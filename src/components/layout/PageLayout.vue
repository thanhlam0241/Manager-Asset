<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeaderLayout from './components/HeaderLayout.vue'
import SidebarLayout from './components/SidebarLayout.vue'
import MISAStack from '@/components/base/MISAStack.vue'
import useEmitter from '@/hooks/useEmitter.js'
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

/**
 * Ref của sidebar
 * @type {import('vue').Ref<HTMLElement>}
 * Created by: NTLam (20/07/2023)
 */
const sidebarShow = ref(true)

onMounted(() => {
  emitter.on('toast-message', addToastMessage)
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

/**
 * Toggle sidebar
 * Created by: NTLam (20/07/2023)
 */
const toggleSidebar = () => {
  sidebarShow.value = !sidebarShow.value
}
</script>

<template>
  <main :class="['main__container', sidebarShow ? 'show' : 'hidden']">
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
    <SidebarLayout @toggle="toggleSidebar" :sidebar-show="sidebarShow" />
    <HeaderLayout :sidebar-show="sidebarShow" />
    <slot />
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
