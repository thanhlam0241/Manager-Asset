<script setup>
// Router
import { RouterLink } from 'vue-router'
import useResources from '@/hooks/useResources.js'
import { ref } from 'vue'

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

const open = ref(false)
</script>

<template>
  <div>
    <RouterLink exact-active-class="active" class="nav__router-link">
      <i :class="route.icon"></i>
      <div v-if="props.show" class="route__content link__collapse">
        {{ routePage[props.route.name].NAV }}
        <i v-if="props.route.collapse" class="icon-angle-down-white"></i>
      </div>
    </RouterLink>
    <div class="div__collapse" :class="[{ hide: open }]" v-if="props.show && props.route.children">
      <RouterLink
        exact-active-class="active"
        class="link-collapse"
        v-for="subRoute in props.route.children"
        :key="subRoute.name"
        :to="subRoute.path"
      >
        {{ routePage[props.route.name].CHILDREN[subRoute.name] }}}
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
  gap: 2px;
  transition: all 0.5s ease;
}
.div__collapse.hide {
  height: 0;
  transition: all 0.5s ease;
}
</style>
