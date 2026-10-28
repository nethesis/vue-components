// Copyright (C) 2026 Nethesis S.r.l.
// SPDX-License-Identifier: GPL-3.0-or-later

// Writes components.json next to the built Storybook: one entry for each
// component and pattern, with its description, so coding agents and other
// tools can choose a component without running the Storybook, whose pages are
// built in the browser.
//
// The description is parameters.docs.description.component in the meta of the
// stories file, the same text shown on the Docs page. Every stories file must
// have one; a deprecated component must start it with "Deprecated: use <Name>".
//
//   node scripts/components-json.mjs [output directory, storybook-static by default]

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadCsf } from 'storybook/internal/csf-tools'

const STORYBOOK = 'https://nethesis.github.io/vue-components/'
const SOURCE = 'https://raw.githubusercontent.com/nethesis/vue-components/main/'
const DEPRECATED = ' [Deprecated]'

const outDir = process.argv[2] ?? 'storybook-static'
const { name: packageName, version } = JSON.parse(readFileSync('package.json', 'utf8'))
const errors = []

// the value of a property of an object expression of the AST, by its path
function property(node, path) {
  for (const key of path) {
    if (node?.type !== 'ObjectExpression') return undefined
    node = node.properties.find((item) => (item.key?.name ?? item.key?.value) === key)?.value
  }
  if (node?.type === 'StringLiteral') return node.value
  if (node?.type === 'TemplateLiteral' && !node.expressions.length)
    return node.quasis[0].value.cooked
  return node && null
}

const files = readdirSync('stories')
  .filter((file) => file.endsWith('.stories.ts'))
  .sort()

const entries = files.map((file) => {
  const path = `stories/${file}`
  const csf = loadCsf(readFileSync(path, 'utf8'), { fileName: path, makeTitle: (title) => title })
  csf.parse()
  const { title, component, tags = [] } = csf.meta
  const description = property(csf._metaAnnotations.parameters, [
    'docs',
    'description',
    'component'
  ])
  if (!description) {
    errors.push(`${path}: missing parameters.docs.description.component, as a string`)
  }
  // the id of a story is <id of the stories file>--<id of the story>
  const id = csf.stories[0].id.split('--')[0]
  return {
    path,
    title,
    component,
    description: description ?? '',
    link: tags.includes('autodocs')
      ? `${STORYBOOK}?path=/docs/${id}--docs`
      : `${STORYBOOK}?path=/story/${csf.stories[0].id}`,
    stories: csf.stories.map((story) => ({
      name: story.name,
      link: `${STORYBOOK}?path=/story/${story.id}`
    }))
  }
})

const components = entries
  .filter((entry) => entry.title.startsWith('Components/'))
  .map(({ path, title, description, link, stories }) => {
    const deprecated = title.endsWith(DEPRECATED)
    const name = title.slice('Components/'.length, deprecated ? -DEPRECATED.length : undefined)
    const componentPath = `src/components/${name}.vue`
    if (!existsSync(componentPath)) errors.push(`${path}: ${componentPath} not found`)
    const replacedBy = description.match(/^Deprecated: use (Ne\w+)/)?.[1]
    if (deprecated && !replacedBy) {
      errors.push(`${path}: the description must start with "Deprecated: use <Name>"`)
    }
    return {
      name,
      title,
      description,
      ...(deprecated ? { deprecated, replacedBy } : {}),
      link,
      storiesSource: SOURCE + path,
      componentSource: SOURCE + componentPath,
      stories
    }
  })

const names = new Set(components.map((component) => component.name))
for (const { name, replacedBy } of components) {
  if (replacedBy && !names.has(replacedBy))
    errors.push(`${name}: unknown replacement ${replacedBy}`)
}

const patterns = entries
  .filter((entry) => entry.title.startsWith('Patterns/'))
  .map(({ path, title, component, description, link, stories }) => ({
    name: title.slice('Patterns/'.length),
    title,
    description,
    ...(component ? { component } : {}),
    link,
    storiesSource: SOURCE + path,
    stories
  }))

for (const entry of entries) {
  if (!/^(Components|Patterns)\//.test(entry.title)) {
    errors.push(`${entry.path}: the title must start with Components/ or Patterns/`)
  }
}

if (errors.length) {
  console.error(`components.json not written:\n${errors.map((error) => `  ${error}`).join('\n')}`)
  process.exit(1)
}

const json = {
  source: STORYBOOK,
  package: packageName,
  version,
  note: 'The components of @nethesis/vue-components and the patterns, ready-made combinations of components for a whole interaction. Use a pattern when it covers the task, a component otherwise, and never a deprecated component: use its replacedBy. storiesSource is the code of the stories, with the usage of the component; componentSource is the code of the component. This file describes the latest version: check the props of the installed version in node_modules/@nethesis/vue-components/dist/components/<Name>.vue.d.ts.',
  components,
  patterns
}
writeFileSync(join(outDir, 'components.json'), `${JSON.stringify(json, null, 2)}\n`)
console.log(`components.json: ${components.length} components, ${patterns.length} patterns`)
