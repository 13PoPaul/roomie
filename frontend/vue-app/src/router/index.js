import { createRouter, createWebHistory } from 'vue-router'

import Welcome from '../components/HelloWorld.vue'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/home', name: 'Home', component: Home },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router