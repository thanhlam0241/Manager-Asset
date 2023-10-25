<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * Props của searchbox
 * @type {Object}
 * @property {String} placeholder - Placeholder của searchbox
 * @property {Boolean} disabled - Trạng thái disabled của searchbox
 * @property {String} value - Giá trị của searchbox
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tìm kiếm'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

/**
 * Emit event onChange
 * @type {import('vue').EmitsOptions}
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['onChange', 'pressEnter'])

/**
 * A reactive variable that represents the value state of the searchbox.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const inputValue = ref(props.value)

/**
 * Các giá trị được expose ra bên ngoài
 * Created by: NTLam (20/07/2023)
 */
defineExpose({
  inputValue: inputValue
})

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (20/07/2023)
 */
watch(
  inputValue,
  useDebounce((newValue) => {
    if (newValue) {
      emit('onChange', newValue)
    } else {
      emit('pressEnter', '')
    }
  }, 500)
)

const onEnter = () => {
  emit('pressEnter', inputValue.value)
}
</script>

<template>
  <div :style="{ ...props.style }" :class="['searchbox', { disabled: disabled }]">
    <button class="btn-find"><i class="icon-find"></i></button>
    <input
      @keydown.enter="onEnter"
      v-model="inputValue"
      class="searchbox__input"
      type="text"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
.searchbox {
  position: relative;
  width: 100%;
  height: 36px;
  border: 1px solid #ccc;
  border-radius: var(--border-radius-size);
  display: flex;
  align-items: center;
  z-index: 8;
  background-color: var(--color-white);
  padding: 1px 0;
  transition: all ease 400ms;
  overflow: hidden;
}

/* .searchbox.disabled:focus-within, */
.searchbox.disabled {
  background-color: var(--textfield-disabled-color);
  pointer-events: none;
}

button {
  height: 34px;
  width: 34px;
  border-radius: var(--border-radius-size);
  background-color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  height: 100%;
  flex-grow: 1;
  padding: 0 2px;
  background-color: inherit;
  border-radius: var(--border-radius-size);
}

.searchbox:not(.disabled):hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--outline-active);
}

.searchbox:not(.disabled):focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--outline-active);
}
</style>
