/// <reference types="vite/client" />

// playground.css is inside the playground root so @tailwindcss/vite processes
// it correctly, picking up @import 'tailwindcss' and @theme from main.css.
import './playground.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
