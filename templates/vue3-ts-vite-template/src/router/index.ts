import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const Home = () => import('@/pages/home.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => {
      return 'home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
