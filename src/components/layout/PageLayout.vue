<script setup>
import { ref } from 'vue'
import HeaderLayout from './components/HeaderLayout.vue'
import SidebarLayout from './components/SidebarLayout.vue'

/**
 * Ref của sidebar
 * @type {import('vue').Ref<HTMLElement>}
 * Created by: NTLam (20/07/2023)
 */
const sidebarShow = ref(true)

const toggleSidebar = () => {
  sidebarShow.value = !sidebarShow.value
}
</script>

<template>
  <main :class="['main__container', sidebarShow ? 'show' : 'hidden']">
    <SidebarLayout @toggle="toggleSidebar" :sidebar-show="sidebarShow" />
    <HeaderLayout :sidebar-show="sidebarShow" />
    <router-view></router-view>
  </main>
</template>

<style scoped>
.main__container {
  width: 100%;
  height: 100%;
  padding-right: var(--padding-main-content);
  padding-bottom: calc(var(--padding-main-content) - 4px);
  padding-top: calc(var(--header-height) + var(--padding-main-content) - 17px);
}

.main__container.show {
  padding-left: calc(var(--sidebar-width-show) + var(--padding-main-content));
}

.main__container.hidden {
  padding-left: calc(var(--sidebar-width-hide) + var(--padding-main-content));
}
</style>
