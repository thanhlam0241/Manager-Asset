<script setup>
import { computed } from 'vue'

/**
 * Props của Skeleton
 * @type {Object}
 * @property {String} type - Loại loading
 * @property {String} width - Chiều rộng của loading
 * @property {String} height - Chiều cao của loading
 * @property {Boolean} loading - Trạng thái loading
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'rectangle',
    validate: (type) => {
      return ['circle', 'linear', 'rectangle'].includes(type)
    }
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
})

/**
 * Chiều rộng của Skeleton
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const width = computed(() => {
  return props.width
})

/**
 * Chiều cao của Skeleton
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const height = computed(() => {
  return props.height
})
</script>
<template>
  <div class="loading">
    <div class="content"></div>
  </div>
</template>

<style scoped>
:root {
  --loading-grey: #ededed;
}

.content {
  width: v-bind(width);
  height: v-bind(height);
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.12);
}

.loading .content {
  background-color: var(--loading-grey);
  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    var(--loading-grey);
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1s loading ease-in-out infinite;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
</style>
