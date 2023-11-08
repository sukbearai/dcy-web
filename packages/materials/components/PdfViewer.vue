<script setup lang='ts'>
import { usePdf } from '@dcyjs/composables'

// import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

const props = defineProps<{
  url: string
}>()

const element = ref<undefined | HTMLCanvasElement>(undefined)
const file = ref(props.url)

const { canvasAttributes, prevPage, nextPage } = usePdf({
  element,
  file,
  renderType: 'canvas',
  // onDocumentLoadSuccess,
})

// function onDocumentLoadSuccess(pdfDocument: PDFDocumentProxy) {

// }
</script>

<template>
  <div>
    <div class="mb-2">
      <ASpace>
        <AButton type="text" @click="prevPage">
          上一页
        </AButton>
        <AButton type="text" @click="nextPage">
          下一页
        </AButton>
      </ASpace>
    </div>
    <div class="pdf-viewer bg-red">
      <canvas ref="element" :width="canvasAttributes.width" :height="canvasAttributes.height" />
    </div>
  </div>
</template>
