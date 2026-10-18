import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateAccount from '../views/CreateAccount.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/create-account', name: 'create-account', component: CreateAccount}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
