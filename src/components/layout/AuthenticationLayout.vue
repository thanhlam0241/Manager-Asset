<template>
  <div class="layout-authentication">
    <img class="layout-header" src="/src/assets/image/page-title.webp" alt="Hello world" />
    <router-view></router-view>
  </div>
</template>

<script setup></script>

<style scoped>
.layout-authentication {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/src/assets/image/background.png') no-repeat center center fixed;
}
.layout-header {
  position: fixed;
  top: -10px;
  height: 57px;
}
</style>
