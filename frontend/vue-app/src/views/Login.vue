<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogin(){
  const activeDashboard=localStorage.getItem('roomie-active-dashboard')
  if (activeDashboard){
    router.push('/dashboard')
  }else{
    router.push('/dashboard-selection')
  }
}

const showPassword = ref(false)
</script>

<template>
  <main class="flex min-h-dvh items-center justify-center bg-purple-50 px-4 py-10">
    <section class="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border bg-purple-600">
            <span class="text-4xl">🏠</span>
        </div>
        <p class="mt-2 text-center text-sm font-bold text-purple-600">Roomie</p>
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold">Welcome back! 👋</h1>
        <p class="mt-3 text-sm text-gray-400">Log in and see what needs to be done.</p>
      </div>
      <form class="w-full" @submit.prevent="handleLogin">
        <div class="mb-5">
          <label for="email" class="block mb-2.5 text-sm font-medium text-gray-900">Email address :</label>
          <input type="email" id="email" name="email" autocomplete="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 block w-full px-3 py-2.5 shadow-xs placeholder:text-gray-400" placeholder="paul@iglesias.com" required />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="mb-2.5 block text-sm font-medium text-gray-900"
          >
            Password:
          </label>

          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" id="password" name="password" autocomplete="current-password" placeholder="••••••••" required class="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-3 pr-12 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

            <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" aria-controls="password" class="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"  aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
                <circle cx="12" cy="12" r="3" />
                <path v-if="showPassword" d="m3 3 18 18" />
              </svg>
            </button>
          </div>
        </div>
        <label for="remember" class="flex items-center mb-5">
          <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-xs bg-gray-50 focus:ring-2 focus:ring-blue-200 accent-blue-600" />
          <span class="ms-2 text-sm font-medium text-gray-900 select-none">Remember me</span>
        </label>
        <button type="submit" class="w-full text-white bg-purple-600 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none">Log in</button>
        <hr class="my-6 border-gray-200"/>
        <p class="text-center text-sm text-gray-600"> New roommate ? <RouterLink to="/create-account" class="font-medium text-purple-600 hover:underline">Create an account</RouterLink>

        </p>
      </form>
    </section>
  </main>
</template>
