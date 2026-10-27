<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const showCode = ref(false)

const copyMessage = ref('')
const activeDashboard=ref(null)

function loadDashboard(){
    const activeId=localStorage.getItem('roomie-active-dashboard')
    try{
        const dashboards = JSON.parse(localStorage.getItem('roomie-dashboards')||'[]')
        activeDashboard.value=dashboards.find(dashboard => dashboard.id === activeId)|| null

    }catch (error){
    console.error('Unable to load dashboard:', error)
    activeDashboard.value=null
    }
}

onMounted(loadDashboard)

const invitationCode=computed(()=>{return activeDashboard.value?.invitationCode || ''})

async function copyCode(){
    if (!invitationCode) return

    try{
        await navigator.clipboard.writeText(invitationCode.value)
        copyMessage.value='Code copied'
    }catch(error){
        copyMessage.value='Unable to copy code.'
        console.error(error)
    }
}

function logout(){
    router.push('/')
}

function leaveDashboard(){
    const confirmed=window.confirm('Are you sure you want to leave this dashboard ?')
    if(!confirmed) return
    localStorage.removeItem('roomie-active-dashboard')
    router.push('/dashboard-selection')
}
</script>

<template>
    <div class="w-72 rounded-2xl border border-violet-100 bg-white p-5 shadow-xl">
        <h2 class="text-lg font-bold text-gray-900 mb-4">
            My Profile
        </h2>
        <div class="mb-4">
            <div class="flex items-center justify-center mb-2">
                <p class="text-sm font-semibold text-gray-700">
                    Invitation Code 
                </p>
                <button type="button" @click="showCode = !showCode" class="text-sm text-violet-600 hover:underline cursor-pointer">
                    {{ showCode ? 'Hide' : 'Show' }}
                </button>
            </div>
            <div class="bg-violet-50 rounded-lg p-3 text-sm font-medium text-violet-700">
                <span v-if="!invitationCode">
                    No active invitation code
                </span>
                <span v-else-if="showCode">
                    {{ invitationCode }}
                </span>
                <span v-else>
                    .........
                </span>
            </div>

            <button type="button" :disabled="!invitationCode" @click="copyCode" class="mt-3 w-full border border-violet-300 text-violet-600 py-2 rounded-lg hover:bg-violet-50 transition disabled:opacity-50 cursor-pointer"> Copy Code </button>
            <p v-if="copyMessage" role="status" class="text-xs text-violet-600 mt-2">
                {{ copyMessage }}
            </p>
        </div>
        <hr class="border-gray-200 my-4"/>
        <button type="button" @click="logout" class="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover-bg-gray-100 transition cursor-pointer"> Log Out</button>
        <button type="button" @click="leaveDashboard" class="w-full text-left px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer">Leave Dashboard</button>
    </div>
</template>