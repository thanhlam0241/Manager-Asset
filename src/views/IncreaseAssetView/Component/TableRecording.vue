<template>
  <table>
    <MISATableHeader
      :sticky="false"
      :columns="props.tableFields"
      hasCheckbox
      action
      :showActionText="false"
    />
    <tbody>
      <MISATableRow v-for="(data, index) in props.data" :key="'row' + index">
        <MISATableData type="checkbox">
          <MISACheckbox :value="false" @mousedown.stop.prevent.self="$emit('selectRow', data.id)" />
        </MISATableData>
        <MISATableData
          v-for="column in tableFields"
          :key="'td' + index + column.recordingCode"
          :type="column.type"
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
      <!-- <tr height="40">
        <td style="height: 40px">Hello</td>
      </tr> -->
    </tbody>
    <MISATableFooter :colspan="5"></MISATableFooter>
  </table>
</template>

<script setup>
const props = defineProps({
  tableFields: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
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
}
</style>
