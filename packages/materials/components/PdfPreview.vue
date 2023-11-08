<script setup lang='ts'>
defineProps<{
  url: string
}>()
</script>

<template>
  <VueOfficePdf :src="url" />
</template>
