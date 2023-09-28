<script setup>
import { computed } from 'vue'

/**
 * Props của table data
 * @type {Object}
 * @property {String} type - Loại table data
 * @property {String} text - Text của table data
 * @property {String} width - Chiều rộng của table data
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validate: (value) => {
      return ['text', 'checkbox', 'number', 'radio', 'date', 'action', 'empty'].includes(value)
    }
  },
  text: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: 'auto'
  },
  position: {
    type: String,
    default: 'left',
    validate: (value) => {
      return ['left', 'center', 'right'].includes(value)
    }
  }
})

/**
 * Class của table data
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const typeClass = computed(() => {
  if (props.type === 'checkbox') {
    return 'input_checkbox'
  } else if (props.type === 'radio') {
    return 'input_radio'
  } else if (props.type === 'date') {
    return 'input_date'
  } else if (props.type === 'action') {
    return 'column__function'
  } else if (props.type === 'number') {
    return 'data__number'
  } else {
    return 'text'
  }
})
</script>

<template>
  <td
    :width="props.width"
    height="40"
    :class="[
      typeClass,
      { data__number: type === 'number' },
      { data_date: type === 'date' },
      { data_order: type === 'order' },
      { position_center: position === 'center' },
      { position_left: position === 'left' },
      { position_right: position === 'right' }
    ]"
  >
    {{ props.text }}
    <div v-if="props.type === 'action'" class="div__function">
      <slot />
    </div>
    <slot v-else />
  </td>
</template>

<style scoped>
td {
  height: 40px;
  max-height: 40px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  table-layout: initial;
}
.div__function {
  max-width: 100px;
  display: flex;
  align-items: center;
  flex-direction: row;
  visibility: hidden;
  gap: 8px;
  height: 40px;
}

td.data_date {
  text-align: center;
  padding-right: 10px;
}

td.data_order {
  width: calc(16px + 16px + 14px);
  text-align: center;
}

td.column__function {
  padding: 0 12px;
}

.position_center {
  text-align: center !important;
}

.position_left {
  text-align: left !important;
}

.position_right {
  text-align: right !important;
}

td:hover .div__function {
  visibility: visible;
}
.input_checkbox {
  width: calc(20px + 16px + 20px);
  padding: 0 16px;
  vertical-align: center;
}
td.data__number {
  text-align: right;
  padding: 0 16px 0 0;
}
td.column__function {
  max-width: 100px;
  padding: 0 16px;
  text-align: center;
}
</style>
