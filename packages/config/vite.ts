import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'

// import { vitePluginForArco } from '@arco-plugins/vite-vue'

// https://arco.design/vue/docs/start
// 直接到处 vite config
export default {
  plugins: [
    // vue(),
    AutoImport({
      resolvers: [ArcoResolver(), VueHooksPlusResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    // vitePluginForArco({
    //   style: 'css'
    // }),
  ],
  ssr: {
    // 被vite编译，以兼容 nuxt3
    noExternal: ['@arco-design/web-vue', '@arco-design/web-vue/es/icon', 'echarts', 'vue-echarts', 'file-saver', 'resize-detector', 'zrender', 'vue-hooks-plus'],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      },
    },
  },
}
