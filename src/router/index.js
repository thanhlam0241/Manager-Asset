import { createRouter, createWebHistory } from 'vue-router'

import PageLayout from '@/components/layout/PageLayout.vue'
import AuthenticationLayout from '@/components/layout/AuthenticationLayout.vue'

import ComponentView from '@/views/ComponentView.vue'
import TableView from '@/views/TableView.vue'
import MISAExcelEditor from '@/components/base/MISAExcelEditer.vue'
import NotFound from '@/components/page/NotFound.vue'
import IncreaseAssetView from '@/views/IncreaseAssetView/IncreaseAssetView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: PageLayout,
      children: [
        {
          path: 'overview',
          component: ComponentView
        },
        {
          path: 'excel',
          component: MISAExcelEditor
        },
        {
          path: 'assets',
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
        },
        { path: 'assets/write-increase', name: 'increase', component: IncreaseAssetView },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
      ]
    },
    {
      path: '/authentication',
      component: AuthenticationLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/AuthenticationView/LoginView.vue')
        }
      ]
    }
  ]
})

export default router
