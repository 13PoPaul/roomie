import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateAccount from '../views/CreateAccount.vue'
import DashboardSelection from '../views/DashboardSelection.vue'
import CreateDashboard from '../views/CreateDashboard.vue'
import JoinDashboard from '../views/JoinDashboard.vue'

const routes = [
  // Routes publiques (accessibles sans connexion)
  { path: '/', name: 'login', component: Login },
  { path: '/create-account', name: 'create-account', component: CreateAccount },

  // Routes protégées : nécessitent d'être connecté
  { 
    path: '/dashboard-selection', 
    name: 'dashboard-selection', 
    component: DashboardSelection,
    meta: { requiresAuth: true }
  },
  { 
    path: '/create-dashboard', 
    name: 'create-dashboard', 
    component: CreateDashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/join-dashboard', 
    name: 'join-dashboard', 
    component: JoinDashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Gardien de navigation global (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')

  // 1. Restauration de session : si la page est rafraîchie (F5), on recharge l'utilisateur dans Pinia
  if (token && !authStore.user && savedUser) {
    try {
      authStore.setUser(JSON.parse(savedUser))
    } catch {
      authStore.logout()
    }
  }

  // 2. Vérification de connexion : si la route requiert une authentification et que l'utilisateur n'est pas connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // 3. Redirection inverse : si l'utilisateur est déjà connecté et tente d'aller sur la page login ou inscription
  if ((to.name === 'login' || to.name === 'create-account') && authStore.isAuthenticated) {
    return next({ name: 'dashboard-selection' })
  }

  // 4. Vérification du dashboard actif pour la vue /dashboard
  if (to.name === 'dashboard' && !localStorage.getItem('roomie-active-dashboard')) {
    return next({ name: 'dashboard-selection' })
  }

  // Autoriser l'accès
  next()
})

export default router