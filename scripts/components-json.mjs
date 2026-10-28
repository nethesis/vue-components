// Copyright (C) 2026 Nethesis S.r.l.
// SPDX-License-Identifier: GPL-3.0-or-later

// Writes components.json next to the built Storybook: one entry for each
// component and pattern, with its description, so coding agents and other
// tools can choose a component without running the Storybook, whose pages are
// built in the browser.
//
// The stories, their titles and their links come from the index.json of the
// built Storybook. The description is parameters.docs.description.component in
// the meta of each stories file, read with the CSF parser of Storybook. Every
// stories file must have one; a deprecated component must start it with
// "Deprecated: use <Name>". Every component exported by src/main.ts must have
// stories, except the parts documented with another component.
//
//   node scripts/components-json.mjs [Storybook output directory, storybook-static by default]
//
// npm runs it after build-storybook (postbuild-storybook).

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCsf } from 'storybook/internal/csf-tools'

const STORYBOOK = 'https://nethesis.github.io/vue-components/'
const SOURCE = 'https://raw.githubusercontent.com/nethesis/vue-components/main/'
const DEPRECATED = ' [Deprecated]'
// components without stories of their own, documented with another one
const PARTS = {
  NeTableHead: 'NeTable',
  NeTableHeadCell: 'NeTable',
  NeTableBody: 'NeTable',
  NeTableRow: 'NeTable',
  NeTableCell: 'NeTable'
}

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (path) => readFileSync(join(root, path), 'utf8')
const outDir = resolve(root, process.argv[2] ?? 'storybook-static')
const errors = []

if (!existsSync(join(outDir, 'index.json'))) {
  console.error(`components.json not written: ${join(outDir, 'index.json')} not found.`)
  console.error(
    'Build the Storybook first, and pass its output directory if it is not storybook-static.'
  )
  process.exit(1)
}
const index = JSON.parse(readFileSync(join(outDir, 'index.json'), 'utf8'))
const { name: packageName, version } = JSON.parse(read('package.json'))

// the stories files, in the order of the Storybook sidebar
const files = new Map()
for (const entry of Object.values(index.entries)) {
  if (entry.importPath.endsWith('.mdx')) continue
  const path = entry.importPath.replace(/^\.\//, '')
  const file = files.get(path) ?? { path, title: entry.title, stories: [] }
  if (entry.type === 'story') {
    file.stories.push({ name: entry.name, link: `${STORYBOOK}?path=/story/${entry.id}` })
  } else {
    file.docs = `${STORYBOOK}?path=/docs/${entry.id}`
  }
  files.set(path, file)
}

// the value of a property of an object expression of the AST, by its path
function property(node, path) {
  for (const key of path) {
    if (node?.type !== 'ObjectExpression') return undefined
    node = node.properties.find((item) => (item.key?.name ?? item.key?.value) === key)?.value
  }
  if (node?.type === 'StringLiteral') return node.value
  if (node?.type === 'TemplateLiteral' && !node.expressions.length) {
    return node.quasis[0].value.cooked
  }
  return undefined
}

function readMeta(path) {
  const csf = loadCsf(read(path), { fileName: path, makeTitle: (title) => title }).parse()
  // _metaAnnotations is not a public API: fail clearly if an update of Storybook changes it
  if (typeof csf._metaAnnotations !== 'object' || csf._metaAnnotations === null) {
    throw new Error('storybook/internal/csf-tools changed: update scripts/components-json.mjs')
  }
  const description = property(csf._metaAnnotations.parameters, [
    'docs',
    'description',
    'component'
  ])
  if (!description) {
    errors.push(`${path}: missing parameters.docs.description.component, as a string`)
  }
  // component is the source text: NeX, or an expression such as NeX as Meta<…>['component']
  return { component: csf.meta.component?.match(/^\w+/)?.[0], description: description ?? '' }
}

const components = []
const patterns = []
for (const { path, title, docs, stories } of files.values()) {
  const { component, description } = readMeta(path)
  const link = docs ?? stories[0].link
  if (title.startsWith('Components/')) {
    const deprecated = title.endsWith(DEPRECATED)
    const name = title.split('/').at(-1).replace(DEPRECATED, '')
    const componentPath = `src/components/${name}.vue`
    if (!existsSync(join(root, componentPath))) errors.push(`${path}: ${componentPath} not found`)
    const replacedBy = description.match(/^Deprecated: use (Ne\w+)/)?.[1]
    if (deprecated && !replacedBy) {
      errors.push(`${path}: the description must start with "Deprecated: use <Name>"`)
    }
    const parts = Object.keys(PARTS).filter((part) => PARTS[part] === name)
    components.push({
      name,
      title,
      description,
      ...(deprecated ? { deprecated, replacedBy } : {}),
      ...(parts.length ? { parts } : {}),
      link,
      storiesSource: SOURCE + path,
      componentSource: SOURCE + componentPath,
      stories
    })
  } else if (title.startsWith('Patterns/')) {
    patterns.push({
      name: title.slice('Patterns/'.length),
      title,
      description,
      ...(component ? { component } : {}),
      link,
      storiesSource: SOURCE + path,
      stories
    })
  } else {
    errors.push(`${path}: the title must start with Components/ or Patterns/`)
  }
}

const names = new Set(components.map((component) => component.name))
for (const { name, replacedBy } of components) {
  if (replacedBy && !names.has(replacedBy)) {
    errors.push(`${name}: unknown replacement ${replacedBy}`)
  }
}
const exported = read('src/main.ts').matchAll(
  /export \{ default as (\w+) \} from '\.\/components\//g
)
for (const [, name] of exported) {
  if (!names.has(name) && !names.has(PARTS[name])) {
    errors.push(`${name}: exported by src/main.ts, but it has no stories`)
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
  note: `The components of @nethesis/vue-components and the patterns, ready-made combinations of components for a whole interaction. Use a pattern when it covers the task, a component otherwise, and never a deprecated component: use its replacedBy. parts are components documented with the one that contains them. storiesSource is the code of the stories, with the usage of the component; componentSource is the code of the component. The Storybook is built from the main branch, which may have changes not released yet; version is the latest release. Check the props of the installed version in node_modules/@nethesis/vue-components/dist/components/<Name>.vue.d.ts.`,
  components,
  patterns
}
writeFileSync(join(outDir, 'components.json'), `${JSON.stringify(json, null, 2)}\n`)
console.log(`components.json: ${components.length} components, ${patterns.length} patterns`)
