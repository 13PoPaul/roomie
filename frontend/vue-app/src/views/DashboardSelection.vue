<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

function goToCreate(){
    router.push({name : 'create-dashboard'})
}

//function goToJoin(){
//    router.push({name : 'join-dashboard'})
//}
</script>

<template>
    <main class="flex flex-col items-center justify-center px-6">
        <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
            Welcome ! You haven't joined a dashboard yet.
        </h1>
        <div class="flex flex-wrap justify-center gap-4">
            <button @click="goToJoin" class="bg-white border border-violet-500 text-violet-600 font-semibold px-7 py-3 rounded-xl hover:bg-violet-50 transition cursor-pointer">
                Join a dashboard
            </button>
             <button @click="goToCreate" class="bg-white border border-violet-500 text-violet-600 font-semibold px-7 py-3 rounded-xl hover:bg-violet-50 transition cursor-pointer">
                Create a dashboard
            </button>
        </div>
    </main>
</template>