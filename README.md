# @nethesis/vue-components

This library contains:
- a collection of Vue 3 components based on [Flowbite](https://flowbite.com/)
- a set of utility functions

## Installation

1. Install TailwindCSS 4 on your project.
2. Add this library via npm:
```sh
npm install @nethesis/vue-components
```
3. Add to your main CSS file (change `node_modules` path if needed):
```css
@layer vendor, theme, base, components, utilities;

@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';

/* import styles from @nethesis/vue-components */
@import '../../node_modules/@nethesis/vue-components/dist/main.css' layer(components);

/* detect tailwind classes used in @nethesis/vue-components */
@source '../../node_modules/@nethesis/vue-components/dist/**/*.js';

/* load tailwind forms plugin, needed for some components */
@plugin '@tailwindcss/forms';
```
4. After this, you're golden! You can browse the [Storybook](https://nethesis.github.io/vue-components) to see the available components and their usage.

## Contributing

You can read the [contributing guidelines](CONTRIBUTING.md) to know how to contribute to this project.

## License

All the repo is licensed under [GPL 3.0 or later](LICENSE) license.
