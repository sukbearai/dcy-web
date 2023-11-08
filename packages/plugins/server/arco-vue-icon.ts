// import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import type { NuxtApp } from 'nuxt/app'

export default function (nuxtApp: any) {
  // nuxtApp.vueApp.use(ArcoVue);
  (nuxtApp as NuxtApp).vueApp.use(ArcoVueIcon)
}
