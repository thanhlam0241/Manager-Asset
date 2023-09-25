<script setup>
// Router
import { RouterLink } from 'vue-router'
import useResources from '@/hooks/useResources.js'
import { computed } from 'vue'
import router from '@/router'
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  route: {
    type: Object,
    required: true
  }
})

const routePage = useResources().routePage

const heightCollapse = computed(() => {
  if (props.route.childPath) {
    return props.route.childPath.length * (48 + 5) + 'px'
  }
  return 0
})

const isActive = computed(() => {
  const splitPath = router.currentRoute.value.path.split('/')
  return splitPath[1] === props.route.path.split('/')[1]
})
</script>

<template>
  <div class="nav-container">
    <RouterLink :class="[{ active: isActive }]" class="nav__router-link" :to="props.route.path">
      <i :class="route.icon"></i>
      <div v-if="props.show" class="route__content link__collapse">
        {{ routePage[props.route.name].NAV }}
        <i v-if="props.route.collapse" class="icon-angle-down-white"></i>
      </div>
    </RouterLink>
    <div
      ref="divCollapse"
      class="div__collapse"
      :class="[{ hide: !isActive }]"
      v-if="props.show && props.route.childPath"
    >
      <RouterLink
        exact-active-class="active"
        class="link-collapse"
        v-for="subRoute in props.route.childPath"
        :key="subRoute.name"
        :to="route.path + '/' + subRoute.path"
      >
        {{ routePage[props.route.name].CHILDREN[subRoute.name] }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.nav__router-link.active {
  background: var(--nav-link-active-color);
}
.nav__router-link {
  color: #fff;
  font-weight: 400;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--border-radius-size);
  height: 48px;
}
.link-collapse {
  color: #fff;
  font-weight: 400;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding-left: 24px;
  border-radius: var(--border-radius-size);
  height: 48px;
}

.link-collapse:hover {
  background-color: #3f5065;
}

.route__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
  transform: scale(1);
  transition: all 0.5s ease;
}
.route__content.hide {
  transform: scale(0);
  transition: all 0.5s ease;
}

.div__collapse {
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: height 1s ease-out;
  background-color: #33455b;
  border-radius: 4px;
  overflow: hidden;
  height: v-bind(heightCollapse);
}
.div__collapse.hide {
  height: 0;
  transition: height 1s ease-out;
}
</style>
