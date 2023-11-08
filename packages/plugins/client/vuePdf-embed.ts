import VuePdfEmbed from 'vue-pdf-embed'
import type { NuxtApp } from 'nuxt/app'

export default function (nuxtApp: any) {
  (nuxtApp as NuxtApp).vueApp.component('VuePdfEmbed', VuePdfEmbed)
}
