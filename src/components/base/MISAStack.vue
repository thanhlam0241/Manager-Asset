<template>
  <div class="stack">
    <div class="item-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Props của stack
 * @type {Object}
 * @property {String} type - Loại stack
 * @property {String} vertical - Vị trí dọc của stack
 * @property {String} horizontal - Vị trí ngang của stack
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'fixed',
    validate: (type) => {
      return ['fixed', 'absotute'].includes(type)
    }
  },
  vertical: {
    type: String,
    default: 'top',
    validate: (vertical) => {
      return ['top', 'bottom'].includes(vertical)
    }
  },
  horizontal: {
    type: String,
    default: 'left',
    validate: (horizontal) => {
      return ['left', 'right'].includes(horizontal)
    }
  }
})

/**
 * Top của stack
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const top = computed(() => {
  return props.vertical === 'top' ? '30px' : 'auto'
})

/**
 * Left của stack
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const left = computed(() => {
  return props.horizontal === 'left' ? '10px' : 'auto'
})

/**
 * Bottom của stack
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const bottom = computed(() => {
  return props.vertical === 'bottom' ? '30px' : 'auto'
})

/**
 * Right của stack
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const right = computed(() => {
  return props.horizontal === 'right' ? '10px' : 'auto'
})

/**
 * Position của stack
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const position = computed(() => {
  return props.type === 'fixed' ? 'fixed' : 'absolute'
})
</script>

<style scoped>
.stack {
  z-index: 202;
  padding: 10px;
  background: transparent;
  position: v-bind(position);
  height: auto;
  max-width: 50vw;
  max-height: 100vh;
  top: v-bind(top);
  left: v-bind(left);
  bottom: v-bind(bottom);
  right: v-bind(right);
}

.item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 10px;
  position: relative;
}
</style>
