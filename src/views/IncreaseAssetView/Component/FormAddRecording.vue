<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
//resourses
import { labelAsset, fieldList } from '@/assets/resources/asset'
import { tooltip } from '@/assets/resources/common'
import recordingApi from '@/service/api/recordingApi'
import resourceBudgetApi from '@/service/api/resourceBudgetApi'
import FormSelectIncreaseAsset from './FormSelectIncreaseAsset.vue'
import FormEditAsset from './FormEditAsset.vue'
import { converStringToBigNumberString } from '@/helper/stringHelper'

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
    field: fieldList.FIXED_ASSET_CODE,
    label: labelAsset[lang.value].FIXED_ASSET_CODE,
    type: 'string',
    canSort: true
  },
  {
    id: 2,
    field: fieldList.FIXED_ASSET_NAME,
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
    field: fieldList.COST,
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

const listResourceBudget = ref([])

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
const open = ref({
  formSelectIncreaseAsset: false,
  formChangeAsset: false,
  dialog: false
})

const data = ref([])

const pageData = ref({
  numberOfPage: 1,
  pageSize: 20,
  totalRecord: 0,
  currentPage: 1,
  pagingList: []
})

const listAssetsId = ref([])

const emits = defineEmits(['close-form'])

const tBodyRef = ref(null)

const heightBalance = ref(0)

const openEditAsset = ref(false)

const assetSelected = ref(null)

const table_container = ref(null)

const tableRef = ref(null)

const sumData = computed(() => {
  const result = {
    cost: 0,
    hmkh: 0,
    remainingValue: 0
  }

  data.value.forEach((item) => {
    result.cost += item.cost
    result.hmkh += item.hmkh
    result.remainingValue += item.remainingValue
  })

  return result
})

onMounted(async () => {
  const dateNow = new Date()
  formData.value.actionDate.defaultValue = dateNow
  formData.value.recordingDate.defaultValue = dateNow
  formData.value.recordingDate.value = dateNow
  formData.value.recordingDate.value = dateNow

  const responseResourceBudget = await resourceBudgetApi.getAll()
  if (responseResourceBudget) {
    listResourceBudget.value = responseResourceBudget
  }

  const responseNewCode = await recordingApi.getNewCode()
  if (responseNewCode) {
    console.log(responseNewCode)
    formData.value.recordingCode.value = responseNewCode
    formData.value.recordingCode.defaultValue = responseNewCode
  }
})

const dialogProps = ref({
  open: false,
  content: ''
})

const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

const onClickCloseForm = () => {
  emits('close-form')
}

const onKeydownBtnClose = (event) => {
  if (event.key === 'Enter') {
    emits('close-form')
  }
}

const onCloseEditForm = () => {
  assetSelected.value = null
  openEditAsset.value = false
}

const onToggleFormSelectIncreaseAsset = () => {
  open.value.formSelectIncreaseAsset = !open.value.formSelectIncreaseAsset
}

const onOpenEditAsset = (code) => {
  const index = data.value.findIndex((item) => item.fixedAssetCode === code)
  assetSelected.value = data.value[index]
  openEditAsset.value = true
}

const reformatTable = () => {
  pageData.value.currentPage = 1
  pageData.value.totalRecord = data.value.length
  pageData.value.numberOfPage = Math.ceil(data.value.length / pageData.value.pageSize)
  console.log(table_container.value.offsetHeight)
  heightBalance.value = table_container.value.offsetHeight - 68 - data.value.length * 40 - 3 * 40
  tableRef.value.scrollTop = 0
  console.log(heightBalance.value)
}

const updateAsseet = (value) => {
  const listIds = data.value.map((item) => item.fixedAssetCode)
  value.forEach((item) => {
    if (!listIds.includes(item.fixedAssetCode)) {
      data.value.push({
        ...item,
        resourceAssets: []
      })
    }
  })
  reformatTable()
  listAssetsId.value = data.value.map((item) => item.fixedAssetCode)
  onToggleFormSelectIncreaseAsset()
}

const deleteAsset = (code) => {
  const index = data.value.findIndex((item) => item.fixedAssetCode === code)
  data.value.splice(index, 1)
  listAssetsId.value = data.value.map((item) => item.fixedAssetCode)
}
const onUpdateResourceAsset = (code, value) => {
  const index = data.value.findIndex((item) => item.fixedAssetCode === code)
  const dataUpdate = data.value[index]
  dataUpdate.resourceAssets = value
  const cost = value.reduce((sum, item) => sum + item.cost, 0)
  dataUpdate.cost = cost
  dataUpdate.hmkh = Math.round((cost * dataUpdate.depreciationRate) / 100)
  dataUpdate.remainingValue = cost - dataUpdate.hmkh

  onCloseEditForm()
}

const onUpdateField = (field, value) => {
  formData.value[field].value = value
}

const loading = ref(false)

const onValidateData = () => {
  let isValid = true
  if (formData.value.recordingCode.value === '') {
    formData.value.recordingCode.isValid = false
    formData.value.recordingCode.errorMessage = 'Mã chứng từ không được để trống'
    isValid = false
  }
  if (formData.value.recordingDate.value === '') {
    formData.value.recordingDate.isValid = false
    formData.value.recordingDate.errorMessage = 'Ngày bắt đầu sử dụng không được để trống'
    isValid = false
  }
  if (formData.value.actionDate.value === '') {
    formData.value.actionDate.isValid = false
    formData.value.actionDate.errorMessage = 'Ngày ghi tăng không được để trống'
    isValid = false
  }
  if (data.value.length === 0) {
    dialogProps.value.open = true
    dialogProps.value.content = 'Chọn ít nhất một tài sản'
    isValid = false
  }
  return isValid
}

const onSave = async () => {
  let isValid = onValidateData()
  if (isValid) {
    loading.value = true
    const dataForm = {
      recording: {
        recordingCode: formData.value.recordingCode.value,
        recordingDate: formData.value.recordingDate.value,
        actionDate: formData.value.actionDate.value,
        description: formData.value.description.value
      },
      assets: data.value.map((item) => {
        return {
          recordedAssetCode: item.fixedAssetCode,
          resourceAssets: item.resourceAssets
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
  }
}
</script>
<template>
  <MISABackdrop zIndex="100">
    <MISABackdrop zIndex="101" v-if="loading" type="fullscreen">
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
    />
    <FormSelectIncreaseAsset
      v-if="open.formSelectIncreaseAsset"
      @close-select-asset="onToggleFormSelectIncreaseAsset"
      :columnFields="tableFields"
      :listIds="listAssetsId"
      @select-asset="updateAsseet"
    />
    <div class="form-recording">
      <div class="form-header">
        <h2>Thêm chứng từ ghi tăng</h2>
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
              <MISATextfield label="Ghi chú" @on-change="(v) => onUpdateField('description', v)" />
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
                            @click="() => onOpenEditAsset(data.fixedAssetCode)"
                            type="icon"
                            ><i class="icon-pencil"></i
                          ></MISAButton>
                          <MISAButton
                            width="32px"
                            height="32px"
                            @click="() => deleteAsset(data.fixedAssetCode)"
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
  </MISABackdrop>
</template>
<style scoped>
.form-recording {
  width: 70%;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-self: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
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
