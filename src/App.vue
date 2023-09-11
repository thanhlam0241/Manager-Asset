<script setup>
import { RouterView } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
</script>

<template>
  <PageLayout>
    <RouterView />
  </PageLayout>
</template>

<style scoped>
.nav__sidebar {
  height: 100vh;
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
}

.nav__sidebar.show {
  width: var(--sidebar-width-show);
}
.nav__sidebar.hide {
  width: var(--sidebar-width-hide);
}

.header__layout {
  height: 50px;
  background-color: #ccc;
  position: fixed;
  top: 0;
}

.header__layout.show {
  width: calc(100vw - var(--sidebar-width-show));
  left: var(--sidebar-width-show);
}

.header__layout.hide {
  width: calc(100vw - var(--sidebar-width-hide));
  left: var(--sidebar-width-hide);
}
</style>
