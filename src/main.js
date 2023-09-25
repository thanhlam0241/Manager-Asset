import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import emitter from '@/helper/emitter'

import store from '@/store/store'

//component
import MISACombobox from '@/components/base/MISACombobox.vue'
import MISABackdrop from '@/components/base/MISABackdrop.vue'
import MISAButton from '@/components/base/MISAButton.vue'
import MISACheckbox from '@/components/base/MISACheckbox.vue'
import MISADialog from '@/components/base/MISADialog.vue'
import MISAInput from '@/components/base/MISAInput.vue'
import MISALoading from '@/components/base/MISALoading.vue'
import MISARadio from '@/components/base/MISARadio.vue'
import MISASnackbar from '@/components/base/MISASnackbar.vue'
import MISATextfield from '@/components/base/MISATextfield.vue'
import MISATooltip from '@/components/base/MISATooltip.vue'
import MISAFormControl from '@/components/base/MISAFormControl.vue'
import MISASkeleton from '@/components/base/MISASkeleton.vue'
import MISASearchBox from '@/components/base/MISASearchBox.vue'
import MISATableHeader from '@/components/base/MISATableHeader.vue'
import MISATableBody from '@/components/base/MISATableBody.vue'
import MISATableFooter from '@/components/base/MISATableFooter.vue'

const app = createApp(App)

app.config.globalProperties.emitter = emitter

app.component('MISACombobox', MISACombobox)
app.component('MISABackdrop', MISABackdrop)
app.component('MISAButton', MISAButton)
app.component('MISACheckbox', MISACheckbox)
app.component('MISADialog', MISADialog)
app.component('MISAInput', MISAInput)
app.component('MISALoading', MISALoading)
app.component('MISARadio', MISARadio)
app.component('MISASnackbar', MISASnackbar)
app.component('MISATextfield', MISATextfield)
app.component('MISATooltip', MISATooltip)
app.component('MISAFormControl', MISAFormControl)
app.component('MISASkeleton', MISASkeleton)
app.component('MISASearchBox', MISASearchBox)
app.component('MISATableHeader', MISATableHeader)
app.component('MISATableBody', MISATableBody)
app.component('MISATableFooter', MISATableFooter)

app.use(router)

app.use(store)

app.mount('#app')


