import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateAccount from '../views/CreateAccount.vue'
import DashboardSelection from '../views/DashboardSelection.vue'
import CreateDashboard from '../views/CreateDashboard.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/create-account', name: 'create-account', component: CreateAccount},
  {path:'/dashboard-selection', name: 'dashboard-selection', component: DashboardSelection},
  {path:'/create-dashboard', name:'create-dashboard', component: CreateDashboard},
  { path: '/dashboard', name: 'dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//prototype of navigation. require a selected dashboard before showing tasks. 
router.beforeEach((to)=>{
  if(to.name==='dashboard'&&!localStorage.getItem('roomie-active-dashboard')){
      return {name: 'dashboard-selection'}
  }
})
export default router
