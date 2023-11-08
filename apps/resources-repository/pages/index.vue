<script setup lang="ts">
import { HelloWorld } from '@dcyjs/materials'
import { Qrcode } from '@dcyjs/materials/client'

const online = useOnline()
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
    <ASpace>
      <AButton type="primary">
        resources-repository
      </AButton>
      <AButton>Secondary</AButton>
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
    <ClientOnly>
      <div class="mt-2 flex flex-col items-center justify-center">
        <div class="my-2">
          二维码组件
        </div>
        <Qrcode :width="150" :height="150" content="你好👋" />
      </div>
    </ClientOnly>
  </div>
</template>
