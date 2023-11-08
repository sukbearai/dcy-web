import { vite } from './config'

export default defineNuxtConfig({
  vite,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],

  css: [
    '@unocss/reset/tailwind.css',
  ],

  devtools: {
    enabled: true,
  },
})
