<script setup>
// Router
import { RouterLink } from 'vue-router'
// Resources
import { routePage } from '@/assets/resources/common.js'
//store vuex
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

const lang = computed(() => store.state.lang)

console.log(lang.value)

defineProps({
  sidebarShow: Boolean
})
</script>

<template>
  <nav :class="['nav__sidebar', sidebarShow ? 'show' : 'hide']">
    <div class="nav__header">
      <i class="image-app"></i>
      <h1 v-if="sidebarShow">MISA QLTS</h1>
    </div>
    <div class="div__router">
      <RouterLink exact-active-class="active" class="nav__router-link" to="/">
        <i class="image-computer-fluctuate-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['OUTLINE']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/assets">
        <i class="image-asset-varient"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['ASSET']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/excel">
        <i class="image-asset-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['ASSET_HTDB']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/">
        <i class="image-tool-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['TOOL']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/">
        <i class="image-catalog-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['CATALOG']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/">
        <i class="image-discover-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['SEARCH']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
      <RouterLink exact-active-class="active" class="nav__router-link" to="/">
        <i class="image-report-outline"></i>
        <div v-if="sidebarShow" class="route__content link__collapse">
          {{ routePage[lang]['REPORT']['NAV'] }}
          <i class="icon-angle-down-white"></i>
        </div>
      </RouterLink>
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
  </nav>
</template>

<style scoped>
.nav__sidebar {
  height: 100vh;
  background-color: #001833;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 20px;
  gap: 36px;
  /* transition: all 0.5s ease; */
  z-index: var(--z-index-layout);
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
  position: absolute;
  bottom: 0;
  left: -20px;
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
