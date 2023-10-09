span
<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { searchInString } from '@/helper/stringHelper'

/**
 * Props của combobox
 * @type {Object}
 * @property {String} label - Label của combobox
 * @property {Array} options - Các options của combobox
 * @property {String} type - Loại combobox
 * @property {String} icon - Icon của combobox
 * @property {String} size - Kích thước của combobox
 * @property {String} placeholder - Placeholder của combobox
 * @property {Boolean} disabled - Trạng thái disabled của combobox
 * @property {Boolean} required - Trạng thái required của combobox
 * @property {String} width - Chiều rộng của combobox
 * @property {String} height - Chiều cao của combobox
 * @property {String} zIndex - Z-index của combobox
 * @property {String} position - Vị trí của combobox
 * @property {String} defaultValue - Giá trị mặc định của combobox
 * @property {String} errorText - Text lỗi của combobox
 * Created by: NTLam (2023-07-05).
 */
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    validate: (options) => {
      return options.length > 0
    }
  },
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'combobox',
    validate: (type) => {
      return ['combobox', 'dropdown'].includes(type)
    }
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validate: (size) => {
      return ['small', 'medium', 'large'].includes(size)
    }
  },
  typeValue: {
    type: String,
    default: 'Value',
    validate: (typeValue) => {
      return ['Value', 'Object'].includes(typeValue)
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
  required: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '200px'
  },
  height: {
    type: String,
    default: '36px'
  },
  zIndex: {
    type: String,
    default: '2'
  },
  position: {
    type: String,
    default: 'bottom',
    validate: (position) => {
      return ['top', 'bottom'].includes(position)
    }
  },
  multiple: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: [String, Number],
    default: ''
  },
  errorText: {
    type: String,
    default: ''
  }
})

/**
 * A reactive variable that indicates whether an error has occurred.
 * @type {Object}
 */
const error = ref(false)

/**
 * The type of the value lists in the combobox.
 * @type {Object}
 * Created by: NTLam (2023-07-05).
 */
const isOptionKeyValue = computed(() => {
  return props.typeValue === 'Object'
})

/**
 * A reactive variable that indicates whether the combobox is disabled or not.
 * @type {Object}
 * Created by: NTLam (2023-07-05).
 */
const indexFocusing = ref(-1)

/**
 * A reactive variable that indicates whether the combobox is disabled or not.
 * @type {Object}
 * Created by: NTLam (2023-07-05).
 */
const optionRefs = ref([])

/**
 * The list index select
 * @type {Object}
 * Created by: NTLam (2023-07-05).
 */
const listIndexSelect = ref([])

/**
 * The input value of the MISACombobox component.
 * @type {Ref<string>}
 * Created by: NTLam (2023-07-05).
 */
const inputValue = ref(props.defaultValue)

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (2023-07-05).
 */
onMounted(() => {
  if (props.defaultValue) {
    const listValueDefault = props.defaultValue.toString().split(',')
    const listIndex = []
    for (let i = 0; i < props.options.length; i++) {
      if (props.typeValue === 'Object') {
        if (listValueDefault.includes(props.options[i].value)) {
          listIndex.push(i)
        }
      } else {
        if (listValueDefault.includes(props.options[i])) {
          listIndex.push(i)
        }
      }
    }
    listIndexSelect.value = listIndex
  }
})

/**
 * Watch the value prop and update the checked state accordingly.
 * Created by: NTLam (2023-07-05).
 */
watch(
  () => props.defaultValue,
  (newValue) => {
    if (newValue) {
      inputValue.value = newValue
    }
  }
)

/**
 * A reactive variable that determines whether the combobox is currently being displayed or not.
 * @type {Object}
 * Created by: NTLam (2023-07-05).
 */
const isShowCombobox = ref(false)

/**
 * This component is a custom combobox that emits a 'changeValue' event when the selected value changes.
 * @emits changeValue - The event emitted when the selected value changes.
 * Created by: NTLam (2023-07-05).
 */
const emit = defineEmits(['changeValue'])

/**
 * Watch the errorText prop and update the error state accordingly.
 * Created by: NTLam (2023-07-05).
 */
watch(
  () => props.errorText,
  (newValue) => {
    if (newValue) error.value = true
  }
)

/**
 * Component for a combobox with options.
 * @component MISACombobox
 *
 * @prop {Array} options - The options to display in the combobox.
 *
 * @example
 * <MISACombobox :options="['Option 1', 'Option 2', 'Option 3']" />
 * Created by: NTLam (2023-07-05).
 */
const options = ref(
  props.options.map((item) => {
    if (isOptionKeyValue.value) {
      return {
        key: item.key,
        value: item.value
      }
    }
    return item
  })
)

/**
 * Handles the event when the combobox is shown.
 * Created by: NTLam (2023-07-05).
 */
const handleShowCombobox = () => {
  isShowCombobox.value = true
}

/**
 * Handles hiding the combobox.
 * @function
 * @name handleHideCombobox
 * @returns {void}
 * Created by: NTLam (2023-07-05).
 */
const handleHideCombobox = () => {
  if (isShowCombobox.value) {
    isShowCombobox.value = false
  }
}

/**
 * Handles the toggle event of the combobox.
 * Created by: NTLam (2023-07-05).
 */
const handleToggleCombobox = () => {
  isShowCombobox.value = !isShowCombobox.value
}

/**
 * Handles the event when the combobox is shown.
 * Created by: NTLam (2023-07-05).
 */
onMounted(() => {
  if (props.defaultValue) {
    inputValue.value = props.defaultValue
  }
})

/**
 * Watch for changes in the input value and perform an asynchronous action.
 * @watch inputValue
 * @async
 * Created by: NTLam (2023-07-05).
 */
watch(inputValue, async () => {
  if (props.type === 'combobox' && props.typeValue === 'Value') {
    if (inputValue.value !== '') {
      let validSelectIndex = props.options.filter((item) => searchInString(item, inputValue.value))
      if (validSelectIndex.length > 0) {
        error.value = false
        options.value = validSelectIndex
        await nextTick()
        handleShowCombobox()
      } else {
        handleHideCombobox()
        error.value = true
      }
    } else {
      options.value = props.options
      error.value = true
    }
  }
  emit('changeValue', inputValue.value)
})

/**
 * Computed property that returns the z-index value for the MISACombobox component.
 * @returns {number} The z-index value.
 * Created by: NTLam (2023-07-05).
 */
const zIndex = computed(() => {
  return props.zIndex
})

/**
 * Computes the width of the MISACombobox component.
 * @computed width
 * @memberof MISACombobox
 * @returns {number} The width of the component.
 * Created by: NTLam (2023-07-05).
 */
const width = computed(() => {
  return props.width
})

/**
 * Computes the height of the MISACombobox component.
 * @computed height
 * @memberof MISACombobox
 * @returns {number} The height of the component.
 * Created by: NTLam (2023-07-05).
 */
const height = computed(() => {
  return props.height
})

/**
 * The `MISACombobox` component is a custom combobox that allows users to select one option from a dropdown list.
 * @typedef {Object} classListSize
 * @property {string} small - The small size class for the combobox.
 * @property {string} medium - The medium size class for the combobox.
 * @property {string} large - The large size class for the combobox.
 * Created by: NTLam (2023-07-05).
 */
const classListSize = {
  small: 'small-size',
  medium: 'medium-size',
  large: 'large-size'
}

/**
 * Handles the selection of a value in the combobox.
 * @param {number} index - The index of the selected value.
 * Created by: NTLam (2023-07-05).
 */
const handleSelectValue = async (index) => {
  console.log('CLick')
  if (props.multiple) {
    const list = [...listIndexSelect.value]
    if (list.includes(index)) {
      list.splice(listIndexSelect.value.indexOf(index), 1)
    } else {
      list.push(index)
    }
    listIndexSelect.value = list
    await nextTick()
    inputValue.value =
      list.length === 0
        ? ''
        : list
            .map((item) =>
              isOptionKeyValue.value ? options.value[item].value : options.value[item]
            )
            .join(',')
    return
  } else if (props.typeValue === 'Value') {
    inputValue.value = options.value[index]
  } else {
    inputValue.value = props.options[index].key
  }
  error.value = false
  isShowCombobox.value = false
}

/**
 * Handles the blur event of the combobox.
 * @function
 * @name onBlur
 * @memberof MISACombobox
 * @inner
 * @param {Event} event - The blur event.
 * Created by: NTLam (2023-07-05).
 */
const onBlur = () => {
  if (props.required) {
    isShowCombobox.value = false
    error.value = inputValue.value === '' ? true : false
  }
}

/**
 * Handles the keydown event of the combobox.
 * @function
 * @name handleKeyDown
 * @memberof MISACombobox
 * @inner
 * @param {Event} event - The keydown event.
 * Created by: NTLam (2023-07-05).
 */
const handleKeyDown = (event) => {
  console.log('Keydown')
  event.stopPropagation()
  event.capture = true
  if (!isShowCombobox.value) {
    if (event.key === 'Tab') {
      isShowCombobox.value = false
      error.value = inputValue.value === '' ? true : false
    }
    return
  }
  if (event.key !== 'Tab') {
    event.preventDefault()
  }
  if (event.key === 'Enter' && !isShowCombobox.value) {
    handleToggleCombobox()
  } else if (event.key === 'Enter' && isShowCombobox.value && indexFocusing.value < 0) {
    handleToggleCombobox()
  } else if (event.key === 'Enter' && isShowCombobox.value && indexFocusing.value >= 0) {
    handleSelectValue(indexFocusing.value)
  } else if (event.key === 'Escape') {
    handleHideCombobox()
  } else if (event.key === 'ArrowDown') {
    if (indexFocusing.value < options.value.length - 1) {
      indexFocusing.value += 1
      optionRefs.value[indexFocusing.value].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  } else if (event.key === 'ArrowUp') {
    if (indexFocusing.value > 0) {
      indexFocusing.value -= 1
      optionRefs.value[indexFocusing.value].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }
}

/**
 * Uncheck all option
 * Created by: NTLam (2023-07-05).
 */
const unCheckAll = () => {
  listIndexSelect.value = []
  inputValue.value = ''
}

/**
 * Event that is triggered when a click occurs outside the combobox.
 * Created by: NTLam (2023-07-05).
 */
const vClickOutside = {
  mounted: function (el, binding) {
    el.ClickOutsideHandler = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.ClickOutsideHandler)
  },
  unmounted: function (el) {
    document.body.removeEventListener('click', el.ClickOutsideHandler)
  }
}
</script>
<template>
  <label v-click-outside="handleHideCombobox">
    <span v-if="props.label" :class="[{ required: required }, 'label__text']">{{
      props.label
    }}</span>
    <div
      :class="[
        'combobox',
        { error: error },
        classListSize[props.size],
        { disabled: disabled },
        { combobox__margin: props.label },
        { focus: isShowCombobox }
      ]"
    >
      <span v-if="props.icon" class="icon__input">
        <i :class="props.icon"></i>
      </span>
      <input
        v-if="props.type === 'combobox'"
        class="combobox-textfield"
        v-model="inputValue"
        :disabled="disabled"
        type="text"
        :placeholder="props.placeholder"
        @blur="onBlur"
      />
      <span class="span__value" v-else>{{ inputValue || props.placeholder }}</span>
      <button class="btn__show" @click="handleToggleCombobox" @keydown.stop.capture="handleKeyDown">
        <i class="icon-caret-down"></i>
      </button>
      <div
        v-if="isShowCombobox && options.length > 0"
        :class="[
          'combobox--options',
          props.position === 'bottom' ? 'position-bottom' : 'position-top'
        ]"
      >
        <div
          class="combobox--option"
          v-if="props.name"
          :class="[classListSize[props.size], 'name']"
          @mousedown="
            () => {
              handleSelectValue(-1)
              $emit('changeValue', '')
            }
          "
        >
          <span class="uncheck-all" @mousedown.prevent.stop="unCheckAll">
            <i class="icon-x"></i>
          </span>
          ----- {{ props.name }} -----
        </div>
        <div class="combobox--label" v-if="isOptionKeyValue">
          <span class="option-code">Mã</span>
          <span>Tên</span>
        </div>
        <div
          v-for="(option, index) in options"
          ref="optionRefs"
          :key="`combobox${index}`"
          class="combobox--option"
          :class="[
            {
              selected: !props.multiple
                ? !isOptionKeyValue
                  ? options[index] === inputValue
                  : options[index].key === inputValue
                : listIndexSelect.includes(index)
            },
            classListSize[props.size],
            { focusing: indexFocusing === index }
          ]"
          @mousedown.stop.prevent="() => handleSelectValue(index)"
        >
          <span v-if="!isOptionKeyValue && !props.multiple" class="mark__seleced"
            ><i
              v-if="
                isOptionKeyValue ? options[index].key === inputValue : options[index] === inputValue
              "
              class="icon-black icon-success"
            ></i
          ></span>
          <span class="combobox-option__checkbox" v-if="props.multiple">
            <MISACheckbox
              :value="listIndexSelect.includes(index)"
              @mousedown.stop.prevent.self="() => handleSelectValue(index)"
            />
          </span>
          <span :class="{ 'option-code': props.typeValue === 'Object' }">{{
            isOptionKeyValue ? options[index].key : options[index]
          }}</span>
          <span v-if="isOptionKeyValue">{{ option.value }}</span>
        </div>
      </div>
    </div>
    <span v-if="props.label" :class="['text--error', { show: error }]">{{
      props.errorText || (props.required && error && 'Không được để trống')
    }}</span>
  </label>
</template>

<style scoped>
.combobox {
  position: relative;
  width: auto;
  width: 100%;
  padding: 0;
  border: 1px solid var(--textfield-border-color);
  border-radius: var(--border-radius-size);
  display: flex;
  align-items: center;
  flex-direction: space-between;
  z-index: v-bind(zIndex);
  height: v-bind(height);
  background-color: var(--color-white);
  transition: all ease 400ms;
  cursor: pointer;
}
label:hover .combobox {
  box-shadow: 0px 0px 1px 1px var(--primary-color);
  border-color: var(--primary-color);
}
label {
  transition: all ease 100ms;
}
.small-size {
  height: 26px;
}
.medium-size {
  height: 36px;
}
.large-size {
  height: 40px;
}
.icon__input {
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.combobox__margin {
  margin-top: 8px;
  margin-bottom: 4px;
}
.btn__show {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
}

.combobox.error {
  border-color: var(--color-error);
}
.combobox.disabled {
  background-color: var(--textfield-disabled-color);
  pointer-events: none;
}

.required:after {
  content: ' *';
  color: var(--color-error);
  margin-left: 1px;
}

.span__value {
  padding: 0 0 0 16px;
  width: v-bind(width);
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text--error {
  color: transparent;
  font-size: 11px;
  height: 11px;
}
.text--error.show {
  color: var(--color-error);
  font-size: 11px;
  height: 11px;
}

.combobox > i {
  cursor: pointer;
}
.combobox:focus-within {
  box-shadow: 0px 0px 1px 1px var(--primary-color);
  border-color: var(--primary-color);
}
.combobox.focus {
  box-shadow: 0px 0px 1px 1px var(--primary-color);
  border-color: var(--primary-color);
}
.combobox-textfield {
  flex-grow: 1;
  border-radius: var(--border-radius-size);
  height: 100%;
  background-color: var(--white-color);
  display: flex;
  align-items: center;
  padding-left: 16px;
  justify-content: space-between;
  font-size: 14px;
  z-index: 10;
  width: v-bind(width);
  outline: none !important;
  border: none;
}

.combobox--selected {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;
}

.combobox--selected::after {
  content: '\25BC'; /* Unicode for down-pointing triangle */
  color: #ccc;
}

.combobox--options {
  position: absolute;
  width: calc(100%);
  /* top: calc(100% + 1px);
  left: 0; */
  background-color: #f9fafc;
  border: 1px solid #ccc;
  padding: 4px;
  height: auto;
  max-height: 200px;
  overflow: auto;
  font-weight: 300;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.option-code {
  width: 100px;
  text-align: left;
  padding-left: 8px;
}

.option-name {
}

.position-top {
  top: auto;
  bottom: calc(100% + 4px);
}

.position-bottom {
  top: calc(100% + 4px);
  bottom: auto;
}

.combobox--options.show {
  display: block;
}

.combobox--option {
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  border-radius: 4px;
  width: 100%;
  text-align: right;
  height: v-bind(height);
}
.combobox--option.name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 800;
  background-color: #cedfed !important;
  cursor: default;
}
.uncheck-all {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  margin-left: 3px;
  background-color: #fff;
  cursor: pointer;
}
.combobox-option__checkbox {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 16px;
  width: 30px;
}

.combobox--label {
  padding: 4px;
  cursor: auto;
  background-color: #96c6ee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  border-radius: 4px;
  width: 100%;
  text-align: right;
  font-weight: 800;
  height: 32px;
}

.combobox--option > .mark__seleced {
  height: 100%;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;
}
.combobox--option:hover {
  background-color: #c7e0f5;
}

/* .combobox--option.selected > .mark__seleced {
  background-color: #c7e0f5;
} */
.combobox--option.selected {
  /* font-weight: bold; */
  background-color: #c7e0f5 !important;
}

.combobox--option.focusing {
  /* font-weight: bold; */
  background-color: #c8d7e3;
}

::placeholder {
  color: #bdbdbd;
  font-style: italic;
  font-weight: 500;
}
</style>
