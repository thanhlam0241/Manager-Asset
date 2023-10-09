<script setup>
import { computed } from 'vue'
// import { converStringToBigNumberString } from '@/helper/stringHelper.js'

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
  },
  action: {
    type: Boolean,
    default: false
  },
  borderBottom: {
    type: Boolean,
    default: true
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
    v-if="props.action"
    :width="props.width"
    height="40"
    :class="[
      typeClass,
      { data__number: props.type === 'number' },
      { data_date: props.type === 'date' },
      { data_order: props.type === 'order' },
      { position_center: props.position === 'center' },
      { position_left: props.position === 'left' },
      { position_right: props.position === 'right' },
      { 'border-at-bottom': props.borderBottom }
    ]"
  >
    <div class="div_relative">
      {{ props.text }}
      <div class="div__function_absolute">
        <slot />
      </div>
    </div>
  </td>
  <td
    v-else
    :width="props.width"
    height="40"
    :class="[
      typeClass,
      { data__number: props.type === 'number' },
      { data_date: props.type === 'date' },
      { data_order: props.type === 'order' },
      { position_center: props.position === 'center' },
      { position_left: props.position === 'left' },
      { position_right: props.position === 'right' },
      { 'border-at-bottom': props.borderBottom }
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
.div_relative {
  position: relative;
  line-height: 40px;
}
.div__function_absolute {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  height: 40px;
  position: absolute;
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
}
tr:has(td):hover .div__function_absolute {
  visibility: visible;
}
td {
  height: 40px;
  max-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  table-layout: initial;
  border-bottom: 1px solid #ddd;
  /* box-shadow: 0 -1px 0 #000; */
  /* outline: 1px solid #ddd; */
  /* background-color: red; */
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
