<script setup>
import MISACheckbox from '@/components/base/MISACheckbox.vue'
import MISATooltip from '@/components/base/MISATooltip.vue'
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Props của table header
 * @type {Object}
 * @property {Array} columns - Các cột của table
 * @property {Function} onSort - Sự kiện sort
 * @property {Boolean} sticky - Có sticky hay không
 * @property {Boolean} hasCheckbox - Có hiển thị checkbox hay không
 * @property {Boolean} action - Có hiển thị action hay không
 * @property {Boolean} selectedAll - Có chọn tất cả hay không
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  onSort: {
    type: Function,
    required: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  hasCheckbox: {
    type: Boolean,
    default: false
  },
  action: {
    type: Boolean,
    default: false
  },
  selectedAll: {
    type: Boolean,
    default: false
  }
})

/**
 * Ref của th
 * Created by: NTLam (20/07/2023)
 */
const thElm = ref(null)

/**
 * Ref của startOffset
 * Created by: NTLam (20/07/2023)
 */
const startOffset = ref(null)

/**
 * Sự kiện mouseOut
 * @param {MouseEvent} e - Sự kiện mouseOut
 * Created by: NTLam (20/07/2023)
 */
const mouseOut = function (e) {
  if (thElm.value) {
    thElm.value.style.width = startOffset.value + e.pageX + 'px'
  }
}

/**
 * Sự kiện mouseUp
 * Created by: NTLam (20/07/2023)
 */
const mouseUp = function () {
  thElm.value = undefined
}

/**
 * Chức năng: Thêm chức năng resize cho table
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
onMounted(() => {
  Array.prototype.forEach.call(document.querySelectorAll('thead tr th'), function (th) {
    th.style.position = 'relative'

    var grip = document.createElement('div')
    grip.innerHTML = '&nbsp;'
    grip.style.top = 0
    grip.style.right = 0
    grip.style.bottom = 0
    grip.style.width = '5px'
    grip.style.position = 'absolute'
    grip.style.cursor = 'col-resize'
    grip.addEventListener('mousedown', function (e) {
      thElm.value = th
      startOffset.value = th.offsetWidth - e.pageX
    })

    th.appendChild(grip)
  })

  document.addEventListener('mousemove', mouseOut)

  document.addEventListener('mouseup', mouseUp)
})

/**
 * Chức năng: Xóa sự kiện mouseOut và mouseUp
 * Tác giả: Nguyễn Thanh Lâm
 * Ngày tạo: 1/8/2023
 */
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseOut)
  document.removeEventListener('mouseup', mouseUp)
})
</script>
<template>
  <thead :class="{ sticky: true }">
    <tr>
      <th class="input__radio">
        <MISACheckbox
          :value="props.selectedAll"
          @mousedown.stop.prevent.self="
            () => {
              //e.stopPropagation()
              $emit('checkAll')
            }
          "
        />
      </th>
      <th
        v-for="column in props.columns"
        :key="column.id"
        :class="[{ data__number: column.type === 'number' }]"
      >
        <span class="th_text" v-if="!column.tooltip">{{ column.label }}</span>
        <MISATooltip position="bottom" :text="column.tooltip" v-else>
          <span class="th_text"> {{ column.label }}</span>
        </MISATooltip>
      </th>
      <th v-if="props.action" class="column__function">Chức năng</th>
    </tr>
  </thead>
</template>

<style scoped>
thead {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 13px;
  box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.2);
}

/* thead:hover th {
  cursor: pointer;
  outline: 1px solid #e0e0e0;
} */
thead.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}
.th_data {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  height: 100%;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: flex-start;
}
tr > .input__radio {
  width: calc(20px + 16px + 20px);
  padding: 0 16px;
  vertical-align: center;
}
th.data__number {
  text-align: right;
  padding: 0 16px 0 0;
}
.data__number .th_text {
  width: 100%;
}
.th_text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
th.column__function {
  padding: 0 12px;
}
thead > tr {
  height: 38px;
  width: 100%;
}

thead > tr > th {
  text-align: left;
  max-width: 200px;
  /* width: auto; */
}
</style>
