<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
//resourses
import { labelAsset, fieldList } from '@/assets/resources/asset'
import { tooltip, events } from '@/assets/resources/common'
import recordingApi from '@/service/api/recordingApi'
import FormSelectIncreaseAsset from './FormSelectIncreaseAsset.vue'
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

const data = ref([
  {
    order: 1,
    fixedAssetCode: 'ABC123',
    fixedAssetName: 'Máy tính',
    departmentName: 'Phòng kế toán',
    cost: 1000,
    hmkh: 100,
    remainingValue: 900
  },
  {
    order: 2,
    fixedAssetCode: 'ABC123',
    fixedAssetName: 'Máy tính',
    departmentName: 'Phòng kế toán',
    cost: 1000,
    hmkh: 100,
    remainingValue: 900
  }
])

const pageData = ref({
  numberOfPage: 1,
  pageSize: 20,
  totalRecord: 0,
  currentPage: 1
})

const emits = defineEmits(['close-form'])

const tBodyRef = ref(null)

const heightBalance = ref(0)

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

  const responseNewCode = await recordingApi.getNewCode()
  if (responseNewCode) {
    console.log(responseNewCode)
    formData.value.recordingCode.value = responseNewCode
    formData.value.recordingCode.defaultValue = responseNewCode
  }
  if (tBodyRef.value) {
    const height = tBodyRef.value.clientHeight
    console.log(height - data.value.length * 40)
    heightBalance.value = height - data.value.length * 40
  }
})

const onClickCloseForm = () => {
  emits('close-form')
}

const onKeydownBtnClose = (event) => {
  if (event.key === 'Enter') {
    emits('close-form')
  }
}

const onToggleFormSelectIncreaseAsset = () => {
  open.value.formSelectIncreaseAsset = !open.value.formSelectIncreaseAsset
}
</script>
<template>
  <MISABackdrop zIndex="1001">
    <FormSelectIncreaseAsset
      v-if="open.formSelectIncreaseAsset"
      @close-select-asset="onToggleFormSelectIncreaseAsset"
      :columnFields="tableFields"
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
              />
            </div>
            <div class="input-container__grid1">
              <MISATextfield
                :defaultValue="formData.recordingDate.defaultValue"
                label="Ngày bắt đầu sử dụng"
                type="date"
                required
              />
            </div>
            <div class="input-container__grid1">
              <MISATextfield
                :defaultValue="formData.actionDate.defaultValue"
                label="Ngày ghi tăng"
                type="date"
                required
              />
            </div>
            <div class="input-container__grid3">
              <MISATextfield label="Ghi chú" />
            </div>
          </div>
        </div>
        <div class="div_detail">
          <h3>Thông tin chi tiết</h3>
          <div class="div-detail__table">
            <div class="detail__table-head">
              <MISASearchBox style="width: 300px" />
              <MISAButton type="outline" shadow @click="onToggleFormSelectIncreaseAsset"
                >Chọn tài sản</MISAButton
              >
            </div>
            <div class="table">
              <table>
                <MISATableHeader :hasCheckbox="false" :action="false" :columns="tableFields" />
                <tbody ref="tBodyRef">
                  <MISATableRow v-for="(data, index) in data" :key="'row' + index">
                    <MISATableData
                      v-for="column in tableFields"
                      :key="'td' + index + column.recordingCode"
                      :type="column.type"
                      :position="column.position"
                    >
                      {{ data[column.field] }}
                    </MISATableData>
                  </MISATableRow>
                  <tr v-if="heightBalance > 0" :height="heightBalance">
                    <td :height="heightBalance" colspan="7"></td>
                  </tr>
                </tbody>
                <MISATableFooter :totalColumn="8" :colspan="4" :isSumDataSameRow="false">
                  <td colspan="4"></td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ sumData.cost }}
                  </td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ sumData.hmkh }}
                  </td>
                  <td style="text-align: right; padding-right: 16px; font-weight: 600">
                    {{ sumData.remainingValue }}
                  </td>
                </MISATableFooter>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <MISAButton padding>Lưu</MISAButton>
        <MISAButton type="sub" padding>Hủy</MISAButton>
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
.div-detail__table,
.table,
table {
  width: 100%;
  height: 100%;
}
.table {
  overflow: auto;
  height: 100%;
  flex-grow: 1;
  background-color: #fff;
}
table {
  border-collapse: collapse;
  height: 100%;
}
.div-detail__table {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
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
.btn-close:focus {
  outline: 1px solid var(--primary-color);
}
</style>
