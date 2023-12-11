import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

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
        '@headlessui/vue'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-tippy': 'Tippy',
          '@fortawesome/vue-fontawesome': 'FontAwesomeIcon',
          '@fortawesome/free-solid-svg-icons': 'fa',
          '@headlessui/vue': 'HeadlessUI'
        }
      }
    }
  },
  plugins: [vue(), dts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
