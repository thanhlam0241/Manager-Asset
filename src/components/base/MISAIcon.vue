<template>
  <i></i>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'none',
    validate: (icon) => {
      return ['none', 'success', 'error', 'warning', 'info'].includes(icon)
    }
  }
})
</script>

<style></style>
