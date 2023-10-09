<script setup>
import TableInformation from './Component/TableInformation.vue'
import TableRecording from './Component/TableRecording.vue'
import FormAddRecording from './Component/FormAddRecording.vue'
import recordingApi from '@/service/api/recordingApi'
import { events } from '@/assets/resources/common'
import router from '@/router'
import { onMounted, ref, watch } from 'vue'
import { getObjectIgnoreField } from '@/helper/object.js'
import useClickOutside from '@/components/composables/useClickOutside.js'
const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  size: {
    type: Number,
    default: 20
  },
  search: {
    type: String,
    default: ''
  }
})

const tableRecordingData = ref({
  totalRecord: 0,
  currentPage: 1,
  numberOfPage: 1,
  numberOfRecordPerpage: 20
})

const fetchData = async (callback) => {
  loading.value = true
  const res = await recordingApi
    .getFilter({
      page: props.page,
      size: props.size,
      search: props.search
    })
    .finally(() => {
      loading.value = false
    })
  if (res) {
    console.log(res)
    const data = [...res.data].map((item, index) => {
      return {
        ...item,
        actionDate: new Date(item.actionDate).toISOString().slice(0, 10),
        recordingDate: new Date(item.recordingDate).toISOString().slice(0, 10),
        order: (props.page - 1) * props.size + index + 1,
        isChecked: false
      }
    })
    dataArray.value = data
    tableRecordingData.value.totalRecord = res.totalRecord
    tableRecordingData.value.currentPage = res.currentPage
    tableRecordingData.value.numberOfPage = res.totalPage
    tableRef.value.scrollTop = 0
    dataArray.value[0].isChecked = true
    showDetailRecord(dataArray.value[0].recordingId)
  }
}

const heightBalance = ref(0)

const loading = ref(false)

const dataArray = ref([])

const heightTable = ref(0)

const heightTableInformation = ref(0)

const showDetail = ref(false)

const tableRef = ref(null)

const tableRecordingRef = ref(null)

const tableInformationRef = ref(null)

const pageRef = ref(null)

const resizer = ref(null)

const selectAll = ref(false)

const dialogProps = ref({
  open: false,
  content: ''
})

watch(heightTable, (newValue) => {
  if (tableRecordingRef.value) {
    heightBalance.value = newValue - dataArray.value.length * 40 - 38 - 2 * 41
  }
})

watch(
  () => [props.page, props.size, props.search],
  async () => {
    await fetchData()
  }
)

/**
 * Chức năng: Khi nhấn vào checkbox ở hàng đầu tiên thì sẽ chọn tất cả các hàng
 * Creatd by: NTLam (15/8/2023)
 */
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
  if (selectAll.value) {
    dataArray.value.forEach((item) => {
      item.isChecked = true
    })
  } else {
    unSelectAll()
  }
}

const vClickOutside = useClickOutside(document)

/**
 * Chức năng: Khởi tạo sự kiện resize cho dialog-form
 * Created by: NTLam (20/07/2023)
 */
function initResizeElement() {
  let element = null
  let startY, startHeight

  resizer.value.addEventListener(events.MOUSEDOWN, initDrag, false)

  // Khởi tạo event resize
  function initDrag(e) {
    element = tableRecordingRef.value
    startY = e.clientY
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
    document.documentElement.addEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.addEventListener(events.MOUSEUP, stopDrag, false)
  }

  // Thực hiện event resize
  function doDrag(e) {
    // if (startHeight - e.clientY + startY > 300) {
    //   stopDrag()
    // }
    const heightInfor = tableInformationRef.value.clientHeight
    element.style.height = startHeight + e.clientY - startY + 'px'
    tableInformationRef.value.style.height = heightInfor - e.clientY + startY + 'px'
  }
  // Dừng event resize
  function stopDrag() {
    calculateRow()
    document.documentElement.removeEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.removeEventListener(events.MOUSEUP, stopDrag, false)
  }
}

onMounted(() => {
  initResizeElement()
  fetchData()
})

const calculateRow = () => {
  heightTableInformation.value = tableInformationRef.value.clientHeight - 80
  console.log(tableRecordingRef.value.style)
  heightTable.value =
    tableRecordingRef.value.clientHeight - 66 - 38 - 2 * 40 - dataArray.value.length * 40
}

const tableFields = [
  {
    id: 1,
    field: 'order',
    label: 'STT',
    type: 'order',
    position: 'center'
  },
  {
    id: 2,
    field: 'recordingCode',
    label: 'Số chứng từ',
    type: 'text',
    position: 'left'
  },
  {
    id: 3,
    field: 'recordingDate',
    label: 'Ngày chứng từ',
    type: 'date',
    position: 'center'
  },
  {
    íd: 4,
    field: 'actionDate',
    label: 'Ngày ghi tăng',
    type: 'date',
    position: 'center'
  },
  {
    id: 5,
    field: 'value',
    label: 'Tổng nguyên giá',
    type: 'number',
    position: 'right'
  },
  {
    id: 6,
    field: 'description',
    label: 'Nội dung',
    type: 'text',
    width: '40%',
    position: 'left'
  }
]

const open = ref({
  formAddRecording: false,
  divAction: false
})

const toggleForm = () => {
  open.value.formAddRecording = !open.value.formAddRecording
}

const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

const showDialogDelete = (type) => {
  if (type === 'delete-multi') {
    dialogProps.value.open = true
    dialogProps.value.content = `Bạn có muốn xóa ${
      dataArray.value.filter((i) => i.isChecked).length
    } chứng từ đã chọn không?`
  }
}

const selectedId = ref('')

const showDetailRecord = (id) => {
  if (selectedId.value !== id) selectedId.value = id
  if (!showDetail.value) {
    // tableRecordingRef.value.style.height = tableRecordingRef.value.offsetHeight - 250 + 'px'
    showDetail.value = true
    // setTimeout(() => calculateRow(), 1000)
  }
}

const unSelectAll = () => {
  dataArray.value.forEach((item) => {
    item.isChecked = false
  })
}

const checkIsSelectAll = () => {
  const isAll = dataArray.value.every((item) => item.isChecked)
  if (isAll) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
}

const selectCheckboxRow = (id) => {
  let row = dataArray.value.find((item) => item.recordingId === id)
  console.log(row)
  row.isChecked = !row.isChecked
  checkIsSelectAll()
}

const selectRow = (id) => {
  unSelectAll()
  let row = dataArray.value.find((item) => item.recordingId === id)
  row.isChecked = !row.isChecked
}

const onShiftClick = (id) => {
  let index = dataArray.value.findIndex((item) => item.recordingId === id)
  let indexSelected = dataArray.value.findIndex((item) => item.isChecked)
  if (indexSelected === -1) {
    selectRow(id)
  } else {
    let start = indexSelected < index ? indexSelected : index
    let end = indexSelected > index ? indexSelected : index
    for (let i = start; i <= end; i++) {
      dataArray.value[i].isChecked = true
    }
  }
  checkIsSelectAll()
}

/**
 * A function that changes the search string value.
 * @param {string} value - The new value for the search string.
 */
const changeSearchString = (value) => {
  if (value) {
    router.push({ query: { ...router.currentRoute.value.query, search: value } })
  } else {
    router.replace({
      query: { ...getObjectIgnoreField(router.currentRoute.value.query, ['search']) }
    })
  }
}
const onCreateRecording = () => {
  toggleForm()
  fetchData()
}
const onShowDetail = (v) => {
  console.log(v)
  showDetailRecord(v)
}
const deleteSelectedRecording = async () => {
  const listId = dataArray.value.filter((item) => item.isChecked).map((item) => item.recordingId)
  console.log(listId)
  loading.value = true
  const res = await recordingApi.deleteMulti(listId).finally(() => {
    loading.value = false
    closeDialog()
  })
  if (res) {
    fetchData()
  }
}
const hideActionBar = () => {
  open.value.divAction = false
}
const toggleInformation = () => {
  showDetail.value = !showDetail.value
  hideActionBar()
  setTimeout(() => calculateRow(), 100)
}
</script>

<template>
  <div ref="pageRef" class="asset-page">
    <form-add-recording
      v-if="open.formAddRecording"
      @close-form="toggleForm"
      @create-recording="onCreateRecording"
    />
    <MISABackdrop zIndex="1010" v-if="loading" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      @agree-dialog="deleteSelectedRecording"
      @close-dialog="closeDialog"
    />
    <div class="page-header">
      <h1>Ghi tăng tài sản</h1>
      <div class="header-action__container">
        <MISAButton @click="toggleForm" padding>Thêm</MISAButton>
        <div class="header_action">
          <div>
            <i class="icon-increase-page"></i>
          </div>
          <div>
            <i class="icon-angle-down"></i>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="tableRecordingRef"
      class="table-container"
      :class="[!showDetail ? 'flexGrow' : 'max_height']"
    >
      <div class="table-container__header">
        <MISASearchBox :value="props.search" @on-change="changeSearchString" style="width: 400px" />
        <div class="table-container__action">
          <MISAButton transparent width="36px" type="icon"><i class="icon-print"></i></MISAButton>
          <div class="div-action__table" v-click-outside="hideActionBar">
            <MISAButton
              transparent
              width="36px"
              type="icon"
              @click="() => (open.divAction = !open.divAction)"
              ><i class="icon-ellpise"></i
            ></MISAButton>
            <ul class="div_child" v-if="open.divAction">
              <li @click="() => showDialogDelete('delete-multi')">Xóa chứng từ đã chọn</li>
              <li @click="toggleInformation">
                {{ showDetail ? 'Ẩn' : 'Hiện' }} thông tin chi tiết
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div ref="tableRef" class="table" :class="[{ 'not-scroll': heightBalance > 0 }]">
        <TableRecording
          :isSelectAll="selectAll"
          @on-toggle-all="toggleSelectAll"
          :heightTable="heightTable"
          :tableFields="tableFields"
          :data="dataArray"
          :totalRecord="tableRecordingData.totalRecord"
          :currentPage="tableRecordingData.currentPage"
          :numberOfPage="tableRecordingData.numberOfPage"
          :numberOfRecordPerPage="tableRecordingData.numberOfRecordPerpage"
          @select-row="selectRow"
          :selectedId="selectedId"
          @change-record="showDetailRecord"
          @select-checkbox-row="selectCheckboxRow"
          @ctrl-click="selectCheckboxRow"
          @shift-click="onShiftClick"
          @delete-record="fetchData"
          @show-detail="onShowDetail"
        />
      </div>
    </div>
    <div v-show="showDetail" ref="resizer" class="resize"></div>

    <div ref="tableInformationRef" v-show="showDetail" class="table-information">
      <div class="table-information-header">
        <h3>Thông tin chi tiết</h3>
        <span><i class="icon-fullscreen"></i></span>
      </div>
      <TableInformation
        v-if="showDetail"
        :recordingId="selectedId"
        :heightBalance="heightTableInformation"
        @finish-load="calculateRow"
      />
    </div>
  </div>
</template>

<style scoped>
.asset-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.page-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
  margin-bottom: 10px;
  height: 36px;
}
.header-action__container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.header_action {
  width: 70px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 4px;
}
.table.not-scroll {
  overflow: hidden;
}
.header_action > div {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.div-action__table {
  position: relative;
}
.div_child {
  position: absolute;
  top: 100%;
  width: 200px;
  right: 0;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}
.div_child > li {
  list-style: none;
}
.div_child > li:hover {
  cursor: pointer;
  color: #007bff;
}
.table-container {
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 36px - 5px);
  max-height: calc(100% - 36px - 5px);
  overflow: auto;
  /* transition: all ease 400ms; */
}
.table-container.flexGrow {
  flex-grow: 1;
}
.table-container.max_height {
  max-height: 400px;
}
.table-container__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
}
.table-container__action {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.table {
  flex-grow: 1;
  overflow: auto;
}

.resize {
  height: 10px;
  width: 100%;
  cursor: row-resize;
  background-color: transparent;
}

.table-information {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.table-information-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background-color: #fff;
}
.table-information-header span {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
