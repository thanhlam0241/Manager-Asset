import { createRouter, createWebHistory } from 'vue-router'

import ComponentView from '@/views/ComponentView.vue'
import TableView from '@/views/TableView.vue'
import MISAExcelEditor from '@/components/base/MISAExcelEditer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ComponentView
    },
    {
      path: '/excel',
      name: 'excel',
      component: MISAExcelEditor
    },
    {
      path: '/assets',
      name: 'asset',
      component: TableView,
      props: (route) => {
        let size = parseInt(route.query.size)
        size = isNaN(size) ? 20 : size
        let page = parseInt(route.query.page)
        page = isNaN(page) ? 1 : page
        if (![20, 50, 100].includes(size)) {
          size = 20
        }
        const search = route.query.search || ''
        const did = route.query.did || ''
        const facid = route.query.facid || ''
        return { size, page, search, did, facid }
      }
    }
  ]
})

export default router
