import { Config } from 'tailwindcss'
import twColors from 'tailwindcss/colors'
import twFormsPlugin from '@tailwindcss/forms'

export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
    './.storybook/preview.ts'
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: twColors.cyan
      },
      keyframes: {
        indeterminateProgressBar: {
          '0%': { transform: 'translateX(0) scaleX(0)' },
          '40%': { transform: 'translateX(0) scaleX(0.4)' },
          '100%': { transform: 'translateX(100%) scaleX(0.5)' }
        }
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
        'indeterminate-progress-bar': 'indeterminateProgressBar 1s infinite linear'
      }
      // fontFamily: { ////
      //   sans: ['Poppins', 'sans-serif']
      // }
    }
  },
  plugins: [twFormsPlugin],
  darkMode: 'class'
} satisfies Config
