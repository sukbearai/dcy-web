<script setup lang="ts">
import { Chart, HelloWorld } from '@dcyjs/materials'
import { CardWrap, GraphicsEditor, PdfEmbed, Qrcode, RichText } from '@dcyjs/materials/client'
import { downloadFormUrl } from '@dcyjs/utils'
import { useFetcher } from '@dcyjs/network'
import { getTodo } from '@/services'

const pdfUrl = ref('https://dcyweb.oss-cn-qingdao.aliyuncs.com/images/AI%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B8%82%E5%9C%BA%E7%A0%94%E7%A9%B6%E6%8A%A5%E5%91%8A%EF%BC%882023%EF%BC%89%E8%BF%88%E5%90%91%E9%80%9A%E7%94%A8%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%EF%BC%8C%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8B%89%E5%BC%80%E6%96%B0%E6%97%B6%E4%BB%A3%E5%BA%8F%E5%B9%95-%E6%B2%99%E5%88%A9%E6%96%87-2023-43%E9%A1%B5.pdf')

// 服务端数据🤔️
const { data } = await useFetcher<object>('/beers')

// 客户端数据
const id = ref(0)
const ready = computed(() => id.value !== 0)
const { data: todo, loading } = useRequest(() => getTodo({ id: id.value }), {
  ready,
  refreshDeps: [id],
})
const todoData = computed(() => todo.value && `getTodo的接口返回值: ${JSON.stringify(todo)}`)

const online = useOnline()
const text = ref('hello world')

const chartOpt = ref({
  legend: {},
  tooltip: {
    trigger: 'axis',
    formatter(params: any) {
      return `${params[0].name}: ${params[0].value}`
    },
  },
  xAxis: {
    data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周'],
  },
  yAxis: {},
  series: [
    {
      name: '材料一班',
      smooth: true,
      data: [10, 100, 20, 40, 60],
      type: 'line',
    },
    {
      name: '材料二班',
      type: 'line',
      smooth: true,
      data: [40, 10, 20, 40, 60],
      emphasis: {
        focus: 'series',
      },
    },
  ],
})

function onDownload() {
  downloadFormUrl('http://static.shanhuxueyuan.com/test.pdf', 'test.pdf')
}
</script>

<template>
  <div>
    <Logos mb-6 />
    <Suspense>
      <ClientOnly>
        <PageView v-if="online" />
        <div v-else text-gray:80>
          You're offline
        </div>
      </ClientOnly>
      <template #fallback>
        <div italic op50>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry />
    <div class="nesting">
      <div class="box">
        <div class="el my-2">
          author: @dcyjs
        </div>
      </div>
    </div>
    <div class="my-4 flex flex-col items-center justify-center">
      <div class="m-2">
        服务端数据
      </div>
      <pre class="h-[400px] w-[600px] overflow-auto bg-gray p-4 text-left text-xs">{{ data }}</pre>
    </div>
    <div class="my-2 flex flex-col items-center">
      <div class="my-2">
        <AButton @click="id = 1">
          获取客户端数据
        </AButton>
      </div>
      <div class="w-[600px]">
        {{ todoData }}
      </div>
    </div>
    <ASpace>
      <AButton type="primary">
        learning space
      </AButton>
      <AButton @click="onDownload">
        Download
      </AButton>
      <AButton type="dashed">
        Dashed
      </AButton>
      <AButton type="outline">
        Outline
      </AButton>
      <AButton type="text">
        Text
      </AButton>
      <HelloWorld />
      <IconChineseFill />
    </ASpace>
    <div class="my-4 flex justify-center">
      <div class="w-[600px]">
        <ASpin :loading="loading" style="width: 100%">
          <div v-if="todo" class="h-[200px] flex items-center justify-center">
            客户端组件
          </div>
        </ASpin>
      </div>
    </div>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          骨架屏组件
        </div>
        <CardWrap
          class="w-[600px]"
          :loading="true"
        >
          我是卡片
          <template #skeleton>
            <ASkeleton :animation="true">
              <ASkeletonLine
                :widths="['50%', '50%', '100%', '40%']"
                :rows="4"
              />
              <ASkeletonLine :widths="['40%']" :rows="1" />
            </ASkeleton>
          </template>
        </CardWrap>
      </div>
    </ClientOnly>
    <p class="mt-4">
      👇下方的第三方组件依赖于dom挂载和浏览器api，不支持ssr渲染
    </p>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          图表组件
        </div>
        <Chart height="360px" width="600px" :option="chartOpt" />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          二维码组件
        </div>
        <Qrcode :width="150" :height="150" content="你好👋" />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          富文本组件
        </div>
        <RichText v-model="text" class="w-[600px]" />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          PDF预览组件
        </div>
        <PdfEmbed :url="pdfUrl" height="760" />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          图形编辑器
        </div>
        <GraphicsEditor :width="600" :height="400" url="https://dcyweb.oss-cn-qingdao.aliyuncs.com/lunbotu/2023/1008/009bc33f-85e9-4d4a-a5a9-7924be2f0e6e.png" />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.nesting {
  .box {
    color: red;

    .el {
      color: greenyellow;
    }
  }
}
</style>
