<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
//resourses
import { labelAsset, fieldList } from '@/assets/resources/asset'
import { tooltip, events } from '@/assets/resources/common'
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
    type: 'number'
  },
  {
    id: 6,
    field: fieldList.COST,
    label: labelAsset[lang.value].COST,
    type: 'number'
  },
  {
    id: 7,
    field: fieldList.HMKH,
    label: labelAsset[lang.value].HMKH,
    type: 'number',
    tooltip: tooltip[lang.value].HMKH
  },
  {
    id: 8,
    field: fieldList.REMAINING_VALUE,
    label: labelAsset[lang.value].REMAINING_VALUE,
    type: 'number'
  }
]

const resizer = ref(null)

const tableContainerRef = ref(null)

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
    element = tableContainerRef.value
    startY = e.clientY
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
    document.documentElement.addEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.addEventListener(events.MOUSEUP, stopDrag, false)
  }

  // Thực hiện event resize
  function doDrag(e) {
    element.style.height = startHeight - e.clientY + startY + 'px'
  }
  // Dừng event resize
  function stopDrag() {
    document.documentElement.removeEventListener(events.MOUSEMOVE, doDrag, false)
    document.documentElement.removeEventListener(events.MOUSEUP, stopDrag, false)
  }
}

onMounted(() => {
  initResizeElement()
})
</script>

<template>
  <div ref="tableContainerRef" class="table-information">
    <div ref="resizer" class="resize"></div>
    <div class="table">
      <table>
        <MISATableHeader :action="false" :columns="columnFields" />
        <MISATableBody :action="false" :hasCheckbox="false" />
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-information {
  height: 200px;
  min-height: 50px;
  max-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.table {
  flex-grow: 1;
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
}
.resize {
  height: 10px;
  width: 100%;
  cursor: row-resize;
}
</style>
