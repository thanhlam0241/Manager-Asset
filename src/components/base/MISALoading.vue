<script setup>
import { computed } from 'vue'

/**
 * Props của loading
 * @type {Object}
 * @property {String} type - Loại loading
 * @property {String} width - Chiều rộng của loading
 * @property {String} height - Chiều cao của loading
 * @property {Boolean} loading - Trạng thái loading
 * Created by: NTLam (20/07/2023)
 */
const props = defineProps({
  type: {
    type: String,
    default: 'circle',
    validate: (type) => {
      return ['circle', 'linear'].includes(type)
    }
  },
  width: {
    type: String,
    default: '50px'
  },
  height: {
    type: String,
    default: '50px'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

/**
 * Chiều rộng của loading
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const width = computed(() => {
  return props.width
})

/**
 * Chiều cao của loading
 * @type {import('vue').ComputedRef<String>}
 * Created by: NTLam (20/07/2023)
 */
const height = computed(() => {
  return props.height
})
</script>

<template>
  <div
    :class="[
      { loader: props.type === 'circle' },
      { linear: props.type === 'linear' },
      { loading: props.loading }
    ]"
  ></div>
</template>

<style scoped>
.linear {
  height: 4px;
  width: 100%;
  background-color: transparent;
}
.loading {
  height: 4px;
  background-color: #ff0000;
  position: relative;
  overflow: hidden;
}
@keyframes slide-away {
  0% {
    transform: translate(-100%, 0);
  }
  100% {
    transform: translate(400%, 0);
  }
}

.loading:before {
  content: '';
  display: block;
  position: absolute;
  height: 6px;
  background-color: #ffffff;
  width: 50%;
  top: -1px;
  left: 0;
  animation: slide-away 3s infinite linear;
}
.loading:after {
  content: '';
  display: block;
  position: absolute;
  height: 6px;
  background-color: #ffffff;
  width: 25%;
  top: -1px;
  left: 0;
  animation: slide-away 2s infinite linear;
}
.loader {
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  width: v-bind(width);
  height: v-bind(height);
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
