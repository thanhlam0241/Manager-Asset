import { createStore } from 'vuex'
import { language } from '@/assets/resources/common'
// Create a new store instance.
const store = createStore({
    state() {
        return {
            lang: language['VI']
        }
    },
    mutations: {
        changeLanguage(state, lang) {
            state.lang = language[lang]
        }
    }
})

export default store