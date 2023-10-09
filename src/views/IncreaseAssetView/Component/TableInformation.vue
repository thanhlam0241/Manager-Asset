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

const emit = defineEmits(['finishLoad'])
const listResourceBudget = ref([])

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
const assetSelected = ref(null)

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
const data = ref([])

const tableRef = ref(null)

const dialogProps = ref({
  open: false,
  content: ''
})
const recordingCode = ref('')
const loading = ref(false)

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

const idToDelete = ref('')

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
  }
}

const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
  idToDelete.value = ''
}

const startDelete = (id) => {
  console.log(id)
  idToDelete.value = id
  dialogProps.value.open = true
  dialogProps.value.content = `Bạn có muốn xóa tài sản mã <b>${
    data.value.find((item) => item.recordedAssetId === id).recordedAssetCode
  }</b> của chứng từ mã <b>${recordingCode.value}</b> không?`
}

const heightRow = computed(() => {
  console.log(props.heightBalance)
  return props.heightBalance - 40 * data.value.length
})

onMounted(async () => {
  const responseResourceBudget = await resourceBudgetApi.getAll()
  if (responseResourceBudget) {
    listResourceBudget.value = responseResourceBudget
  }
  await fetchData(props.recordingId)
})
watch(
  () => props.recordingId,
  async (newValue) => {
    await fetchData(newValue)
  }
)

const onStartEdit = (id) => {
  assetSelected.value = data.value.find((item) => item.recordedAssetId === id)
}

const onCloseEditForm = () => {
  assetSelected.value = null
}
const onUpdateResourceAsset = async (code, value) => {
  console.log(value)
  const recordedAsset = data.value.find((item) => item.recordedAssetCode === code)
  const dataUpdate = {
    resourceAssets: value.map((item) => {
      const resourceBudget = listResourceBudget.value.find(
        (i) => i.resourceBudgetName === item.resourceBudgetName
      )
      return {
        resourceBudget,
        cost: item.cost,
        resourceAssetId: item.resourceAssetId
      }
    })
  }
  const response = await recordedAssetApi.update(recordedAsset.recordedAssetId, dataUpdate)
  if (response) {
    fetchData(props.recordingId)
    onCloseEditForm()
  }
  // onCloseEditForm()
}
</script>

<template>
  <div ref="tableRef" class="table">
    <FormEditAsset
      v-if="assetSelected"
      @close-edit="onCloseEditForm"
      @on-save="onUpdateResourceAsset"
      :resourceBudget="listResourceBudget"
      :assetSelected="assetSelected"
      nameCode="recordedAssetCode"
    />
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @agree-dialog="deleteAsset"
      @close-dialog="closeDialog"
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
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  border-radius: 4px;
  height: 100%;
}
</style>
