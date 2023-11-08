import VueOfficeDocx from '@vue-office/pdf'
import '@vue-office/docx/lib/index.css'
import type { NuxtApp } from 'nuxt/app'

export default function (nuxtApp: any) {
  (nuxtApp as NuxtApp).vueApp.component('VueOfficePdf', VueOfficeDocx)
}
