<script setup>
import { onMounted, reactive, watch, ref, nextTick, computed, onUnmounted } from 'vue'
import fixedAssetApi from '@/service/api/fixedAssetApi'
import MISALoading from '@/components/base/MISALoading.vue'
import emitter from '@/helper/emitter'

import { compareDate } from '@/helper/stringHelper'

import { dialogResource, typeForm, typeButton } from '@/assets/resources/dialog'
import { textErrorAssetForm, labelAsset } from '@/assets/resources/asset'
import { exceptionResource, typeAction } from '@/assets/resources/response'
import { events, eventBus } from '@/assets/resources/common'

import { useStore } from 'vuex'

const store = useStore()
const lang = computed(() => store.state.lang)
/**
 * MISAdialog-form component emits
 * @typedef {Object} MISAdialog-formEmits
 * @property {function} close - The function to be called when the dialog-form is closed.
 * @property {function} action - The function to be called when the dialog-form is closed.
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['close', 'action'])

/**
 * MISAdialog-form component props
 * @typedef {Object} MISAdialog-formProps
 * @property {number} width - The width of the dialog-form.
 * @property {boolean} open - A boolean value indicating whether the dialog-form is open or not.
 * @property {string} type - The type of the dialog-form. Can be either `'add'`, `'change'` or `'duplicate'`.
 * @property {string} assetId - The id of the asset to be edited.
 * @property {Array} department - The list of departments.
 * @property {Array} fixedAssetCategory - The list of fixed asset categories.
 */

const props = defineProps({
  width: {
    type: Number,
    default: 1000
  },
  open: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: typeForm.ADD,
    validator: (value) => {
      return [typeForm.ADD, typeForm.EDIT, typeForm.DUPLICATE].includes(value)
    }
  },
  assetId: {
    type: String,
    default: ''
  },
  department: {
    type: Array,
    default: () => []
  },
  fixedAssetCategory: {
    type: Array,
    default: () => []
  }
})
/**
 * A reactive reference to the dialog-form header element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const headerRef = ref(null)

/**
 * A reactive reference to the dialog-form element to resize the form in the right.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const resizeRightRef = ref(null)

/**
 * A reactive reference to the dialog-form element to resize the form in the bottom.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const resizeBottomRef = ref(null)

/**
 * A reactive reference to the dialog-form element to resize the form in the both right and bottom.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const resizeBothRef = ref(null)

/**
 * A reactive reference to the dialog-form element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const dialogRef = ref(null)

/**
 * Chức năng: Khởi tạo sự kiện drag cho dialog-form
 * Created by: NTLam (20/07/2023)
 */
function initDragElement() {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  var elmnt = null
  var currentZIndex = 100 //TODO reset z index when a threshold is passed

  dialogRef.value.onmousedown = function () {
    dialogRef.value.style.zIndex = '' + ++currentZIndex
  }

  headerRef.value.onmousedown = dragMouseDown

  // Khởi tạo event drag
  function dragMouseDown(e) {
    elmnt = dialogRef.value
    elmnt.style.zIndex = '' + ++currentZIndex

    e = e || window.event
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  // Thực hiện event drag
  function elementDrag(e) {
    if (!elmnt) {
      return
    }
    e = e || window.event
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    const differenceTop = elmnt.offsetTop - pos2
    const differenceLeft = elmnt.offsetLeft - pos1
    const differenceRight = window.innerWidth - elmnt.offsetWidth - elmnt.offsetLeft + pos1
    const differenceBottom = window.innerHeight - elmnt.offsetHeight - elmnt.offsetTop + pos2

    if (differenceTop < 0 || differenceLeft < 0 || differenceRight < 0 || differenceBottom < 0) {
      return
    }

    elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
  }

  // Dừng event drag
  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null
    document.onmousemove = null
  }
}

/**
 * Chức năng: Khởi tạo sự kiện resize cho dialog-form
 * Created by: NTLam (20/07/2023)
 */
function initResizeElement() {
  var element = null
  var startX, startY, startWidth, startHeight

  resizeRightRef.value.addEventListener(events.MOUSEDOWN, initDrag, false)

  resizeBottomRef.value.addEventListener(events.MOUSEDOWN, initDrag, false)

  resizeBothRef.value.addEventListener(events.MOUSEDOWN, initDrag, false)

  // Khởi tạo event resize
  function initDrag(e) {
    element = dialogRef.value

    startX = e.clientX
    startY = e.clientY
    startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
    document.documentElement.addEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.addEventListener(events.MOUSEUP, stopDrag, false)
  }

  // Thực hiện event resize
  function doDrag(e) {
    element.style.width = startWidth + e.clientX - startX + 'px'
    element.style.height = startHeight + e.clientY - startY + 'px'
  }
  // Dừng event resize
  function stopDrag() {
    document.documentElement.removeEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.removeEventListener(events.MOUSEUP, stopDrag, false)
  }
}

/**
 * Chức năng: Canh giữa dialog-form
 * Created by: NTLam (20/07/2023)
 */
const centerTheForm = () => {
  const width = dialogRef.value.offsetWidth
  const height = dialogRef.value.offsetHeight

  dialogRef.value.style.top = `calc(50vh - ${height / 2}px)`
  dialogRef.value.style.left = `calc(50vw - ${width / 2}px)`
}

/**
 * A reactive reference to the close button element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const closeBtn = ref(null)

/**
 * A reactive reference to the save button element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const cancelFormBtn = ref(null)

/**
 * A reactive reference to the first input element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const firstInput = ref(null)

/**
 * A reactive reference to a boolean value indicating whether the dialog-form is currently loading or not.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const loading = ref(false)

// const formProperty = reactive({
//   fixedAssetCode: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   fixedAssetName: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   departmentCode: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   fixedAssetCategoryCode: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   quantity: {
//     defaultValue: 1,
//     errorText: '',
//     value: 1
//   },
//   cost: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   lifeTime: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   depreciationRate: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   productionYear: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   trackedYear: {
//     defaultValue: '',
//     errorText: '',
//     value: ''
//   },
//   purchaseDate: {
//     defaultValue: new Date(),
//     errorText: '',
//     value: new Date()
//   },
//   createdDate: {
//     defaultValue: new Date(),
//     errorText: '',
//     value: new Date()
//   }
// })

/**
 * This file contains the MISAdialog-form component which is used to display a dialog-form window.
 * The reactive object valueForm is defined here to store the fields of the dialog-form.
 * @file MISAdialog-form component and reactive valueForm object
 * @name MISAdialog-form.vue
 * Created by: NTLam (20/07/2023)
 */
const valueForm = reactive({
  fixedAssetCode: '',
  fixedAssetName: '',
  departmentCode: '',
  fixedAssetCategoryCode: '',
  quantity: 1,
  cost: '',
  lifeTime: '',
  depreciationRate: '',
  productionYear: '',
  trackedYear: '',
  purchaseDate: new Date(),
  createdDate: new Date()
})

/**
 * A reactive reference to the default value of the dialog-form.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const defaultValueForm = reactive({
  fixedAssetCode: '',
  fixedAssetName: '',
  departmentCode: '',
  fixedAssetCategoryCode: '',
  quantity: 1,
  cost: '',
  lifeTime: '',
  depreciationRate: '',
  productionYear: '',
  trackedYear: '',
  purchaseDate: new Date(),
  createdDate: new Date()
})

/**
 * A reactive reference to the error texts.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const errorTexts = reactive({
  fixedAssetCode: '',
  fixedAssetName: '',
  departmentCode: '',
  fixedAssetCategoryCode: '',
  quantity: '',
  cost: '',
  lifeTime: '',
  depreciationRate: '',
  productionYear: '',
  trackedYear: '',
  purchaseDate: '',
  createdDate: ''
})

/**
 * A reactive reference to the depreciationRate input element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const depreciationRateRef = ref(null)

/**
 * A reactive reference to the lifeTime input element.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const lifeTimeRef = ref(null)

/**
 * Computed property that returns a boolean value indicating whether the form is valid or not.
 * @computed isFormValid
 * @memberof MISAdialog-form
 * @returns {boolean} A boolean value indicating whether the form is valid or not.
 * Created by: NTLam (20/07/2023)
 */
const isFormValid = computed(() => {
  return (
    !errorTexts.fixedAssetCode &&
    !errorTexts.fixedAssetName &&
    !errorTexts.departmentCode &&
    !errorTexts.fixedAssetCategoryCode &&
    !errorTexts.quantity &&
    !errorTexts.cost &&
    !errorTexts.lifeTime &&
    !errorTexts.depreciationRate &&
    !errorTexts.purchaseDate &&
    !errorTexts.createdDate
  )
})

/**
 * Function that checks whether the form has changed or not.
 * @returns {boolean} A boolean value indicating whether the form has changed or not.
 * Created by: NTLam (20/07/2023)
 */
const checkFormChange = () => {
  let isChange = false
  console.log(valueForm, defaultValueForm)
  Object.keys(valueForm).forEach((key) => {
    if (key === 'purchaseDate' || key === 'createdDate') {
      if (compareDate(valueForm[key], defaultValueForm[key])) {
        isChange = true
      }
    } else if (
      valueForm[key] &&
      defaultValueForm[key] &&
      valueForm[key].toString() !== defaultValueForm[key].toString()
    ) {
      console.log(key)
      isChange = true
    } else if (
      (valueForm[key] && !defaultValueForm[key]) ||
      (!valueForm[key] && defaultValueForm[key])
    ) {
      console.log(key)
      isChange = true
    }
  })
  return isChange
}

/**
 * A reactive reference to the dialog-form properties.
 * @type {Object}
 * Created by: NTLam (20/07/2023)
 */
const dialogProps = reactive({
  open: false,
  title: '',
  content: ''
})

/**
 * Function that handles the close event of the MISAdialog-form component.
 * Created by: NTLam (20/07/2023)
 */
const closeDialog = () => {
  dialogProps.open = false
}

/**
 * Function that handles the click event of the agree button on the MISAdialog-form component.
 * Created by: NTLam (20/07/2023)
 */
const agreeDialog = async () => {
  if (props.type === typeForm.ADD || props.type === typeForm.DUPLICATE) {
    emit('close')
  } else {
    await onSave()
  }
}

/**
 * Function that handles the click event of the close button.
 * Created by: NTLam (20/07/2023)
 */
const notAgreeDialog = () => {
  emit('close')
}

/**
 * Computed property for the title of the MISAdialog-form component.
 * @computed title
 * @memberof MISAdialog-form
 * @returns {string} The title of the dialog-form.
 * Created by: NTLam (20/07/2023)
 */
const title = computed(() => {
  if (props.type === typeForm.ADD || props.type === typeForm.DUPLICATE) {
    return dialogResource[lang.value].LABEL_FORM.ADD
  } else {
    return dialogResource[lang.value].LABEL_FORM.EDIT
  }
})

/**
 * Fetches data asynchronously based on the given id.
 * @param {guid} id - The id of the data to be fetched.
 * @returns {Promise} - A promise that resolves with the fetched data.
 * Created by: NTLam (20/07/2023)
 */
const fetchData = async (id) => {
  if (id) {
    const response = await fixedAssetApi.get(id)
    if (response) {
      let data = response
      Object.keys(valueForm).forEach((key) => {
        if (data[key]) {
          if (key === 'purchaseDate') {
            defaultValueForm[key] = new Date(data[key]).toISOString().split('T')[0]
          } else {
            defaultValueForm[key] = data[key]
          }
          valueForm[key] = data[key]
        }
      })
    }
  }
}

/**
 * This code block is responsible for executing the onMounted lifecycle hook of the MISAdialog-form component.
 * It is called after the component is mounted to the DOM and is used to perform asynchronous operations.
 * Created by: NTLam (20/07/2023)
 **/
onMounted(async () => {
  initResizeElement()
  initDragElement()
  centerTheForm()

  const heightForm = dialogRef.value.offsetHeight
  dialogRef.value.style.minHeight = heightForm + 'px'

  document.addEventListener('keydown', doSaveWhenPressCtrlS)

  await fetchData(props.assetId)
  if (props.type === typeForm.DUPLICATE || props.type === typeForm.ADD) {
    const response = await fixedAssetApi.getNewCode()
    if (response) {
      valueForm.fixedAssetCode = response
      defaultValueForm.fixedAssetCode = response
    }
  }
})

/**
 * Function that handles the click event of the save button.
 * Created by: NTLam (20/07/2023)
 */
onUnmounted(() => {
  document.removeEventListener('keydown', doSaveWhenPressCtrlS)
})

// The above code is using the Vue `watch` function to watch for changes in the `createdDate` property
// of the `valueForm` object. Whenever the `createdDate` property changes, the code inside the
// watcher function will be executed. In this case, it sets the `trackedYear` property of the
// `valueForm` object to the year of the new value of `createdDate`.
// Created by: NTLam (20/07/2023)
watch(
  () => valueForm.createdDate,
  (newValue) => {
    valueForm.trackedYear = new Date(newValue).getFullYear()
  }
)

/**
 * Computed property that returns the department name.
 * @computed departmentName
 * @memberof MISAdialog-form
 * @returns {string} The department name.
 * Created by: NTLam (20/07/2023)
 */
const departmentName = computed(() => {
  if (valueForm.departmentCode && props.department.length > 0) {
    const department = props.department.find(
      (item) => item.departmentCode === valueForm.departmentCode
    )
    if (department) {
      return department.departmentName
    }
  }
  return ''
})

/**
 * Computed property that returns the fixed asset category name.
 * @computed fixedAssetCategoryName
 * @memberof MISAdialog-form
 * @returns {string} The name of the fixed asset category.
 * Created by: NTLam (20/07/2023)
 */
const fixedAssetCategoryName = computed(() => {
  if (valueForm.fixedAssetCategoryCode && props.fixedAssetCategory.length > 0) {
    const fixedAssetCategory = props.fixedAssetCategory.find(
      (item) => item.fixedAssetCategoryCode === valueForm.fixedAssetCategoryCode
    )
    if (fixedAssetCategory) {
      return fixedAssetCategory.fixedAssetCategoryName
    }
  }
  return ''
})

/**
 * Computed property that returns the depreciation value.
 * @computed depreciationValue
 * @memberof MISAdialog-form
 * @returns {number} The depreciation value.
 * Created by: NTLam (20/07/2023)
 */
const depreciationValue = computed(() => {
  if (valueForm.cost && valueForm.depreciationRate) {
    return parseInt((valueForm.cost * valueForm.depreciationRate) / 100)
  }
  return 0
})

/**
 * Computed property that returns the remaining value.
 * @computed remainingValue
 * @memberof MISAdialog-form
 * @returns {number} The remaining value.
 * Created by: NTLam (20/07/2023)
 */
watch(
  () => valueForm.lifeTime,
  (newValue) => {
    if (newValue) {
      if (!isNaN(parseInt(newValue)) && newValue.toString() != '0')
        depreciationRateRef.value.inputValue = parseFloat(100 / newValue)
          .toFixed(2)
          .toString()
          .replace('.', ',')
      else depreciationRateRef.value.inputValue = '0'
    }
  }
)

/**
 * Computed property that returns the tracked year.
 * @computed trackedYear
 * @returns {number} The tracked year.
 * Created by: NTLam (20/07/2023)
 */
const trackedYear = computed(() => {
  if (valueForm.createdDate) {
    return new Date(valueForm.createdDate).getFullYear()
  } else return 2023
})

/**
 * Function that handles updating data field in the dialog-form component.
 * @param {string} field - The name of the field to be updated.
 * @param {any} value - The new value to be assigned to the field.
 * Created by: NTLam (20/07/2023)
 */
const onUpdateDataField = (field, value) => {
  valueForm[field] = value
  errorTexts[field] = ''
  if (field === 'fixedAssetCategoryCode') {
    const fixedAssetCategory = props.fixedAssetCategory.find(
      (item) => item.fixedAssetCategoryCode === valueForm.fixedAssetCategoryCode
    )
    if (fixedAssetCategory) {
      depreciationRateRef.value.inputValue = fixedAssetCategory.depreciationRate
        .toFixed(2)
        .toString()
        .replace('.', ',')
      lifeTimeRef.value.inputValue = fixedAssetCategory.lifeTime
    }
  }
}

/**
 * Function that handles the click event of the close form button.
 * Created by: NTLam (20/07/2023)
 */
const onClickCloseForm = () => {
  if (checkFormChange()) {
    if (props.type === typeForm.ADD || props.type === typeForm.DUPLICATE) {
      dialogProps.content = dialogResource[lang.value].CLOSE.CANCEL_CREATE
      dialogProps.open = true
    } else {
      dialogProps.content = dialogResource[lang.value].CLOSE.CANCEL_UPDATE
      dialogProps.open = true
    }
  } else {
    emit('close')
  }
}

/**
 * Validates the given data value.
 * @param {any} data - The data value to be validated.
 * Created by: NTLam (20/07/2023)
 */
const validateValue = (data) => {
  /// Hiển thị thông báo lỗi nếu không nhập mã tài sản
  errorTexts.fixedAssetName = !data.fixedAssetCode
    ? textErrorAssetForm[lang.value].FIXED_ASSET_CODE
    : ''
  /// Hiển thị thông báo lỗi nếu không nhập tên tài sản
  errorTexts.fixedAssetName = !data.fixedAssetName
    ? textErrorAssetForm[lang.value].FIXED_ASSET_NAME
    : ''
  /// Hiển thị thông báo lỗi nếu không nhập mã phòng ban
  errorTexts.departmentCode = !data.departmentCode ? textErrorAssetForm[lang.value].DEPARTMENT : ''
  /// Hiển thị thông báo lỗi nếu không nhập mã loại tài sản
  errorTexts.fixedAssetCategoryCode = !data.fixedAssetCategoryCode
    ? textErrorAssetForm[lang.value].FIXED_ASSET_CATEGORY
    : ''
  /// Hiển thị thông báo lỗi nếu không nhập số lượng
  errorTexts.quantity =
    isNaN(data.quantity) || data.quantity <= 0 ? textErrorAssetForm[lang.value].QUANTITY : ''
  /// Hiển thị thông báo lỗi nếu không nhập giá trị
  errorTexts.cost = isNaN(data.cost) || data.cost <= 0 ? textErrorAssetForm[lang.value].COST : ''
  /// Hiển thị thông báo lỗi nếu không nhập thời gian sử dụng
  errorTexts.lifeTime =
    isNaN(data.lifeTime) || data.lifeTime <= 0 ? textErrorAssetForm[lang.value].LIFE_TIME : ''
  /// Hiển thị thông báo lỗi nếu không nhập tỷ lệ hao mòn
  errorTexts.depreciationRate =
    isNaN(data.depreciationRate) || data.depreciationRate <= 0
      ? textErrorAssetForm[lang.value].DEPRECIATION_RATE
      : ''
  /// Hiển thị thông báo lỗi nếu không nhập ngày mua
  errorTexts.purchaseDate = !data.purchaseDate
    ? textErrorAssetForm[lang.value].PURCHASE_DATE
    : data.purchaseDate > new Date()
    ? textErrorAssetForm[lang.value].DATE_EXCEED
    : data.purchaseDate.getFullYear() < 2000
    ? textErrorAssetForm[lang.value].INVALID_YEAR
    : ''
  errorTexts.createdDate = !data.createdDate
    ? textErrorAssetForm[lang.value].CREATED_DATE
    : data.createdDate > new Date()
    ? textErrorAssetForm[lang.value].DATE_EXCEED
    : data.createdDate.getFullYear() < 2000
    ? textErrorAssetForm[lang.value].INVALID_YEAR
    : ''
}

/**
 * Function that is called when the user clicks the save button on the dialog-form.
 * @async
 * @function onSave
 * @returns {Promise<void>}
 * Created by: NTLam (20/07/2023)
 */
const onSave = async () => {
  const data = {
    fixedAssetCode: valueForm.fixedAssetCode,
    fixedAssetName: valueForm.fixedAssetName,
    departmentId: valueForm.departmentCode
      ? props.department.find((d) => d.departmentCode === valueForm.departmentCode).departmentId
      : null,
    departmentCode: valueForm.departmentCode,
    departmentName: departmentName.value,
    fixedAssetCategoryId: valueForm.fixedAssetCategoryCode
      ? props.fixedAssetCategory.find(
          (c) => c.fixedAssetCategoryCode === valueForm.fixedAssetCategoryCode
        ).fixedAssetCategoryId
      : null,
    fixedAssetCategoryCode: valueForm.fixedAssetCategoryCode,
    fixedAssetCategoryName: fixedAssetCategoryName.value,
    quantity: parseInt(valueForm.quantity),
    cost: parseFloat(valueForm.cost),
    lifeTime: parseInt(valueForm.lifeTime),
    depreciationRate: parseFloat(valueForm.depreciationRate),
    trackedYear: trackedYear.value || null,
    purchaseDate: valueForm.purchaseDate ? new Date(valueForm.purchaseDate) : null,
    createdDate: valueForm.createdDate ? new Date(valueForm.createdDate) : null,
    productionYear: valueForm.purchaseDate
      ? new Date(valueForm.purchaseDate).getYear()
      : trackedYear.value,
    active: null
  }

  validateValue(data)

  await nextTick()

  if (!isFormValid.value) {
    emit('action', typeAction.ERROR, exceptionResource[lang.value].BAD_REQUEST)
    firstInput.value.focus()
  } else if (props.assetId && props.type === typeForm.EDIT) {
    if (!checkFormChange()) {
      emitter.emit(eventBus.TOAST_MESSAGE, {
        type: typeAction.WARNING,
        message: exceptionResource[lang.value].NOT_CHANGE
      })
      return
    }
    loading.value = true
    const response = await fixedAssetApi.update(props.assetId, data).finally(() => {
      loading.value = false
    })
    if (response) {
      emit('action', typeAction.SUCCESS)
      emit('close')
    }
  } else {
    const response = await fixedAssetApi.create(data).finally(() => {
      loading.value = false
    })
    if (response) {
      emit('action', typeAction.SUCCESS)
      emit('close')
    }
  }
}

/**
 * Function that handles saving when the user presses the Ctrl + S key combination.
 * @param {Event} e - The event object.
 * @returns {Promise<void>}
 * Created by: NTLam (20/07/2023)
 */
const doSaveWhenPressCtrlS = async (e) => {
  if (!(e.keyCode === 83) || !e.ctrlKey) {
    if (e.keyCode === 27) {
      onClickCloseForm()
    }
    return
  }
  e.preventDefault()
  onSave()
}

/**
 * Function that handles the focus event of the close button.
 * @param {Event} e - The event object.
 * @returns {void}
 * Created by: NTLam (20/07/2023)
 */
const onTabFocusCloseBtn = (e) => {
  if (e.keyCode === 9 && !e.shiftKey) {
    e.preventDefault()
    closeBtn.value.focus()
  }
}

/**
 * Function that handles the focus event of the first input element.
 * @param {Event} e - The event object.
 * @returns {void}
 * Created by: NTLam (20/07/2023)
 */
const onKeydownBtnClose = (e) => {
  console.log(e)
  if (e.keyCode === 9 && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    firstInput.value.focus()
  } else if (e.keyCode == 9 && e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    cancelFormBtn.value.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-form">
      <MISADialog
        v-if="dialogProps.open"
        :type="
          props.type === typeForm.ADD || props.type === typeForm.DUPLICATE
            ? typeButton.CANCEL
            : typeButton.SAVE
        "
        :open="dialogProps.open"
        :content="dialogProps.content"
        :title="dialogProps.title"
        @agree-dialog="agreeDialog"
        @not-agree-dialog="notAgreeDialog"
        @close-dialog="closeDialog"
      />
      <div ref="dialogRef" class="dialog-form__container">
        <div ref="resizeRightRef" class="resizer-right"></div>
        <div ref="resizeBottomRef" class="resizer-bottom"></div>
        <div ref="resizeBothRef" class="resizer-both"></div>
        <header ref="headerRef">
          <h2>{{ title }}</h2>
          <button
            class="btn-close"
            ref="closeBtn"
            @keydown="onKeydownBtnClose"
            @click="onClickCloseForm"
          >
            <i class="icon-xmark"></i>
          </button>
        </header>
        <MISALoading type="linear" :loading="loading" />
        <main>
          <div class="grid-1">
            <MISATextfield
              required
              ref="firstInput"
              @on-change="(value) => onUpdateDataField('fixedAssetCode', value)"
              :label="labelAsset[lang].FIXED_ASSET_CODE"
              :defaultValue="defaultValueForm.fixedAssetCode"
              :errorText="errorTexts.fixedAssetCode"
              autofocus
            />
          </div>
          <div class="grid-2">
            <MISATextfield
              required
              :label="labelAsset[lang].FIXED_ASSET_NAME"
              :placeholder="dialogResource[lang].PLACEHOLDER.TYPE_NAME_ASSET"
              @on-change="(value) => onUpdateDataField('fixedAssetName', value)"
              :defaultValue="defaultValueForm.fixedAssetName"
              :errorText="errorTexts.fixedAssetName"
            />
          </div>
          <div class="grid-1">
            <MISACombobox
              :placeholder="dialogResource[lang].PLACEHOLDER.SELECT_DEPARTMENT"
              :label="labelAsset[lang].DEPARTMENT_CODE"
              required
              typeValue="Object"
              :options="
                props.department.map((item) => ({
                  key: item.departmentCode,
                  value: item.departmentName
                }))
              "
              zIndex="20"
              @change-value="(value) => onUpdateDataField('departmentCode', value)"
              type="dropdown"
              :defaultValue="defaultValueForm.departmentCode"
              :errorText="errorTexts.departmentCode"
            />
          </div>
          <div class="grid-2">
            <MISATextfield
              :defaultValue="departmentName"
              :label="labelAsset[lang].DEPARTMENT_NAME"
              disabled
            />
          </div>
          <div class="grid-1">
            <MISACombobox
              :placeholder="dialogResource[lang].PLACEHOLDER.SELECT_FIXED_ASSET_CATEGORY"
              required
              :label="labelAsset[lang].FIXED_ASSET_CATEGORY_CODE"
              type="dropdown"
              typeValue="Object"
              :options="
                props.fixedAssetCategory.map((item) => ({
                  key: item.fixedAssetCategoryCode,
                  value: item.fixedAssetCategoryName
                }))
              "
              @change-value="(value) => onUpdateDataField('fixedAssetCategoryCode', value)"
              :defaultValue="defaultValueForm.fixedAssetCategoryCode"
              :errorText="errorTexts.fixedAssetCategoryCode"
            />
          </div>
          <div class="grid-2">
            <MISATextfield
              :label="labelAsset[lang].FIXED_ASSET_CATEGORY_NAME"
              disabled
              :defaultValue="fixedAssetCategoryName"
            />
          </div>
          <div class="grid-1">
            <MISAInput
              @on-change="(value) => onUpdateDataField('quantity', value)"
              type="number"
              format
              action
              required
              :formLabel="labelAsset[lang].QUANTITY"
              :defaultValue="defaultValueForm.quantity"
              :errorText="errorTexts.quantity"
            />
          </div>
          <div class="grid-1">
            <MISAInput
              type="number"
              format
              @on-change="(value) => onUpdateDataField('cost', value)"
              required
              :formLabel="labelAsset[lang].COST"
              :defaultValue="defaultValueForm.cost"
              :errorText="errorTexts.cost"
            />
          </div>
          <div class="grid-1">
            <MISAInput
              @on-change="(value) => onUpdateDataField('lifeTime', value)"
              type="number"
              required
              :formLabel="labelAsset[lang].LIFE_TIME"
              :defaultValue="defaultValueForm.lifeTime"
              :errorText="errorTexts.lifeTime"
              ref="lifeTimeRef"
            />
          </div>

          <div class="grid-1">
            <MISAInput
              format
              @on-change="(value) => onUpdateDataField('depreciationRate', value)"
              required
              :formLabel="labelAsset[lang].DEPRECIATION_RATE"
              disabled
              type="float"
              :defaultValue="defaultValueForm.depreciationRate.toString().replace('.', ',')"
              ref="depreciationRateRef"
            />
          </div>
          <div class="grid-1">
            <MISAInput
              type="number"
              format
              required
              :formLabel="labelAsset[lang].DEPRECIATION_VALUE"
              :defaultValue="depreciationValue"
              disabled
            />
          </div>
          <div class="grid-1">
            <MISAInput
              disabled
              type="number"
              required
              :formLabel="labelAsset[lang].TRACKED_YEAR"
              :defaultValue="trackedYear.toString()"
            />
          </div>

          <div class="grid-1">
            <MISATextfield
              required
              :label="labelAsset[lang].PURCHASE_DATE"
              type="date"
              @on-change="(value) => onUpdateDataField('purchaseDate', value)"
              :defaultValue="defaultValueForm.purchaseDate"
              :errorText="errorTexts.purchaseDate"
            />
          </div>
          <div class="grid-1">
            <MISATextfield
              required
              :label="labelAsset[lang].PRODUCTION_DATE"
              type="date"
              @on-change="(value) => onUpdateDataField('createdDate', value)"
              :defaultValue="defaultValueForm.createdDate"
              :errorText="errorTexts.createdDate"
            />
          </div>
        </main>
        <footer>
          <MISAButton @click="onSave" padding type="main">{{
            props.type === typeForm.ADD
              ? dialogResource[lang].BUTTON.ADD
              : dialogResource[lang].BUTTON.SAVE
          }}</MISAButton>
          <MISAButton
            ref="cancelFormBtn"
            @keydown="onTabFocusCloseBtn"
            @click="onClickCloseForm"
            type="sub"
            >{{ dialogResource[lang].BUTTON.CANCEL }}</MISAButton
          >
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* background-color: rgba(0, 0, 0, 0.5); */
  z-index: var(--z-index-form);
  /* display: flex;
  align-items: center;
  justify-content: center; */
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog-form__container {
  width: 1000px;
  max-height: 100vh;
  height: auto;
  background-color: var(--color-white);
  border-radius: var(--border-radius-size);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  overflow: auto;
  min-width: 1000px;

  position: relative;
}
header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
}
header > i {
  cursor: pointer;
}
main {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 300px 300px auto;
  grid-auto-rows: 84px;
  /* justify-content: stretch;
  align-items: stretch; */
  margin-top: 5px;
  column-gap: 16px;
  padding: 0 16px;
  row-gap: 2px;
  grid-auto-flow: row;
  margin-bottom: 16px;
}
.grid-1 {
}

.grid-2 {
  grid-column: span 2;
}
footer {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  background-color: var(--textfield-disabled-color);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row-reverse;
  gap: 10px;
}
.btn-close {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resizer-right {
  width: 5px !important;
  height: 100%;
  background: transparent;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: e-resize;
}

.resizer-bottom {
  width: 100%;
  height: 5px !important;
  background: transparent;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: n-resize;
}

.resizer-both {
  width: 5px !important;
  height: 5px !important;
  background: transparent;
  z-index: 10;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: nw-resize;
}
</style>
