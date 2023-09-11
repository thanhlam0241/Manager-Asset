<script setup>
import MISATableRow from '@/components/base/MISATableRow.vue'
import MISATableData from './MISATableData.vue'
import { converStringToBigNumberString } from '@/helper/stringHelper'

/**
 * Props của table body
 * @type {Object}
 * @property {Array} data - Dữ liệu của table
 * @property {Array} columnFields - Các cột của table
 * @property {String} selectedId - Id của dòng được chọn
 * @property {Array} emptyData - Dữ liệu rỗng
 * @property {Boolean} action - Có hiển thị action hay không
 * @property {Boolean} hasCheckbox - Có hiển thị checkbox hay không
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columnFields: {
    type: Array,
    default: () => []
  },
  selectedId: {
    type: String,
    default: ''
  },
  emptyData: {
    type: Array,
    default: () => []
  },
  action: {
    type: Boolean,
    default: false
  },
  hasCheckbox: {
    type: Boolean,
    default: false
  },
  isShowEmpty: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <tbody>
    <MISATableRow
      :selected="item.isChecked"
      :focus="item.fixedAssetId === props.selectedId"
      v-for="(item, index) in data"
      :key="'row' + item.fixedAssetId"
      v-on:dblclick="$emit('doubleClick', item.fixedAssetId)"
      @click.ctrl="$emit('clickCtrl', item.fixedAssetId)"
      @click.shift="$emit('shiftClick', item.fixedAssetId)"
      @mousedown.stop="$emit('clickFocusing', item.fixedAssetId)"
      @contextmenu.prevent="(event) => $emit('contextMenu', event, item.fixedAssetId)"
      :isSelected="props.data[index].fixedAssetId === props.selectedId"
    >
      <MISATableData v-if="props.hasCheckbox" type="checkbox">
        <MISACheckbox
          :value="item.isChecked"
          @mousedown.stop.prevent.self="$emit('selectRow', item.fixedAssetId)"
        />
      </MISATableData>
      <MISATableData
        :type="field.type === 'number' ? 'number' : 'text'"
        v-for="field in props.columnFields"
        :key="field.id"
      >
        {{
          field.type === 'number'
            ? item[field.field]
              ? converStringToBigNumberString(item[field.field])
              : 0
            : item[field.field]
            ? item[field.field]
            : 'Chưa có dữ liệu'
        }}
      </MISATableData>
      <MISATableData v-if="props.action" width="100px" type="action">
        <MISAButton
          width="24px"
          height="24px"
          @click="$emit('changeDialog', item.fixedAssetId)"
          transparent
          type="icon"
          ><i class="icon-pencil"></i
        ></MISAButton>
        <MISAButton
          width="24px"
          height="24px"
          @click="$emit('duplicateDialog', item.fixedAssetId)"
          transparent
          type="icon"
          ><i class="icon-duplicate"></i
        ></MISAButton>
      </MISATableData>
    </MISATableRow>
    <MISATableRow height="40px" :key="`empty${i}`" v-for="i in props.emptyData"></MISATableRow>
  </tbody>
</template>

<style scoped>
tbody {
  height: 700px;
}

tbody:focus {
  border: none;
  outline: none;
}
tbody > tr > td {
  border-bottom: 1px solid #ddd;
}

th.column__function {
  padding: 0 12px;
}

td.column__function {
  max-width: 100px;
  padding: 0 16px;
  text-align: center;
}

.div__function {
  max-width: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  visibility: hidden;
}

tr:hover .div__function {
  visibility: visible;
}

tbody > tr {
  height: 40px;
  width: 100%;
}
</style>
