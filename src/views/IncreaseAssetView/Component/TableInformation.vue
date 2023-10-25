<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import recordingApi from '@/service/api/recordingApi'
import recordedAssetApi from '@/service/api/recordedAssetApi'
import resourceBudgetApi from '@/service/api/resourceBudgetApi'
import FormEditAsset from './FormEditAsset.vue'
//resourses
import { labelAsset, fieldList } from '@/assets/resources/asset'
import {
  tooltip
  //events
} from '@/assets/resources/common'
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
 * Created by: NTLam (15/8/2023)
 */
const props = defineProps({
  recordingId: {
    type: String,
    default: ''
  },
  heightBalance: {
    type: Number,
    default: 0
  }
})

/**
 * The emit function.
 * @type {import('vue').EmitsOptions}
 * Creatd by: NTLam (15/8/2023)
 */
const emit = defineEmits(['finishLoad', 'update'])

/**
 * The list of resource budget.
 * @type {import('vue').Ref<import('@/models/ResourceBudget').ResourceBudget[]>}
 * Created by: NTLam (15/8/2023)
 */
const listResourceBudget = ref([])

/**
 * The list of asset selected.
 * Created by: NTLam (15/8/2023)
 */
const assetSelected = ref(null)

/**
 * The list of column fields.
 * Created by: NTLam (15/8/2023)
 */
const columnFields = [
  {
    id: 0,
    field: 'order',
    label: 'STT',
    type: 'order',
    position: 'center'
  },
  {
    id: 1,
    field: fieldList.RECORDED_ASSET_CODE,
    label: labelAsset[lang.value].RECORDED_ASSET_CODE,
    type: 'string',
    canSort: true
  },
  {
    id: 2,
    field: fieldList.RECORDED_ASSET_NAME,
    label: labelAsset[lang.value].RECORDED_ASSET_NAME,
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
    field: fieldList.VALUE,
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
    position: 'right',
    action: true
  }
]

/**
 * The list of data.
 * Created by: NTLam (15/8/2023)
 */
const data = ref([])

/**
 * The table ref.
 * Created by: NTLam (15/8/2023)
 */
const tableRef = ref(null)

/**
 * The dialog props.
 * Created by: NTLam (15/8/2023)
 */
const dialogProps = ref({
  open: false,
  content: '',
  type: 'confirm'
})

/**
 * The dialog props warning.
 * Created by: NTLam (15/8/2023)
 */
const dialogPropsDelete = ref({
  open: false,
  content: ''
})

/**
 * The id to delete.
 * Created by: NTLam (15/8/2023)
 */
const idToDelete = ref('')

/**
 * Close dialog delete.
 * Created by: NTLam (15/8/2023)
 */
const closeDialogDelete = () => {
  dialogPropsDelete.value.open = false
  dialogPropsDelete.value.content = ''
}

/**
 * The recording code.
 * Created by: NTLam (15/8/2023)
 */
const recordingCode = ref('')

/**
 * The loading.
 * Created by: NTLam (15/8/2023)
 */
const loading = ref(false)

/**
 * Fetch data.
 * @param {string} id The id of recording.
 * Created by: NTLam (15/8/2023)
 */
const fetchData = async (id) => {
  if (!id) return
  const response = await recordingApi.getAllAsset(id)
  if (response) {
    console.log(response)
    recordingCode.value = response.recordingCode
    data.value = [...response.assets].map((item, index) => {
      const hmkh = parseInt(item.value * (item.depreciationRate / 100))
      return {
        ...item,
        order: index + 1,
        hmkh: hmkh,
        remainingValue: item.value - hmkh
      }
    })
    tableRef.value.scrollTop = 0
    emit('finishLoad')
  }
}

/**
 * Delete asset.
 * Created by: NTLam (15/8/2023)
 */
const deleteAsset = async () => {
  console.log(idToDelete.value)
  if (!idToDelete.value) return
  loading.value = true
  const response = await recordedAssetApi.delete(idToDelete.value).finally(() => {
    loading.value = false
  })
  if (response) {
    closeDialog()
    fetchData(props.recordingId)
    emit('update')
  }
}

/**
 * Close dialog.
 * Created by: NTLam (15/8/2023)
 */
const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''

  idToDelete.value = ''
}

/**
 * Start delete.
 * @param {string} id The id of asset.
 * Created by: NTLam (15/8/2023)
 */
const startDelete = (id) => {
  console.log(id)
  if (data.value.length === 1) {
    dialogPropsDelete.value.content = 'Không thể xóa tài sản cuối cùng của chứng từ'
    dialogPropsDelete.value.open = true
    return
  } else {
    idToDelete.value = id
    dialogProps.value.type = 'confirm'
    dialogProps.value.content = `Bạn có muốn xóa tài sản mã <b>${
      data.value.find((item) => item.recordedAssetId === id).recordedAssetCode
    }</b> của chứng từ mã <b>${recordingCode.value}</b> không?`
    dialogProps.value.open = true
  }
}

/**
 * The height of row.
 * Created by: NTLam (15/8/2023)
 */
const heightRow = computed(() => {
  console.log(props.heightBalance)
  return props.heightBalance - 40 * data.value.length
})

/**
 * The mounted hook.
 * Created by: NTLam (15/8/2023)
 */
onMounted(async () => {
  const responseResourceBudget = await resourceBudgetApi.getAll()
  if (responseResourceBudget) {
    listResourceBudget.value = responseResourceBudget
  }
  await fetchData(props.recordingId)
})

/**
 * The watch recording id.
 * Created by: NTLam (15/8/2023)
 */
watch(
  () => props.recordingId,
  async (newValue) => {
    await fetchData(newValue)
  }
)

/**
 * Event start edit.
 * @param {string} id The id of asset.
 * Created by: NTLam (15/8/2023)
 */
const onStartEdit = (id) => {
  assetSelected.value = data.value.find((item) => item.recordedAssetId === id)
}

/**
 * Close edit form.
 * Created by: NTLam (15/8/2023)
 */
const onCloseEditForm = () => {
  assetSelected.value = null
}

/**
 * Update resource asset.
 * @param {string} code The code of asset.
 * @param {import('@/models/ResourceAsset').ResourceAsset[]} value The value of asset.
 * Created by: NTLam (15/8/2023)
 */
const onUpdateResourceAsset = async (code, value) => {
  console.log(value)
  const recordedAsset = data.value.find((item) => item.recordedAssetCode === code)
  if (!value || value.length == 0) return
  const dataUpdate = {
    value: value.reduce((total, item) => total + parseInt(item.cost), 0),
    resourceAssets: value.map((item) => {
      return {
        resourceBudget: item.resourceBudget,
        cost: item.cost,
        resourceAssetId: item.resourceAssetId
      }
    })
  }
  const response = await recordedAssetApi.update(recordedAsset.recordedAssetId, dataUpdate)
  if (response) {
    emit('update')
    fetchData(props.recordingId)
    onCloseEditForm()
  }
  // onCloseEditForm()
}
</script>

<template>
  <div ref="tableRef" :class="['table', { 'not-scroll': heightRow > 0 }]">
    <FormEditAsset
      v-if="assetSelected"
      @close-edit="onCloseEditForm"
      @on-save="onUpdateResourceAsset"
      :resourceBudget="listResourceBudget"
      :assetSelected="assetSelected"
      nameCode="recordedAssetCode"
    />
    <MISADialog
      v-if="dialogProps.open && dialogProps.type === 'confirm'"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @agree-dialog="deleteAsset"
      @close-dialog="closeDialog"
    />
    <!-- <MISADialog
      v-if="dialogProps.open && dialogProps.type === 'alert'"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @close-dialog="closeDialog"
    /> -->
    <MISADialog
      v-if="dialogPropsDelete.open"
      :open="dialogPropsDelete.open"
      :content="dialogPropsDelete.content"
      @agree-dialog="closeDialogDelete"
      type="error"
    />
    <MISABackdrop zIndex="101" v-if="loading" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <table>
      <MISATableHeader :hasCheckbox="false" :action="false" :columns="columnFields" />
      <MISATableBody
        nameId="recordedAssetId"
        :action="false"
        :hasCheckbox="false"
        :columnFields="columnFields"
        :data="data"
        :heightBalance="heightRow"
        @delete="startDelete"
        @change="onStartEdit"
      />
    </table>
  </div>
</template>

<style scoped>
.table {
  overflow: auto;
  border-radius: 4px;
  flex-grow: 1;
}
.table.not-scroll {
  overflow: hidden;
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  border-radius: 4px;
  height: 100%;
}
</style>
