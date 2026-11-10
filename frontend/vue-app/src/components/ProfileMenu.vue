<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardDataService from '../services/DashBoardDataService'

const router = useRouter()
const copyMessage = ref('')
const activeDashboard = ref(null)

async function loadDashboard() {
  const activeId = localStorage.getItem('roomie-active-dashboard')
  
  if (!activeId) {
    activeDashboard.value = null
    return
  }

  try {
    const response = await DashboardDataService.get(activeId)
    activeDashboard.value = response.data
  } catch (error) {
    console.warn('Chargement depuis le cache local :', error)
    try {
      const dashboards = JSON.parse(localStorage.getItem('roomie-dashboards') || '[]')
      activeDashboard.value = dashboards.find(d => (d.dashboard_id || d.id) == activeId) || null
    } catch {
      activeDashboard.value = null
    }
  }
}

onMounted(loadDashboard)

// Récupère la propriété MySQL (invitation_code) ou JavaScript (invitationCode)
const invitationCode = computed(() => {
  return activeDashboard.value?.invitation_code || activeDashboard.value?.invitationCode || ''
})

async function copyCode() {
  if (!invitationCode.value) return

  try {
    await navigator.clipboard.writeText(invitationCode.value)
    copyMessage.value = 'Code copied!'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2500)
  } catch (error) {
    copyMessage.value = 'Unable to copy code.'
    console.error(error)
  }
}

function logout() {
  router.push('/')
}

function leaveDashboard() {
  const confirmed = window.confirm('Are you sure you want to leave this dashboard ?')
  if (!confirmed) return
  localStorage.removeItem('roomie-active-dashboard')
  localStorage.removeItem('roomie-active-room')
  router.push('/dashboard-selection')
}
</script>

<template>
  <div class="w-72 rounded-2xl border border-violet-100 bg-white p-5 shadow-xl">
    <h2 class="text-lg font-bold text-gray-900 mb-4">
      My Profile
    </h2>
    <div class="mb-4">
      <p class="text-sm font-semibold text-gray-700 mb-2">
        Invitation Code 
      </p>

      <!-- Le code est maintenant affiché directement et en permanence -->
      <div class="bg-violet-50 rounded-lg p-3 text-sm font-medium text-violet-700 text-center">
        <span v-if="!invitationCode" class="text-gray-400">
          No active invitation code
        </span>
        <span v-else class="font-bold tracking-wider">
          {{ invitationCode }}
        </span>
      </div>

      <button 
        type="button" 
        :disabled="!invitationCode" 
        @click="copyCode" 
        class="mt-3 w-full border border-violet-300 text-violet-600 py-2 rounded-lg hover:bg-violet-50 transition disabled:opacity-50 cursor-pointer"
      >
        Copy Code
      </button>

      <p v-if="copyMessage" role="status" class="text-xs text-violet-600 mt-2 text-center">
        {{ copyMessage }}
      </p>
    </div>

    <hr class="border-gray-200 my-4" />
    <button type="button" @click="logout" class="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer">
      Log Out
    </button>
    <button type="button" @click="leaveDashboard" class="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer mt-1">
      Leave Dashboard
    </button>
  </div>
</template>