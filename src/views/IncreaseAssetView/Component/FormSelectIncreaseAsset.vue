<template>
  <Teleport to="body">
    <MISABackdrop zIndex="1002">
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
            <MISASearchBox style="width: 250px" />
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
                @double-click="toggleSelectRow"
                @click-ctrl="toggleSelectRow"
                @shift-click="onPressShiftAndClick"
                @select-row="toggleSelectRow"
                :columnFields="props.columnFields"
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
          <MISAButton padding>Lưu</MISAButton>
          <MISAButton type="sub" padding>Hủy</MISAButton>
        </div>
      </div>
    </MISABackdrop>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { types, eventBus, keys } from '@/assets/resources/common'

const props = defineProps({
  columnFields: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['close-select-asset'])

const data = ref([
  {
    order: 1,
    fixedAssetId: '1',
    fixedAssetCode: 'ABC123',
    fixedAssetName: 'Máy tính',
    departmentName: 'Phòng kế toán',
    cost: 1000,
    hmkh: 100,
    remainingValue: 900,
    isChecked: false
  },
  {
    order: 2,
    fixedAssetId: '2',
    fixedAssetCode: 'ABC123',
    fixedAssetName: 'Máy tính',
    departmentName: 'Phòng kế toán',
    cost: 1000,
    hmkh: 100,
    remainingValue: 900,
    isChecked: false
  }
])

const listIdSelected = ref([])
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

const pageData = ref({
  numberOfPage: 1,
  pageSize: 20,
  totalRecord: 0,
  currentPage: 1,
  selectAll: false
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
const toggleSelectAll = () => {
  pageData.value.selectAll = !pageData.value.selectAll
  if (pageData.value.selectAll) {
    data.value.forEach((item) => {
      item.isChecked = true
    })
  } else {
    data.value.forEach((item) => {
      item.isChecked = false
    })
  }
}

const toggleSelectRow = (id) => {
  console.log(id)
  const index = data.value.findIndex((item) => item.fixedAssetId === id)
  console.log('Index: ', index)
  data.value[index].isChecked = !data.value[index].isChecked
  if (data.value[index].isChecked) {
    listIdSelected.value.push(id)
  } else {
    const indexId = listIdSelected.value.findIndex((item) => item === id)
    listIdSelected.value.splice(indexId, 1)
  }
  console.log(listIdSelected)
}

const onPressShiftAndClick = (id) => {}
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
