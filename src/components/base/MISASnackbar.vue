<template>
  <div class="snackbar show" :class="props.type">
    <div class="content">
      <!-- <strong>{{ typeText }}</strong> -->
      <img class="icon-snackbar" :src="srcImage" alt="Hello" />
      <span> <slot /></span>
    </div>
    <span class="snackber-close">
      <i @click="onClose" class="icon-close"></i>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import imageSuccess from '@/assets/icon/success.png'
import imageError from '@/assets/icon/error.webp'
import imageWarning from '@/assets/icon/warning.png'

/**
 * Props của snackbar
 * @type {Object}
 * @property {String} type - Loại snackbar
 * @property {Number} zIndex - Z-index của snackbar
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validate: (type) => {
      return ['success', 'error', 'warning', 'info'].includes(type)
    }
  },
  zIndex: {
    type: Number,
    default: 100
  }
})

/**
 * Emit của snackbar
 * @type {Object}
 * @property {Function} close - Đóng snackbar
 * Created by: NTLam (20/07/2023)
 */
const emit = defineEmits(['close'])

/**
 * Text của snackbar
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
// const typeText = computed(() => {
//   switch (props.type) {
//     case 'success':
//       return 'Thành công!'
//     case 'error':
//       return 'Lỗi!'
//     case 'warning':
//       return 'Cảnh báo!'
//     case 'info':
//       return 'Thông tin!'
//     default:
//       return 'Thông báo!'
//   }
// })

const srcImage = computed(() => {
  switch (props.type) {
    case 'success':
      return imageSuccess
    case 'error':
      return imageError
    case 'warning':
      return imageWarning
    case 'info':
      return imageError
    default:
      return imageSuccess
  }
})

/**
 * Z-index của snackbar
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const zIndex = computed(() => {
  return props.zIndex || 'var(--z-index-snackbar)'
})

/**
 * Đóng snackbar
 * Created by: NTLam (20/07/2023)
 */
const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.snackbar {
  visibility: hidden;
  min-width: 300px;
  width: auto;
  height: auto;
  /* margin-left: -125px; */
  color: #000;
  border-radius: 4px;
  padding: 12px;
  /* position: absolute; */
  z-index: v-bind(zIndex);
  /* right: 30px; */
  font-size: 15px;
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  border-left: 5px solid;
  outline: 1px solid #ccc;
  box-shadow: 0 0 10px #999;
}

.content {
  display: flex;
  padding-left: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 5px;
}
.content b {
  width: 100px !important;
}

.icon-snackbar {
  height: 24px;
  width: 24px;
  margin-right: 16px;
}

.snackbar.success {
  border-color: #80d383;
}

.snackbar.error {
  border-color: #db726b;
}

.snackbar.warning {
  border-color: #f0be72;
}

.snackbar.info {
  border-color: #60adeb;
}
.snackber-close {
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;
}
@-webkit-keyframes fadein {
  from {
    /* right: 0; */
    opacity: 0;
  }
  to {
    /* right: 30px; */
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    /* right: 0; */
    opacity: 0;
  }
  to {
    /* right: 30px; */
    opacity: 1;
  }
}

/* @-webkit-keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
} */
</style>
