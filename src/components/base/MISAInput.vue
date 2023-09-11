<script setup>
import { ref, computed, watch } from 'vue'
import {
  checkIsNumberString,
  checkIsPositiveFloat,
  converStringToBigNumberString,
  checkIsNumberFormatString
} from '@/helper/stringHelper.js'

/**
 * Props của input
 * @type {Object}
 * @property {String} type - Loại input
 * @property {String} placeholder - Placeholder của input
 * @property {Boolean} disabled - Trạng thái disabled
 * @property {String} defaultValue - Giá trị mặc định của input
 * @property {Boolean} action - Có action hay không
 * @property {String} width - Chiều rộng của input
 * @property {String} height - Chiều cao của input
 * @property {String} label - Label của input
 * @property {Object} inputRef - Ref của input
 * @property {String} color - Màu của input
 * @property {String} errorText - Text lỗi của input
 * @property {Boolean} format - Có format hay không
 * @property {Boolean} border - Có border hay không
 * @property {Boolean} bold - Có bold hay không
 * @property {Boolean} required - Có required hay không
 * @property {String} formLabel - Label của form
 * @property {Boolean} autofocus - Có focus hay không
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'string',
    validate: (type) => {
      return ['string', 'number', 'email', 'date', 'float'].includes(type)
    }
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
  action: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '36px'
  },
  label: {
    type: String,
    default: ''
  },
  inputRef: {
    type: String
  },
  color: {
    type: String,
    default: 'normal',
    validate: (color) => {
      return ['normal', 'error', 'primary'].includes(color)
    }
  },
  errorText: {
    type: String,
    default: ''
  },
  format: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: true
  },
  bold: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  formLabel: {
    type: String,
    default: ''
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})

/**
 * Tính toán chiều rộng của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const width = computed(() => {
  return props.width
})

/**
 * Tính toán chiều cao của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const height = computed(() => {
  return props.height
})

/**
 * Dùng để focus input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const vFocus = {
  mounted: (el) => {
    if (props.autofocus) el.focus()
  }
}

/**
 * Tính toán màu nền của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const backgroundColor = computed(() => {
  if (props.color === 'normal') return 'var(--color-white)'
  else if (props.color === 'error') return 'var(--color-error)'
  else return 'var(--color-item-selected)'
})

/**
 * Tính toán border của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const border = computed(() => {
  if (props.border) return '1px solid #ccc'
  else return 'none'
})

/**
 * Tính toán bold của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const bold = computed(() => {
  if (props.bold) return '600'
  else return '400'
})

/**
 * Giá trị của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const inputValue = ref(
  props.defaultValue || (props.type === 'number' || props.type === 'float' ? 0 : '')
)

/**
 * Ref của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const refInput = ref(null)

/**
 * Hành động khi giá trị mặc định của input thay đổi
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => props.defaultValue,
  (newValue) => {
    if (props.type === 'float') {
      inputValue.value = newValue.toString().replace('.', ',')
    }
    inputValue.value = newValue
  }
)

/**
 * Định nghĩa các giá trị cần expose ra bên ngoài
 * Created by: NTLam (20/07/2023)
 */
defineExpose({
  inputValue: inputValue,
  ref: refInput
})

/**
 * Định nghĩa các hàm cần emit ra bên ngoài
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['onChange', 'checkValid', 'sendValue'])

/**
 * Tính toán trạng thái valid của input
 * @type {import('vue').Ref<HTMLInputElement>}
 * Created by: NTLam (20/07/2023)
 */
const isValid = computed(() => {
  if (props.required) {
    if (inputValue.value === '') return false
  }
  if (props.errorText) return false
  if (props.type === 'number') {
    return (
      inputValue.value == '0' ||
      checkIsNumberString(inputValue.value.toString().split('.').join(''))
    )
  } else if (props.type === 'float') {
    return inputValue.value === '' || checkIsPositiveFloat(inputValue.value)
  } else if (props.type === 'email') {
    return inputValue.value === '' || inputValue.value.includes('@')
  } else {
    return true
  }
})

/**
 * Hành động khi trang thái valid thay đổi
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
watch(isValid, (value) => {
  emit('checkValid', value)
})

/**
 * Hành động khi giá trị của input thay đổi
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
watch(inputValue, (value) => {
  if (props.type === 'number' && props.format) {
    const valueFormat = value.toString().split('.').join('')
    emit('onChange', valueFormat)
    if (checkIsNumberFormatString(value)) {
      return
    } else if (checkIsNumberString(valueFormat)) {
      inputValue.value = converStringToBigNumberString(valueFormat)
    }
  } else if (props.type === 'number' && !props.format && value === '') {
    inputValue.value = 0
  } else if (props.type === 'float') {
    const valueFormat = value.toString().replace(',', '.')
    emit('onChange', valueFormat)
    if (checkIsPositiveFloat(valueFormat)) {
      inputValue.value = valueFormat
    }
  } else {
    emit('onChange', value)
  }
})

/**
 * Hành động khi click vào nút mũi tên trên
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onIncrease = () => {
  if (props.type === 'number') {
    if (props.format) {
      const a = parseInt(inputValue.value.toString().split('.').join(''))
      if (typeof a === 'number')
        inputValue.value = converStringToBigNumberString((a + 1).toString())
    } else {
      inputValue.value = parseInt(inputValue.value) + 1
    }
  }
}

/**
 * Hành động khi click vào nút mũi tên dưới
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onDecrease = () => {
  if (props.type === 'number') {
    if (props.format) {
      const a = parseInt(inputValue.value.toString().split('.').join(''))
      if (typeof a === 'number')
        inputValue.value = converStringToBigNumberString((a - 1).toString())
    } else {
      inputValue.value = parseInt(inputValue.value) - 1
    }
  }
}

/**
 * Hành động khi nhấn phím
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onKeyUp = (e) => {
  if (props.type === 'number') {
    if (e.key === 'Enter') {
      emit('sendValue', inputValue.value)
    }
  } else if (props.type === 'date') {
    if (e.key === 'Enter') {
      refInput.value.showPicker()
    }
  }
}

/**
 * Hành động khi focus vào input
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onFocus = (e) => {
  refInput.value.select()
  if (props.type === 'date') {
    if (e.key === 'Enter') {
      refInput.value.showPicker()
    }
  }
}
</script>
<template>
  <label :class="{ disabled: props.disabled }" class="form-control">
    <span v-if="props.formLabel" :class="{ required: required }" class="label-form">{{
      props.formLabel
    }}</span>
    <div :class="['input-text', { disabled: props.disabled }, { error: !isValid }]">
      <span v-if="props.label" class="label">{{ props.label }}</span>
      <input
        ref="refInput"
        v-focus
        v-model="inputValue"
        class="textfield"
        :disabled="props.disabled"
        type="text"
        :placeholder="props.placeholder"
        @keyup.stop.prevent="onKeyUp"
        @focusin="onFocus"
      />
      <span
        v-if="props.type === 'number' && props.action"
        class="btn__change-number"
        :class="[{ error: !isValid }]"
      >
        <i @click="onIncrease" class="icon-caret-up"></i>
        <i @click="onDecrease" :class="['icon-caret-down', { disabled: inputValue === '0' }]"></i>
      </span>
    </div>
    <span v-if="props.formLabel" :class="['text-error', { show: !isValid || props.errorText }]">{{
      props.errorText || 'Không được để trống'
    }}</span>
  </label>
</template>

<style scoped>
.input-text {
  padding: 0 8px 0 0;
  height: v-bind(height);
  border: v-bind(border);
  border-radius: var(--border-radius-size);
  display: flex;
  align-items: center;
  z-index: 1;
  background-color: v-bind(backgroundColor);
  transition: all ease 400ms;
}

.input-text:not(.disabled):hover {
  border-color: var(--primary-color) !important;
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}

label:focus-within .input-text:not(.disabled) {
  border-color: var(--primary-color) !important;
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}

label:hover .input-text:not(.disabled) {
  border-color: var(--primary-color) !important;
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}

i.disabled {
  pointer-events: none;
  cursor: not-allowed !important;
}
.input-text.disabled {
  pointer-events: none;
  cursor: not-allowed;
  background-color: var(--textfield-disabled-color);
  pointer-events: none;
  box-shadow: none;
}
.input-text.error {
  border-color: var(--color-error) !important;
}

.input-text:not(.disabled):not(.error):focus-within {
  border-color: var(--primary-color) !important;
  box-shadow: 0px 0px 1px 1px var(--primary-color);
}
.textfield {
  width: v-bind(width);
  height: 100%;
  border-radius: var(--border-radius-size);
  padding: 0 8px;
  text-align: right;
  background-color: transparent;
  font-weight: v-bind(bold);
}
::placeholder {
  color: #bdbdbd;
  font-style: italic;
  font-weight: 500;
}
.btn__change-number {
  height: 36px;
  width: 16px;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.btn__change-number > i {
  cursor: pointer;
  font-size: 12px;
  color: #bdbdbd;
}

.btn__change-number.error {
  pointer-events: none;
  opacity: 0.5;
}
.label {
  padding-left: 16px;
}

.form-control {
  /* display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.label-form {
  margin-bottom: 8px !important;
}

.text-error {
  margin-top: 4px;
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
  font-style: italic;
  font-weight: 500;
}
</style>
