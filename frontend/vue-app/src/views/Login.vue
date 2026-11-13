<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserDataService from '../services/UserDataService'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = ref({
  email: '',
  password: ''
})
const message = ref(null)
const loading = ref(false)

async function login() {
  message.value = null
  loading.value = true

  try {
    const response = await UserDataService.postLogin(user.value)
    
    // Sauvegarder dans le store Pinia et localStorage
    authStore.setUser(response.data.user)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Rediriger vers la sélection de dashboard
    router.push('/dashboard-selection')
  } catch (error) {
    message.value = error.response?.data?.message || 'Invalid credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-68px)] flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">
        Log In
      </h1>

      <div v-if="message" class="bg-red-500 mb-4 text-white p-3 rounded-xl text-sm">
        {{ message }}
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            id="email" 
            v-model="user.email" 
            type="email" 
            required 
            placeholder="paul@example.com" 
            class="w-full border border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            id="password" 
            v-model="user.password" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full border border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-md transition cursor-pointer mt-2"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p class="mt-5 text-center text-sm text-gray-500">
        Don't have an account?
        <RouterLink
          to="/create-account"
          class="font-semibold text-violet-600 hover:underline"
        >
          Sign up
        </RouterLink>
      </p>
    </div>
  </main>
</template>