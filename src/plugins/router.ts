import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'theme',
      component: () => import('@/pages/theme.page.vue')
    }
  ]
})

export default {
  install(app: App) {
    app.use(router)
  }
}

export { router }
