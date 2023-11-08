import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import type { NuxtApp } from 'nuxt/app'

export default function (nuxtApp: any) {
  (nuxtApp as NuxtApp).vueApp.component('QuillEditor', QuillEditor)
}
