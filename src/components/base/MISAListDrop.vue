<template>
  <div ref="dropContainer" @click.self.stop="toggle" class="drop-container">
    {{ props.label }}
    <Teleport to="body">
      <div :class="{ visible: open }" ref="listContainer" v-click-outside="hide" class="list-drop">
        <div class="list-item-head">
          <span class="span-key">Mã</span>
          <span class="span-value">Tên</span>
        </div>
        <div class="list-item" v-for="(item, index) in props.keyValue" :key="index">
          <span class="span-key">{{ item.key }}</span>
          <span class="span-value">{{ item.value }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

/**
 * Define props
 * Created by: NTLam (2023-07-05).
 */
const props = defineProps({
  label: {
    type: String,
    default: 'label'
  },
  keyValue: {
    type: Array,
    default: () => []
  }
})

/**
 * Define refs
 * Created by: NTLam (2023-07-05).
 */
const open = ref(false)

/**
 * The drop container ref
 * Created by: NTLam (2023-07-05).
 */
const dropContainer = ref(null)

/**
 * The list container ref
 * Created by: NTLam (2023-07-05).
 */
const listContainer = ref(null)

/**
 * Hide the list
 * Created by: NTLam (2023-07-05).
 */
const hide = () => {
  open.value = false
}

// const show = () => {
//   open.value = true
// }

const toggle = () => {
  open.value = !open.value
}

/**
 * Watch the open state
 * Created by: NTLam (2023-07-05).
 */
watch(open, (newValue) => {
  if (newValue) {
    let offsetTop = dropContainer.value.offsetTop
    let offsetHeight = dropContainer.value.offsetHeight
    let offsetLeft = dropContainer.value.offsetLeft

    console.log(listContainer.value)
    listContainer.value.style.top = `${offsetTop + offsetHeight + 2}px`
    listContainer.value.style.left = `${offsetLeft}px`
  }
})

/**
 * Event that is triggered when a click occurs outside the combobox.
 * Created by: NTLam (2023-07-05).
 */
const vClickOutside = {
  mounted: function (el, binding) {
    el.ClickOutsideHandler = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.ClickOutsideHandler)
  },
  unmounted: function (el) {
    document.body.removeEventListener('click', el.ClickOutsideHandler)
  }
}
</script>

<style scoped>
.drop-container {
  /* position: relative; */
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.list-drop {
  position: fixed;
  width: 300px;
  min-height: 100px;
  max-height: 300px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: auto;
  padding: 10px;
  gap: 2px;
  z-index: 100000;
  cursor: text;

  visibility: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.list-drop.visible {
  visibility: visible !important;
}

.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.list-item-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #ccc;
  font-weight: 1000;
}

.span-key {
  width: 100px;
}
.span-value {
  padding: 5px;
}
</style>
