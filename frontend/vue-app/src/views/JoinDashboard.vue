<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const invitationCode=ref('')
const error = ref('')

function joinDashboard(){
    const code = invitationCode.value.trim().toUpperCase()

    if(!code){
        error.value = 'Please enter an invitation code.'
        return
    }

    try{
        const dashboards = JSON.parse(localeStorage.getItem('roomie-dashboards')|| '[]') 
        const dashboard= dashboards.find(dashboard => dashboard.invitationCode==code)

        if (!dashboard){
            error.value= 'Dashboard not found in this browser.'
            return
        }

        localStorage.setItem('roomie-active-dashboard', dashboard.id)

        router.push('/dashboard')
    }catch(err){
        error.value='Unable to read saved dashboards.'
        console.error(err)
    }
}

function goBack(){
    router.push('dashboard-selection')
}
</script>

<template>
    <main class="min-h-[calc(100vh-68px)] flex items-center justify-center p-6">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">
            <h1 class="text-2xl font-bold text-gray-900 text-center">
                Join a Dashboard
            </h1>
            <p class="text-gray-500 text-sm text-center mt-2 mb-7">
                Enter the invitation code shared by your roomate.
            </p>
            <form @submit.prevent="joinDashboard">
                <label for="invitation-code" class="block text-sm font-medium text-gray-700 mb-2">Invitation Code</label>
                <input id="invitation-code" v-model="invitationCode" type="text" required placeholder="ROOMIE-ABC123" class="w-full border border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"/>
                <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>
                <button type="submit" class="w-full bg-violet-500 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-md transition mt-4 cursor-pointer">Join Dashboard</button>
            </form>

            <button type="button" @click="goBack" class="w-full text-violet-600 font-medium text-sm mt-5 cursor-pointer">Back</button>
        </div>

    </main>
</template>