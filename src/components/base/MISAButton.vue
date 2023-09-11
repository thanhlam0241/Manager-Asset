<script setup>
import { computed, ref } from 'vue'

/**
 * Props của button
 * @type {Object}
 * @property {String} type - Loại button
 * @property {Boolean} disabled - Trạng thái disabled
 * @property {Boolean} padding - Có padding hay không
 * @property {Boolean} transparent - Có background màu trắng hay không
 * @property {String} height - Chiều cao của button
 * @property {Boolean} shadow - Có shadow hay không
 * @property {Boolean} autofocus - Có focus hay không
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'main',
    validator: (value) => {
      return ['main', 'sub', 'outline', 'icon'].includes(value)
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '36px'
  },
  width: {
    type: String,
    default: 'auto'
  },
  shadow: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  }
})

/**
 * Ref của button
 * Created by: NTLam (20/07/2023)
 */
const btnRef = ref(null)

/**
 * Width của button
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const width = computed(() => {
  return props.width
})

/**
 * Height của button
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const height = computed(() => {
  return props.height
})

/**
 * Class của button
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const btnClass = {
  main: 'btn--main',
  sub: 'btn--sub',
  outline: 'btn--outline',
  icon: 'btn--icon'
}

/**
 * Expose method focus
 * Created by: NTLam (20/07/2023)
 */
defineExpose({
  focus: () => {
    btnRef.value.focus()
  }
})

/**
 * Directive focus
 * Created by: NTLam (20/07/2023)
 */
const vFocus = {
  mounted(el) {
    if (props.autofocus) {
      el.focus()
    }
  }
}
</script>

<template>
  <button
    v-focus
    ref="btnRef"
    :class="[
      btnClass[props.type],
      { transparent: props.transparent },
      { shadow: props.shadow },
      { 'padding-high': props.padding },
      { circle: props.circle }
    ]"
    v-bind:disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
button {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.circle {
  border-radius: 50% !important;
}
.padding-high {
  padding: 8px 32px !important;
}
.btn--main {
  background-color: var(--main-color-default);
  color: var(--color-white);
  text-align: center;
  padding: 0 16px;
  height: v-bind(height);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.btn--main:hover {
  background-color: var(--main-color-hover);
}
.btn--main:focus {
  background-color: var(--main-color-focus);
  outline: 2px solid var(--outline-active);
}
.btn--main:active {
  background-color: var(--main-color-active);
}
.btn--main:disabled,
.btn--main[disabled] {
  background-color: var(--main-color-disabled);
  pointer-events: none;
  cursor: not-allowed;
}
.btn--sub {
  background-color: var(--sub-color-default);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  text-align: center;
  padding: 8px 32px;
  width: auto;
  height: v-bind(height);
  border-radius: 4px;
  cursor: pointer;
}
.btn--sub:hover {
  background-color: var(--sub-color-hover);
}
.btn--sub:focus {
  background-color: var(--sub-color-focus);
  outline: 2px solid var(--outline-active);
}
.btn--sub:active {
  background-color: var(--sub-color-active);
}
.btn--sub:disabled,
.btn--sub[disabled] {
  background-color: var(--sub-color-disabled);
  pointer-events: none;
  cursor: not-allowed;
}
.btn--outline {
  background-color: var(--outline-color-default);
  color: var(--color-black);
  border: 1px solid var(--color-black);
  text-align: center;
  padding: 8px 32px;
  width: auto;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
}
.btn--outline:hover {
  background-color: var(--outline-color-hover);
  color: var(--color-white);
  border-color: transparent;
}
.btn--outline:focus {
  background-color: var(--outline-color-focus);
  outline: 3px solid var(--outline-active);
  color: var(--color-white);
  border-color: transparent;
}
.btn--outline:active {
  background-color: var(--outline-color-active);
  color: var(--color-white);
  border-color: transparent;
}
.btn--outline:disabled,
.btn--outline[disabled] {
  background-color: var(--outline-color-disabled);
  pointer-events: none;
  cursor: not-allowed;
}
.btn--icon {
  height: v-bind(height);
  width: v-bind(width);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-white);
  cursor: pointer;
  border-radius: var(--border-radius-size);
  border: 1px solid transparent;
}
.btn--icon:focus {
  border-color: var(--primary-color);
}
.btn--icon:disabled {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.5;
}
.shadow {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}
.btn--icon.transparent {
  background: transparent;
}
.btn--icon:hover {
  border-color: var(--primary-color);
}
/* .btn--icon:is(:hover, :focus, :active) {
  background-color: var(--primary-color);
} */
</style>
