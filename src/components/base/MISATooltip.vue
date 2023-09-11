<script setup>
/**
 * Props của radio
 * @type {Object}
 * @property {String} text - Text của radio
 * @property {String} position - Vị trí của radio
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  text: {
    type: String,
    default: 'radio'
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => {
      return [
        'top',
        'right',
        'bottom',
        'left',
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left'
      ].includes(value)
    }
  },
  zIndex: {
    type: String,
    default: '10'
  },
  mode: {
    type: String,
    default: 'light',
    validator: (value) => {
      return ['dark', 'light'].includes(value)
    }
  },
  width: {
    type: String,
    default: 'auto'
  }
})

/**
 * Class của radio
 * Created by: NTLam (20/07/2023)
 */
const positionClass = {
  top: 'tooltip--top',
  right: 'tooltip--right',
  bottom: 'tooltip--bottom',
  left: 'tooltip--left',
  'top-right': 'tooltip--top-right',
  'top-left': 'tooltip--top-left',
  'bottom-right': 'tooltip--bottom-right',
  'bottom-left': 'tooltip--bottom-left'
}

/**
 * Class của radio
 * Created by: NTLam (20/07/2023)
 */
const modeClass = {
  dark: 'tooltip--dark',
  light: 'tooltip--light'
}
</script>

<template>
  <div class="tooltip">
    <!-- <div class="tooltip__icon">
      <i class="icon-info"></i>
    </div> -->
    <slot />
    <div :class="['tooltip__content', positionClass[props.position], modeClass[props.mode]]">
      <div class="tooltip__content--text">{{ props.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  z-index: v-bind(zIndex);
}

.tooltip__icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #999;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.tooltip__icon:hover {
  background-color: #999;
  color: #fff;
}

.tooltip__content {
  position: absolute;
  max-width: 300px;
  min-width: 100px;
  height: auto;
  max-height: 100px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: none;
  transition: all 0.3s ease;
  top: 0;
  left: 0;
  z-index: 11;
}

.tooltip__content--text {
  font-size: 12px;
  text-align: left;
}

.tooltip__content.tooltip--dark {
  background-color: var(--color-black);
  color: var(--color-white);
}

.tooltip__content.tooltip--light {
  background-color: var(--color-white);
  color: var(--color-black);
}

.tooltip:hover .tooltip__content.tooltip--top {
  display: block;
  top: 0;
  margin-top: -4px;
  transform: translateY(-100%);
}
.tooltip:hover .tooltip__content.tooltip--left {
  display: block;
  top: 0;
  left: 0;
  margin-left: -4px;
  transform: translateX(-100%);
}
.tooltip:hover .tooltip__content.tooltip--right {
  display: block;
  top: 0;
  left: 100%;
  margin-left: 4px;
  /* transform: translateX(100%); */
}
.tooltip:hover .tooltip__content.tooltip--bottom {
  display: block;
  top: 100%;
  left: 50%;
  margin-top: 4px;
  /* transform: translateX(100%); */
}

.tooltip:hover .tooltip__icon {
  background-color: #999;
  color: #fff;
}

.tooltip--top .tooltip__content {
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
