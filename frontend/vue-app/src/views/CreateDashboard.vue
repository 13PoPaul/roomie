<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RoomDataService from '../services/DashBoardDataService'

const router = useRouter()
const dashboardName = ref('')

// Génère un code de 9 caractères au total (ex: RM-E4B1F8) pour tenir dans un VARCHAR(10)
function generateCode() {
  return 'RM-' + crypto.randomUUID().slice(0, 6).toUpperCase()
}

const invitationCode = ref(generateCode())
const error = ref('')
const loading = ref(false)

async function createDashboard() {
  const name = dashboardName.value.trim()
  if (!name) {
    error.value = 'Please enter a valid dashboard name.'
    return
  }

  loading.value = true
  error.value = ''

  const payload = {
    name: name,
    code: invitationCode.value
  }

  try {
    const response = await RoomDataService.create(payload)
    const createdRoom = response.data

    const roomId = createdRoom.dashboard_id || createdRoom.id

    // 1. Sauvegarder sous les deux formats pour satisfaire toutes vos vues
    localStorage.setItem('roomie-active-dashboard', roomId)
    localStorage.setItem('roomie-active-room', JSON.stringify(createdRoom))

    // 2. Mettre à jour la liste locale des dashboards
    const localDashboards = JSON.parse(localStorage.getItem('roomie-dashboards') || '[]')
    localDashboards.push(createdRoom)
    localStorage.setItem('roomie-dashboards', JSON.stringify(localDashboards))

    // 3. Redirection
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error creating the dashboard. Please try again.'
    console.error('Erreur API :', err)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard-selection')
}
</script>

<template>
  <main class="flex items-center justify-center p-6 min-h-[80vh]">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
      <h1 class="text-2xl font-bold text-gray-900 text-center">
        Create Dashboard
      </h1>
      <p class="text-gray-500 text-sm text-center mt-2 mb-7">
        Choose a name for your shared roommate space.
      </p>

      <form @submit.prevent="createDashboard">
        <label for="dashboard-name" class="block text-sm font-medium text-gray-700 mb-2">
          Dashboard Name
        </label>
        <input 
          id="dashboard-name" 
          v-model="dashboardName" 
          type="text" 
          required 
          maxlength="80" 
          placeholder="Apartment 1206" 
          class="w-full border border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

        <div class="bg-violet-50 rounded-xl p-4 mt-4 mb-4">
          <p class="text-xs font-semibold text-violet-400 uppercase">Your Invitation Code</p>
          <p class="font-bold text-violet-600 tracking-wide mt-1">{{ invitationCode }}</p>
        </div>

        <p v-if="error" class="text-sm text-red-600 mb-3">{{ error }}</p>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-md transition cursor-pointer"
        >
          {{ loading ? 'Creating...' : 'Create Dashboard' }}
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