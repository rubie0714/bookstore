export default defineNuxtConfig({
  devtools: { enabled: false },
  vite: {
    vue: {
      customElement: true,

    },
    vueJsx: {
      mergeProps: true
    }
  },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ]

})