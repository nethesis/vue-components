# @nethesis/vue-components

This library contains:
- a collection of Vue 3 components based on [Flowbite](https://flowbite.com/)
- a set of utility functions

## Installation

1. Install TailwindCSS 4 on your project, follow [the official documentation](https://tailwindcss.com/docs/installation)
   on how to do so.
2. Add this library via npm:
   ```sh
   npm install @nethesis/vue-components
   ```
3. Add to your main CSS file (change `node_modules` path if needed):
   ```css
   /* import the Theme and the CSS for the components */
   @import '@nethesis/vue-components/theme.css';
   /* detect tailwind classes used in @nethesis/vue-components (change this path accordingly if needed) */
   @source 'node_modules/@nethesis/vue-components';
   ```
4. After this, you're golden! You can browse the [Storybook](https://nethesis.github.io/vue-components) to see the available components and their usage.
   Coding agents and other tools that cannot run the Storybook can read the list of the components and patterns, with their descriptions, in [components.json](https://nethesis.github.io/vue-components/components.json).
5. Write the texts, and choose the icons and colors, by the [Nebula Design System](https://nethesis.github.io/nebula-design-system/), which the components follow.

## Fontawesome

Due to fontawesome having issues overriding your icons, it's suggested to set to false the `autoAddCss` option from the
icons, and adding the required CSS by yourself in a lower priority layer than tailwindcss.

```css
/* fontawesome styles */
@import '@fortawesome/fontawesome-svg-core/styles.css' layer(fontawesome);
```

Official documentation can be found here: https://docs.fontawesome.com/apis/javascript/configuration

## Font

The theme uses Poppins with two weights: Regular (400) and Medium (500). Load both, for example with
`@fontsource/poppins`:

```css
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/500.css';
```

The default import, `@import '@fontsource/poppins'`, loads only Regular: the browser then fakes Medium by
thickening Regular. Use only `font-normal` and `font-medium`, the weights of the design system.

## Contributing

You can read the [contributing guidelines](CONTRIBUTING.md) to know how to contribute to this project.

## License

All the repo is licensed under [GPL 3.0 or later](LICENSE) license.
