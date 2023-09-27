<script setup>
import TableInformation from './Component/TableInformation.vue'
import TableRecording from './Component/TableRecording.vue'

import { ref } from 'vue'

const tableFields = [
  {
    id: 1,
    field: 'order',
    label: 'STT',
    type: 'order',
    position: 'center'
  },
  {
    id: 2,
    field: 'recordingCode',
    label: 'Số chứng từ',
    type: 'text'
  },
  {
    id: 3,
    field: 'recordingDate',
    label: 'Ngày chứng từ',
    type: 'date'
  },
  {
    íd: 4,
    field: 'actionDate',
    label: 'Ngày ghi tăng',
    type: 'date'
  },
  {
    id: 5,
    field: 'cost',
    label: 'Tổng nguyên giá',
    type: 'number'
  },
  {
    id: 6,
    field: 'description',
    label: 'Nội dung',
    type: 'text',
    width: '40%'
  }
]

const dataArray = ref([
  {
    order: 1,
    recordingCode: 'ABC123',
    recordingDate: '2023-09-26',
    actionDate: '2023-09-27',
    cost: 1000,
    description: 'Lorem ipsum dolor sit amet.',
    checked: false
  },
  {
    order: 2,
    recordingCode: 'DEF456',
    recordingDate: '2023-09-27',
    actionDate: '2023-09-28',
    cost: 1500,
    description: 'Consectetur adipiscing elit.',
    checked: false
  }
  // Add more data objects as needed
])
</script>

<template>
  <div class="asset-page">
    <div class="page-header">
      <h1>Ghi tăng tài sản</h1>
      <div class="header-action__container">
        <MISAButton padding>Thêm</MISAButton>
        <div class="header_action">
          <div>
            <i class="icon-increase-page"></i>
          </div>
          <div>
            <i class="icon-angle-down"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="table-container">
      <div class="table-container__header">
        <MISASearchBox style="width: 400px" />
        <div class="table-container__action">
          <MISAButton transparent width="36px" shadow type="icon"
            ><i class="icon-print"></i
          ></MISAButton>
          <MISAButton transparent width="36px" shadow type="icon"
            ><i class="icon-ellpise"></i
          ></MISAButton>
        </div>
      </div>
      <div class="table">
        <TableRecording :tableFields="tableFields" :data="dataArray" />
      </div>
    </div>
    <TableInformation />
  </div>
</template>

<style scoped>
.asset-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.page-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
}
.header-action__container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.header_action {
  width: 70px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 4px;
}
.header_action > div {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.table-container {
  background-color: #fff;
  flex-grow: 1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.table-container__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
}
.table-container__action {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.table {
  flex-grow: 1;
  overflow: auto;
}
</style>
