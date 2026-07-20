export default defineNuxtConfig({
  extends: ['docus'],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-07-20',

  // Site metadata
  site: {
    name: 'color-schemes-js'
  },

  // Disable Docus server-only modules (not compatible with static export)
  mcp: false,
  llms: false,

  // Static site generation for GitHub Pages
  nitro: {
    preset: 'static',
  },

  // Pre-bundle dependencies used in browser components
  vite: {
    optimizeDeps: {
      include: [
        'three',
        'color-schemes-js',
      ],
    },
  },
})
