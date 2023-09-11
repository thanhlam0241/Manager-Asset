<script setup>
/**
 * Props của radio
 * @type {Object}
 * @property {String} name - Tên của radio
 * @property {Boolean} disabled - Trạng thái disabled của radio
 * @property {Boolean} checked - Trạng thái checked của radio
 * Created by: NTLam (20/07/2023)
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
  checked: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <input
    :class="['input__radio', { disabled: disabled }]"
    :checked="checked"
    type="radio"
    :name="props.name"
  />
</template>

<style scoped>
.input__radio {
  appearance: none;
  border: 2px solid white;
  box-shadow: 0 0 0 1px var(--primary-color);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  transition: all ease-in 0.2s;
}

.input__radio:checked {
  background-color: var(--primary-color);
}

.input__radio.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.input__radio:hover:before {
  box-shadow: 0px 0px 0px 5px rgba(116, 165, 225, 0.3);
  border-radius: 50%;
}
.input__radio:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
