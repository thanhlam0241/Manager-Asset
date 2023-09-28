<script setup>
import { converStringToBigNumberString } from '@/helper/stringHelper.js'
import { ref } from 'vue'
import { table } from '@/assets/resources/asset'
import { useStore } from 'vuex'

const store = useStore()

const lang = store.state.lang

/**
 * Props của table footer
 * @type {Object}
 * @property {Number} totalRecord - Tổng số bản ghi
 * @property {Number} numberOfRecordPerpage - Số bản ghi trên 1 trang
 * @property {Number} currentPage - Trang hiện tại
 * @property {Number} numberOfPage - Tổng số trang
 * @property {Array} listPages - Danh sách các trang
 * @property {Array} pagingList - Danh sách các trang hiển thị
 * @property {Number} colspan - Số cột
 * @property {Boolean} action - Có hiển thị action hay không
 * @property {Boolean} loadingTotal - Đang loading tổng số bản ghi
 * @property {Boolean} loadingPage - Đang loading trang
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  totalRecord: {
    type: Number,
    default: 0
  },
  numberOfRecordPerpage: {
    type: Number,
    default: 20
  },
  currentPage: {
    type: Number,
    default: 1
  },
  numberOfPage: {
    type: Number,
    default: 1
  },
  listPages: {
    type: Array,
    default: () => []
  },
  pagingList: {
    type: Array,
    default: () => []
  },
  colspan: {
    type: Number,
    default: 1
  },
  action: {
    type: Boolean,
    default: false
  },
  loadingTotal: {
    type: Boolean,
    default: false
  },
  loadingPage: {
    type: Boolean,
    default: false
  },
  isSumDataSameRow: {
    type: Boolean,
    default: true
  },
  totalColumn: {
    type: Number,
    default: 1
  }
})

/**
 * Emit event
 * @type {import('vue').EmitsOptions}
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits([
  'changePage',
  'increase',
  'decrease',
  'changeRecordPerPage',
  'isSelectingPageToGo'
])

/**
 * Trang cần nhảy đến
 * @type {import('vue').Ref<Number>}
 * Created by: NTLam (20/07/2023)
 */
const pageToGo = ref(-1)

/**
 * Set trang cần nhảy đến
 * @param {Number} value - Trang cần nhảy đến
 * Created by: NTLam (20/07/2023)
 */
const setPageToGo = (value) => {
  pageToGo.value = value
}

/**
 * Nhảy đến trang
 * @param {Number} v - Trang cần nhảy đến
 * Created by: NTLam (20/07/2023)
 */
const onEnterOrClickSubmit = (v) => {
  if (v) {
    emit('changePage', v)
    emit('isSelectingPageToGo', false)
    resetPageToGo()
  }
}

/**
 * Reset trang cần nhảy đến
 * Created by: NTLam (20/07/2023)
 */
const resetPageToGo = () => {
  emit('isSelectingPageToGo', false)
  pageToGo.value = -1
}

/**
 * Directive click outside
 * Created by: NTLam (20/07/2023)
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
 * Xử lý khi click vào trang
 * @param {Number} page - Trang
 * @param {Number} index - Index
 * Created by: NTLam (20/07/2023)
 */
const onClickPageIndex = (page, index) => {
  resetPageToGo()
  if (page !== '...') {
    emit('changePage', page)
    emit('isSelectingPageToGo', false)
  } else {
    emit('isSelectingPageToGo', true)
    const indexCurrentPage = props.pagingList.findIndex((item) => item === props.currentPage)
    const diffence = index - indexCurrentPage
    if (diffence != 0) {
      setPageToGo(props.currentPage + diffence)
    } else {
      setPageToGo(-1)
    }
  }
}
</script>

<template>
  <tfoot>
    <tr class="row-sum" v-if="!props.isSumDataSameRow">
      <slot />
    </tr>
    <tr>
      <td :colspan="props.colspan">
        <div class="tfoot__page">
          <div class="span__totalRecord">
            {{ table[lang]['ALL'] }}
            <b>{{ props.totalRecord ? converStringToBigNumberString(props.totalRecord) : 0 }}</b>
            {{ table[lang]['ROW'] }}
          </div>
          <MISACombobox
            position="top"
            required
            size="small"
            type="dropdown"
            width="40px"
            height="24px"
            :options="[20, 50, 100]"
            :defaultValue="props.numberOfRecordPerpage"
            @change-value="(value) => $emit('changeRecordPerPage', value)"
          />
          <div tabindex="1" v-click-outside="resetPageToGo" class="page__seperate">
            <div class="comboShowPage" v-if="pageToGo >= 0">
              <span class="span_gotopage">{{ table[lang]['GO_TO_PAGE'] }}</span>
              <MISAInput
                type="number"
                @send-value="onEnterOrClickSubmit"
                @on-change="setPageToGo"
                autofocus
                height="24px"
                width="50px"
                :defaultValue="pageToGo"
              />
              <MISAButton
                @click="() => pageToGo && onEnterOrClickSubmit(pageToGo)"
                height="26px"
                type="main"
                >{{ table[lang]['GO'] }}</MISAButton
              >
            </div>
            <div
              :class="{ disabled: props.currentPage === 1 }"
              class="page__index"
              @click="$emit('decrease')"
            >
              <svg class="icon-angle-left-small icon-black"></svg>
            </div>
            <MISASkeleton v-if="props.loadingPage" width="200px" height="24px" />
            <div
              v-else
              :class="[
                { page__index: page !== '' },
                { selected: page === props.currentPage },
                { showMorePage: page === '...' },
                { disabled: page === '...' && pageToGo > 0 }
              ]"
              v-for="(page, index) in props.pagingList"
              @click.stop.prevent="() => onClickPageIndex(page, index)"
              :key="'page' + page + index"
            >
              {{ page !== '...' ? converStringToBigNumberString(page) : page }}
            </div>
            <div
              :class="{ disabled: props.currentPage === props.numberOfPage }"
              class="page__index"
              @click="$emit('increase')"
            >
              <i class="icon-angle-right-small icon-black"></i>
            </div>
          </div>
        </div>
      </td>
      <slot v-if="props.isSumDataSameRow" />
      <td v-else :colspan="props.totalColumn - props.colspan"></td>
      <td v-if="props.action"></td>
    </tr>
  </tfoot>
</template>

<style scoped>
tfoot {
  height: 40px;
  width: 100%;
  background-color: var(--color-white);
  padding: 0 16px;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
}
td.data__number {
  text-align: right;
  padding: 0 16px 0 0;
}
tfoot th,
tfoot td,
tfoot {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  z-index: 4;
  box-shadow: 0 -1px 0px 0 rgba(0, 0, 0, 0.2);
}
tfoot tr {
  height: 40px;
  box-shadow: 0px -1px 0px rgba(50, 50, 50, 0.1);
}
.table.hide {
  overflow: hidden;
}
tfoot td .tfoot__page {
  text-align: left;
  padding: 0 16px;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  align-items: center;
  flex-direction: row;
}

.span__totalRecord {
  display: flex;
  align-items: center;
  flex-direction: row;
  min-width: 150px;
  gap: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page__seperate {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  gap: 4px;
  width: 300px;
  position: relative;
}
.page__seperate > i {
  cursor: pointer;
}

.comboShowPage {
  position: absolute;
  width: auto;
  height: 42px;
  background-color: var(--color-white);
  z-index: 100;
  top: -45px;
  border: 1px solid #ccc;
  border-radius: var(--border-radius-size);
  overflow-y: auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  padding: 2px;
  display: none;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 5px;
}

.page__index.disabled {
  cursor: not-allowed !important;
  opacity: 0.5 !important;
  /* pointer-events: none; */
}
.span_gotopage {
  width: 80px;
  max-width: 200px;
}
.page__index {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-width: 24px;
  width: auto;
  padding: 0 2px;
  height: 24px;
  border-radius: var(--border-radius-size);
  cursor: pointer;
}
.row-sum {
  background-color: #f5f5f5;
  height: 40px;
}
.page__index.selected {
  font-weight: bold;
  background-color: var(--textfield-disabled-color);
  cursor: default;
}
.page__index:not(.disabled):hover {
  background-color: var(--textfield-disabled-color);
}
</style>
