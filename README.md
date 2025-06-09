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

## Fontawesome

Due to fontawesome having issues overriding your icons, it's suggested to set to false the `autoAddCss` option from the
icons, and adding the required CSS by yourself in a lower priority layer than tailwindcss.

```css
/* fontawesome styles */
@import '@fortawesome/fontawesome-svg-core/styles.css' layer(fontawesome);
```

Official documentation can be found here: https://docs.fontawesome.com/apis/javascript/configuration

## Contributing

You can read the [contributing guidelines](CONTRIBUTING.md) to know how to contribute to this project.

## License

All the repo is licensed under [GPL 3.0 or later](LICENSE) license.
