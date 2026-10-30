# vue-components — Agent Instructions

`@nethesis/vue-components` is the Vue 3 + TypeScript + Tailwind CSS 4 component library of the Nethesis products (My Nethesis, NethSecurity and others). Its Storybook is published at https://nethesis.github.io/vue-components/, and the list of its components and patterns, with their descriptions, at https://nethesis.github.io/vue-components/components.json. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development setup.

## Build & Dev

```bash
npm ci                   # Node.js version from .nvmrc
npm run storybook        # Storybook on :6006
npm run playground       # quick test app, see playground/App.vue
npm run lint             # ESLint
npm run format           # Prettier check of src/ (format-fix to fix)
npm run build            # type declarations + library bundle in dist/
npm run build-storybook  # Storybook, then components.json; fails on a missing description
```

## Layout

| Location               | Content                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `src/components/`      | One `Ne<Name>.vue` per component                                                                    |
| `src/composables/`     | Composables exported by the library (`useSort`, `usePasswordRequirements`…)                         |
| `src/lib/`             | Utility functions exported by the library                                                           |
| `src/main.ts`          | The public API: every component, type and function is exported here                                 |
| `src/styles/theme.css` | The theme the products import: a change here reaches every product                                  |
| `stories/`             | One stories file per component (`Ne<Name>.stories.ts`) and per pattern (`Pattern<Name>.stories.ts`) |
| `scripts/`             | `components-json.mjs`, run after `build-storybook`                                                  |

## Design rules

The components follow the Nebula Design System (https://nethesis.github.io/nebula-design-system/, plain files listed in https://nethesis.github.io/nebula-design-system/llms.txt). If the `nebula-frontend` skill is available, use it for these rules:

- Colors from the semantic tokens, and every color class with its `dark:` variant: every component supports the dark theme.
- Poppins with two weights only: `font-normal` and `font-medium`.
- Icons: `FontAwesomeIcon` with the free Solid icons, imported by name. The icon for each meaning comes from https://nethesis.github.io/nebula-design-system/icons.json.
- Keyboard support and a visible focus ring on every interactive element; icons without text get an accessible label.
- Texts in the stories follow the writing guidelines and the glossary of the design system. Pattern stories have an English and an Italian version.

## Adding or changing a component

1. **No hard-coded text.** The library has no i18n: every text the user sees or hears, aria labels included, is a prop, so each product passes its translation. Give it an English default or make it required.
2. **Export it** from `src/main.ts`, with its public types.
3. **Write its stories** in `stories/Ne<Name>.stories.ts`: title `Components/Ne<Name>`, `tags: ['autodocs']` (except for components that cover the page, such as `NeModal`), a story for each main variant, and the description in `parameters.docs.description.component` (see "Stories" in CONTRIBUTING.md). The description says what the component is for and which component to use in the cases it does not cover, and links the section of the writing guidelines for its texts, if there is one: agents read it in `components.json` to choose a component, so update it when the component changes.
4. **Do not break the products.** Add props instead of renaming or removing them. When a component needs incompatible changes, create a new version (`Ne<Name>V2`) and deprecate the old one:
   - add ` [Deprecated]` to the title of its stories;
   - start its description with `Deprecated: use Ne<Name>V2`, and say how to switch: the props, slots, events and types that change;
   - add `/** @deprecated Use Ne<Name>V2 instead. … */` to its export in `src/main.ts`;
   - call `warnDeprecated()` from `src/lib/utils.ts` when it mounts.

   To deprecate a single prop, add `@deprecated` to the JSDoc of the prop and call `warnDeprecated()` when the prop is used, as `NeCombobox` does for `multiple`.

5. **Check** with `npm run lint`, `npm run format`, `npm run build` and `npm run build-storybook`, then look at the stories in the light and the dark theme.

New files start with the license header used by the others (`Copyright (C) <year> Nethesis S.r.l.`, `SPDX-License-Identifier: GPL-3.0-or-later`).

## Commits

Conventional Commits: release-please builds the changelog and the version from them, so `feat` and `fix` are for changes the products see, and `!` or `BREAKING CHANGE` for incompatible ones.
