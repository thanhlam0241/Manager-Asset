<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
//resourses
import { labelAsset, fieldList } from '@/assets/resources/asset'
import { tooltip } from '@/assets/resources/common'
import recordingApi from '@/service/api/recordingApi'
import resourceBudgetApi from '@/service/api/resourceBudgetApi'
import FormSelectIncreaseAsset from './FormSelectIncreaseAsset.vue'
import FormEditAsset from './FormEditAsset.vue'
import { converStringToBigNumberString } from '@/helper/stringHelper'
import { formatISODateString } from '@/helper/object'

/**
 * The store object.
 * @type {import('vuex').Store}
 * Creatd by: NTLam (15/8/2023)
 */
const store = useStore()

/**
 * The current language of the application.
 * @type {import('vue').ComputedRef<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const lang = computed(() => store.state.lang)

/**
 * The props of the component.
 * @type {import('vue').DefineProps<{}>}
 * Creatd by: NTLam (15/8/2023)
 */
const props = defineProps({
  idRecording: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'add',
    validator: (value) => {
      return ['add', 'edit'].includes(value)
    }
  }
})

/**
 * The fields of the table.
 * @type {import('vue').Ref<import('@/components/MISATable/MISATableHeader').TableHeader[]>}
 * Creatd by: NTLam (15/8/2023)
 */
const tableFields = [
  {
    id: 0,
    field: 'order',
    label: 'STT',
    type: 'order',
    position: 'center'
  },
  {
    id: 1,
    field: 'recordedAssetCode',
    label: labelAsset[lang.value].FIXED_ASSET_CODE,
    type: 'string',
    canSort: true
  },
  {
    id: 2,
    field: 'recordedAssetName',
    label: labelAsset[lang.value].FIXED_ASSET_NAME,
    type: 'string'
  },
  {
    id: 4,
    field: fieldList.DEPARTMENT_NAME,
    label: labelAsset[lang.value].DEPARTMENT_NAME,
    type: 'string'
  },
  {
    id: 6,
    field: 'value',
    label: labelAsset[lang.value].COST,
    type: 'number',
    position: 'right'
  },
  {
    id: 7,
    field: fieldList.HMKH,
    label: 'Hao mòn năm',
    type: 'number',
    tooltip: tooltip[lang.value].HMKH,
    position: 'right'
  },
  {
    id: 8,
    field: fieldList.REMAINING_VALUE,
    label: labelAsset[lang.value].REMAINING_VALUE,
    type: 'number',
    position: 'right'
  }
]

/**
 * The list of resource budget.
 * Created by: NTLam (20/07/2023)
 */
const listResourceBudget = ref([])

/**
 * The reference of the head
 * Created by: NTLam (20/07/2023)
 */
const headRef = ref(null)

/**
 * The data of the form.
 * Created by: NTLam (20/07/2023)
 */
const formData = ref({
  recordingCode: {
    value: '',
    isValid: true,
    errorMessage: '',
    defaultValue: ''
  },
  recordingDate: {
    value: '',
    isValid: true,
    errorMessage: '',
    defaultValue: ''
  },
  actionDate: {
    value: '',
    isValid: true,
    errorMessage: '',
    defaultValue: ''
  },
  description: {
    value: '',
    isValid: true,
    errorMessage: '',
    defaultValue: ''
  }
})

/**
 * The state of form, dialog.
 * Created by: NTLam (20/07/2023)
 */
const open = ref({
  formSelectIncreaseAsset: false,
  formChangeAsset: false,
  dialog: false
})

/**
 * The data of the table.
 * Created by: NTLam (20/07/2023)
 */
const data = ref([])

/**
 * The data of the page.
 * Created by: NTLam (20/07/2023)
 */
const pageData = ref({
  numberOfPage: 1,
  pageSize: 20,
  totalRecord: 0,
  currentPage: 1,
  pagingList: []
})

/**
 * The reference of the dialog.
 * Created by: NTLam (20/07/2023)
 */
const dialogRef = ref(null)

/**
 * The list of assets id.
 * Created by: NTLam (20/07/2023)
 */
const listAssetsId = ref([])

/**
 * The emits of the component.
 */
const emits = defineEmits(['close-form', 'create-recording', 'update-recording'])

/**
 * The reference of the body.
 * Created by: NTLam (20/07/2023)
 */
const tBodyRef = ref(null)

/**
 * The height balance of the table.
 * Created by: NTLam (20/07/2023)
 */
const heightBalance = ref(0)

/**
 * The state of open edit form.
 * Created by: NTLam (20/07/2023)
 */
const openEditAsset = ref(false)

/**
 * The asset selected.
 * Created by: NTLam (20/07/2023)
 */
const assetSelected = ref(null)

/**
 * The reference of the table container.
 * Created by: NTLam (20/07/2023)
 */
const table_container = ref(null)

/**
 * The list of asset id deletes.
 * Created by: NTLam (20/07/2023)
 */
const listAssetIdDeletes = ref([])

/**
 * The reference of the table.
 * Created by: NTLam (20/07/2023)
 */
const tableRef = ref(null)

/**
 * The state of loading.
 * Created by: NTLam (20/07/2023)
 */
const loading = ref(false)

/**
 * The props of the dialog.
 * Created by: NTLam (20/07/2023)
 */
const dialogProps = ref({
  open: false,
  content: ''
})

/**
 * The sum data of the table.
 * Created by: NTLam (20/07/2023)
 */
const sumData = computed(() => {
  const result = {
    cost: 0,
    hmkh: 0,
    remainingValue: 0
  }

  data.value.forEach((item) => {
    result.cost += item.value
    result.hmkh += item.hmkh
    result.remainingValue += item.remainingValue
  })

  return result
})

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

  headRef.value.onmousedown = dragMouseDown

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
 * Các sự kiện khi component được khởi tạo
 * Created by: NTLam (20/07/2023)
 */
onMounted(async () => {
  initDragElement()
  centerTheForm()
  const dateNow = formatISODateString(new Date())
  formData.value.actionDate.defaultValue = dateNow
  formData.value.recordingDate.defaultValue = dateNow
  formData.value.actionDate.value = dateNow
  formData.value.recordingDate.value = dateNow

  const responseResourceBudget = await resourceBudgetApi.getAll()
  if (responseResourceBudget) {
    listResourceBudget.value = responseResourceBudget
  }
  if (!props.idRecording) {
    const responseNewCode = await recordingApi.getNewCode()
    if (responseNewCode) {
      // console.log(responseNewCode)
      formData.value.recordingCode.value = responseNewCode
      formData.value.recordingCode.defaultValue = responseNewCode
    }
  } else {
    const responseRecording = await recordingApi.getById(props.idRecording)
    if (responseRecording) {
      // console.log(responseRecording)
      formData.value.recordingCode.value = responseRecording.recordingCode
      formData.value.recordingCode.defaultValue = responseRecording.recordingCode

      formData.value.recordingDate.value = responseRecording.recordingDate
      formData.value.recordingDate.defaultValue = responseRecording.recordingDate

      formData.value.actionDate.value = responseRecording.actionDate
      formData.value.actionDate.defaultValue = responseRecording.actionDate

      formData.value.description.value = responseRecording.description
      formData.value.description.defaultValue = responseRecording.description

      data.value = responseRecording.assets.map((item) => {
        const hmkh = Math.round((item.value * item.depreciationRate) / 100)
        return {
          ...item,
          hmkh,
          remainingValue: item.value - hmkh,
          isChange: false
        }
      })
      listAssetsId.value = data.value.map((item) => item.recordedAssetCode)
      reformatTable()
    }
  }

  window.addEventListener('keydown', onPressKey)
})

/**
 * Các sự kiện khi press key
 * Created by: NTLam (20/07/2023)
 */
onUnmounted(() => {
  window.removeEventListener('keydown', onPressKey)
})

/**
 * Sự kiện khi ấn phím
 * Created by: NTLam (20/07/2023)
 */
const onPressKey = (event) => {
  if (event.key === 'Escape') {
    if (openEditAsset.value) {
      onCloseEditForm()
    } else if (open.value.formSelectIncreaseAsset) {
      onToggleFormSelectIncreaseAsset()
    } else if (open.value.dialog) {
      open.value.dialog = false
    } else if (checkHavingChange()) {
      open.value.dialog = true
    } else {
      onClickCloseForm()
    }
  } else if (event.key === 's' && event.ctrlKey) {
    event.preventDefault()
    onSave()
  }
}

/**
 * Chức năng: Đóng dialog
 * Created by: NTLam (20/07/2023)
 */
const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

/**
 * Chức năng: Đóng form
 * Created by: NTLam (20/07/2023)
 */
const onClickCloseForm = () => {
  emits('close-form')
}

/**
 * Chức năng: Ẩn button đóng form
 * Created by: NTLam (20/07/2023)
 */
const onKeydownBtnClose = (event) => {
  if (event.key === 'Enter') {
    emits('close-form')
  }
}

/**
 * Chức năng: Đóng form edit
 * Created by: NTLam (20/07/2023)
 */
const onCloseEditForm = () => {
  assetSelected.value = null
  openEditAsset.value = false
}

/**
 * Chức năng: Mở form chọn tài sản
 * Created by: NTLam (20/07/2023)
 */
const onToggleFormSelectIncreaseAsset = () => {
  open.value.formSelectIncreaseAsset = !open.value.formSelectIncreaseAsset
}

/**
 * Chức năng: Mở form edit tài sản
 * Created by: NTLam (20/07/2023)
 */
const onOpenEditAsset = (code) => {
  const index = data.value.findIndex((item) => item.recordedAssetCode === code)
  assetSelected.value = data.value[index]
  openEditAsset.value = true
}

/**
 * Chức năng: Định dạng lại bảng
 * Created by: NTLam (20/07/2023)
 */
const reformatTable = () => {
  pageData.value.currentPage = 1
  pageData.value.totalRecord = data.value.length
  pageData.value.numberOfPage = Math.ceil(data.value.length / pageData.value.pageSize)
  console.log(table_container.value.offsetHeight)
  heightBalance.value = table_container.value.offsetHeight - 68 - data.value.length * 40 - 3 * 40
  tableRef.value.scrollTop = 0
  console.log(heightBalance.value)
}

/**
 * Chức năng: Cập nhật tài sản
 * Created by: NTLam (20/07/2023)
 */
const updateAsseet = (value) => {
  const listIds = data.value.map((item) => item.recordedAssetCode)
  value.forEach((item) => {
    if (!listIds.includes(item.fixedAssetCode)) {
      const hmkh = Math.round((item.cost * item.depreciationRate) / 100)
      data.value.push({
        recordedAssetCode: item.fixedAssetCode,
        recordedAssetName: item.fixedAssetName,
        departmentName: item.departmentName,
        value: item.cost,
        depreciationRate: item.depreciationRate,
        hmkh,
        remainingValue: item.cost - hmkh,
        recordingType: 1,
        resourceAssets: [],
        isChange: true
      })
    }
  })
  reformatTable()
  listAssetsId.value = data.value.map((item) => item.recordedAssetCode)
  onToggleFormSelectIncreaseAsset()
}

/**
 * Chức năng: Xóa tài sản
 * Created by: NTLam (20/07/2023)
 */
const deleteAsset = (code) => {
  const index = data.value.findIndex((item) => item.recordedAssetCode === code)
  if (data.value[index].recordedAssetId) {
    listAssetIdDeletes.value.push(data.value[index].recordedAssetId)
  }
  data.value.splice(index, 1)
  listAssetsId.value = data.value.map((item) => item.recordedAssetCode)
  reformatTable()
}

/**
 * Chức năng: Cập nhật tài sản
 * Created by: NTLam (20/07/2023)
 */
const onUpdateResourceAsset = (code, value) => {
  const index = data.value.findIndex((item) => item.recordedAssetCode === code)
  const dataUpdate = data.value[index]
  if (value.length === 0) {
    dataUpdate.resourceAssets = []
  } else {
    dataUpdate.resourceAssets = value
    const cost = value.reduce((sum, item) => sum + item.cost, 0)
    dataUpdate.value = cost
    dataUpdate.hmkh = Math.round((cost * dataUpdate.depreciationRate) / 100)
    dataUpdate.remainingValue = cost - dataUpdate.hmkh
  }
  dataUpdate.isChange = true
  onCloseEditForm()
}

/**
 * Chức năng: Cập nhật dữ liệu form
 * Created by: NTLam (20/07/2023)
 */
const onUpdateField = (field, value) => {
  formData.value[field].value = value
}

/**
 * Chức năng: Validate dữ liệu
 * Created by: NTLam (20/07/2023)
 */
const onValidateData = () => {
  let isValid = true
  if (formData.value.recordingCode.value === '') {
    formData.value.recordingCode.isValid = false
    formData.value.recordingCode.errorMessage = 'Mã chứng từ không được để trống'
    isValid = false
  }
  if (!formData.value.recordingDate.value) {
    formData.value.recordingDate.isValid = false
    formData.value.recordingDate.errorMessage = 'Ngày bắt đầu sử dụng không được để trống'
    isValid = false
  } else {
    const timestampDate = new Date(formData.value.recordingDate.value).getTime()
    const timestampNow = new Date().getTime()
    if (timestampDate > timestampNow) {
      formData.value.recordingDate.isValid = false
      formData.value.recordingDate.errorMessage = 'Ngày không được lớn hơn ngày hiện tại'
      isValid = false
    }
  }
  if (!formData.value.actionDate.value) {
    formData.value.actionDate.isValid = false
    formData.value.actionDate.errorMessage = 'Ngày ghi tăng không được để trống'
    isValid = false
  } else {
    const timestampDate = new Date(formData.value.actionDate.value).getTime()
    const timestampNow = new Date().getTime()
    if (timestampDate > timestampNow) {
      formData.value.actionDate.isValid = false
      formData.value.actionDate.errorMessage = 'Ngày không được lớn hơn ngày hiện tại'
      isValid = false
    }
  }
  if (data.value.length === 0) {
    isValid = false
    dialogProps.value.content = 'Chọn ít nhất một tài sản'
    dialogProps.value.open = true
    return false
  }
  return isValid
}

/**
 * Chức năng: Kiểm tra dữ liệu có thay đổi
 * Created by: NTLam (20/07/2023)
 */
const checkHavingChange = () => {
  console.log(formData.value)
  let isChange =
    formData.value.recordingCode.value !== formData.value.recordingCode.defaultValue ||
    formData.value.recordingDate.value != formData.value.recordingDate.defaultValue ||
    formData.value.actionDate.value != formData.value.actionDate.defaultValue ||
    formData.value.description.value !== formData.value.description.defaultValue
  data.value.forEach((item) => {
    if (item.isChange) {
      isChange = true
    }
  })
  return isChange
}

/**
 * Chức năng: Lưu dữ liệu
 * Created by: NTLam (20/07/2023)
 */
const onSave = async () => {
  if (!checkHavingChange()) {
    dialogProps.value.content = 'Chưa thay đổi dữ liệu.'
    dialogProps.value.open = true
    return
  }
  let isValid = onValidateData()
  if (isValid && !props.idRecording) {
    console.log(data.value)
    loading.value = true
    const dataForm = {
      recording: {
        recordingCode: formData.value.recordingCode.value,
        recordingDate: new Date(formData.value.recordingDate.value),
        actionDate: new Date(formData.value.actionDate.value),
        description: formData.value.description.value
      },
      assets: data.value.map((item) => {
        return {
          recordedAssetCode: item.recordedAssetCode,
          value: item.value,
          resourceAssets: item.resourceAssets.map((item) => ({
            resourceBudgetId: item.resourceBudget.resourceBudgetId,
            cost: item.cost
          }))
        }
      })
    }
    console.log(dataForm)
    const response = await recordingApi.create(dataForm).finally(() => {
      loading.value = false
    })
    if (response) {
      emits('create-recording')
    }
  } else if (isValid && props.idRecording) {
    console.group('Update')
    console.log(data)
    const dataForm = {
      recordingCode: formData.value.recordingCode.value,
      recordingDate: formData.value.recordingDate.value,
      actionDate: formData.value.actionDate.value,
      description: formData.value.description.value,
      value: sumData.value.cost,
      assets: [
        ...data.value
          .filter((item) => item.isChange)
          .map((item) => {
            return {
              recordedAssetId: item.recordedAssetId || null,
              recordedAssetCode: item.recordedAssetCode,
              value: item.value,
              resourceAssets: item.resourceAssets.map((item) => ({
                resourceBudget: item.resourceBudget,
                cost: item.cost,
                resourceAssetId: item.resourceAssetId
              }))
            }
          }),
        ...listAssetIdDeletes.value.map((item) => ({
          recordedAssetId: item,
          recordedAssetCode: null
        }))
      ]
    }
    console.log(JSON.stringify(dataForm))
    console.groupEnd()
    loading.value = true
    const res = await recordingApi.update(props.idRecording, dataForm).finally(() => {
      loading.value = false
    })
    if (res) {
      emits('update-recording')
    }
  }
}
</script>
<template>
  <div class="dialog-form">
    <MISABackdrop zIndex="1001" v-if="loading" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @agree-dialog="closeDialog"
      type="error"
    />
    <FormEditAsset
      v-if="openEditAsset && assetSelected"
      @close-edit="onCloseEditForm"
      @on-save="onUpdateResourceAsset"
      :resourceBudget="listResourceBudget"
      :assetSelected="assetSelected"
      nameCode="recordedAssetCode"
    />
    <FormSelectIncreaseAsset
      v-if="open.formSelectIncreaseAsset"
      @close-select-asset="onToggleFormSelectIncreaseAsset"
      :listIds="listAssetsId"
      @select-asset="updateAsseet"
    />
    <div ref="dialogRef" class="form-recording">
      <div ref="headRef" class="form-header">
        <h2>{{ props.idRecording ? 'Sửa' : 'Thêm' }} chứng từ ghi tăng</h2>
        <button
          class="btn-close"
          ref="closeBtn"
          @keydown="onKeydownBtnClose"
          @click="onClickCloseForm"
        >
          <i class="icon-xmark"></i>
        </button>
      </div>
      <div class="div_form">
        <div class="div_information">
          <h3>Thông tin chứng từ</h3>
          <div class="input-container">
            <div class="input-container__grid1">
              <MISATextfield
                :defaultValue="formData.recordingCode.defaultValue"
                label="Mã chứng từ"
                autofocus
                required
                @on-change="(v) => onUpdateField('recordingCode', v)"
                :errorText="formData.recordingCode.errorMessage"
              />
            </div>
            <div class="input-container__grid1">
              <MISATextfield
                :defaultValue="formData.recordingDate.defaultValue"
                label="Ngày bắt đầu sử dụng"
                type="date"
                required
                @on-change="(v) => onUpdateField('recordingDate', v)"
                :errorText="formData.recordingDate.errorMessage"
              />
            </div>
            <div class="input-container__grid1">
              <MISATextfield
                :defaultValue="formData.actionDate.defaultValue"
                label="Ngày ghi tăng"
                type="date"
                required
                @on-change="(v) => onUpdateField('actionDate', v)"
                :errorText="formData.actionDate.errorMessage"
              />
            </div>
            <div class="input-container__grid3">
              <MISATextfield
                :defaultValue="formData.description.defaultValue"
                label="Ghi chú"
                @on-change="(v) => onUpdateField('description', v)"
              />
            </div>
          </div>
        </div>
        <div class="div_detail">
          <h3>Thông tin chi tiết</h3>
          <div ref="table_container" class="div-detail__table">
            <div class="detail__table-head">
              <MISASearchBox style="width: 300px" />
              <MISAButton type="outline" shadow @click="onToggleFormSelectIncreaseAsset"
                >Chọn tài sản</MISAButton
              >
            </div>
            <div ref="tableRef" :class="{ scroll: heightBalance > 0 }" class="table">
              <table>
                <MISATableHeader :hasCheckbox="false" :action="false" :columns="tableFields" />
                <tbody ref="tBodyRef">
                  <MISATableRow v-for="(data, index) in data" :key="'row' + index">
                    <MISATableData
                      v-for="(column, colIndex) in tableFields"
                      :key="'td' + index + column.recordingCode"
                      :type="column.type"
                      :position="column.position"
                    >
                      <div class="div_relative">
                        {{
                          column.field === 'order'
                            ? index + 1
                            : column.type === 'number'
                            ? converStringToBigNumberString(data[column.field])
                            : data[column.field]
                        }}
                        <div class="div_action" v-if="colIndex === tableFields.length - 1">
                          <MISAButton
                            width="32px"
                            height="32px"
                            @click="() => onOpenEditAsset(data.recordedAssetCode)"
                            type="icon"
                            ><i class="icon-pencil"></i
                          ></MISAButton>
                          <MISAButton
                            width="32px"
                            height="32px"
                            @click="() => deleteAsset(data.recordedAssetCode)"
                            type="icon"
                            ><i class="icon-delete-red"></i
                          ></MISAButton>
                        </div>
                      </div>
                    </MISATableData>
                  </MISATableRow>
                  <tr v-if="heightBalance > 0" :height="heightBalance">
                    <td :height="heightBalance" colspan="7"></td>
                  </tr>
                </tbody>
                <MISATableFooter
                  :totalColumn="8"
                  :colspan="4"
                  :isSumDataSameRow="false"
                  :totalRecord="pageData.totalRecord"
                  :currentPage="pageData.currentPage"
                  :numberOfPage="pageData.numberOfPage"
                  :numberOfRecordPerpage="pageData.pageSize"
                >
                  <td colspan="4"></td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ converStringToBigNumberString(sumData.cost) }}
                  </td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ converStringToBigNumberString(sumData.hmkh) }}
                  </td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ converStringToBigNumberString(sumData.remainingValue) }}
                  </td>
                </MISATableFooter>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <MISAButton @click="onSave" padding>Lưu</MISAButton>
        <MISAButton @click="onClickCloseForm" type="sub" padding>Hủy</MISAButton>
      </div>
    </div>
  </div>
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
.form-recording {
  width: 70%;
  position: relative;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-self: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
  cursor: move;
}
.div_form {
  background-color: #f4f7ff;
}
.div_information {
  padding: 16px;
}
.input-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-auto-rows: 80px;
  column-gap: 16px;
  background-color: #fff;
  padding: 10px 16px 0 16px;
  margin-top: 8px;
}
.input-container__grid3 {
  grid-column: span 3;
}
.div_detail {
  padding: 0 16px 10px 16px;
  height: 350px;
  display: flex;
  flex-direction: column;
}
.div_relative {
  position: relative;
}
.div_action {
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  display: none;
}
tr:has(.div_action):hover .div_action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
}
table {
  width: 100%;
  height: 100%;
}
.table {
  overflow: auto;
  width: 100%;
  flex-grow: 1;
  background-color: #fff;
}
.table.scroll {
  overflow: hidden;
}
table {
  border-collapse: collapse;
  height: 100%;
}
.div-detail__table {
  margin-top: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.detail__table-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
}
.form-footer {
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  background-color: #e5e5e5;
  height: 50px;
  border-radius: 0 0 4px 4px;
}
.btn-close {
  background-color: transparent;
  height: 18px;
  width: 18px;
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
