<script setup>
defineProps({
  sidebarShow: Boolean
})
</script>

<template>
  <Teleport to="body">
    <header :class="['header__layout', sidebarShow ? 'show' : 'hide']">
      <h2>Danh sách tài sản</h2>
      <div class="header__more">
        <h3>Sổ tài chính</h3>
        <MISAInput
          type="number"
          defaultValue="2021"
          label="Năm"
          color="primary"
          width="50px"
          :border="false"
          bold
          action
        />
        <div class="header__action">
          <i class="icon-bell-outline"></i>
          <i class="icon-grid"></i>
          <i class="icon-question"></i>
          <i class="icon-user">
            <i class="icon-caret-down"></i>
          </i>
        </div>
      </div></header
  ></Teleport>
</template>

<style scoped>
.header__layout {
  height: var(--header-height);
  background-color: #fff;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 24px;
  z-index: var(--z-index-layout);
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  gap: 10px;
}

h2 {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header__layout.show {
  width: calc(100vw - var(--sidebar-width-show));
  left: var(--sidebar-width-show);
}

.header__layout.hide {
  width: calc(100vw - var(--sidebar-width-hide));
  left: var(--sidebar-width-hide);
}
.header__more {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-direction: row;
}
.header__action {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 16px;
  padding-left: 4px;
}
.icon-user {
  position: relative;
}
.icon-caret-down {
  position: absolute;
  top: 8px;
  right: -16px;
}
</style>
