<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { converStringToBigNumberString } from '@/helper/stringHelper.js'
import MISAContextMenu from '@/components/base/MISAContextMenu.vue' //resourses
import { contextMenu, contextMenuType } from '@/assets/resources/asset'
import recordingApi from '@/service/api/recordingApi'
//store vuex
import { useStore } from 'vuex'
import { types } from '@/assets/resources/common'
import router from '@/router'

const props = defineProps({
  tableFields: {
    type: Array,
    required: true
  },
  heightTable: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    required: true
  },
  totalRecord: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  numberOfPage: {
    type: Number,
    default: 1
  },
  numberOfRecordPerpage: {
    type: Number,
    default: 20
  },
  isSelectAll: {
    type: Boolean,
    default: false
  },
  selectedId: {
    type: String,
    default: ''
  }
})
const emits = defineEmits([
  'selectRow',
  'selectCheckboxRow',
  'changeRecord',
  'deleteRecord',
  'ctrlClick',
  'shiftClick',
  'onToggleAll',
  'showDetail'
])
/**
 * The store object.
 * @type {import('vuex').Store}
 * Creatd by: NTLam (15/8/2023)
 */
const store = useStore()

const lang = store.state.lang

const tBodyRef = ref(null)

/**
 * The context menu component.
 * @type {Ref<Object>}
 * Creatd by: NTLam (15/8/2023)
 */
const mymenu = ref(null)

/**
 * The items to be displayed in the context menu.
 * @type {Ref<Array>}
 * Creatd by: NTLam (15/8/2023)
 */
const items = ref([
  {
    id: contextMenuType.EDIT,
    text: contextMenu[lang].EDIT,
    divider: true,
    click: () => {
      emits('changeRecord', selectedAssetId.value)
      selectedAssetId.value = ''
    }
  },
  {
    id: contextMenuType.DELETE,
    text: contextMenu[lang].DELETE,
    divider: true,
    click: () => {}
  },
  {
    id: 'detail',
    text: 'Chi tiết',
    click: () => {
      console.log(selectedAssetId.value)
      emits('showDetail', selectedAssetId.value)
      selectedAssetId.value = ''
      hideContextMenu()
    }
  }
])

/**
 * The selected asset ID.
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const selectedAssetId = ref('')

const loading = ref(false)

/**
 * Shows the context menu with the given event and items.
 * @param {Event} event - The event that triggered the context menu.
 * Creatd by: NTLam (15/8/2023)
 */
const showContextMenu = (event) => {
  mymenu.value.show(event, items.value)
}
onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
/**
 * Hides the context menu and removes focus from all items in the table.
 * Creatd by: NTLam (15/8/2023)
 */
const hideContextMenu = () => {
  mymenu.value.hide()
}
watch(
  () => props.currentPage,
  () => {
    tBodyRef.value.scrollTop = 0
  }
)
/**
 * Function that handles right-click event on a row in the MISATable component.
 * @param {Event} event - The right-click event.
 * @param {string} id - The id of the row that was right-clicked.
 * Creatd by: NTLam (15/8/2023)
 */
const rightClickARow = (event, id) => {
  selectedAssetId.value = id
  showContextMenu(event)
}

const dialogProps = ref({
  open: false,
  content: ''
})

const deleteARecording = async () => {
  closeDialog()
  if (selectedAssetId.value) {
    loading.value = true
    const res = await recordingApi.delete(selectedAssetId.value).finally(() => {
      loading.value = false
    })
    if (res) {
      selectedAssetId.value = ''
      emits('deleteRecord')
    }
  }
}

const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

const showDialogDelete = (type, id) => {
  if (id) {
    selectedAssetId.value = id
    if (type === 'multi') {
      dialogProps.value.open = true
      dialogProps.value.content = 'Bạn có chắc chắn muốn xóa bản ghi đã chọn không?'
    } else if (type === 'single') {
      dialogProps.value.open = true
      dialogProps.value.content = `Bạn có muốn xóa chứng từ có mã <b>${
        props.data.find((i) => i.recordingId === id).recordingCode
      }</b> ?`
    }
  }
}

/**
 * Function that is called when the mouse leaves the context.
 * Creatd by: NTLam (15/8/2023)
 */
const onMouseLeaveContext = () => {
  // if (!dialogProps.value.open) {
  //   selectedId.value = ''
  // }
  hideContextMenu()
}

/**
 * Chức năng: Tạo danh sách các trang hiển thị
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const pagingList = computed(() => {
  const list = []
  const numberPage = props.numberOfPage
  if (numberPage <= 7) {
    for (let i = 1; i <= numberPage; i++) {
      list.push(i)
    }
  } else {
    if (props.page <= 4) {
      list.push(1, 2, 3, 4, 5, '...', numberPage)
    } else if (props.page >= numberPage - 4) {
      list.push(1, '...', numberPage - 4, numberPage - 3, numberPage - 2)
      list.push(numberPage - 1, numberPage)
    } else {
      list.push(1, '...')
      list.push(props.page - 1, props.page, props.page + 1)
      list.push('...', numberPage)
    }
  }
  return list
})

/**
 * Tính danh sách các trang hiển thị
 * Creatd by: NTLam (15/8/2023)
 */
const listPages = computed(() => {
  const list = []
  for (let i = 1; i <= props.numberOfPage; i++) {
    list.push(i)
  }
  return list
})

const sumCost = computed(() => {
  return props.data.reduce((sum, data) => sum + data.value, 0)
})

const onMousedownRow = (event, id) => {
  if (event.ctrlKey) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    emits('ctrlClick', id)
  } else if (event.shiftKey) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    emits('shiftClick', id)
  } else {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    emits('selectRow', id)
  }
}

/**
 * Chức năng: Thay đổi số trang hiện tại
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const changePage = (page) => {
  if (page === '...' || page == props.number) return
  if ((parseInt(page) - 1) * props.size > props.totalRecord) {
    router.replace({ query: { ...router.currentRoute.value.query, page: 1 } })
  } else router.replace({ query: { ...router.currentRoute.value.query, page } })
}

/**
 * Chức năng: Tăng hoặc giảm số trang hiện tại
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const increaseOrDecreasePage = (type) => {
  if (type === types.INCREASE) {
    if (props.page < props.numberOfPage) {
      router.replace({ query: { ...router.currentRoute.value.query, page: props.page + 1 } })
    }
  } else {
    if (props.page > 1) {
      router.replace({ query: { ...router.currentRoute.value.query, page: props.page - 1 } })
    }
  }
}

/**
 * Changes the number of records displayed per page in the MISATable component.
 * @param {number} value - The number of records to display per page.
 * Creatd by: NTLam (15/8/2023)
 */
const changeRecordPerpage = (value) => {
  router.push({ query: { ...router.currentRoute.value.query, size: value } })
}
</script>
<template>
  <div ref="tBodyRef" class="div-container" :class="{ 'not-scroll': props.heightTable > 0 }">
    <MISABackdrop zIndex="101" v-if="loading" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      :title="dialogProps.title"
      @agree-dialog="deleteARecording"
      @close-dialog="closeDialog"
    />
    <MISAContextMenu
      ref="mymenu"
      minWidth="1em"
      maxWidth="15em"
      backgroundColor="#fbfbfb"
      fontSize="15px"
      textColor="#35495e"
      iconColor="#41b883"
      borderRadius="0.1em"
      @mouseleave="onMouseLeaveContext"
    />
    <table>
      <MISATableHeader
        :sticky="false"
        :columns="props.tableFields"
        hasCheckbox
        action
        :showActionText="false"
        :selectedAll="props.isSelectAll"
        @check-all="$emit('onToggleAll')"
      />
      <tbody>
        <MISATableRow
          @contextmenu="(event) => rightClickARow(event, data.recordingId)"
          :selected="data.isChecked"
          v-for="(data, index) in props.data"
          @mousedown.stop="(e) => onMousedownRow(e, data.recordingId)"
          :key="'row' + index"
        >
          <MISATableData type="checkbox">
            <MISACheckbox
              :value="data.isChecked"
              @mousedown.stop.prevent.self="$emit('selectCheckboxRow', data.recordingId)"
            />
          </MISATableData>
          <MISATableData
            v-for="column in tableFields"
            :key="'td' + index + column.recordingCode"
            :type="column.type"
            :position="column.position"
          >
            {{
              column.field == 'value'
                ? converStringToBigNumberString(data[column.field])
                : data[column.field]
            }}
          </MISATableData>
          <MISATableData width="50px" type="action">
            <MISAButton
              width="32px"
              height="32px"
              @click="$emit('changeRecord', data.recordingId)"
              type="icon"
              ><i class="icon-pencil"></i
            ></MISAButton>
            <MISAButton
              width="32px"
              height="32px"
              @click="() => showDialogDelete('single', data.recordingId)"
              type="icon"
              ><i class="icon-delete-red"></i
            ></MISAButton>
          </MISATableData>
        </MISATableRow>
        <tr v-if="props.heightTable > 0" :height="heightTable">
          <td :height="props.heightTable" colspan="8"></td>
        </tr>
      </tbody>
      <MISATableFooter
        :totalColumn="8"
        :colspan="5"
        :isSumDataSameRow="false"
        :totalRecord="props.totalRecord"
        :currentPage="props.currentPage"
        :numberOfPage="props.numberOfPage"
        :numberOfRecordPerpage="props.numberOfRecordPerpage"
        :pagingList="pagingList"
        :listPages="listPages"
        @change-page="(v) => changePage(v)"
        @decrease="() => increaseOrDecreasePage(types.DECREASE)"
        @increase="() => increaseOrDecreasePage(types.INCREASE)"
        @change-record-per-page="(v) => changeRecordPerpage(v)"
      >
        <td colspan="5"></td>
        <td style="text-align: right; padding-right: 16px; font-weight: 600">
          {{ converStringToBigNumberString(sumCost) }}
        </td>
        <td colspan="2"></td>
      </MISATableFooter>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  border-radius: 4px;
  height: 100%;
  -webkit-box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
  box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
}
.div-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.not-scroll {
  overflow: hidden;
}
</style>
