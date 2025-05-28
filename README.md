# @nethesis/vue-components

This library contains:
- a collection of Vue 3 components based on [Flowbite](https://flowbite.com/)
- a set of utility functions

## Installation

You can add this library via npm:

```sh
npm install @nethesis/vue-components
```

After this, import the default preset for tailwind, this can be done editing the `tailwind.config.js/ts` with the following lines (remove? ////):

    ```js
    export default {
      // ...
      presets: [require('@nethesis/vue-components/tailwind.config.ts')],
      content: [
        // ...
        './node_modules/@nethesis/vue-components/dist/**/*.js',
        // ...
      ],
      // ...
    }
    ```

You can still override the theme adding your customizations, more info can be found in the [Tailwind documentation](https://tailwindcss.com/docs/presets).

After this, you're golden! You can browse the [Storybook](https://nethesis.github.io/vue-components) to see the available components and their usage.

## Contributing

You can read the [contributing guidelines](CONTRIBUTING.md) to know how to contribute to this project.

## License

All the repo is licensed under [GPL 3.0 or later](LICENSE) license.
