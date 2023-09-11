<script setup>
import MISASearch from '@/components/base/MISASearchBox.vue'
import MISAContextMenu from '@/components/base/MISAContextMenu.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { removeVietnameseDiacritics } from '@/helper/stringHelper'
import fixedAssetApi from '@/service/api/fixedAssetApi'
import MISATableHeader from '@/components/base/MISATableHeader.vue'
import MISATableBody from '@/components/base/MISATableBody.vue'
import MISATableFooter from '@/components/base/MISATableFooter.vue'
import MISAStack from '@/components/base/MISAStack.vue'
import AssetForm from '@/components/page/AssetForm.vue'
import fixedAssetCategoryApi from '@/service/api/fixedAssetCategoryApi'
import departmentApi from '@/service/api/departmentApi'
import { converStringToBigNumberString } from '@/helper/stringHelper.js'
import MISASkeleton from '@/components/base/MISASkeleton.vue'
import { onBeforeRouteUpdate } from 'vue-router'
import router from '@/router'

//////////////////////Table////////////////////////

/**
 * MISATable component props.
 * @typedef {Object} MISATableProps
 * @property {number} size - The number of records to display per page.
 * @property {number} page - The current page number.
 * @property {string} search - The search string.
 * @property {string} did - The department ID.
 * @property {string} facid - The fixed asset category ID.
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
    field: 'fixedAssetCode',
    label: 'Mã tài sản',
    type: 'string',
    canSort: true
  },
  {
    id: 2,
    field: 'fixedAssetName',
    label: 'Tên tài sản',
    type: 'string'
  },
  {
    id: 3,
    field: 'fixedAssetCategoryName',
    label: 'Loại tài sản',
    type: 'string'
  },
  {
    id: 4,
    field: 'departmentName',
    label: 'Bộ phận sử dụng',
    type: 'string'
  },
  {
    id: 5,
    field: 'quantity',
    label: 'Số lượng',
    type: 'number'
  },
  {
    id: 6,
    field: 'cost',
    label: 'Nguyên giá',
    type: 'number'
  },
  {
    id: 7,
    field: 'hmkm',
    label: 'HM/KH lũy kế',
    type: 'number',
    tooltip: 'Hao mòn / Khấu hao lũy kế'
  },
  {
    id: 8,
    field: 'remainingValue',
    label: 'Giá trị còn lại',
    type: 'number'
  }
]

/**
 * A reactive reference to the table element.
 * @type {Ref<HTMLElement>}
 * Creatd by: NTLam (15/8/2023)
 */
const tableRef = ref(null)

/**
 * Represents a table component with data.
 * @typedef {Object} MISATable
 * @property {Array} data - The data displayed in the table.
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
 */
const loading = ref({
  data: false,
  page: false,
  size: false,
  total: false,
  export: false
})

//////////////////////Search and filter////////////////////////

/**
 * The total number of records in the MISATable component.
 * @type {Ref<number>}
 */
const totalRecord = ref(0)

/**
 * An array of departments
 * @type {Ref<Array>}
 */
const departments = ref([])

/**
 * An array of fixed asset categories.
 * @type {Ref<Array>}
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
 */
const dialogProps = ref({
  open: false,
  title: '',
  content: ''
})
///////////////////////////////// Dialog From/////////////////////////////////////

/**
 * A reactive reference to a boolean value indicating whether the table is open or not.
 * Creatd by: NTLam (15/8/2023)
 */
const open = ref(false)

/**
 * The type of the popup ('add' or 'change').
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const typePopup = ref('add')

/**
 * The selected asset ID.
 * @type {Ref<string>}
 * Creatd by: NTLam (15/8/2023)
 */
const selectedAssetId = ref('')

//////////////////////////////////////////////////////////////////////////////////////

//Toast message
/**
 * This component defines a MISATable that can be used to display data in a table format.
 *
 * @typedef {Object} ToastMessage
 * @property {string} message - The message to be displayed in the toast.
 * @property {string} type - The type of the toast message (e.g. success, warning, error).
 * Creatd by: NTLam (15/8/2023)
 */
const toastMessages = ref([])

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
    id: 'add',
    text: 'Thêm',
    divider: true,
    click: () => {
      openAssetDialog('add')
    }
  },
  {
    id: 'detail',
    text: 'Sửa',
    divider: true,
    click: () => {
      openAssetDialog('change', selectedId.value)
    }
  },
  {
    id: 'delete',
    text: 'Xóa',
    divider: true,
    click: () => {
      startOpenDialog('delete')
    }
  },
  {
    id: 'duplicate',
    text: 'Nhân bản',
    click: () => {
      openAssetDialog('duplicate', selectedId.value)
    }
  },
  {
    id: 'select',
    text: 'Chọn',
    click: () => {
      toggleSelectRow(selectedId.value)
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
    count += item.hmkm || 0
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
  loading.value.data = true
  tableRef.value.scrollTop = 0
  await fixedAssetApi
    .getFilter({
      pageSize: props.size,
      pageNumber: props.page,
      filterString: removeVietnameseDiacritics(props.search),
      departmentId: props.did,
      fixedAssetCategoryId: props.facid
    })
    .then((res) => {
      data.value = res.data.data.map((item) => {
        const hmkm = parseInt(
          (parseInt(item.cost) * parseInt(item.lifeTime) * parseFloat(item.depreciationRate)) / 100
        )
        return {
          ...item,
          isChecked: false,
          hmkm: hmkm,
          remainingValue: parseInt(item.cost) - hmkm
        }
      })
      totalRecord.value = res.data.totalRecord || 0
    })
    .catch((e) => {
      console.log(e)
      addToastMessage('error', 'Tải dữ liệu thất bại. Kiểm tra kết nối mạng')
    })
    .finally(() => {
      setTimeout(() => (loading.value.data = false), 0)
      loading.value.total = false
      loading.value.page = false
      selectAll.value = false
    })
}

/**
 * Handles the keydown event when the escape key is pressed.
 * @param {Event} e - The keydown event object.
 * Creatd by: NTLam (15/8/2023)
 */
const pressEscape = (e) => {
  if (e.key === 'Escape') {
    open.value = false
  }
}

/**
 * Chức năng: Thêm chức năng resize cho table
 * Creatd by: NTLam (15/8/2023)
 */
onMounted(async () => {
  loading.value.total = true
  loading.value.page = true

  fetchData()

  const tbodyHeight = document.querySelector('.table').offsetHeight - 38 - 40
  maxRowTableShow.value = tbodyHeight % 40 === 0 ? tbodyHeight / 40 : tbodyHeight / 40 + 1
  // get data for filter
  const departmentResponse = await departmentApi.getAll()
  if (departmentResponse && departmentResponse.data) {
    departments.value = departmentResponse.data
  }
  const fixedAssetCategoryResponse = await fixedAssetCategoryApi.getAll()
  if (fixedAssetCategoryResponse && fixedAssetCategoryResponse.data) {
    fixedAssetCategories.value = fixedAssetCategoryResponse.data
  }

  // add event listener for escape key and click outside context menu
  document.addEventListener('keydown', pressEscape)
  document.addEventListener('click', hideContextMenu)
})

/**
 * Chức năng: Xóa event listener khi component unmounted
 * Creatd by: NTLam (15/8/2023)
 */
onUnmounted(() => {
  // remove event listener for escape key and click outside context menu
  document.removeEventListener('keydown', pressEscape)
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
  router.replace({ query: { ...router.currentRoute.value.query, page } })
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
  if (type === 'increase') {
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
    data.value.forEach((item) => {
      item.isChecked = false
    })
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
  typePopup.value = type
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
  await fixedAssetApi
    .delete(id)
    .then(() => {
      addToastMessage('success', 'Xóa thành công')
      if (isDeleteAllPage) {
        router.replace({ query: { ...router.currentRoute.value.query, page: props.page - 1 } })
        return
      }
      fetchData()
      if (selectAll.value) selectAll.value = false
    })
    .catch((e) => {
      console.log(e)
      addToastMessage('error', 'Xóa thất bại')
    })
    .finally(() => {
      dialogProps.value.open = false
      loading.value.data = false
    })
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
  await fixedAssetApi
    .deleteMany(selectedIds.value)
    .then(() => {
      addToastMessage('success', 'Xóa thành công')
      if (isDeleteAllPage) {
        router.replace({ query: { ...router.currentRoute.value.query, page: props.page - 1 } })
        return
      }
      fetchData()
      if (selectAll.value) selectAll.value = false
    })
    .catch((e) => {
      addToastMessage('error', 'Xóa thất bại')
      console.log(e)
    })
    .finally(() => {
      dialogProps.value.open = false
      loading.value.data = false
    })
}

/**
 * Function that starts opening a dialog of a given type.
 * @param {string} type - The type of dialog to open.
 * Creatd by: NTLam (15/8/2023)
 */
const startOpenDialog = (type) => {
  if (type === 'delete') {
    const isSelectedIdSelected = selectedIds.value.includes(selectedId.value)
    if (selectedId.value && !isSelectedIdSelected) {
      const selectedData = data.value.find((item) => item.fixedAssetId === selectedId.value)
      actionDialog.value.changeTitle('Xóa tài sản')
      actionDialog.value.changeContent(
        `Bạn có muốn xóa tài sản: ${selectedData.fixedAssetCode} - ${selectedData.fixedAssetName} không?`
      )
      dialogProps.value.open = true
    } else if (selectedIds.value.length === 1) {
      const selectedData = data.value.find((item) => item.fixedAssetId === selectedIds.value[0])
      //actionDialog.value.changeTitle('Xóa tài sản')
      actionDialog.value.changeContent(
        `Bạn có muốn xóa tài sản: ${selectedData.fixedAssetCode} - ${selectedData.fixedAssetName} không?`
      )
      dialogProps.value.open = true
    } else if (selectedIds.value.length > 1) {
      actionDialog.value.changeTitle('Xóa tài sản')
      actionDialog.value.changeContent(`Bạn có muốn xóa ${selectedIds.value.length} tài sản không?`)
      dialogProps.value.open = true
    } else {
      addToastMessage('error', 'Chưa chọn tài sản để xóa')
    }
  } else if (type === 'delete-multi') {
    if (selectedIds.value.length === 0) {
      addToastMessage('error', 'Chưa chọn tài sản để xóa')
    } else if (selectedIds.value.length === 1) {
      const selectedData = data.value.find((item) => item.fixedAssetId === selectedIds.value[0])
      //actionDialog.value.changeTitle('Xóa tài sản')
      actionDialog.value.changeContent(
        `Bạn có muốn xóa tài sản: ${selectedData.fixedAssetCode} - ${selectedData.fixedAssetName} không?`
      )
      dialogProps.value.open = true
    } else {
      actionDialog.value.changeTitle('Xóa tài sản')
      actionDialog.value.changeContent(`Bạn có muốn xóa ${selectedIds.value.length} tài sản không?`)
      dialogProps.value.open = true
    }
  } else if (type === 'cancel-create') {
    actionDialog.value.changeContent('Bạn có muốn hủy bỏ khai báo tài sản không?')
    dialogProps.value.open = true
  }
}

/**
 * Opens a dialog for user agreement.
 * @async
 * @param {string} type - The type of agreement to be displayed.
 * Creatd by: NTLam (15/8/2023)
 */
const startAgreeDialog = async (type) => {
  if (type === 'delete' && selectedId.value) {
    if (selectedIds.value.includes(selectedId.value)) {
      await deleteMulti().then(() => (selectedId.value = ''))
    } else {
      await deleteAsset(selectedId.value).then(() => (selectedId.value = ''))
    }
  } else if (type === 'delete') {
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
    if (event.key === 'ArrowDown') {
      if (index < data.value.length - 1) {
        selectedId.value = data.value[index + 1].fixedAssetId
      }
    } else if (event.key === 'ArrowUp') {
      if (index > 0) {
        selectedId.value = data.value[index - 1].fixedAssetId
      }
    } else if (event.key === 'Enter') {
      toggleSelectRow(id)
    }

    if (event.key === 'Delete') startOpenDialog('delete-multi')
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
 * Adds a toast message to the MISATable component.
 *
 * @param {string} type - The type of the toast message (e.g. success, error, warning).
 * @param {string} message - The message to display in the toast.
 * Creatd by: NTLam (15/8/2023)
 */
const addToastMessage = (type, message) => {
  toastMessages.value.push({
    type,
    message
  })
  setTimeout(() => {
    toastMessages.value.shift()
  }, 5500)
}

/**
 * Removes the toast message at the specified index.
 * @param {number} index - The index of the toast message to remove.
 * Creatd by: NTLam (15/8/2023)
 */
const removeToastMessage = (index) => {
  toastMessages.value.splice(index, 1)
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
      if (
        !(
          el == event.target ||
          el.contains(event.target) ||
          event.target.className === 'select2-selection__choice__remove' ||
          event.target.className === 'select2-search__field'
        )
      ) {
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
    const department = departments.value.find((item) => item.departmentId === props.did)
    if (department) return department.departmentName
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
    const fixedAssetCategory = fixedAssetCategories.value.find(
      (item) => item.fixedAssetCategoryId === props.facid
    )
    if (fixedAssetCategory) return fixedAssetCategory.fixedAssetCategoryName
    else return ''
  } else return ''
})

/**
 * Defines a function that handles form actions.
 * @param {string} type - The type of action to be performed.
 * @param {string} message - The message to be displayed after the action is performed.
 */
const actionOfForm = (type, message) => {
  addToastMessage(type, message)
  if (type !== 'error') fetchData()
}
////////////////////////////////Filter//////////////////////////////////////

/**
 * Changes the department ID.
 * @param {any} value - The new value for the department ID.
 */
const changeDepartmentId = (value) => {
  if (value) {
    const department = departments.value.find((item) => item.departmentName === value)
    if (department)
      router.push({ query: { ...router.currentRoute.value.query, did: department.departmentId } })
    else router.push({ query: { ...router.currentRoute.value.query, did: null } })
  } else {
    router.push({ query: { ...router.currentRoute.value.query, did: null } })
  }
}

/**
 * A function that changes the fixed asset category ID.
 * @param {any} value - The value to be passed to the function.
 */
const changeFixedAssetCategoryId = (value) => {
  if (value) {
    const fixedAssetCategory = fixedAssetCategories.value.find(
      (item) => item.fixedAssetCategoryName === value
    )
    if (fixedAssetCategory)
      router.push({
        query: {
          ...router.currentRoute.value.query,
          facid: fixedAssetCategory.fixedAssetCategoryId
        }
      })
    else router.push({ query: { ...router.currentRoute.value.query, facid: null } })
  } else {
    router.push({ query: { ...router.currentRoute.value.query, facid: null } })
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
    router.push({ query: { ...router.currentRoute.value.query, search: null } })
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
  const response = await fixedAssetApi.exportExcel(startLoadingExport).finally(() => {
    loading.value.export = false
  })
  if (response && !response.data) {
    addToastMessage('error', response.response.data)
    return
  }
}

/**
 * Function to hide the export popover.
 * @function hideExportPopover
 * @memberof MISATable
 * @returns {void}
 */
const hideExportPopover = () => {
  exportPopover.value = false
}

/**
 * Handles the event when the user chooses an Excel file.
 * @param {Event} event - The event object.
 */
const handleChooseFileExcel = async (event) => {
  exportPopover.value = false
  loading.value.export = true
  const response = await fixedAssetApi.importExcel(event.target.files[0]).finally(() => {
    loading.value.export = false
  })
  if (response && response.data) {
    addToastMessage('success', 'Import thành công')
    fetchData()
  } else {
    addToastMessage('error', response.response.data)
  }
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
      @agree-dialog="startAgreeDialog('delete')"
      @close-dialog="closeDialog"
    />
    <MISABackdrop zIndex="101" v-if="loading.export" type="fullscreen">
      <MISALoading />
    </MISABackdrop>
    <header>
      <div class="div__filter">
        <MISASearch :value="props.search" @on-change="changeSearchString" />
        <MISASkeleton v-if="departments.length === 0" width="217.6px" height="36px" />
        <MISACombobox
          v-else
          zIndex="100"
          type="dropdown"
          width="150px"
          icon="icon-filter"
          @change-value="changeDepartmentId"
          :options="departments.map((item) => item.departmentName)"
          :default-value="departmentSelected"
          placeholder="Bộ phận sử dụng"
        />
        <MISASkeleton v-if="fixedAssetCategories.length === 0" width="217.6px" height="36px" />
        <MISACombobox
          v-else
          zIndex="100"
          type="dropdown"
          width="150px"
          icon="icon-filter"
          :options="fixedAssetCategories.map((item) => item.fixedAssetCategoryName)"
          @change-value="changeFixedAssetCategoryId"
          :default-value="fixedAssetCategorySelected"
          placeholder="Loại tài sản"
        />
      </div>
      <div class="div__action">
        <MISAButton @click="() => openAssetDialog('add')">
          <i class="fa-solid fa-plus" style="color: #ffffff"></i>
          Thêm tài sản
        </MISAButton>
        <div v-click-outside="hideExportPopover" class="div-excel">
          <ul v-if="exportPopover" class="div-excel_popover">
            <li>
              <label>
                <input @input="handleChooseFileExcel" type="file" accept=".xlsx" />Import
              </label>
            </li>
            <li @click.stop="exportExcel">Export</li>
          </ul>
          <MISAButton
            @click="exportPopover = !exportPopover"
            :disabled="!data || data.length === 0"
            shadow
            type="icon"
            ><i class="icon-excel"></i
          ></MISAButton>
        </div>
        <MISAButton @click="() => startOpenDialog('delete-multi')" shadow type="icon"
          ><i class="icon-delete-red"></i
        ></MISAButton>
      </div>
    </header>
    <div
      tabindex="0"
      v-click-outside="removeSelectRow"
      @keydown="onKeyDownTable"
      class="table no-select"
      :class="[{ hide: data.length < maxRowTableShow, loading: loading.data }]"
      ref="tableRef"
    >
      <MISABackdrop v-if="loading.data" type="fullparent" top="38px" bottom="40px">
        <MISALoading />
      </MISABackdrop>
      <MISABackdrop
        v-if="!loading.data && data.length === 0"
        backgroundColor="#fff"
        type="fullparent"
        top="38px"
        bottom="40px"
      >
        <h2>Không có dữ liệu</h2>
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
          @change-dialog="(id) => openAssetDialog('change', id)"
          @duplicate-dialog="(id) => openAssetDialog('duplicate', id)"
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
          @decrease="() => increaseOrDecreasePage('decrease')"
          @increase="() => increaseOrDecreasePage('increase')"
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
      :type="typePopup"
      @action="actionOfForm"
    />
    <MISAStack type="fixed" vertical="bottom" horizontal="right">
      <MISASnackbar
        @close="() => removeToastMessage(index)"
        :type="toast.type"
        v-for="(toast, index) in toastMessages"
        :key="index"
      >
        {{ toast.message }}
      </MISASnackbar>
    </MISAStack>
  </div>
</template>

<style scoped>
.table__container {
  transition: all 0.5s ease;
  /* height: 600px;
  overflow: auto; */
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
