<script setup>
import { ref } from 'vue'
import useClickOutside from '@/components/composables/useClickOutside'
defineProps({
  sidebarShow: Boolean
})

const vClickOutside = useClickOutside(document)

const isShowPopup = ref(false)

const togglePopup = () => {
  isShowPopup.value = true
}

const closePopup = () => {
  isShowPopup.value = false
}
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
          <div v-click-outside="closePopup" class="div_show_option" @click="togglePopup">
            <i class="icon-user">
              <i class="icon-caret-down"></i>
            </i>
            <div :class="['options', { show: isShowPopup }]">
              <ul>
                <li>
                  <i class="icon-user"></i>
                  <span>Thông tin cá nhân</span>
                </li>
                <li>
                  <i class="icon-logout"></i>
                  <span>Đăng xuất</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header></Teleport
  >
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

.div_show_option {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
}
.options {
  position: absolute;
  width: 150px;
  top: calc(100% + 4px);
  right: 0;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  visibility: hidden;
}

.options.show {
  visibility: visible;
}

.options li {
  list-style: none;
  padding: 5px;
  border-radius: 4px;
}

.options li:hover {
  background-color: #f5f5f5;
  cursor: pointer;
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
