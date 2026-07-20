export default defineAppConfig({
  // Docus v5 config
  docus: {
    locale: 'en',
    colorMode: '',
  },

  // Site metadata (used by @nuxtjs/seo)
  site: {
    name: 'color-schemes-js',
    description: 'A comprehensive collection of 1,150+ perceptually uniform and artistic color palettes for JavaScript & TypeScript.',
  },

  // Header title & logo
  header: {
    title: 'color-schemes-js',
  },

  // GitHub integration (shows GitHub icon in the header)
  github: {
    url: 'https://github.com/lazarusA/color-schemes-js',
  },

  // Search
  search: {
    fts: false,
  },

  // Navigation
  navigation: {
    sub: '',
  },

  // Nuxt UI colors
  ui: {
    colors: {
      primary: 'indigo',
      neutral: 'zinc',
    },
  },
})
