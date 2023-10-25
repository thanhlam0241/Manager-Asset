<script setup>
import TableInformation from './Component/TableInformation.vue'
import TableRecording from './Component/TableRecording.vue'
import FormAddRecording from './Component/FormAddRecording.vue'
import recordingApi from '@/service/api/recordingApi'
import { events } from '@/assets/resources/common'
import router from '@/router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { getObjectIgnoreField } from '@/helper/object.js'
import useClickOutside from '@/components/composables/useClickOutside.js'

/**
 * Props for the IncreaseAssetView component.
 * @typedef {Object} IncreaseAssetViewProps
 * @property {Number} page - The current page number.
 * @property {Number} size - The number of items to display per page.
 * @property {String} search - The search query to filter items by.
 * Created by: NTLam (15/8/2023)
 */
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

/**
 * @typedef {Object} TableRecordingData
 * @property {number} totalRecord - The total number of records in the table.
 * @property {number} currentPage - The current page number.
 * @property {number} numberOfPage - The total number of pages in the table.
 * @property {number} numberOfRecordPerpage - The number of records to display per page.
 *
 * @type {Object}
 * @property {TableRecordingData} tableRecordingData - The data object for the table recording.
 * Created by: NTLam (15/8/2023)
 */
const tableRecordingData = ref({
  totalRecord: 0,
  currentPage: 1,
  numberOfPage: 1,
  numberOfRecordPerpage: 20
})

/**
 * Fetches data from the server.
 * @returns {Promise<void>} A promise that resolves when the data has been fetched.
 * Created by: NTLam (15/8/2023)
 */
const fetchData = async () => {
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
    // console.log(res)
    const data = [...res.data].map((item, index) => {
      return {
        ...item,
        actionDate: new Date(item.actionDate).toLocaleDateString('Vi').slice(0, 10),
        recordingDate: new Date(item.recordingDate).toLocaleDateString('Vi').slice(0, 10),
        order: (props.page - 1) * props.size + index + 1,
        isChecked: false
      }
    })
    dataArray.value = data
    tableRecordingData.value.totalRecord = res.totalRecord
    tableRecordingData.value.currentPage = res.currentPage
    tableRecordingData.value.numberOfPage = res.totalPage
    if (dataArray.value.length > 0) {
      tableRef.value.scrollTop = 0
      dataArray.value[0].isChecked = true
      // selectedId.value = ''
      showDetail.value = false
      await nextTick()
      showDetailRecord(dataArray.value[0].recordingId)
    } else {
      showDetail.value = false
      recordingIdDetail.value = ''
    }
  }
}
/**
 * @property {number} heightBalance - The height of table recording.
 * Created by: NTLam (15/8/2023)
 */
const heightBalance = ref(0)

/**
 * State for the recording view.
 * Created by: NTLam (15/8/2023)
 */
const showRecording = ref(true)

/**
 * State for the loading.
 * Created by: NTLam (15/8/2023)
 */
const loading = ref(false)

/**
 * The data array for the table recording.
 * @type {Ref<TableRecordingData[]>}
 * Created by: NTLam (15/8/2023)
 */
const dataArray = ref([])

/**
 * The height of table recording.
 * @type {Ref<number>}
 * Created by: NTLam (15/8/2023)
 */
const heightTable = ref(0)

/**
 * The height of table information.
 * @type {Ref<number>}
 * Created by: NTLam (15/8/2023)
 */
const heightTableInformation = ref(0)

/**
 * The state of the table information.
 * @type {Ref<boolean>}
 * Created by: NTLam (15/8/2023)
 */
const showDetail = ref(false)

/**
 * The reference to the table element.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const tableRef = ref(null)

/**
 * The reference to the table recording element.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const tableRecordingRef = ref(null)

/**
 * The reference to the table information element.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const tableInformationRef = ref(null)

/**
 * The state of the header toolbar.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const showHeaderToolbar = ref(false)

/**
 * The reference to the page element.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const pageRef = ref(null)

/**
 * The reference to the resizer element.
 * @type {Ref<HTMLElement>}
 * Created by: NTLam (15/8/2023)
 */
const resizer = ref(null)

/**
 * The state of the select all checkbox.
 * @type {Ref<boolean>}
 * Created by: NTLam (15/8/2023)
 */
const selectAll = ref(false)

/**
 * The state of the dialog.
 * @type {Ref<boolean>}
 * Created by: NTLam (15/8/2023)
 */
const dialogProps = ref({
  open: false,
  content: ''
})

/**
 * The table fields for the table recording.
 * @type {TableField[]}
 * Created by: NTLam (15/8/2023)
 */
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
    position: 'left',
    color: '#5f9beb'
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

/**
 * The state of the dialog.
 * @type {Ref<boolean>}
 * Created by: NTLam (15/8/2023)
 */
const open = ref({
  formAddRecording: false,
  divAction: false
})

/**
 * The id of the recording selected.
 * @type {Ref<string>}
 * Created by: NTLam (15/8/2023)
 */
const selectedId = ref('')

/**
 * The id of the recording selected.
 * @type {Ref<string>}
 * Created by: NTLam (15/8/2023)
 */
const recordingIdDetail = ref('')

/**
 * Vue directive for handling clicks outside of an element.
 * Created by: NTLam (15/8/2023)
 */
const vClickOutside = useClickOutside(document)

/**
 * Chức năng: Khi thay đổi chiều cao của table thì sẽ tính toán lại chiều cao của hàng dư thừa
 * Created by: NTLam (20/07/2023)
 */
watch(heightTable, (newValue) => {
  if (tableRecordingRef.value) {
    heightBalance.value = newValue - dataArray.value.length * 40 - 38 - 2 * 41
  }
})

/**
 * Fetch data when the page, size, or search string changes.
 * Created by: NTLam (15/8/2023)
 */
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

/**
 * Chức năng: Khởi tạo sự kiện resize cho dialog-form
 * Created by: NTLam (20/07/2023)
 */
function initResizeElement() {
  let element = null
  var startY, startHeight

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
    const dis = (e.clientY - startY) / 1
    if (dis < 0) {
      if (startHeight + dis < 300) return
      element.style.height = startHeight + dis + 'px'
    } else {
      const heightInfor = tableInformationRef.value.clientHeight
      element.style.height = startHeight + dis + 'px'
      tableInformationRef.value.style.height = heightInfor - dis + 'px'
    }
  }
  // Dừng event resize
  function stopDrag() {
    calculateRow()
    document.documentElement.removeEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.removeEventListener(events.MOUSEUP, stopDrag, false)
  }
}

/**
 * Chức năng: Khởi tạo sự kiện resize cho table
 * Created by: NTLam (20/07/2023)
 */
onMounted(() => {
  initResizeElement()
  fetchData()
})

/**
 * Tính toán lại chiều cao của hàng dư thừa
 * Created by: NTLam (20/07/2023)
 */
const calculateRow = () => {
  heightTableInformation.value = tableInformationRef.value.clientHeight - 80
  // console.log(tableRecordingRef.value.style)
  heightTable.value =
    tableRecordingRef.value.clientHeight - 66 - 38 - 2 * 40 - dataArray.value.length * 40
}

/**
 * A function that toggles the form.
 * Created by: NTLam (20/07/2023)
 */
const toggleForm = () => {
  open.value.formAddRecording = !open.value.formAddRecording
}
/**
 * A function that closes the dialog.
 * Created by: NTLam (20/07/2023)
 */
const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

/**
 * A function that shows the dialog.
 * Created by: NTLam (20/07/2023)
 */
const showDialogDelete = (type) => {
  if (type === 'delete-multi') {
    const listId = dataArray.value.filter((item) => item.isChecked).map((item) => item.recordingId)
    dialogProps.value.open = true
    if (listId.length > 0) {
      dialogProps.value.content = `Bạn có muốn xóa ${
        dataArray.value.filter((i) => i.isChecked).length
      } chứng từ đã chọn không?`
    } else {
      dialogProps.value.content = `Bạn chưa chọn chứng từ nào để xóa`
    }
  }
}

/**
 * A function that shows the table information.
 * @param {string} id - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
const showDetailRecord = (id) => {
  if (selectedId.value !== id) selectedId.value = id
  else {
    selectedId.value = ''
    selectedId.value = id
  }
  if (!showDetail.value) {
    tableRecordingRef.value.style.height = 500 + 'px'
    showDetail.value = true
    // setTimeout(() => calculateRow(), 1000)
  }
}

/**
 * A function that unselects all rows.
 * Created by: NTLam (20/07/2023)
 */
const unSelectAll = () => {
  dataArray.value.forEach((item) => {
    item.isChecked = false
  })
}

/**
 * A function that checks if all rows are selected.
 * Created by: NTLam (20/07/2023)
 */
const checkIsSelectAll = () => {
  const isAll = dataArray.value.every((item) => item.isChecked)
  if (isAll) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
}

/**
 * Event handler when click on checkbox row
 * @param {string} id - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
const selectCheckboxRow = (id) => {
  let row = dataArray.value.find((item) => item.recordingId === id)
  // console.log(row)
  row.isChecked = !row.isChecked
  if (row.isChecked) {
    selectedId.value = id
  } else {
    selectedId.value = ''
  }
  checkIsSelectAll()
}

/**
 * A function that selects a row.
 * @param {string} id - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
const selectRow = (id) => {
  unSelectAll()
  let row = dataArray.value.find((item) => item.recordingId === id)
  row.isChecked = !row.isChecked
  if (row.isChecked) {
    selectedId.value = id
  } else {
    selectedId.value = ''
  }
}

/**
 * A function that selects a row.
 * @param {string} id - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
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

/**
 * Event when create or update recording success
 * Created by: NTLam (20/07/2023)
 */
const onCreateRecording = () => {
  toggleForm()
  recordingIdDetail.value = ''
  fetchData()
}

/**
 * Event when show detail recording
 * @param {string} v - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
const onShowDetail = (v) => {
  // console.log(v)
  showDetailRecord(v)
}

/**
 * Delete selected recording
 * Created by: NTLam (20/07/2023)
 */
const deleteSelectedRecording = async () => {
  const listId = dataArray.value.filter((item) => item.isChecked).map((item) => item.recordingId)
  // console.log(listId)
  if (listId.length > 0) {
    loading.value = true
    const res = await recordingApi.deleteMulti(listId).finally(() => {
      loading.value = false
      closeDialog()
    })
    if (res) {
      recordingIdDetail.value = ''
      fetchData()
    }
  }
}

/**
 * Hide action bar
 * Created by: NTLam (20/07/2023)
 */
const hideActionBar = () => {
  open.value.divAction = false
}

/**
 * Toggle information
 * Created by: NTLam (20/07/2023)
 */
const toggleInformation = () => {
  showRecording.value = true
  showDetail.value = !showDetail.value
  hideActionBar()
  setTimeout(() => calculateRow(), 100)
}

/**
 * Open form add recording
 * @param {string} id - The id of the recording.
 * Created by: NTLam (20/07/2023)
 */
const onOpenEditRecording = (id) => {
  recordingIdDetail.value = id
  toggleForm()
}

/**
 * Close form add recording
 * Created by: NTLam (20/07/2023)
 */
const onCloseForm = () => {
  toggleForm()
  recordingIdDetail.value = ''
}

/**
 * Toggle recording
 * Created by: NTLam (20/07/2023)
 */
const toggleRecording = () => {
  console.log('toggle')
  if (showRecording.value) {
    showRecording.value = false
  } else {
    showRecording.value = true
    tableInformationRef.value.style.height = 200 + 'px'
  }
}

/**
 * Khi trạng thái của showRecording thay đổi thì tính toán lại chiều cao của hàng dư thừa
 * Created by: NTLam (20/07/2023)
 */
watch(showRecording, () => {
  setTimeout(() => calculateRow(), 10)
})
</script>

<template>
  <div ref="pageRef" class="asset-page">
    <form-add-recording
      v-if="open.formAddRecording"
      @close-form="onCloseForm"
      @create-recording="onCreateRecording"
      @update-recording="onCreateRecording"
      :idRecording="recordingIdDetail"
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
        <div
          v-click-outside="() => (showHeaderToolbar = false)"
          @click="() => (showHeaderToolbar = !showHeaderToolbar)"
          class="header_action"
        >
          <div>
            <i
              :class="[
                showRecording ? (showDetail ? 'icon-show-full' : 'icon-menu') : 'icon-show-full'
              ]"
            ></i>
          </div>
          <div>
            <i class="icon-angle-down"></i>
          </div>
          <div v-if="showHeaderToolbar" class="header_action-toolbar">
            <div @click="toggleInformation" :class="[{ selected: showRecording && !showDetail }]">
              <i class="icon-menu"></i>
            </div>
            <div @click="toggleInformation" :class="[{ selected: showRecording && showDetail }]">
              <i class="icon-show-full"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="showRecording"
      ref="tableRecordingRef"
      class="table-container"
      :class="[!showDetail ? 'flexGrow' : 'max_height']"
    >
      <div class="table-container__header">
        <MISASearchBox
          :value="props.search"
          @press-enter="changeSearchString"
          style="width: 400px"
        />
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
              <li @click="() => showDialogDelete('delete-multi')">
                <MISAButton width="32px" transparent height="32px" type="icon"
                  ><i class="icon-delete-red"></i
                ></MISAButton>
              </li>
              <!-- <li @click="toggleInformation">
                {{ showDetail ? 'Ẩn' : 'Hiện' }} thông tin chi tiết
              </li> -->
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
          @change-record="onOpenEditRecording"
          @select-checkbox-row="selectCheckboxRow"
          @ctrl-click="selectCheckboxRow"
          @double-click="onOpenEditRecording"
          @shift-click="onShiftClick"
          @delete-record="fetchData"
          @show-detail="onShowDetail"
        />
      </div>
    </div>
    <div v-show="showDetail && showRecording" ref="resizer" class="resize"></div>

    <div
      @mouseenter="() => {}"
      ref="tableInformationRef"
      v-show="showDetail"
      class="table-information"
    >
      <div class="table-information-header">
        <h3>Thông tin chi tiết</h3>
        <span style="cursor: pointer" @click="toggleRecording"
          ><i class="icon-fullscreen"></i
        ></span>
      </div>
      <TableInformation
        v-if="showDetail"
        :recordingId="selectedId"
        :heightBalance="heightTableInformation"
        @finish-load="calculateRow"
        @update="fetchData"
      />
    </div>
  </div>
</template>

<style scoped>
.asset-page {
  height: 100%;
  padding-top: 5px;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  position: relative;
  z-index: 11;
  cursor: pointer;
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
  z-index: 10;
}
.div_child {
  position: absolute;
  top: 100%;
  /* width: 40px; */
  right: 0;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-height: calc(100% - 36px - 5px);
  /* min-height: 400px; */
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
}
.table {
  flex-grow: 1;
  overflow: auto;
}
.header_action-toolbar {
  position: absolute;
  /* width: 100%; */
  top: calc(100% + 2px);
  right: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 5px;
}
.header_action-toolbar > div {
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 100%;
  border-radius: 4px;
}
.selected {
  background-color: #d1edf4;
  color: #fff;
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
  /*max-height: 300px;*/
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
