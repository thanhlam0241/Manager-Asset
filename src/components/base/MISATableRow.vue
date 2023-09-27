<script setup>
import { computed, ref, watch } from 'vue'

/**
 * Props của table row
 * @type {Object}
 * @property {Boolean} selected - Được chọn
 * @property {Boolean} focus - Được focus
 * @property {String} width - Chiều rộng của table row
 * @property {String} height - Chiều cao của table row
 * @property {Boolean} action - Có phải là action
 * @property {Boolean} isSelected - Được chọn
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: 'auto'
  },
  height: {
    type: Number,
    default: 40
  },
  action: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

/**
 * Ref của table row
 * Created by: NTLam (20/07/2023)
 */
const rowRef = ref(null)

/**
 * Khi isSelected thay đổi thì scrollIntoView
 * @param {MouseEvent} e - Sự kiện mouseOut
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => props.isSelected,
  (newValue) => {
    if (newValue) {
      rowRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  },
  { immediate: true }
)

/**
 * Chiều rộng của table row
 * Created by: NTLam (20/07/2023)
 */
const width = computed(() => {
  return props.width
})

/**
 * Chiều cao của table row
 * Created by: NTLam (20/07/2023)
 */
const height = computed(() => {
  return props.height + 'px'
})
</script>

<template>
  <tr
    ref="rowRef"
    style="height: 40px"
    :class="[{ selected: props.selected }, { focus: props.focus }, 'table_row']"
    :height="props.height"
    v-on:dblclick="$emit('doubleClick')"
    @click.ctrl="$emit('ctrlClick')"
    @click.shift="$emit('shiftClick')"
    @contextmenu.prevent="(event) => $emit('ShowContext', event)"
  >
    <slot />
  </tr>
</template>

<style>
tr {
  height: 40px;
  table-layout: initial;
  max-height: 40px;
}
.table_row {
  height: v-bind(height) !important;
  width: v-bind(width);
  background-color: #fff;
  padding: 0 16px;
}
.table_row.selected {
  background-color: var(--color-item-selected) !important;
}
tr.table_row.focus {
  background-color: #e6f2ff;
}
.table_row:hover {
  background-color: #e6e8ea;
}
tr:hover .div__function {
  visibility: visible;
}
</style>
