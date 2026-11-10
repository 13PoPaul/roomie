<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardDataService from '../services/DashBoardDataService'

const router = useRouter()

const invitationCode = ref('')
const error = ref('')
const loading = ref(false)

async function joinDashboard() {
  const code = invitationCode.value.trim().toUpperCase()

  if (!code) {
    error.value = 'Please enter an invitation code.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 1. Appel au serveur Express sur le port 8080 via le service
    const response = await DashboardDataService.join(code)
    const dashboard = response.data

    // 2. Définir le dashboard actif en session (gère le dashboard_id ou id selon le modèle)
    const dashboardId = dashboard.dashboard_id || dashboard.id
    localStorage.setItem('roomie-active-dashboard', dashboardId)

    // 3. Mettre à jour la liste des dashboards locaux si besoin d'un cache
    const dashboards = JSON.parse(localStorage.getItem('roomie-dashboards') || '[]')
    const exists = dashboards.some(d => (d.dashboard_id || d.id) === dashboardId)
    if (!exists) {
      dashboards.push(dashboard)
      localStorage.setItem('roomie-dashboards', JSON.stringify(dashboards))
    }

    // 4. Redirection vers la vue dashboard
    router.push('/dashboard')
  } catch (err) {
    // Affiche l'erreur envoyée par dashboard.controller.js (ex: 404 "Invalid code...")
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Unable to connect to the server.'
    }
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard-selection')
}
</script>

<template>
  <main class="min-h-[calc(100vh-68px)] flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
      <h1 class="text-2xl font-bold text-gray-900 text-center">
        Join a Dashboard
      </h1>
      <p class="text-gray-500 text-sm text-center mt-2 mb-7">
        Enter the invitation code shared by your roommate.
      </p>

      <form @submit.prevent="joinDashboard">
        <label for="invitation-code" class="block text-sm font-medium text-gray-700 mb-2">
          Invitation Code
        </label>
        <input
          id="invitation-code"
          v-model="invitationCode"
          type="text"
          required
          placeholder="ROOMIE-ABC123"
          class="w-full border border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

        <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-violet-500 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-md transition mt-4 cursor-pointer"
        >
          {{ loading ? 'Joining...' : 'Join Dashboard' }}
        </button>
      </form>

      <button
        type="button"
        @click="goBack"
        class="w-full text-violet-600 font-medium text-sm mt-5 cursor-pointer"
      >
        Back
      </button>
    </div>
  </main>
</template>