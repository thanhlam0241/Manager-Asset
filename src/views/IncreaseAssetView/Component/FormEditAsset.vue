<template>
  <MISABackdrop zIndex="1004">
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @agree-dialog="closeDialog"
      type="error"
    />
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Sửa tài sản {{ props.assetSelected.recordedAssetName }}</h2>
        <button
          class="btn-close"
          ref="closeBtn"
          @keydown="onKeydownBtnClose"
          @click="onClickCloseForm"
        >
          <i class="icon-xmark"></i>
        </button>
      </div>
      <div class="dialog-body">
        <MISATextfield
          disabled
          :defaultValue="props.assetSelected.departmentName"
          width="550px"
          label="Bộ phận sử dụng"
        />
        <h4 style="margin-bottom: 16px">Nguyên giá</h4>
        <div class="grid-container">
          <span>Nguồn hình thành</span>
          <span>Giá trị</span>
        </div>
        <div class="resource-container">
          <div v-for="(item, index) in items" :key="'row' + index" class="resource-asset">
            <div class="grid-container">
              <MISACombobox
                :zIndex="(50 - index).toString()"
                :defaultValue="item.resourceBudgetName"
                :options="props.resourceBudget.map((item) => item.resourceBudgetName)"
                type="dropdown"
                @change-value="(v) => onUpdateField(index, 'resourceBudgetName', v)"
                :errorText="item.errorTextName"
              />
              <MISAInput
                @on-change="(v) => onUpdateField(index, 'cost', v)"
                :defaultValue="item.cost"
                format
                type="number"
                :errorText="item.errorCost"
              />
            </div>
            <div class="tool-asset">
              <MISAButton
                :disabled="items.length === 4"
                @click="() => addNewItem(index)"
                type="icon"
                height="24px"
                width="24px"
              >
                <i class="icon-add-square"></i>
              </MISAButton>
              <MISAButton
                :disabled="items.length === 1"
                @click="() => removeItem(index)"
                type="icon"
                height="24px"
                width="24px"
              >
                <i class="icon-minus-circle"></i>
              </MISAButton>
            </div>
          </div>
        </div>
        <div class="grid-container">
          <MISATextfield height="36px" noMargin :hasLabel="false" disabled defaultValue="Tổng" />
          <MISAInput height="36px" type="number" format :defaultValue="totalCost" disabled />
        </div>
      </div>
      <div class="dialog-footer">
        <MISAButton @click="onSave" padding>Lưu</MISAButton>
        <MISAButton @click="onClickCloseForm" type="sub" padding>Hủy</MISAButton>
      </div>
    </div>
  </MISABackdrop>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { checkIsNumberString } from '@/helper/stringHelper'

/**
 * The emit function.
 * Created by: NTLam (15/8/2021)
 */
const emit = defineEmits(['closeEdit', 'onSave'])

/**
 * The data of component.
 * Created by: NTLam (15/8/2021)
 */
const items = ref([])

/**
 * The is change.
 * Created by: NTLam (15/8/2021)
 */
const isChange = ref(false)

/**
 * The props of component.
 * Created by: NTLam (15/8/2021)
 */
const props = defineProps({
  assetId: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'add',
    validator: (value) => {
      return ['add', 'edit'].includes(value)
    }
  },
  resourceBudget: {
    type: Array,
    default: () => []
  },
  assetSelected: {
    type: Object,
    default: () => {}
  },
  nameCode: {
    type: String,
    default: 'fixedAssetCode'
  }
})

/**
 * The dialog props.
 * Created by: NTLam (15/8/2021)
 */
const dialogProps = ref({
  open: false,
  content: ''
})

/**
 * Close dialog event.
 * Created by: NTLam (15/8/2021)
 */
const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

/**
 * The total cost.
 * Created by: NTLam (15/8/2021)
 */
const totalCost = computed(() => {
  return items.value.reduce((sum, item) => sum + parseInt(item.cost), 0)
})

/**
 * The event press key.
 * @param {KeyboardEvent} event The event of keydown.
 * Created by: NTLam (15/8/2021)
 */
const onPressKey = (event) => {
  event.stopPropagation()
  if (event.key === 'Escape') {
    onClickCloseForm()
  } else if (event.key === 's' && event.ctrlKey) {
    event.preventDefault()
    onSave()
  }
}

/**
 * Events when mounted.
 * Created by: NTLam (15/8/2023)
 */
onMounted(() => {
  // console.log(props.assetSelected)
  if (props.assetSelected.resourceAssets.length > 0) {
    items.value = props.assetSelected.resourceAssets.map((item) => {
      return {
        resourceBudgetName: item.resourceBudget.resourceBudgetName,
        cost: item.cost,
        errorTextName: '',
        errorCost: '',
        resourceAssetId: item.resourceAssetId
      }
    })
  } else
    items.value.push({
      resourceBudgetName: '',
      cost: props.assetSelected.value,
      errorTextName: '',
      errorCost: ''
    })

  window.addEventListener('keydown', onPressKey)
})

/**
 * Events when unmounted.
 * Created by: NTLam (15/8/2023)
 */
onUnmounted(() => {
  window.removeEventListener('keydown', onPressKey)
})

/**
 * Event when add new item.
 * @param {number} index The index of item.
 * Created by: NTLam (15/8/2023)
 */
const addNewItem = (index) => {
  items.value.splice(index + 1, 0, {
    resourceBudgetName: '',
    cost: 0,
    errorTextName: '',
    errorCost: ''
  })
  isChange.value = true
}

/**
 * Event when update field.
 * @param {number} index The index of item.
 * @param {string} field The field of item.
 * @param {string} value The value of item.
 * Created by: NTLam (15/8/2023)
 */
const onUpdateField = (index, field, value) => {
  items.value[index][field] = value
  if (field === 'resourceBudgetName') {
    items.value[index].errorTextName = ''
  } else if (field === 'cost') {
    items.value[index].errorCost = ''
  }
  isChange.value = true
}

/**
 * Event when remove item.
 * @param {number} index The index of item.
 * Created by: NTLam (15/8/2023)
 */
const removeItem = (index) => {
  items.value.splice(index, 1)
  if (items.value.length === 0) {
    items.value.push({
      resourceBudgetName: '',
      cost: 0,
      errorTextName: '',
      errorCost: ''
    })
  }
  isChange.value = true
}

/**
 * Check whether the data has changed.
 * Created by: NTLam (15/8/2023)
 */
const checkIsChange = () => {
  if (!isChange.value) {
    dialogProps.value.open = true
    dialogProps.value.content = 'Chưa thay đổi dữ liệu.'
  }
  return isChange.value
}

/**
 * Event when click close form.
 * Created by: NTLam (15/8/2023)
 */
const onClickCloseForm = () => {
  emit('closeEdit')
}

/**
 * Event when click button close.
 * @param {KeyboardEvent} event The event of keydown.
 * Created by: NTLam (15/8/2023)
 */
const onSave = () => {
  let isNotValid = false
  if (!checkIsChange()) return
  // console.log(items.value)
  for (let i = 0; i < items.value.length; i++) {
    if (items.value[i].resourceBudgetName === '') {
      items.value[i].errorTextName = 'Bạn chưa nhập nguồn hình thành'
      if (!isNotValid) isNotValid = true
    }
    if (!checkIsNumberString(items.value[i].cost)) {
      items.value[i].errorCost = 'Bạn chưa nhập giá trị nguồn'
      if (!isNotValid) isNotValid = true
    }
    for (let j = i + 1; j < items.value.length; j++) {
      if (items.value[i].resourceBudgetName === items.value[j].resourceBudgetName) {
        items.value[j].errorTextName = 'Nguồn hình thành không được trùng nhau'
        if (!isNotValid) isNotValid = true
      }
    }
  }
  if (isNotValid) {
    dialogProps.value.content =
      'Giá trị không hợp lệ. Nguồn hình thành không được để trống, trùng nhau và giá trị phải là số nguyên dương.'
    dialogProps.value.open = true
  } else {
    const data = items.value.map((item) => {
      const rb = props.resourceBudget.find((i) => i.resourceBudgetName === item.resourceBudgetName)
      return {
        resourceBudget: {
          resourceBudgetId: rb.resourceBudgetId,
          resourceBudgetCode: rb.resourceBudgetCode,
          resourceBudgetName: item.resourceBudgetName
        },
        cost: parseInt(item.cost),
        resourceAssetId: item.resourceAssetId || null
      }
    })
    // console.log(data)
    emit('onSave', props.assetSelected[props.nameCode], data)
  }
}
</script>

<style scoped>
.dialog-container {
  height: 600px;
  width: 800px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.dialog-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-self: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
}
.dialog-body {
  flex-grow: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.resource-asset {
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 36px;
}
.tool-asset {
  width: 60px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grid-container {
  width: 550px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  padding: 1px;
}
.resource-container {
  flex-grow: 1;
  display: flex;
  height: 290px;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  padding: 10px 0;
  /* overflow: auto; */
  margin-bottom: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 16px;
  gap: 5px;
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
