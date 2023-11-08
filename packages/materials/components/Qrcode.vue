<script setup lang='ts'>
import { Base64 } from 'js-base64'
import { encodeData, rendererRect } from 'beautify-qrcode'

const props = defineProps<{
  width: number
  height: number
  content: string
}>()

function generateQrcodeToBase64() {
  const codeOption = {
    text: props.content ?? '这是测试内容',
    width: props.width ?? 100,
    height: props.height ?? 100,
    correctLevel: 0,
    isSpace: true,
  }
  const encodeDataResult = encodeData(codeOption)
  const generateQrUrlResult = rendererRect(encodeDataResult)
  return `data:image/svg+xml;base64,${Base64.encode(generateQrUrlResult)}`
}

const url = computed(() => generateQrcodeToBase64())
</script>

<template>
  <img :src="url" :width="width" :height="height" alt="qr code">
</template>
