<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
// import PageLayout from '@/components/layout/PageLayout.vue'
import MISAStack from '@/components/base/MISAStack.vue'
import useEmitter from '@/hooks/useEmitter.js'
import authenticateApi from '@/service/api/authenticateApi'
import router from '@/router/index.js'

//Toast message
/**
 * This component defines a MISATable that can be used to display data in a table format.
 *
 * @typedef {Object} ToastMessage
 * @property {string} message - The message to be displayed in the toast.
 * @property {string} type - The type of the toast message (e.g. success, warning, error).
 * Creatd by: NTLam (15/8/2023)
 */
const toastMessages = ref([])

const emitter = useEmitter()

onMounted(() => {
  emitter.on('toast-message', addToastMessage)

  authenticateApi.checkLogin().then(
    (response) => {
      console.log(response)
      //router.push('/')
    },
    (error) => {
      console.log(error)
      router.push('/authentication/login')
    }
  )
})

onUnmounted(() => {
  emitter.off('toast-message', addToastMessage)
})

/**
 * Adds a toast message to the MISATable component.
 *
 * @param {string} type - The type of the toast message (e.g. success, error, warning).
 * @param {string} message - The message to display in the toast.
 * Creatd by: NTLam (15/8/2023)
 */
const addToastMessage = ({ type, message }) => {
  console.log(message)
  toastMessages.value.push({
    type,
    message
  })
  setTimeout(() => {
    toastMessages.value.shift()
  }, 10000)
}

/**
 * Removes the toast message at the specified index.
 * @param {number} index - The index of the toast message to remove.
 * Creatd by: NTLam (15/8/2023)
 */
const removeToastMessage = (index) => {
  toastMessages.value.splice(index, 1)
}
</script>

<template>
  <div>
    <MISAStack type="fixed" vertical="bottom" horizontal="right">
      <MISASnackbar
        @close="() => removeToastMessage(index)"
        :type="toast.type"
        v-for="(toast, index) in toastMessages"
        :key="index"
      >
        {{ toast.message }}
      </MISASnackbar>
    </MISAStack>
    <RouterView />
  </div>
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
