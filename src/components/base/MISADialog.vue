<script setup>
import { computed, ref } from 'vue'
import { types, keys } from '@/assets/resources/common'
import { dialogResource } from '@/assets/resources/dialog'
import image from '@/assets/icon/warning.png'
import useStore from '@/hooks/useStore'

/**
 * Store của ứng dụng
 * @type {import('vuex').Store}
 * Created by: NTLam (20/07/2023)
 */
const { store } = useStore()

/**
 * Ngôn ngữ hiện tại
 * @type {import('vue').Ref<String>}
 * Created by: NTLam (20/07/2023)
 */
const lang = computed(() => store.state.lang)

/**
 * Props của dialog
 * @type {Object}
 * @property {Boolean} open - Trạng thái open
 * @property {String} title - Tiêu đề của dialog
 * @property {String} width - Chiều rộng của dialog
 * @property {String} height - Chiều cao của dialog
 * @property {String} content - Nội dung của dialog
 * @property {String} icon - Icon của dialog
 * @property {String} type - Loại dialog
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  },
  width: {
    type: String,
    default: '500px'
  },
  height: {
    type: String,
    default: '200px'
  },
  content: {
    type: String,
    default: 'Hello world'
  },
  icon: {
    type: String,
    default: types.NONE,
    validate: (icon) => {
      return [types.NONE, types.SUCCESS, types.ERROR, types.WARNING, types.INFO].includes(icon)
    }
  },
  type: {
    type: String,
    default: types.DELETE,
    validate: (type) => {
      return [types.DELETE, types.CANCEL, types.SAVE, types.ERROR].includes(type)
    }
  }
})

/**
 * Ref của button sub
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonSub = ref(null)

/**
 * Ref của button main
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonMain = ref(null)

/**
 * Ref của button not agree
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonNotAgree = ref(null)

/**
 * Button sub title
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonSubTitle = computed(() => {
  if (props.type === types.DELETE || props.type === types.CANCEL) {
    return dialogResource[lang.value].BUTTON.NO
  } else if (props.type === types.SAVE) {
    return dialogResource[lang.value].BUTTON.CANCEL
  }
  return ''
})

/**
 * Button not agree title
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonNotAgreeTitle = computed(() => {
  if (props.type === types.SAVE) {
    return dialogResource[lang.value].BUTTON.NOT_SAVE
  }
  return ''
})

/**
 * Button main title
 * @type {import('vue').Ref<HTMLButtonElement>}
 * Created by: NTLam (20/07/2023)
 */
const buttonMainTitle = computed(() => {
  if (props.type === types.DELETE) {
    return dialogResource[lang.value].BUTTON.DELETE
  } else if (props.type === types.CANCEL) {
    return dialogResource[lang.value].BUTTON.CANCEL
  } else if (props.type === types.SAVE) {
    return dialogResource[lang.value].BUTTON.SAVE
  } else if (props.type === types.ERROR) {
    return dialogResource[lang.value].BUTTON.CLOSE
  }
  return ''
})

/**
 * Hành động khi nhấn phím
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onKeyDownSub = function (e) {
  if (e.keyCode === 9 || e.key === keys.ARROW_LEFT) {
    e.preventDefault()
    e.stopPropagation()
    buttonMain.value.focus()
  } else if (e.key === keys.ARROW_RIGHT) {
    e.preventDefault()
    e.stopPropagation()
    if (buttonNotAgree.value) {
      buttonNotAgree.value.focus()
    } else {
      buttonMain.value.focus()
    }
  }
}

/**
 * Hành động khi nhấn phím đang foccus vào button không đồng ý
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onKeydownNotAgree = function (e) {
  if (e.keyCode === 9 || e.key === keys.ARROW_LEFT) {
    e.preventDefault()
    e.stopPropagation()
    buttonSub.value.focus()
  } else if (e.key === keys.ARROW_RIGHT) {
    e.preventDefault()
    e.stopPropagation()
    buttonMain.value.focus()
  }
}

/**
 * Hành động khi nhấn phím
 * @param {*} e
 * Created by: NTLam (20/07/2023)
 */
const onKeyDownMain = function (e) {
  if (e.keyCode === 9 || e.key === keys.ARROW_LEFT) {
    e.preventDefault()
    e.stopPropagation()
    if (buttonNotAgree.value) {
      buttonNotAgree.value.focus()
    } else {
      buttonSub.value.focus()
    }
  } else if (e.key === keys.ARROW_RIGHT) {
    e.preventDefault()
    e.stopPropagation()
    buttonSub.value.focus()
  }
}
</script>

<template>
  <div tabindex="0" v-if="props.open" class="dialog__container">
    <div class="dialog">
      <h3 v-if="props.title" class="dialog__header">{{ props.title }}</h3>
      <div class="dialog__content">
        <img class="icon-warning-dialog" :src="image" alt="" />
        <p v-html="props.content"></p>
      </div>
      <div tabindex="0" class="dialog__footer">
        <MISAButton
          v-if="buttonMainTitle"
          @keydown="onKeyDownMain"
          ref="buttonMain"
          autofocus
          type="main"
          padding
          @click="$emit('agreeDialog')"
        >
          {{ buttonMainTitle }}
        </MISAButton>
        <MISAButton
          v-if="buttonNotAgreeTitle"
          @keydown="onKeydownNotAgree"
          ref="buttonNotAgree"
          type="sub"
          padding
          @click="$emit('notAgreeDialog')"
        >
          {{ buttonNotAgreeTitle }}
        </MISAButton>
        <MISAButton
          v-if="buttonSubTitle"
          @keydown="onKeyDownSub"
          ref="buttonSub"
          type="sub"
          padding
          @click="$emit('closeDialog')"
        >
          {{ buttonSubTitle }}
        </MISAButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog__container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
}
.dialog {
  width: v-bind(width);
  height: auto;
  background: var(--color-white);
  padding: 42px 24px 24px 24px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
}
.dialog__header {
  margin-bottom: 10px;
}
.icon-warning-dialog {
  width: 40px;
  height: 40px;
  background-color: transparent;
}
.dialog__content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
}
.dialog__footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  flex-direction: row-reverse;
}
</style>
