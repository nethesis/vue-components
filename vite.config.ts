import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VueComponents',
      fileName: 'vue-components'
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-tippy',
        '@fortawesome/vue-fontawesome',
        '@fortawesome/free-solid-svg-icons',
        '@headlessui/vue',
        'uuid'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-tippy': 'Tippy',
          '@fortawesome/vue-fontawesome': 'FontAwesomeIcon',
          '@fortawesome/free-solid-svg-icons': 'fa',
          '@headlessui/vue': 'HeadlessUI',
          uuid: 'v'
        }
      }
    }
  },
  plugins: [
    typescript({
      check: false,
      exclude: ['.storybook/*'],
      tsconfig: resolve(__dirname, 'tsconfig.app.json'),
      tsconfigOverride: {
        compilerOptions: {
          emitDeclarationOnly: true,
          declaration: true,
          declarationMap: true
        }
      }
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
