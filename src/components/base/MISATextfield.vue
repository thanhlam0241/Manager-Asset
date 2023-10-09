<script setup>
import { computed, ref, watch } from 'vue'

/**
 * Props của textfield
 * @type {Object}
 * @property {String} label - Nhãn của textfield
 * @property {String} errorText - Lỗi của textfield
 * @property {String} type - Loại của textfield
 * @property {String} width - Chiều rộng của textfield
 * @property {Boolean} required - Bắt buộc nhập
 * @property {String} placeholder - Placeholder của textfield
 * @property {Boolean} disabled - Bị disable
 * @property {String} defaultValue - Giá trị mặc định
 * @property {Boolean} autofocus - Tự động focus
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  label: {
    type: String,
    default: '',
    required: false
  },
  hasLabel: {
    type: Boolean,
    default: true
  },
  noMargin: {
    type: Boolean,
    default: false
  },
  errorText: {
    type: String,
    default: 'Không được để trống ô này'
  },
  type: {
    type: String,
    default: 'text',
    validate: (type) => {
      return ['text', 'number', 'email', 'date', 'password'].includes(type)
    }
  },
  width: {
    type: String,
    required: false,
    default: '100%'
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: [String, Number, Date],
    default: ''
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: 100
  },
  height: {
    type: String,
    default: '36px'
  },
  onlyInput: {
    type: Boolean,
    default: false
  }
})

/**
 * Lỗi của textfield
 * @type {import('vue').Ref<Boolean>}
 * Created by: NTLam (20/07/2023)
 */
const error = ref(false)

/**
 * Ref của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const refInput = ref(null)

const height = computed(() => {
  return props.height
})
const width = computed(() => {
  return props.width
})
/**
 * Giá trị của textfield
 * @type {import('vue').Ref<String>}
 * Created by: NTLam (20/07/2023)
 */
const inputValue = ref(
  props.defaultValue
    ? props.type === 'date'
      ? new Date(props.defaultValue).toISOString().slice(0, 10)
      : props.defaultValue
    : ''
)

/**
 * Emit event onChange
 * @type {import('vue').EmitsOptions}
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['onChange'])

/**
 * Expose method focus
 * Created by: NTLam (20/07/2023)
 */
defineExpose({
  focus: () => {
    refInput.value.focus()
  }
})

/**
 * Quan sát sự thay đổi của props.errorText
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => props.errorText,
  (newValue) => {
    if (newValue) error.value = true
  }
)

/**
 * Quan sát sự thay đổi của props.defaultValue
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => props.defaultValue,
  (newValue) => {
    if (props.type === 'date') {
      inputValue.value = new Date(newValue).toISOString().slice(0, 10)
    } else inputValue.value = newValue
  }
)

/**
 * Directive focus
 * Created by: NTLam (20/07/2023)
 */
const vFocus = {
  mounted: (el) => {
    if (props.autofocus) el.focus()
  }
}

/**
 * Khi blur
 * Created by: NTLam (20/07/2023)
 */
const onBlur = () => {
  if (props.required) {
    if (inputValue.value === '') {
      error.value = true
    }
  }
}

/**
 * Khi keydown
 * Created by: NTLam (20/07/2023)
 */
const onKeyDown = (e) => {
  if (e.key === 'Enter' && props.type === 'date') {
    refInput.value.showPicker()
  }
}

/**
 * Quan sát sự thay đổi của inputValue
 * Created by: NTLam (20/07/2023)
 */
watch(inputValue, (newValue) => {
  if (props.required) error.value = newValue === ''
  emit('onChange', newValue)
})

/**
 * Khi focus
 * Created by: NTLam (20/07/2023)
 */
const onFocus = () => {
  refInput.value.select()
}

const typeInput = ref(props.type)

const toggle = () => {
  if (typeInput.value !== 'password') {
    typeInput.value = 'password'
  } else {
    typeInput.value = 'text'
  }
}
</script>

<template>
  <label v-if="props.hasLabel">
    <span v-if="props.label" :class="{ required: required }">{{ props.label }}</span>
    <div class="input-container">
      <input
        ref="refInput"
        @keydown="onKeyDown"
        :maxlength="props.maxlength"
        v-focus
        @focus="onFocus"
        :class="{ error: error }"
        :type="typeInput"
        @blur="onBlur"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        v-model="inputValue"
      />
      <i
        @click="toggle"
        v-if="props.type === 'password'"
        :class="[!(typeInput === 'password') ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye']"
      ></i>
    </div>
    <span v-if="props.label" :class="['text-error', { show: error }]">{{
      props.errorText || 'Không được để trống'
    }}</span>
  </label>
  <input
    v-else
    ref="refInput"
    @keydown="onKeyDown"
    :maxlength="props.maxlength"
    v-focus
    @focus="onFocus"
    :class="{ error: error, 'no-margin': props.noMargin, disabled: props.disabled }"
    :type="typeInput"
    @blur="onBlur"
    :placeholder="props.placeholder"
    v-model="inputValue"
  />
</template>

<style scoped>
label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}
.input-container {
  position: relative;
}
input:disabled {
  background-color: var(--textfield-disabled-color);
  border-color: #bdbdbd;
  pointer-events: none;
  box-shadow: none;
  color: black;
}
input.disabled {
  background-color: var(--textfield-disabled-color);
  border-color: #bdbdbd;
  pointer-events: none;
  box-shadow: none;
  color: black;
}
input {
  height: var(--textfield-height);
  display: block;
  height: v-bind(height);
  width: v-bind(width);
  border-radius: var(--border-radius-size);
  border: 1px solid var(--textfield-border-color);
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  padding: 0 4px 0 14px;
  font-weight: 400;
  font-family: 'MISA font';
  transition: all ease 400ms;
}
input.no-margin {
  margin: 0 !important;
}
input[type='date']::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  /* display: block; */
  background: url('/src/assets/icon/qlts-icon.png') no-repeat -287px -67px;
  width: 18px;
  height: 18px;
  border-width: thin;
  cursor: pointer;
  margin-top: 2px;
}
input:focus {
  border: 1px solid var(--primary-color) !important;
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}
input:not(:disabled):hover {
  border: 1px solid var(--primary-color);
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}

input::placeholder {
  font-size: 14px;
  font-family: 'MISA font';
}
input.error {
  border: 1px solid var(--color-error);
}
.text-error {
  font-size: 12px;
  color: transparent;
  height: 10px;
}
.text-error.show {
  color: var(--color-error);
}
.required:after {
  content: ' *';
  color: var(--color-error);
  margin-left: 1px;
}
::placeholder {
  color: #bdbdbd;
  font-weight: 500;
}
.input-container {
  position: relative;
}
i {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 21px;
}
</style>
