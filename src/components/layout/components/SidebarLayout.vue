<script setup>
import MISASidebarLink from '@/components/base/MISASidebarLink.vue'
import sidebarRoutes from '@/helper/routes.js'

defineProps({
  sidebarShow: Boolean
})
</script>

<template>
  <div class="sidebar">
    <nav :class="['nav__sidebar', sidebarShow ? 'show' : 'hide']">
      <div class="nav__header">
        <i class="image-app"></i>
        <h1 v-if="sidebarShow">MISA QLTS</h1>
      </div>
      <div class="div__router">
        <MISASidebarLink
          v-for="route in sidebarRoutes"
          :key="route.name"
          :route="route"
          :show="sidebarShow"
        />
      </div>
    </nav>

    <div class="nav_footer" :class="sidebarShow ? 'show' : 'hide'">
      <i
        :class="[
          sidebarShow ? 'icon-square-left-arrow' : 'icon-square-right-arrow',
          'icon__interactive'
        ]"
        @click="$emit('toggle')"
      ></i>
    </div>
  </div>
</template>

<style scoped>
.space {
  height: 50px;
}
.sidebar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #001833;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: var(--z-index-layout);
  padding-bottom: 15px;
}
.nav__sidebar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  padding: 12px 20px;
  gap: 36px;
  flex-grow: 1;
  /* transition: all 0.5s ease; */
  overflow-y: auto;
}
.nav__sidebar::-webkit-scrollbar {
  width: 0px;
}
.nav__router-link.active {
  background: var(--nav-link-active-color);
}
.nav__router-link {
  color: #fff;
  font-weight: 400;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--border-radius-size);
  height: 48px;
}
.route__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
  transform: scale(1);
  transition: all 0.5s ease;
}
.route__content.hide {
  transform: scale(0);
  transition: all 0.5s ease;
}
h1.hide {
  transform: scaleX(0);
  transition: all 0.5s ease;
}
h1 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.5s ease;
  transform: scale(1);
}
.nav__header {
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  padding: 0 6px;
  position: sticky;
  /* transition: all 0.5s ease; */
}

.nav__header.hide {
  justify-content: center;
}
.div__router {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  position: relative;
}
.nav__sidebar.show {
  width: var(--sidebar-width-show);
}
.icon__interactive {
  cursor: pointer;
}
.nav__sidebar.hide {
  width: var(--sidebar-width-hide);
  /* transition: all 0.5s ease; */
}

.nav_footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #fff;
  padding: 10px 10px 0 10px;
}

.nav_footer.show {
  width: var(--sidebar-width-show);
}

.nav_footer.hide {
  width: var(--sidebar-width-hide);
}
</style>
