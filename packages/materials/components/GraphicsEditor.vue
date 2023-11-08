<script setup lang="ts">
import { FabricTool } from '@dcyjs/utils'
import type { ImageFormat } from '@dcyjs/utils'

interface EditorProps {
  width: number
  height: number
  url: string
  gutter?: number
  format?: ImageFormat
}

const props = withDefaults(defineProps<EditorProps>(), {
  gutter: 20,
  format: 'png',
})

const emit = defineEmits(['getImageUrl'])

const canvasRef = ref<null | HTMLCanvasElement>(null)
let fabric: FabricTool | null = null

function initCanvas() {
  fabric = new FabricTool(canvasRef.value!, props.width, props.height, props.gutter, props.format)
  fabric.drawImage(props.url)
}

onMounted(() => {
  initCanvas()
})

function zoomIn() {
  fabric?.zoomIn()
}

function zoomOut() {
  fabric?.zoomOut()
}

function turnLeft() {
  fabric?.turnLeft()
}

function turnRight() {
  fabric?.turnRight()
}

function brush() {
  fabric?.brush()
}

function clear() {
  fabric?.clear()
}

// function eraser() {
//   fabric?.eraser()
// }

function exportToBase64Image() {
  const base64Image = fabric?.export()
  emit('getImageUrl', base64Image)
}
</script>

<template>
  <div class="wrapper">
    <div class="mb-4">
      <ASpace>
        <AButton @click="zoomIn">
          放大
        </AButton>
        <AButton @click="zoomOut">
          缩小
        </AButton>
        <AButton @click="turnLeft">
          左转
        </AButton>
        <AButton @click="turnRight">
          右转
        </AButton>
        <AButton @click="brush">
          画笔
        </AButton>
        <AButton @click="clear">
          清除
        </AButton>
        <AButton @click="exportToBase64Image">
          导出
        </AButton>
      </ASpace>
    </div>
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped></style>
