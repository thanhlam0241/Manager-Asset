import store from '@/store/store'
import { computed } from 'vue'
import { routePage } from '@/assets/resources/common'
export default function useResources() {
    const lang = computed(() => store.state.lang)

    return {
        routePage: computed(() => routePage[lang.value])
    }
}