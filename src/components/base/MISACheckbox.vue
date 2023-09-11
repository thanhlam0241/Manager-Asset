<script setup>
import { ref, watch } from 'vue'

/**
 * MISACheckbox component props
 * @props {string} name - The name of the checkbox
 * @props {boolean} disabled - Determines whether the checkbox is disabled or not
 * @props {boolean} value - The value of the checkbox
 * @props {Object} inputRef - The ref of the checkbox
 * Creatd by: NTLam (20/07/2023)
 */
const props = defineProps({
  name: {
    type: String,
    default: 'radio'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: Boolean,
    default: false
  },
  checkbox: {
    type: String,
    default: 'checkbox'
  },
  inputRef: {
    type: Object,
    default: null
  }
})

/**
 * A reactive variable that represents the checked state of the checkbox.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const checked = ref(props.value)

/**
 * The ref of the checkbox
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const refCheckbox = ref(null)

/**
 * Watch the value of the checkbox
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => props.value,
  (newValue) => {
    console.group('watch change checkbox')
    checked.value = newValue
    console.log(newValue)
    console.groupEnd()
  }
)

/**
 * Expose method focus
 * Created by: NTLam (20/07/2023)
 */
defineExpose({
  checked
})
</script>

<template>
  <input
    type="checkbox"
    ref="refCheckbox"
    :name="props.checkbox"
    v-model="checked"
    :disabled="props.disabled"
    @click.prevent="$emit('changeCheckbox', checked)"
  />
</template>

<style scoped>
.form-control {
  display: grid;
  grid-template-columns: 20px;
  width: auto;
}

.form-control--disabled {
  cursor: not-allowed;
}

input[type='checkbox'] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* For iOS < 15 */
  background-color: #fff;
  /* Not removed via appearance */
  margin: 0;

  font: inherit;
  color: currentColor;
  width: 16px;
  height: 16px;
  border-radius: 0.1em;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
  cursor: pointer;
  border: 1px solid var(--color-black);
}

input[type='checkbox']:checked {
  background-color: var(--primary-color);
  border: 1px solid transparent;
}

input[type='checkbox']::before {
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  transform-origin: center;
  transition: 120ms transform ease-in-out;
  /* box-shadow: inset 1em 1em var(--form-control-color); */
  /* Windows High Contrast Mode */
}

input[type='checkbox']:checked::before {
  content: '';
  width: 0.65em;
  height: 0.65em;
  transform: scale(1);
  background-color: var(--color-white);
}

input[type='checkbox']:not(:disabled):hover {
  outline: max(3px, 0.25em) solid #caeaf4;
  outline-offset: 0em;
}

input[type='checkbox']:disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
