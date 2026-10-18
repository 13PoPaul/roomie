import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Tasks from '../views/Tasks.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/tasks', name: 'tasks', component: Tasks },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router