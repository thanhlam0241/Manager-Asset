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
  },
  heightBalance: {
    type: Number,
    default: 0
  },
  actionInLast: {
    type: Boolean,
    default: false
  },
  nameId: {
    type: String,
    default: 'fixedAssetId'
  }
})

const emits = defineEmits([
  'selectRow',
  'selectCheckboxRow',
  'changeRecord',
  'deleteRecord',
  'ctrlClick',
  'doubleClick',
  'clickCtrl',
  'shiftClick',
  'clickFocusing',
  'contextMenu',
  'changeDialog',
  'duplicateDialog',
  'delete',
  'change'
])

const onMousedownRow = (e, id) => {
  if (e.shiftKey) {
    emits('shiftClick', id)
  } else if (e.ctrlKey) {
    emits('clickCtrl', id)
  } else {
    emits('clickFocusing', id)
  }
}
</script>

<template>
  <tbody>
    <MISATableRow
      :selected="item.isChecked"
      :focus="item.fixedAssetId === props.selectedId"
      v-for="(item, index) in props.data"
      :key="'row' + item.fixedAssetId"
      v-on:dblclick="$emit('doubleClick', item[props.nameId])"
      @click.ctrl.prevent="$emit('clickCtrl', item[props.nameId])"
      @click.shift.stop.prevent="$emit('shiftClick', item[props.nameId])"
      @mousedown.stop.prevent="(e) => onMousedownRow(e, item[props.nameId])"
      @contextmenu.prevent="(event) => $emit('contextMenu', event, item[props.nameId])"
      :isSelected="props.data[index].fixedAssetId === props.selectedId"
    >
      <MISATableData v-if="props.hasCheckbox" type="checkbox">
        <MISACheckbox
          :value="item.isChecked"
          @mousedown.stop.prevent.self="$emit('selectRow', item[props.nameId])"
        />
      </MISATableData>
      <MISATableData
        :position="field.position"
        :type="field.type"
        v-for="field in props.columnFields"
        :key="field.id"
        :action="field.action"
        :text="
          field.action
            ? field.type === 'number'
              ? converStringToBigNumberString(item[field.field].toString())
              : item[field.field].toString()
            : null
        "
      >
        {{
          !field.action
            ? field.type === 'number'
              ? item[field.field]
                ? converStringToBigNumberString(item[field.field])
                : 0
              : item[field.field]
              ? item[field.field]
              : 'Chưa có dữ liệu'
            : null
        }}
        <MISAButton
          v-if="field.action"
          width="32px"
          height="32px"
          @click="$emit('change', item[props.nameId])"
          type="icon"
          ><i class="icon-pencil"></i
        ></MISAButton>
        <MISAButton
          v-if="field.action"
          width="32px"
          height="32px"
          @click="$emit('delete', item[props.nameId])"
          type="icon"
          ><i class="icon-delete-red"></i
        ></MISAButton>
      </MISATableData>
      <MISATableData v-if="props.action" width="100" type="action">
        <MISAButton
          width="24px"
          height="24px"
          @click="$emit('changeDialog', item[props.nameId])"
          transparent
          type="icon"
          ><i class="icon-pencil"></i
        ></MISAButton>
        <MISAButton
          width="24px"
          height="24px"
          @click="$emit('duplicateDialog', item[props.nameId])"
          transparent
          type="icon"
          ><i class="icon-duplicate"></i
        ></MISAButton>
      </MISATableData>
    </MISATableRow>
    <!-- <MISATableRow height="40px" :key="`empty${i}`" v-for="i in props.emptyData"></MISATableRow> -->
    <tr :height="props.heightBalance" v-if="heightBalance > 0">
      <td :height="props.heightBalance" :colspan="props.columnFields.length + 1"></td>
    </tr>
  </tbody>
</template>

<style scoped>
tbody:focus {
  border: none;
  outline: none;
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
