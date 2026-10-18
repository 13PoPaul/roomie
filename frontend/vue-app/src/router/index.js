import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Tasks from '../views/Tasks.vue'
import CreateAccount from '../views/CreateAccount.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/tasks', name: 'tasks', component: Tasks },
  { path: '/create-account', name: 'create-account', component: CreateAccount}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
