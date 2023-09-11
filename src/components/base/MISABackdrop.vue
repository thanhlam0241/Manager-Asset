<template>
  <div class="backdrop">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * MISABackdrop component props
 * @props {boolean} visible - Determines whether the backdrop is visible or not
 * @props {string} color - The color of the backdrop
 * @props {number} opacity - The opacity of the backdrop
 * Creatd by: NTLam (15/8/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'fullscreen',
    validate: (type) => {
      return ['fullscreen', 'fullparent'].includes(type)
    }
  },
  top: {
    type: String,
    default: '0px'
  },
  left: {
    type: String,
    default: '0px'
  },
  bottom: {
    type: String,
    default: '0px'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.45)'
  },
  zIndex: {
    type: String,
    default: '99'
  }
})

/**
 * Computes the position of the MISABackdrop component.
 * @computed position
 * @returns {Object} An object containing the position of the component.
 * Creatd by: NTLam (15/8/2023)
 */
const position = computed(() => {
  return props.type === 'fullscreen' ? 'fixed' : 'absolute'
})

/**
 * Computed property that returns the width of the backdrop element based on the type prop.
 * If the type prop is 'fullscreen', the width is set to '100vw', otherwise it is set to '100%'.
 *
 * @returns {string} The width of the backdrop element.
 * Creatd by: NTLam (15/8/2023)
 */
const width = computed(() => {
  return props.type === 'fullscreen' ? '100vw' : '100%'
})

/**
 * Computed property that returns the z-index of the MISABackdrop component.
 * @computed zIndex
 * @returns {number} The z-index of the component.
 * Creatd by: NTLam (15/8/2023)
 */
const zIndex = computed(() => {
  return props.zIndex
})

/**
 * Calculates the height of the MISABackdrop component.
 * @computed height
 * @returns {number} The height of the component.
 * Creatd by: NTLam (15/8/2023)
 */
const height = computed(() => {
  return props.type === 'fullscreen' ? '100vh' : '100%'
})

/**
 * Computes the top position of the MISABackdrop component.
 * @computed top
 * @returns {number} The top position of the component.
 * Creatd by: NTLam (15/8/2023)
 */
const top = computed(() => {
  return props.top
})

/**
 * Computes the left position of the backdrop element.
 * @computed left
 * @return {number} The left position of the backdrop element.
 * Creatd by: NTLam (15/8/2023)
 */
const left = computed(() => {
  return props.left
})

/**
 * Computed property that returns the background color of the MISABackdrop component.
 * @computed backgroundColor
 * @returns {string} The background color of the component.
 * Creatd by: NTLam (15/8/2023)
 */
const backgroundColor = computed(() => {
  return props.backgroundColor
})

/**
 * Computed property that returns the bottom position of the MISABackdrop component.
 * @name bottom
 * @type {ComputedRef<number>}
 * @memberof MISABackdrop
 * @instance
 * Creatd by: NTLam (15/8/2023)
 */
const bottom = computed(() => {
  return props.bottom
})
</script>

<style>
.backdrop {
  position: v-bind(position);
  top: v-bind(top);
  left: v-bind(left);
  z-index: v-bind(zIndex);
  width: v-bind(width);
  height: calc(v-bind(height) - v-bind(top) - v-bind(bottom));
  background-color: v-bind(backgroundColor);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
