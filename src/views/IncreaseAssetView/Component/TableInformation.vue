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
    id: 0,
    field: 'order',
    label: 'STT',
    type: 'order',
    position: 'center'
  },
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
    id: 4,
    field: fieldList.DEPARTMENT_NAME,
    label: labelAsset[lang.value].DEPARTMENT_NAME,
    type: 'string'
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
    label: 'Hao mòn năm',
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

const emits = defineEmits(['changeHeight'])

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
    if (startHeight - e.clientY + startY > 300) {
      stopDrag()
    }
    element.style.height = startHeight - e.clientY + startY + 'px'
  }
  // Dừng event resize
  function stopDrag() {
    emits('changeHeight', element.offsetHeight)
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
    <div class="table-information-header">
      <h3>Thông tin chi tiết</h3>
      <span><i class="icon-fullscreen"></i></span>
    </div>
    <div class="table">
      <table>
        <MISATableHeader :hasCheckbox="false" :action="false" :columns="columnFields" />
        <MISATableBody :action="false" :hasCheckbox="false" />
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-information {
  min-height: 100px;
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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
.table {
  /* flex-grow: 1; */
  overflow: auto;
  border-radius: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  border-radius: 4px;
}
.resize {
  height: 10px;
  width: 100%;
  cursor: row-resize;
  position: absolute;
  top: 0;
}
</style>
