<script setup lang='ts'>
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const modules = {
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {/* options */},
}

function onUpdateContent(content: any) {
  emit('update:modelValue', content)
}
</script>

<template>
  <div>
    <QuillEditor :modules="modules" :content="modelValue" theme="snow" toolbar="full" content-type="html" h-60 @update:content="onUpdateContent" />
  </div>
</template>

<style scoped>

</style>
