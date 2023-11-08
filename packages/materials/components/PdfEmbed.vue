<script setup lang='ts'>
import type { VuePdfEmbedData } from 'vue-pdf-embed'

const props = defineProps<{
  url: string
  height: number | string
}>()

const pdfRef = ref<VuePdfEmbedData | null>(null)
const page = ref(1)
const pageCount = ref(0)

function handleDocumentRender() {
  pageCount.value = pdfRef.value!.pageCount!
}

function handlePasswordRequest() {
  // ...todo
}

function pageNext() {
  if (page.value < pageCount.value)
    page.value = page.value + 1
}

function pagePrev() {
  if (page.value > 1)
    page.value = page.value - 1
}
</script>

<template>
  <div class="pdf-viewer">
    <div class="mb-2">
      <ASpace>
        <AButton type="text" @click="pagePrev">
          上一页
        </AButton>
        <AButton type="text" @click="pageNext">
          下一页
        </AButton>
      </ASpace>
    </div>
    <VuePdfEmbed
      ref="pdfRef"
      :height="props.height"
      :page="page"
      :source="url"
      @rendered="handleDocumentRender"
      @password-requested="handlePasswordRequest"
    />
  </div>
</template>
