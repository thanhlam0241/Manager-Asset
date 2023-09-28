<template>
  <table>
    <MISATableHeader
      :sticky="false"
      :columns="props.tableFields"
      hasCheckbox
      action
      :showActionText="false"
    />
    <tbody ref="tBodyRef">
      <MISATableRow v-for="(data, index) in props.data" :key="'row' + index">
        <MISATableData type="checkbox">
          <MISACheckbox :value="false" @mousedown.stop.prevent.self="$emit('selectRow', data.id)" />
        </MISATableData>
        <MISATableData
          v-for="column in tableFields"
          :key="'td' + index + column.recordingCode"
          :type="column.type"
          :position="column.position"
        >
          {{ data[column.field] }}
        </MISATableData>
        <MISATableData width="50px" type="action">
          <MISAButton
            width="24px"
            height="24px"
            @click="$emit('changeRecord', data.id)"
            transparent
            type="icon"
            ><i class="icon-pencil"></i
          ></MISAButton>
          <MISAButton
            width="24px"
            height="24px"
            @click="$emit('deleteRecord', data.id)"
            transparent
            type="icon"
            ><i class="icon-delete-red"></i
          ></MISAButton>
        </MISATableData>
      </MISATableRow>
      <tr v-if="heightBalance > 0" :height="heightBalance">
        <td :height="heightBalance" colspan="8"></td>
      </tr>
    </tbody>
    <MISATableFooter :totalColumn="8" :colspan="5" :isSumDataSameRow="false">
      <td colspan="5"></td>
      <td style="text-align: right; padding-right: 16px; font-weight: 600">{{ sumCost }}</td>
      <td colspan="2"></td>
    </MISATableFooter>
  </table>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  tableFields: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  heightInfor: {
    type: Number,
    default: 0
  }
})

const tBodyRef = ref(null)

const heightBalance = ref(0)

onMounted(() => {
  if (tBodyRef.value) {
    const height = tBodyRef.value.clientHeight
    console.log(height - props.data.length * 40)
    heightBalance.value = height - props.data.length * 40
  }
})

watch(
  () => props.data.length,
  (newValue) => {
    if (tBodyRef.value) {
      const height = tBodyRef.value.clientHeight
      console.log(height - newValue * 40)
      heightBalance.value = height - newValue * 40
    }
  }
)

watch(
  () => props.heightInfor,
  () => {
    if (tBodyRef.value) {
      const height = tBodyRef.value.clientHeight
      console.log(height - props.data.length * 40)
      heightBalance.value = height - props.data.length * 40
    }
  }
)

const sumCost = computed(() => {
  return props.data.reduce((sum, data) => sum + data.cost, 0)
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
  position: relative;
  border-radius: 4px;
  height: 100%;
  -webkit-box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
  box-shadow: 0px -1px 1px rgba(50, 50, 50, 0.75);
}
</style>
