<script setup>
//composition api
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import router from '@/router'
//components
import MISASearch from '@/components/base/MISASearchBox.vue'
import MISAContextMenu from '@/components/base/MISAContextMenu.vue'
import MISATableHeader from '@/components/base/MISATableHeader.vue'
import MISATableBody from '@/components/base/MISATableBody.vue'
import MISATableFooter from '@/components/base/MISATableFooter.vue'
//layout
import AssetForm from '@/components/page/AssetForm.vue'
import MISAExcelEditer from '@/components/base/MISAExcelEditer.vue'
//api
import fixedAssetApi from '@/service/api/fixedAssetApi'
import fixedAssetCategoryApi from '@/service/api/fixedAssetCategoryApi'
import departmentApi from '@/service/api/departmentApi'
//helper
import { converStringToBigNumberString, removeVietnameseDiacritics } from '@/helper/stringHelper.js'
import { getObjectIgnoreField } from '@/helper/object.js'
//emitter
import useEmitter from '@/hooks/useEmitter.js'
//store vuex
import { useStore } from 'vuex'
//resourses
import {
  labelAsset,
  contextMenu,
  message,
  excel,
  table,
  fieldList,
  contextMenuType
} from '@/assets/resources/asset'
import { tooltip } from '@/assets/resources/common'
import { typeForm } from '@/assets/resources/dialog'
import { actionData } from '@/assets/resources/other'
import { types, eventBus, keys } from '@/assets/resources/common'

//////////////////////Table////////////////////////

/**
 * The store object.
 * @type {import('vuex').Store}
 * Creatd by: NTLam (15/8/2023)
 */
const store = useStore()

/**
 * The emitter object.
 * @type {import('vue').Emitter}
 * Creatd by: NTLam (15/8/2023)
 */
const emitter = useEmitter()

/**
 * The current language of the application.
 * @type {import('vue').ComputedRef<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const lang = computed(() => store.state.lang)

/**
 * MISATable component props.
 * @typedef {Object} MISATableProps
 * @property {number} size - The number of records to display per page.
 * @property {number} page - The current page number.
 * @property {string} search - The search string.
 * @property {string} did - The department ID.
 * @property {string} facid - The fixed asset category ID.
 * Creatd by: NTLam (15/8/2023)
 */

const props = defineProps({
  size: {
    type: Number,
    default: 20
  },
  page: {
    type: Number,
    default: 1
  },
  search: {
    type: String,
    default: ''
  },
  did: {
    type: String,
    default: ''
  },
  facid: {
    type: String,
    default: ''
  }
})

/**
 * Chức năng: Khai báo các cột của table
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const columnFields = [
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
    id: 3,
    field: fieldList.FIXED_ASSET_CATEGORY_NAME,
    label: labelAsset[lang.value].FIXED_ASSET_CATEGORY_NAME,
    type: 'string'
  },
  {
    id: 4,
    field: fieldList.DEPARTMENT_NAME,
    label: labelAsset[lang.value].DEPARTMENT_NAME,
    type: 'string'
  },
  {
    id: 5,
    field: fieldList.QUANTITY,
    label: labelAsset[lang.value].QUANTITY,
    type: 'number',
    position: 'right'
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
    label: labelAsset[lang.value].HMKH,
    type: 'number',
    position: 'right',
    tooltip: tooltip[lang.value].HMKH
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
 * Ref của table
 * @type {import('vue').Ref<HTMLDivElement>}
 * Creatd by: NTLam (15/8/2023)
 */
const tableRef = ref(null)

/**
 * Represents a table component with data.
 * @typedef {Object} MISATable
 * @property {Array} data - The data displayed in the table.
 * Creatd by: NTLam (15/8/2023)
 */
const data = ref([])

/**
 * Indicates whether the table is currently loading data or not.
 * @type {Ref<boolean>}
 * Creatd by: NTLam (15/8/2023)
 */
const isSelectPageToGo = ref(false)

////////////////////////////////////////////

/**
 * Indicates whether the table is currently loading data or not.
 * @type {Ref<boolean>}
 * Creatd by: NTLam (15/8/2023)
 */
const loading = ref({
  data: false,
  page: false,
  size: false,
  total: false,
  export: false,
  department: false,
  fixedAssetCategory: false
})

//////////////////////Search and filter////////////////////////

/**
 * The total number of records in the MISATable component.
 * @type {Ref<number>}
 * Creatd by: NTLam (15/8/2023)
 */
const totalRecord = ref(0)

/**
 * An array of departments
 * @type {Ref<Array>}
 * Creatd by: NTLam (15/8/2023)
 */
const departments = ref([])

/**
 * An array of fixed asset categories.
 * @type {Ref<Array>}
 * Creatd by: NTLam (15/8/2023)
 */
const fixedAssetCategories = ref([])

//////////////////////////////////////////////////////////////////

/**
 * Trạng thái của popover export và import
 * @type {Ref<boolean>}
 * Creatd by: NTLam (15/8/2023)
 */
const exportPopover = ref(false)

/**
 * Dialog props
 * @type {Ref<Object>}
 * Creatd by: NTLam (15/8/2023)
 */
const dialogProps = ref({
  open: false,
  title: '',
  content: ''
})
///////////////////////////////// Dialog From/////////////////////////////////////

/**
 * A reactive reference to a boolean value indicating whether the form is open or not.
 * Creatd by: NTLam (15/8/2023)
 */
const open = ref(false)

/**
 * A reactive reference to a boolean value indicating whether the excel editer is open or not.
 * Creatd by: NTLam (15/8/2023)
 */
const openExcelEditer = ref(false)

/**
 * The type of the popup ('add' or 'change').
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const typeDialog = ref('add')

/**
 * The selected asset ID.
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const selectedAssetId = ref('')

//////////////////////////////////////////////////////////////////////////////////////

/**
 * A boolean ref that represents whether all rows in the table are selected or not.
 * Creatd by: NTLam (15/8/2023)
 */
const selectAll = ref(false)

/**
 * The ID of the currently selected item in the MISATable component.
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const selectedId = ref('')

/**
 * The maximum number of rows that can be displayed in the table.
 * @type {Ref<number>}
 * Creatd by: NTLam (15/8/2023)
 */
const maxRowTableShow = ref(0)

/////////////////////////////////////Context menu///////////////////////////////////////

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
    id: contextMenuType.ADD,
    text: contextMenu[lang.value].ADD,
    divider: true,
    click: () => {
      openAssetDialog(typeForm.ADD)
    }
  },
  {
    id: contextMenuType.EDIT,
    text: contextMenu[lang.value].EDIT,
    divider: true,
    click: () => {
      openAssetDialog(typeForm.EDIT, selectedId.value)
    }
  },
  {
    id: contextMenuType.DELETE,
    text: contextMenu[lang.value].DELETE,
    divider: true,
    click: () => {
      startOpenDialog('delete')
    }
  },
  {
    id: contextMenuType.DUPLICATE,
    text: contextMenu[lang.value].DUPLICATE,
    click: () => {
      openAssetDialog(typeForm.DUPLICATE, selectedId.value)
    }
  },
  {
    id: contextMenuType.UNSELECT_ALL,
    text: contextMenu[lang.value].UNSELECT_ALL,
    click: () => {
      removeAllRow()
      selectAll.value = false
      selectedId.value = ''
      hideContextMenu()
    }
  }
])

onBeforeRouteUpdate((to, from) => {
  console.log(from.params)
})

//////////////////////////////////////////////////////////////////////////////////////

/**
 * Shows the context menu with the given event and items.
 * @param {Event} event - The event that triggered the context menu.
 * Creatd by: NTLam (15/8/2023)
 */
const showContextMenu = (event) => {
  mymenu.value.show(event, items.value)
}

/**
 * Hides the context menu and removes focus from all items in the table.
 * Creatd by: NTLam (15/8/2023)
 */
const hideContextMenu = () => {
  mymenu.value.hide()
}

/////////////////////////////////////Value computed///////////////////////////////////////

/**
 * Computes the number of pages for the MISATable component.
 * @computed numberOfPage
 * @returns {number} The number of pages.
 */
const numberOfPage = computed(() => {
  return Math.ceil(totalRecord.value / props.size)
})

/**
 * Tính danh sách các trang hiển thị
 * Creatd by: NTLam (15/8/2023)
 */
const listPages = computed(() => {
  const list = []
  for (let i = 1; i <= numberOfPage.value; i++) {
    list.push(i)
  }
  return list
})

/**
 * Tính tổng số lượng tài sản trong trang hiện tại
 * Creatd by: NTLam (15/8/2023)
 */
const countAllAssetsInPage = computed(() => {
  let count = 0
  data.value.forEach((item) => {
    count += item.quantity || 0
  })
  return count
})

/**
 * Tính tổng nguyên giá tài sản trong trang hiện tại
 * Creatd by: NTLam (15/8/2023)
 */
const countAllPricesInPage = computed(() => {
  let count = 0
  data.value.forEach((item) => {
    count += item.cost || 0
  })
  return count
})

/**
 * Tính tổng HM/KH lũy kế tài sản trong trang hiện tại
 * Creatd by: NTLam (15/8/2023)
 */
const countAllHmKm = computed(() => {
  let count = 0
  data.value.forEach((item) => {
    count += item.hmkh || 0
  })
  return count
})

/**
 * Tính tổng giá trị còn lại tài sản trong trang hiện tại
 * Creatd by: NTLam (15/8/2023)
 */
const countAllRemainingValue = computed(() => {
  let count = 0
  data.value.forEach((item) => {
    count += item.remainingValue || 0
  })
  return count
})

/**
 * Hành động cho dialog thông báo
 * Creatd by: NTLam (15/8/2023)
 */
const actionDialog = computed(() => {
  return {
    changeTitle: (title) => {
      dialogProps.value.title = title
    },
    showDialog: () => {
      dialogProps.value.open = true
    },
    changeContent: (value) => {
      dialogProps.value.content = value
    },
    hideDialog: () => {
      dialogProps.value.open = false
    }
  }
})

/////////////////////////////////////Function///////////////////////////////////////

/**
 * Fetches data asynchronously.
 * @returns {Promise} A promise that resolves with the fetched data.
 * Creatd by: NTLam (15/8/2023)
 */
const fetchData = async () => {
  console.log('Fetch')
  // set loading

  loading.value.data = true
  tableRef.value.scrollTop = 0
  const response = await fixedAssetApi
    .getFilter({
      pageSize: props.size,
      pageNumber: props.page,
      filterString: removeVietnameseDiacritics(props.search),
      departmentIds: props.did,
      fixedAssetCategoryIds: props.facid
    })
    .finally(() => {
      setTimeout(() => (loading.value.data = false), 0)
      selectedId.value = ''
      loading.value.total = false
      loading.value.page = false
      selectAll.value = false
    })
  if (response) {
    if (response.data.length > 0) {
      data.value = response.data.map((item) => {
        const yearUsed = 1
        // item.productionYear ? currentYear - item.productionYear : 0
        const hmkh = parseInt(
          (parseInt(item.cost) * yearUsed * parseFloat(item.depreciationRate)) / 100
        )
        return {
          ...item,
          isChecked: false,
          hmkh: hmkh,
          remainingValue: parseInt(item.cost) - hmkh
        }
      })
    } else {
      data.value = []
      if (props.page > 1) {
        router.replace({ query: { ...router.currentRoute.value.query, page: 1 } })
      }
    }
    totalRecord.value = response.totalRecord || 0
  }
}

/**
 * Chức năng: Thêm chức năng resize cho table
 * Creatd by: NTLam (15/8/2023)
 */
onMounted(async () => {
  loading.value.total = true
  loading.value.page = true
  loading.value.department = true
  loading.value.fixedAssetCategory = true
  // get data
  fetchData()

  // get max row table show
  const tbodyHeight = document.querySelector('.table').offsetHeight - 38 - 40
  maxRowTableShow.value = tbodyHeight % 40 === 0 ? tbodyHeight / 40 : tbodyHeight / 40 + 1
  // get data for filter
  const departmentResponse = await departmentApi.getAll().finally(() => {
    loading.value.department = false
  })
  if (departmentResponse) {
    departments.value = departmentResponse
  }
  const fixedAssetCategoryResponse = await fixedAssetCategoryApi.getAll().finally(() => {
    loading.value.fixedAssetCategory = false
  })
  if (fixedAssetCategoryResponse) {
    fixedAssetCategories.value = fixedAssetCategoryResponse
  }

  // add event listener for escape key and click outside context menu
  document.addEventListener('click', hideContextMenu)
})

/**
 * Chức năng: Xóa event listener khi component unmounted
 * Creatd by: NTLam (15/8/2023)
 */
onUnmounted(() => {
  // remove event listener for escape key and click outside context menu
  document.removeEventListener('click', hideContextMenu)
})

/**
 * Chức năng: Lấy dữ liệu khi có sự thay đổi về page, size, search, did, facid
 * Creatd by: NTLam (15/8/2023)
 */
watch(
  () => [props.page, props.size, props.search, props.did, props.facid],
  async () => {
    await fetchData()
  }
)

/**
 * Chức năng: Nếu trang hiện tại lớn hơn tổng số trang thì chuyển về trang đầu tiên
 * Creatd by: NTLam (15/8/2023)
 */
watch(totalRecord, () => {
  if ((props.page - 1) * props.size > totalRecord.value) {
    router.replace({ query: { ...router.currentRoute.value.query, page: 1 } })
  }
})

const emptyData = computed(() => {
  const list = []
  const length = props.size - data.value.length
  if (length > 0) {
    for (let i = 1; i <= length; i++) {
      list.push(i)
    }
  }
  return list
})

/**
 * Chức năng: Danh sách các id được chọn
 * Creatd by: NTLam (15/8/2023)
 */
const selectedIds = computed(() => {
  return data.value.filter((item) => item.isChecked).map((item) => item.fixedAssetId)
})

/**
 * Chức năng: Thay đổi số trang hiện tại
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const changePage = (page) => {
  if (page === '...' || page == props.page) return
  if ((parseInt(page) - 1) * props.size > totalRecord.value) {
    router.replace({ query: { ...router.currentRoute.value.query, page: 1 } })
  } else router.replace({ query: { ...router.currentRoute.value.query, page } })
}

/**
 * Chức năng: Thay đổi số bản ghi hiển thị trên 1 trang
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const changeStatusSelectPageToGo = (value) => {
  if (value) {
    isSelectPageToGo.value = true
  } else {
    isSelectPageToGo.value = false
  }
}

/**
 * Chức năng: Tăng hoặc giảm số trang hiện tại
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const increaseOrDecreasePage = (type) => {
  if (type === types.INCREASE) {
    if (props.page < numberOfPage.value) {
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

/**
 * Chức năng: Tạo danh sách các trang hiển thị
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const pagingList = computed(() => {
  const list = []
  if (numberOfPage.value <= 7) {
    for (let i = 1; i <= numberOfPage.value; i++) {
      list.push(i)
    }
  } else {
    if (props.page <= 4) {
      list.push(1, 2, 3, 4, 5, '...', numberOfPage.value)
    } else if (props.page >= numberOfPage.value - 4) {
      list.push(1, '...', numberOfPage.value - 4, numberOfPage.value - 3, numberOfPage.value - 2)
      list.push(numberOfPage.value - 1, numberOfPage.value)
    } else {
      list.push(1, '...')
      list.push(props.page - 1, props.page, props.page + 1)
      list.push('...', numberOfPage.value)
    }
  }
  return list
})

/**
 * Chức năng: Khi nhấn shift + click vào 1 hàng thì sẽ chọn tất cả các hàng từ hàng đầu tiên được chọn đến hàng đang được click
 * Creatd by: NTLam (15/8/2023)
 */
const onPressShiftAndClick = (id) => {
  let index = data.value.findIndex((item) => item.fixedAssetId === id)
  let firstIndex = data.value.findIndex(
    (item) => item.isChecked === true && item.fixedAssetId !== id
  )
  if (firstIndex === -1) {
    data.value[index].isChecked = true
  } else {
    if (index < firstIndex) {
      for (let i = index; i <= firstIndex; i++) {
        data.value[i].isChecked = true
      }
    } else if (index > firstIndex) {
      for (let i = firstIndex; i <= index; i++) {
        data.value[i].isChecked = true
      }
    }
  }
}

/**
 * Removes the selected row from the MISATable component.
 * @function removeSelectRow
 * @returns {void}
 * Creatd by: NTLam (15/8/2023)
 */
const removeSelectRow = () => {
  if (!dialogProps.value.open) {
    selectedId.value = ''
  }
}

/**
 * Chức năng: Xóa tất cả các hàng đã được chọn
 * Creatd by: NTLam (15/8/2023)
 */
const removeAllRow = () => {
  if (data.value.length > 0) {
    data.value.forEach((item) => {
      item.isChecked = false
    })
  }
}

/**
 * Chức năng: Khi nhấn vào checkbox ở hàng đầu tiên thì sẽ chọn tất cả các hàng
 * Creatd by: NTLam (15/8/2023)
 */
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
  if (selectAll.value) {
    data.value.forEach((item) => {
      item.isChecked = true
    })
  } else {
    removeAllRow()
  }
}

/**
 * Chức năng: Khi nhấn vào checkbox ở hàng thứ i thì sẽ chọn hàng thứ i hoặc hủy chọn
 * Creatd by: NTLam (15/8/2023)
 */
const toggleSelectRow = (id) => {
  let index = data.value.findIndex((item) => item.fixedAssetId === id)
  data.value[index].isChecked = !data.value[index].isChecked
}

/**
 * Opens the asset dialog based on the type and id.
 * @param {string} type - The type of the dialog ('add' or 'change').
 * @param {number} id - The id of the asset to be edited (only used if type is 'change').
 * @emits changeTitle - Emits an event to change the title of the dialog.
 * @emits showPopup - Emits an event to show the dialog.
 * Creatd by: NTLam (15/8/2023)
 */
const openAssetDialog = (type, id) => {
  typeDialog.value = type
  if (id) {
    selectedAssetId.value = id
  } else {
    selectedAssetId.value = ''
  }
  open.value = true
}

/**
 * Deletes an asset with the given id.
 * @param {number} id - The id of the asset to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the asset is deleted.
 * Creatd by: NTLam (15/8/2023)
 */
const deleteAsset = async (id) => {
  const isDeleteAllPage = data.value.length === 1 && props.page === numberOfPage.value
  loading.value.data = true
  const response = await fixedAssetApi.delete(id).finally(() => {
    dialogProps.value.open = false
    loading.value.data = false
    fetchData()
  })
  if (response) {
    if (isDeleteAllPage) {
      router.replace({ query: { ...router.currentRoute.value.query, page: props.page - 1 } })
      return
    }
    if (selectAll.value) selectAll.value = false
  }
}

/**
 * Deletes multiple items from the table.
 * @async
 * @function deleteMulti
 * @returns {Promise<void>}
 * Creatd by: NTLam (15/8/2023)
 */
const deleteMulti = async () => {
  const isDeleteAllPage =
    selectedIds.value.length === data.value.length && props.page === numberOfPage.value
  const response = await fixedAssetApi.deleteMany(selectedIds.value).finally(() => {
    fetchData()
    dialogProps.value.open = false
    loading.value.data = false
  })
  if (response) {
    if (isDeleteAllPage) {
      router.replace({ query: { ...router.currentRoute.value.query, page: props.page - 1 } })
      return
    }
    if (selectAll.value) selectAll.value = false
  }
}

/**
 * Function that starts opening a dialog of a given type.
 * @param {string} type - The type of dialog to open.
 * Creatd by: NTLam (15/8/2023)
 */
const startOpenDialog = (type) => {
  //const titleDialogDelete = dialogResource[lang.value].LABEL_DIALOG.DELETE

  const dataSelectLength = selectedIds.value.length

  const idSelected = selectedId.value

  const contentDeleteOne = (asset) => {
    const deletor = message[lang.value].DELETE.DELETE_ONE
    return deletor(asset.fixedAssetCode, asset.fixedAssetName)
  }
  const contentDeleteMany = (count) => {
    const deletor = message[lang.value].DELETE.DELETE_MANY
    return deletor(count)
  }

  if (type === types.DELETE) {
    const isSelectedIdSelected = selectedIds.value.includes(selectedId.value)

    if (idSelected && !isSelectedIdSelected) {
      const selectedData = data.value.find((item) => item.fixedAssetId === idSelected)
      actionDialog.value.changeContent(contentDeleteOne(selectedData))
    } else if (dataSelectLength === 1) {
      const selectedData = data.value.find((item) => item.fixedAssetId === selectedIds.value[0])
      actionDialog.value.changeContent(contentDeleteOne(selectedData))
    } else if (dataSelectLength > 1) {
      actionDialog.value.changeContent(contentDeleteMany(dataSelectLength))
    } else {
      emitter.emit(eventBus.TOAST_MESSAGE, {
        type: types.WARNING,
        message: message[lang.value].DELETE.NO_SELECT
      })
      return
    }
  } else if (type === types.DELETE_MULTI) {
    if (dataSelectLength === 0) {
      emitter.emit(eventBus.TOAST_MESSAGE, {
        type: 'warning',
        message: message[lang.value].DELETE.NO_SELECT
      })
      return
    } else if (dataSelectLength === 1) {
      const selectedData = data.value.find((item) => item.fixedAssetId === selectedIds.value[0])
      actionDialog.value.changeContent(contentDeleteOne(selectedData))
    } else {
      actionDialog.value.changeContent(contentDeleteMany(dataSelectLength))
    }
  } else if (type === types.CANCEL_CREATE) {
    actionDialog.value.changeContent(message[lang.value].CLOSE.CANCEL_CREATE)
  }
  dialogProps.value.open = true
}

/**
 * Opens a dialog for user agreement.
 * @async
 * @param {string} type - The type of agreement to be displayed.
 * Creatd by: NTLam (15/8/2023)
 */
const startAgreeDialog = async (type) => {
  if (type === types.DELETE && selectedId.value) {
    if (selectedIds.value.includes(selectedId.value)) {
      await deleteMulti().then(() => (selectedId.value = ''))
    } else {
      await deleteAsset(selectedId.value).then(() => (selectedId.value = ''))
    }
  } else if (type === types.DELETE) {
    if (selectedIds.value.length === 0) return
    if (selectedIds.value.length === 1) {
      await deleteAsset(selectedIds.value[0])
    } else {
      await deleteMulti()
    }
  } else {
    actionDialog.value.hideDialog()
  }
}

/**
 * Closes the dialog delete.
 * Creatd by: NTLam (15/8/2023)
 */
const closeDialog = () => {
  dialogProps.value.open = false
  selectedId.value = ''
}

/**
 * Function that handles right-click event on a row in the MISATable component.
 * @param {Event} event - The right-click event.
 * @param {string} id - The id of the row that was right-clicked.
 * Creatd by: NTLam (15/8/2023)
 */
const rightClickARow = (event, id) => {
  if (!selectedIds.value || selectedIds.value.length === 0 || !selectedIds.value.includes(id)) {
    selectedId.value = id
  }
  showContextMenu(event)
}

/**
 * Handles the logic for when a row is clicked once.
 * @param {string} id - The ID of the clicked row.
 * Creatd by: NTLam (15/8/2023)
 */
const oneClickRow = (id) => {
  if (!selectedIds.value || selectedIds.value.length === 0 || !selectedIds.value.includes(id)) {
    selectedId.value = id
  }
}

/**
 * Handles the keydown event on the MISATable component.
 *
 * @param {Event} event - The keydown event.
 * Creatd by: NTLam (15/8/2023)
 */
const onKeyDownTable = (event) => {
  if (!isSelectPageToGo.value) event.preventDefault()

  const id = selectedId.value
  if (id) {
    const index = data.value.findIndex((item) => item.fixedAssetId === id)
    if (event.key === keys.ARROW_DOWN) {
      if (index < data.value.length - 1) {
        selectedId.value = data.value[index + 1].fixedAssetId
      }
    } else if (event.key === keys.ARROW_UP) {
      if (index > 0) {
        selectedId.value = data.value[index - 1].fixedAssetId
      }
    } else if (event.keyCode === 32) {
      toggleSelectRow(id)
    }

    if (event.key === keys.DELETE) startOpenDialog(types.DELETE_MULTI)
  }
}

/**
 * Function that is called when the mouse leaves the context.
 * Creatd by: NTLam (15/8/2023)
 */
const onMouseLeaveContext = () => {
  if (!dialogProps.value.open) {
    selectedId.value = ''
  }
  hideContextMenu()
}

/**
 * Closes the popup.
 * Creatd by: NTLam (15/8/2023)
 */
const closePopup = () => {
  open.value = false
}

/**
 * Vue directive that detects clicks outside the element.
 * @name vClickOutside
 * @type {Object}
 * @property {Object} bind - Called once, when the directive is first bound to the element.
 * @property {Object} unbind - Called once, when the directive is unbound from the element.
 * @property {Object} inserted - Called when the bound element has been inserted into its parent node (this is not guaranteed to be called only once).
 * Creatd by: NTLam (15/8/2023)
 */
const vClickOutside = {
  mounted: function (el, binding) {
    el.ClickOutsideHandler = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.ClickOutsideHandler)
  },
  unmounted: function (el) {
    document.body.removeEventListener('click', el.ClickOutsideHandler)
  }
}

/**
 * Computed property that returns the selected department.
 * @computed departmentSelected
 * @memberof MISATable
 * @returns {Object} The selected department object.
 */
const departmentSelected = computed(() => {
  if (props.did) {
    const list = props.did.split(',')
    const department = departments.value.filter((item) => list.includes(item.departmentId))
    if (department.length > 0) return department.map((item) => item.departmentName).join(',')
    else return ''
  } else return ''
})

/**
 * Computed property that returns the selected fixed asset category.
 * @computed fixedAssetCategorySelected
 * @memberof MISATable
 * @returns {Object} The selected fixed asset category.
 */
const fixedAssetCategorySelected = computed(() => {
  if (props.facid) {
    const list = props.facid.split(',')
    const fixedAssetCategory = fixedAssetCategories.value.filter((item) =>
      list.includes(item.fixedAssetCategoryId)
    )
    if (fixedAssetCategory.length > 0)
      return fixedAssetCategory.map((item) => item.fixedAssetCategoryName).join(',')
    else return ''
  } else return ''
})

/**
 * Defines a function that handles form actions.
 * @param {string} type - The type of action to be performed.
 * @param {string} message - The message to be displayed after the action is performed.
 */
const actionOfForm = (type) => {
  if (type !== types.ERROR) {
    const isNowNotPageOne = props.page !== 1
    router.replace({ query: { ...router.currentRoute.value.query, page: 1 } })
    if (!isNowNotPageOne) fetchData()
  }
}
////////////////////////////////Filter action//////////////////////////////////////

/**
 * Changes the department ID.
 * @param {any} value - The new value for the department ID.
 */
const changeDepartmentId = (value) => {
  if (value) {
    const list = value.split(',')
    const department = departments.value.filter((item) => list.includes(item.departmentName))
    if (department.length > 0)
      router.push({
        query: {
          ...router.currentRoute.value.query,
          did: department.map((item) => item.departmentId).join(',')
        }
      })
    else
      router.replace({
        query: { ...getObjectIgnoreField(router.currentRoute.value.query, ['did']) }
      })
  } else {
    router.replace({ query: { ...getObjectIgnoreField(router.currentRoute.value.query, ['did']) } })
  }
}

/**
 * A function that changes the fixed asset category ID.
 * @param {any} value - The value to be passed to the function.
 */
const changeFixedAssetCategoryId = (value) => {
  if (value) {
    const list = value.split(',')
    const fixedAssetCategory = fixedAssetCategories.value.filter((item) =>
      list.includes(item.fixedAssetCategoryName)
    )
    if (fixedAssetCategory.length > 0)
      router.push({
        query: {
          ...router.currentRoute.value.query,
          facid: fixedAssetCategory.map((item) => item.fixedAssetCategoryId).join(',')
        }
      })
    else {
      router.replace({
        query: { ...getObjectIgnoreField(router.currentRoute.value.query, ['facid']) }
      })
    }
  } else {
    router.replace({
      query: { ...getObjectIgnoreField(router.currentRoute.value.query, ['facid']) }
    })
  }
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

///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////Export/Import Excel/////////////////////////////////
/**
 * Function that starts loading the export process.
 * Creatd by: NTLam (15/8/2023)
 */
const startLoadingExport = () => {
  loading.value.export = true
}

/**
 * Export data to Excel file.
 * @async
 * @function exportExcel
 * @memberof module:MISATable
 * @returns {Promise<void>}
 * Creatd by: NTLam (15/8/2023)
 */
const exportExcel = async () => {
  exportPopover.value = false
  const filter = {}
  if (props.search) filter.filterString = removeVietnameseDiacritics(props.search)
  if (props.did) filter.departmentIds = props.did
  if (props.facid) filter.fixedAssetCategoryIds = props.facid
  const response = await fixedAssetApi.exportExcel(filter, startLoadingExport).finally(() => {
    loading.value.export = false
  })
  if (response) {
    emitter.emit(eventBus.TOAST_MESSAGE, {
      type: types.SUCCESS,
      message: excel[lang.value].exportSuccess
    })
  }
}

/**
 * Function to hide the export popover.
 * @function hideExportPopover
 * @memberof MISATable
 * @returns {void}
 * Creatd by: NTLam (15/8/2023)
 */
const hideExportPopover = () => {
  exportPopover.value = false
}

/**
 * Handles the event when the user chooses an Excel file.
 * @param {Event} event - The event object.
 * Creatd by: NTLam (15/8/2023)
 */
const onOpenExcelEditer = () => {
  openExcelEditer.value = true
}

/**
 * Handles the event when the user closes the Excel editor.
 * Creatd by: NTLam (15/8/2023)
 */
const onCloseExcelEditer = () => {
  openExcelEditer.value = false
}

/**
 * Handles the data from the Excel file.
 * @param {Array} data - The data from the Excel file.
 * Creatd by: NTLam (15/8/2023)
 */
const handleDataExcel = async (data) => {
  loading.value.export = true
  if (data && data.length > 0) {
    const list = []
    for (let item of data) {
      const department = departments.value.find((i) => i.departmentCode === item.departmentCode)
      if (!department) {
        console.log(item.departmentCode)
        emitter.emit(eventBus.TOAST_MESSAGE, {
          type: types.ERROR,
          message: actionData[lang.value].NOT_FOUND_DEPARTMENT_CODE(item.departmentCode)
        })
        loading.value.export = false
        return
      }
      const fixedAssetCategory = fixedAssetCategories.value.find(
        (i) => i.fixedAssetCategoryCode === item.fixedAssetCategoryCode
      )
      if (!fixedAssetCategory) {
        emitter.emit(eventBus.TOAST_MESSAGE, {
          type: types.ERROR,
          message: actionData[lang.value].NOT_FOUND_FIXED_ASSET_CATEGORY_CODE(
            item.fixedAssetCategoryCode
          )
        })
        loading.value.export = false
        return
      }
      const obj = {
        ...item,
        departmentId: department.departmentId,
        fixedAssetCategoryId: fixedAssetCategory.fixedAssetCategoryId,
        departmentName: department.departmentName,
        fixedAssetCategoryName: fixedAssetCategory.fixedAssetCategoryName,
        purchaseDate: new Date(item.purchaseDate),
        quantity: parseInt(item.quantity),
        cost: parseInt(item.cost),
        lifeTime: parseInt(item.lifeTime),
        trackedYear: parseInt(item.trackedYear),
        depreciationRate: parseFloat(1 / item.lifeTime).toFixed(2)
      }
      list.push(obj)
    }
    if (list.length > 0) {
      const response = await fixedAssetApi.importMulti(list).finally(() => {
        loading.value.export = false
      })
      if (response) {
        onCloseExcelEditer()
        fetchData()
      }
    }
  }
}

const handleErrorExcel = (error) => {
  emitter.emit(eventBus.TOAST_MESSAGE, { type: types.ERROR, message: error })
  loading.value.export = false
}

//////////////////////////////////////////////////////////////////////////////////////
</script>

<template>
  <div class="table__container">
    <MISADialog
      v-if="dialogProps.open"
      :open="dialogProps.open"
      :content="dialogProps.content"
      :title="dialogProps.title"
      @agree-dialog="startAgreeDialog(types.DELETE)"
      @close-dialog="closeDialog"
    />
    <MISABackdrop zIndex="1001" v-if="loading.export" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <MISABackdrop zIndex="101" v-if="openExcelEditer" type="fullscreen">
      <MISAExcelEditer
        :departments="
          departments.map((item) => {
            return {
              key: item.departmentCode,
              value: item.departmentName
            }
          })
        "
        :fixedAssetCategories="
          fixedAssetCategories.map((item) => {
            return {
              key: item.fixedAssetCategoryCode,
              value: item.fixedAssetCategoryName
            }
          })
        "
        @close="onCloseExcelEditer"
        @get-data-from-excel="handleDataExcel"
        @error="handleErrorExcel"
      />
    </MISABackdrop>
    <header>
      <div class="div__filter">
        <MISASearch :value="props.search" @on-change="changeSearchString" />

        <MISASkeleton
          v-if="loading.fixedAssetCategory || fixedAssetCategories.length === 0"
          width="217.6px"
          height="36px"
        />
        <MISACombobox
          v-else
          zIndex="100"
          name="Loại tài sản"
          type="dropdown"
          width="150px"
          icon="icon-filter"
          multiple
          :options="fixedAssetCategories.map((item) => item.fixedAssetCategoryName)"
          @change-value="changeFixedAssetCategoryId"
          :default-value="fixedAssetCategorySelected"
          :placeholder="labelAsset[lang].FIXED_ASSET_CATEGORY"
        />
        <MISASkeleton
          v-if="loading.department || departments.length === 0"
          width="217.6px"
          height="36px"
        />
        <MISACombobox
          v-else
          name="Bộ phận sử dụng"
          zIndex="100"
          type="dropdown"
          width="150px"
          icon="icon-filter"
          multiple
          @change-value="changeDepartmentId"
          :options="departments.map((item) => item.departmentName)"
          :default-value="departmentSelected"
          :placeholder="labelAsset[lang].DEPARTMENT"
        />
      </div>
      <div class="div__action">
        <MISAButton @click="() => openAssetDialog('add')">
          <i class="fa-solid fa-plus" style="color: #ffffff"></i>
          {{ table[lang]['ADD_DATA'] }}
        </MISAButton>
        <div v-click-outside="hideExportPopover" class="div-excel">
          <ul v-if="exportPopover" class="div-excel_popover">
            <li @click="onOpenExcelEditer">{{ excel[lang].IMPORT_DATA }}</li>
            <li @click.stop="exportExcel">{{ excel[lang].EXPORT_DATA }}</li>
          </ul>
          <MISAButton
            @click="exportPopover = !exportPopover"
            :disabled="!data || data.length === 0"
            shadow
            width="36px"
            type="icon"
            ><i class="icon-excel"></i
          ></MISAButton>
        </div>
        <MISAButton
          width="36px"
          @click="() => startOpenDialog(types.DELETE_MULTI)"
          shadow
          type="icon"
          ><i class="icon-delete-red"></i
        ></MISAButton>
      </div>
    </header>
    <div
      tabindex="0"
      v-click-outside="removeSelectRow"
      @keydown="onKeyDownTable"
      class="table no-select"
      :class="[{ loading: loading.data, hide: data.length === 0 }]"
      ref="tableRef"
    >
      <MISABackdrop v-if="loading.data" type="fullparent" top="38px" bottom="40px">
        <MISALoading />
      </MISABackdrop>
      <MISABackdrop
        v-if="!loading.data && data.length === 0"
        backgroundColor="#fff"
        type="fullparent"
        top="39px"
        bottom="41px"
      >
        <h2>{{ table[lang]['NO_DATA'] }}</h2>
      </MISABackdrop>
      <table>
        <MISATableHeader
          :sticky="emptyData.length === 0"
          :columns="columnFields"
          hasCheckbox
          action
          :selected-all="selectAll"
          @check-all="toggleSelectAll"
        />
        <MISATableBody
          action
          hasCheckbox
          @double-click="toggleSelectRow"
          @click-ctrl="toggleSelectRow"
          @shift-click="onPressShiftAndClick"
          @context-menu="(event, id) => rightClickARow(event, id)"
          @select-row="toggleSelectRow"
          @change-dialog="(id) => openAssetDialog(typeForm.EDIT, id)"
          @duplicate-dialog="(id) => openAssetDialog(typeForm.DUPLICATE, id)"
          @click-focusing="oneClickRow"
          :selectedId="selectedId"
          :columnFields="columnFields"
          :data="data"
          :isShowEmpty="data.length < maxRowTableShow"
          :emptyData="data.length < maxRowTableShow ? emptyData : []"
        />
        <MISATableFooter
          action
          :totalRecord="totalRecord"
          :currentPage="props.page"
          :numberOfPage="numberOfPage"
          :numberOfRecordPerpage="props.size"
          :listPages="listPages"
          :pagingList="pagingList"
          :colspan="5"
          :loadingPage="loading.page"
          :loadingSize="loading.size"
          :loadingTotal="loading.total"
          @change-page="(v) => changePage(v)"
          @decrease="() => increaseOrDecreasePage(types.DECREASE)"
          @increase="() => increaseOrDecreasePage(types.INCREASE)"
          @change-record-per-page="(v) => changeRecordPerpage(v)"
          @is-selecting-page-to-go="changeStatusSelectPageToGo"
        >
          <td class="data__number">
            <b>{{ converStringToBigNumberString(countAllAssetsInPage) }}</b>
          </td>
          <td class="data__number">
            <b> {{ converStringToBigNumberString(countAllPricesInPage) }}</b>
          </td>
          <td class="data__number">
            <b> {{ converStringToBigNumberString(countAllHmKm) }}</b>
          </td>
          <td class="data__number">
            <b>{{ converStringToBigNumberString(countAllRemainingValue) }}</b>
          </td>
        </MISATableFooter>
      </table>
    </div>
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
    <AssetForm
      v-if="open && departments.length > 0 && fixedAssetCategories.length > 0"
      :assetId="selectedAssetId"
      :department="departments"
      :fixedAssetCategory="fixedAssetCategories"
      :open="open"
      @close="closePopup"
      :type="typeDialog"
      @action="actionOfForm"
    />
  </div>
</template>

<style scoped>
.table__container {
  transition: all 0.5s ease;
}

.div-excel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: auto;
  z-index: 100;
}

.div-excel_popover {
  position: absolute;
  top: calc(100% + 2px);
  right: 0;
  background: var(--color-white);
  height: auto;
  max-height: 300px;
  width: 100px;
  border-radius: var(--border-radius-size);
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0px 0px 0px 1px rgba(152, 63, 63, 0.2);
}

input[type='file'] {
  display: none;
}

label {
  cursor: pointer;
}

.div-excel_popover li {
  list-style: none;
  cursor: pointer;
  padding: 5px;
  border-radius: var(--border-radius-size);
}

.div-excel_popover li:hover {
  background: var(--color-item-selected);
}

.table__container:focus {
  outline: none;
  border: none;
}

.table {
  height: calc(100vh - var(--header-height) - 40px - 30px);
  position: relative;
  border-radius: var(--border-radius-size);
  box-shadow: 0px 0px 0px 1px rgba(152, 63, 63, 0.2);
  overflow: auto;
}

.table.hide {
  overflow-y: hidden !important;
}

.table:focus {
  outline: none;
  /* border: none; */
  border: 1px solid var(--color-primary);
}

.table.loading {
  /* overflow: hidden; */
  pointer-events: none;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 1px;
  background-color: transparent;
  height: 40px;
  margin-bottom: 10px;
  gap: 16px;
}
table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  position: relative;
  box-shadow: 1px 1px 1px 1px rgba(152, 63, 63, 0.2);
}

.div__filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  justify-items: stretch;
  gap: 16px;
}
.div__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 16px;
}
.no-select {
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* IE 10 and IE 11 */
  user-select: none;
  /* Standard syntax */
}
.data__number {
  text-align: right;
  padding: 0 16px 0 0;
}
</style>
