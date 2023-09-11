<script setup>
import { onMounted, ref, onUnmounted, computed } from 'vue'
import * as XLSX from 'xlsx'
import MISAInputFile from '@/components/base/MISAInputFile.vue'
import MISAContextMenu from './MISAContextMenu.vue'
import MISAListDrop from './MISAListDrop.vue'
import { getFileExtension } from '@/helper/file.js'
import { isDateValid } from '@/helper/stringHelper.js'
import { excel, labelAsset, fieldList } from '@/assets/resources/asset'
import { dataTypes, types, events } from '@/assets/resources/common'
import { useStore } from 'vuex'

/**
 * The store of the application.
 * @type {import('vuex').Store}
 * Creatd by: NTLam (15/8/2023)
 */
const store = useStore()

/**
 * The language of the application.
 * @type {import('vue').Ref<String>}
 * Creatd by: NTLam (15/8/2023)
 */
const lang = store.state.lang

const columnFields = [
  {
    id: 0,
    field: fieldList.FIXED_ASSET_CODE,
    label: labelAsset[lang].FIXED_ASSET_CODE,
    type: dataTypes.STRING,
    canSort: true
  },
  {
    id: 1,
    field: fieldList.FIXED_ASSET_NAME,
    label: labelAsset[lang].FIXED_ASSET_NAME,
    type: dataTypes.STRING
  },
  {
    id: 2,
    field: fieldList.FIXED_ASSET_CATEGORY_CODE,
    label: labelAsset[lang].FIXED_ASSET_CATEGORY_CODE,
    type: dataTypes.STRING
  },
  {
    id: 3,
    field: fieldList.DEPARTMENT_CODE,
    label: labelAsset[lang].DEPARTMENT_CODE,
    type: dataTypes.STRING
  },
  {
    id: 4,
    field: fieldList.PURCHASE_DATE,
    label: labelAsset[lang].PURCHASE_DATE,
    type: dataTypes.STRING
  },
  {
    id: 5,
    field: fieldList.QUANTITY,
    label: labelAsset[lang].QUANTITY,
    type: dataTypes.NUMBER
  },
  {
    id: 6,
    field: fieldList.COST,
    label: labelAsset[lang].COST,
    type: dataTypes.NUMBER
  },
  {
    id: 7,
    field: fieldList.LIFE_TIME,
    label: labelAsset[lang].LIFE_TIME,
    type: dataTypes.NUMBER
  },
  {
    id: 8,
    field: fieldList.TRACKED_YEAR,
    label: labelAsset[lang].TRACKED_YEAR,
    type: dataTypes.NUMBER
  }
]

const props = defineProps({
  departments: {
    type: Array,
    default: () => []
  },
  fixedAssetCategories: {
    type: Array,
    default: () => []
  }
})

/**
 * The event emitter.
 * @type {Object}
 * Creatd by: NTLam (15/8/2023)
 */
const emit = defineEmits(['close', 'getDataFromExcel', types.ERROR])

/**
 * The data of the table.
 * @type {Ref<Array<Object>>}
 * Creatd by: NTLam (15/8/2023)
 */
const dataTable = ref([])

/**
 * The row of the table when the data is not full of height table.
 * @type {Ref<Array<Object>>}
 * Creatd by: NTLam (15/8/2023)
 */
const emptyData = computed(() => {
  const emptyDatas = []
  if (dataTable.value.length < 9) {
    for (let i = 0; i < 9 - dataTable.value.length; i++) {
      emptyDatas.push({})
    }
  }
  return emptyData
})

/**
 * The index of the row that is right-clicked.
 * @type {Ref<number>}
 * Creatd by: NTLam (15/8/2023)
 */
const rowSelected = ref(-1)

/**
 * The context menu component.
 * @type {Ref<Object>}
 * Creatd by: NTLam (15/8/2023)
 */
const mymenu = ref(null)

/**
 * The reference to the table element.
 * @type {Ref<Object>}
 * Creatd by: NTLam (15/8/2023)
 */
const tableRef = ref(null)

/**
 * The items of the context menu.
 * @type {Ref<Array<Object>>}
 * Creatd by: NTLam (15/8/2023)
 */
const items = ref([
  {
    id: 'insertAfter',
    text: excel[lang].INSERT_AFTER,
    divider: true,
    click: () => {
      onAddRow(types.AFTER, rowSelected.value)
      hideContextMenu()
    }
  },
  {
    id: 'insertBefore',
    text: excel[lang].INSERT_BEFORE,
    divider: true,
    click: () => {
      onAddRow(types.BEFORE, rowSelected.value)
      hideContextMenu()
    }
  },
  {
    id: 'remove',
    text: excel[lang].DELETE_ROW,
    divider: true,
    click: () => {
      onRemoveRow(rowSelected.value)
      hideContextMenu()
    }
  },
  {
    id: 'duplicate',
    text: excel[lang].DUPLICATE_ROW,
    divider: true,
    click: () => {
      onDuplicate(rowSelected.value)
      hideContextMenu()
    }
  }
])

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
/**
 * Function that is called when the mouse leaves the context.
 * Creatd by: NTLam (15/8/2023)
 */
const onMouseLeaveContext = () => {
  hideContextMenu()
}

/**
 * Chức năng: Thêm event listener khi component mounted
 * Creatd by: NTLam (15/8/2023)
 */
onMounted(() => {
  document.addEventListener(events.CLICK, hideContextMenu)
})

/**
 * Chức năng: Xóa event listener khi component unmounted
 * Creatd by: NTLam (15/8/2023)
 */
onUnmounted(() => {
  // remove event listener for escape key and click outside context menu
  document.removeEventListener(events.CLICK, hideContextMenu)
})

/**
 * Function that handles right-click event on a row in the MISATable component.
 * @param {Event} event - The right-click event.
 * @param {string} id - The id of the row that was right-clicked.
 * Creatd by: NTLam (15/8/2023)
 */
const rightClickARow = (event, index) => {
  rowSelected.value = index
  showContextMenu(event)
}

/**
 * The data of the table cell that is currently focused.
 * @type {Ref<Object>}
 * Creatd by: NTLam (15/8/2023)
 */
const tableDataFocus = ref({
  field: '',
  rowIndex: 0
})

/**
 * Function that handles the focus event on a table cell.
 * @param {string} field - The field of the table cell that is focused.
 * @param {string} rowIndex - The index of the row that is focused.
 * Creatd by: NTLam (15/8/2023)
 */
const changeTableDataFocus = (field, rowIndex) => {
  tableDataFocus.value.field = field
  tableDataFocus.value.rowIndex = rowIndex
}

/**
 * Function that handles the change event on a table cell.
 * @param {Event} event - The change event.
 * Creatd by: NTLam (15/8/2023)
 */
const onChange = (e) => {
  if (tableDataFocus.value.field === '' || tableDataFocus.value.rowIndex === '') return
  dataTable.value[tableDataFocus.value.rowIndex][tableDataFocus.value.field] = e.target.innerText
  tableDataFocus.value.field = ''
  tableDataFocus.value.rowIndex = ''
}

/**
 * Function that handles the click event on the add row button.
 * @param {string} type - The type of the row that is added.
 * @param {string} indexRow - The index of the row that is added.
 * Creatd by: NTLam (15/8/2023)
 */
const onAddRow = (type = types.LAST, indexRow = -1) => {
  const newRow = {}
  columnFields.forEach((column) => {
    newRow[column.field] = ''
  })
  if (type === types.LAST) dataTable.value.push(newRow)
  else if (indexRow === -1) {
    return
  } else if (type === types.BEFORE) {
    if (indexRow === 0) {
      dataTable.value.unshift(newRow)
      return
    }
    dataTable.value.splice(indexRow, 0, newRow)
  } else if (type === types.AFTER) {
    dataTable.value.splice(indexRow + 1, 0, newRow)
  }
}

/**
 * Function that handles the click event on the duplicate row button.
 * Creatd by: NTLam (15/8/2023)
 */
const onDuplicate = () => {
  if (rowSelected.value === -1) return
  const newRow = {}
  columnFields.forEach((column) => {
    newRow[column.field] = dataTable.value[rowSelected.value][column.field]
  })
  dataTable.value.splice(rowSelected.value + 1, 0, newRow)
}

/**
 * Function that handles the click event on the remove row button.
 * @param {string} index - The index of the row that is removed.
 * Creatd by: NTLam (15/8/2023)
 */
const onRemoveRow = (index) => {
  dataTable.value.splice(index, 1)
  // tableRef.value.scrollTop = 0
}

const removeAllData = () => {
  dataTable.value = []
}

/**
 * Function that handles the click event on the import button.
 * Creatd by: NTLam (15/8/2023)
 */
const onFileChange = (file) => {
  if (getFileExtension(file.name) !== 'xlsx') {
    emit(types.ERROR, excel[lang].FILE_NOT_SUPPORT)
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target.result
    const workbook = XLSX.read(data, {
      type: 'binary',
      cellText: false,
      cellDates: true,
      dateNF: 'dd/mm/yyyy'
    })
    const firstSheetName = workbook.SheetNames[0]

    const worksheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      rawNumbers: false
    })

    const columnLabels = columnFields.map((column) => {
      return column.label
    })

    let isFileValid = true
    rows[0].forEach((value) => {
      if (columnLabels.indexOf(value.trim()) === -1) {
        isFileValid = false
      }
    })
    if (!isFileValid) {
      emit('error', excel[lang].FILE_COLUMN_NOT_VALID)
      return
    } else {
      dataTable.value = rows
        .slice(1)
        .filter((row) => {
          return row[0] && row[1]
        })
        .map((row) => {
          let objectRow = {}
          columnFields.forEach((column, index) => {
            if (column.field === 'purchaseDate') {
              row[index] = new Date(row[index]).toLocaleDateString('en-EN')
            }
            objectRow[column.field] = row[index]
          })
          return objectRow
        })
    }
  }
  reader.readAsBinaryString(file)
}

/**
 * Function that handles the click event on the import button.
 * Creatd by: NTLam (15/8/2023)
 */
const onImport = () => {
  const messageErrors = []
  if (dataTable.value && dataTable.value.length > 0) {
    let isEmpty = false
    let isDateNotValid = false
    dataTable.value.forEach((row) => {
      columnFields.forEach((column) => {
        if (column.field === fieldList.PURCHASE_DATE) {
          if (!isDateValid(row[column.field])) {
            isDateNotValid = true
          }
        }
        if (!row[column.field] || row[column.field] === '') {
          isEmpty = true
        }
      })
    })
    if (isEmpty) {
      messageErrors.push(excel[lang].EMPTY_CELL)
    }
    if (isDateNotValid) {
      messageErrors.push(excel[lang].DATE_FORMAT)
    }

    const setCode = new Set()
    dataTable.value.forEach((row) => {
      setCode.add(row.fixedAssetCode)
    })
    if (setCode.size !== dataTable.value.length && !isEmpty) {
      messageErrors.push(excel[lang].DUPLICATE_CODE)
    }

    const isNumber = dataTable.value.some((row) => {
      console.log(isNaN(+row.cost))
      console.log(isNaN(+row.lifeTime))
      console.log(isNaN(+row.trackedYear))
      return (
        isNaN(+row.quantity) || isNaN(+row.cost) || isNaN(+row.lifeTime) || isNaN(+row.trackedYear)
      )
    })

    if (isNumber && !isEmpty) {
      messageErrors.push(excel[lang].NUMBER_FORMAT)
    }

    if (messageErrors.length === 0) {
      emit('getDataFromExcel', dataTable.value)
    } else {
      emit('error', messageErrors.join('. '))
    }
  }
}
</script>

<template>
  <div class="excel-container">
    <div class="export-header">
      <h2>{{ excel[lang].IMPORT_DATA }}</h2>
      <button class="btn-close" ref="closeBtn" @click="() => $emit('close')">
        <i class="icon-xmark"></i>
      </button>
    </div>
    <div class="excel-tool">
      <MISAInputFile @get-file="onFileChange" accept=".xlsx" />
      <div class="other-tool">
        <div class="div-one">
          <MISAButton @click="onAddRow('last')">{{ excel[lang].INSERT_END }}</MISAButton>
          <MISAButton @click="removeAllData"> {{ excel[lang].DELETE_ALL }} </MISAButton>
        </div>
        <div class="div-one">
          <MISAListDrop :keyValue="props.departments" :label="excel[lang].DEPARTMENT" />
          <MISAListDrop
            :keyValue="props.fixedAssetCategories"
            :label="excel[lang].FIXED_ASSET_CATEGORY"
          />
        </div>
        <!-- <MISATextfield onlyInput width="100%" type="text" /> -->
      </div>
    </div>
    <div ref="tableRef" class="table">
      <table :spellcheck="false">
        <thead>
          <tr>
            <th class="column-id">
              <MISATooltip position="bottom" text="Số thứ tự"> STT </MISATooltip>
            </th>
            <th v-for="column in columnFields" :key="column.id" :column="column">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody id="excel-tbody">
          <tr
            @contextmenu.prevent="(event) => rightClickARow(event, indexData)"
            v-for="(row, indexData) in dataTable"
            :key="indexData"
          >
            <td class="cell-id">{{ indexData + 1 }}</td>
            <td
              @click="() => changeTableDataFocus(column.field, indexData)"
              v-for="column in columnFields"
              :key="column.id + 'column'"
              :class="[
                { number: column.type === 'number' },
                {
                  focusing:
                    tableDataFocus.field === column.field && tableDataFocus.rowIndex === indexData
                }
              ]"
              :column="column"
              @blur="onChange"
              contenteditable="true"
            >
              {{ row[column.field] || '' }}
            </td>
          </tr>
          <tr v-for="(e, index) in emptyData" :key="'empty' + index"></tr>
        </tbody>
      </table>
    </div>
    <MISAButton height="32px" @click="onImport">{{ excel[lang].IMPORT_DATA }}</MISAButton>
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
  </div>
</template>

<style scoped>
.excel-container {
  width: calc(100vw - 32px);
  min-height: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  background-color: #fff;
  padding: 24px 24px 10px 24px;
  border-radius: 10px;
}
.export-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-close {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
}
.btn-close:focus {
  outline: 1px solid var(--primary-color);
}

.excel-tool {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: stretch;
}

.other-tool {
  border-radius: 4px;
  flex-grow: 1;
  border: 1px solid #a32323;

  padding: 5px;

  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-direction: column;
}

.div-one {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.table {
  width: 100%;
  max-height: 400px;
  overflow: auto;
  border: 1px solid #a32323;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  margin-bottom: 10px;
}

.table.not-overflow {
  overflow: hidden;
}

table {
  background-color: var(--color-white);
  border-collapse: collapse;
  width: 100%;
  border-radius: 4px;
}

thead {
  width: 100%;
  position: sticky;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  top: 0;
  height: 40px;
}

thead tr {
  background-color: #eee;
}

tbody {
  max-height: 600px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

th.column-id {
  width: 40px;
  border-right: none;
  cursor: auto;
}

.cell-id {
  text-align: center;
  border-right: none;
  outline: none;
}

th {
  outline: 1px solid green;
  padding: 5px;
  text-align: center;
  cursor: auto;
}

tbody td {
  border: 1px solid green;
  padding: 5px;
  text-align: center;
  height: 40px;
}

tbody td {
  cursor: cell;
  text-align: left;
}

td.number {
  text-align: right;
}

td.focusing {
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19),
    inset 0 0 0 1px #3bbb72;
}

td:focus {
  /* border: none; */
  outline: none;
}
</style>
