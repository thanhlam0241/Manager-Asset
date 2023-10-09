<template>
  <Teleport to="body">
    <MISABackdrop zIndex="1002">
      <MISABackdrop zIndex="1003" v-if="loading.data" type="fullparent">
        <MISALoading />
      </MISABackdrop>
      <MISADialog
        v-if="dialogProps.open"
        :open="dialogProps.open"
        :content="dialogProps.content"
        @agree-dialog="closeDialog"
        type="error"
      />
      <div class="form-select-asset">
        <div class="form-header">
          <h2>Chọn tài sản ghi tăng</h2>
          <button
            class="btn-close"
            ref="closeBtn"
            @keydown="onKeydownBtnClose"
            @click="onClickCloseForm"
          >
            <i class="icon-xmark"></i>
          </button>
        </div>
        <div class="table-container">
          <div class="container-search">
            <MISASearchBox
              style="width: 250px"
              :value="pageData.filterString"
              @on-change="(v) => (pageData.filterString = v)"
            />
          </div>
          <div class="table">
            <table>
              <MISATableHeader
                :columns="props.columnFields"
                hasCheckbox
                :action="false"
                :selected-all="pageData.selectAll"
                @check-all="toggleSelectAll"
              />
              <MISATableBody
                :action="false"
                hasCheckbox
                @double-click="onClickARow"
                @shift-click="onPressShiftAndClick"
                @select-row="toggleSelectRowByCheckbox"
                :columnFields="props.columnFields"
                @click-focusing="onClickARow"
                :data="data"
              />
              <MISATableFooter
                action
                :totalRecord="pageData.totalRecord"
                :currentPage="pageData.currentPage"
                :numberOfPage="pageData.numberOfPage"
                :numberOfRecordPerpage="pageData.pageSize"
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
              >
                <td class="data__number"></td>
                <td class="data__number"></td>
                <td class="data__number"></td>
                <td class="data__number"></td>
              </MISATableFooter>
            </table>
          </div>
        </div>
        <div class="form-footer">
          <MISAButton @click="onClickSave" padding>Lưu</MISAButton>
          <MISAButton type="sub" padding>Hủy</MISAButton>
        </div>
      </div>
    </MISABackdrop>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { types } from '@/assets/resources/common'
import fixedAssetApi from '@/service/api/fixedAssetApi'

const props = defineProps({
  columnFields: {
    type: Array,
    default: () => []
  },
  listIds: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['close-select-asset', 'select-asset'])

const data = ref([])

const dialogProps = ref({
  open: false,
  content: ''
})

const pageData = ref({
  numberOfPage: 1,
  pageSize: 20,
  totalRecord: 0,
  currentPage: 1,
  selectAll: false,
  filterString: ''
})

const listData = ref([])

const listIdSelect = ref([])

const closeDialog = () => {
  dialogProps.value.open = false
  dialogProps.value.content = ''
}

const fetchData = async () => {
  loading.value.data = true
  const res = await fixedAssetApi
    .getFilterExcept({
      pageSize: pageData.value.pageSize,
      pageNumber: pageData.value.currentPage,
      filterString: pageData.value.filterString,
      codeExcepts: props.listIds.length > 0 ? props.listIds : null
    })
    .finally(() => {
      loading.value.data = false
    })
  if (res) {
    let isAll = true
    data.value = [...res.data].map((item, index) => {
      const hmkh = Math.round((item.cost * item.depreciationRate) / 100)
      const isChecked =
        listIdSelect.value.includes(item.fixedAssetCode) ||
        [...listData.value].map((i) => i.fixedAssetCode).includes(item.fixedAssetCode)
      if (isChecked === false) {
        isAll = false
      }
      return {
        ...item,
        isChecked: isChecked,
        order: index + 1 + (pageData.value.currentPage - 1) * pageData.value.pageSize,
        hmkh: hmkh,
        remainingValue: item.cost - hmkh
      }
    })
    pageData.value.selectAll = isAll
    pageData.value.totalRecord = res.totalRecord
    pageData.value.numberOfPage = res.totalPage
  }
}

onMounted(async () => {
  console.log(props.listIds)
  listIdSelect.value = props.listIds
  await nextTick()
  await fetchData()
})

const onClickSave = () => {
  console.log('Click Save')
  console.log(listData.value)
  emits('select-asset', listData.value)
}

watch(
  [
    () => pageData.value.currentPage,
    () => pageData.value.pageSize,
    () => pageData.value.filterString
  ],
  async () => {
    pageData.value.selectAll = false
    await fetchData()
  }
)
/**
 * Indicates whether the table is currently loading data or not.
 * @type {Ref<boolean>}
 * Creatd by: NTLam (15/8/2023)
 */
const loading = ref({
  data: false,
  page: false,
  size: false,
  total: false
})

/**
 * Tính danh sách các trang hiển thị
 * Creatd by: NTLam (15/8/2023)
 */
const listPages = computed(() => {
  const list = []
  for (let i = 1; i <= pageData.value.numberOfPage; i++) {
    list.push(i)
  }
  return list
})

const checkSelectAll = () => {
  pageData.value.selectAll = data.value.every((item) => item.isChecked)
}

/**
 * Chức năng: Tạo danh sách các trang hiển thị
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const pagingList = computed(() => {
  const list = []
  const numberOfPage = pageData.value.numberOfPage
  const currentPage = pageData.value.currentPage
  if (numberOfPage <= 7) {
    for (let i = 1; i <= numberOfPage; i++) {
      list.push(i)
    }
  } else {
    if (currentPage <= 4) {
      list.push(1, 2, 3, 4, 5, '...', numberOfPage)
    } else if (currentPage >= numberOfPage - 4) {
      list.push(1, '...', numberOfPage - 4, numberOfPage - 3, numberOfPage - 2)
      list.push(numberOfPage - 1, numberOfPage)
    } else {
      list.push(1, '...')
      list.push(currentPage - 1, currentPage, currentPage + 1)
      list.push('...', numberOfPage)
    }
  }
  return list
})

const onClickCloseForm = () => {
  emits('close-select-asset')
}

const onKeydownBtnClose = (event) => {
  if (event.key === 'Enter') {
    emits('close-select-asset')
  }
}
/**
 * Chức năng: Tăng hoặc giảm số trang hiện tại
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
const increaseOrDecreasePage = (type) => {
  if (type === types.INCREASE) {
    if (pageData.value.currentPage < pageData.value.numberOfPage) {
      pageData.value.currentPage++
    }
  } else {
    if (props.page > 1) {
      pageData.value.currentPage--
    }
  }
}

const changePage = (page) => {
  pageData.value.currentPage = page
}

const changeRecordPerpage = (size) => {
  pageData.value.pageSize = size
}

const addAData = (code) => {
  const index = data.value.findIndex((item) => item.fixedAssetCode === code)
  const indexId = listData.value.findIndex((item) => item.fixedAssetCode === code)
  if (index !== -1 && indexId === -1) {
    data.value[index].isChecked = true
    listData.value.push(data.value[index])
  }
}

const removeData = (code) => {
  const index = data.value.findIndex((item) => item.fixedAssetCode === code)
  const indexId = listData.value.findIndex((item) => item.fixedAssetCode === code)
  if (index !== -1 && indexId >= 0) {
    data.value[index].isChecked = false
    listData.value.splice(indexId, 1)
  }
}

const toggleSelectAll = () => {
  console.log('Click Select All')
  pageData.value.selectAll = !pageData.value.selectAll
  if (pageData.value.selectAll) {
    data.value.forEach((item) => {
      removeData(item.fixedAssetCode)
    })
  } else {
    data.value.forEach((item) => {
      addAData(item.fixedAssetCode)
    })
  }
}

const toggleSelectRowByCheckbox = (id) => {
  console.log('Click Checkbox')
  const index = data.value.findIndex((item) => item.fixedAssetId === id)
  const row = data.value[index]
  console.log('Index: ', index)
  if (index !== -1) {
    if (row.isChecked) {
      removeData(row.fixedAssetCode)
    } else {
      addAData(row.fixedAssetCode)
    }
    checkSelectAll()
  }
}

const onClickARow = (id) => {
  console.log('Click Focusing')
  const index = data.value.findIndex((item) => item.fixedAssetId === id)
  const row = data.value[index]
  console.log(index)
  if (index !== -1) {
    if (row.isChecked) {
      removeData(row.fixedAssetCode)
    } else {
      addAData(row.fixedAssetCode)
    }
  }
  checkSelectAll()
}

const onPressShiftAndClick = (id) => {
  console.log('Click Shift Click')
  const index = data.value.findIndex((item) => item.fixedAssetId === id)
  const indexFirst = data.value.findIndex((item) => item.isChecked)
  if (index < indexFirst) {
    for (let i = index; i < indexFirst; i++) {
      addAData(data.value[i].fixedAssetCode)
    }
  } else if (index > indexFirst) {
    for (let i = indexFirst; i <= index; i++) {
      addAData(data.value[i].fixedAssetCode)
    }
  } else {
    if (data.value[index].isChecked) {
      removeData(data.value[index].fixedAssetCode)
    } else {
      addAData(data.value[index].fixedAssetCode)
    }
  }
  checkSelectAll()
}
</script>

<style scoped>
.form-select-asset {
  width: 70%;
  display: flex;
  flex-direction: column;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-self: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #e5e5e5;
  width: 100%;
}
.table-container {
  flex-grow: 1;
  background-color: #fff;
}
.table {
  height: 520px;
  width: 100%;
  overflow: auto;
}
table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  position: relative;
  box-shadow: 1px 1px 1px 1px rgba(152, 63, 63, 0.2);
}
.container-search {
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
