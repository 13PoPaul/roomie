<script setup>
import {ref, computed } from 'vue'
import { useRoute } from 'vue-router';

import ProfileMenu from './ProfileMenu.vue';
const route = useRoute()

const showProfileMenu = ref(false)

const isDashboard = computed(()=> route.name === 'dashboard')

function toggleProfileMenu(){
    showProfileMenu.value=!showProfileMenu.value

}

function closeProfileMenu(){
    showProfileMenu.value=false
}

</script>


<template>
    <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class = "flex items-center gap-2">
                <div class="bg-violet-500 text-white rounded-lg p-2">🏠</div>
                <span class="text-xl font-bold text-violet-600">Roomie</span>
            </div>

            <div class="relative">
                <button type="button" @click="toggleProfileMenu" :aria-expanded="showProfileMenu" aria-label="Open profile menu" class="flex items-center gap-3 rounded-xl p-2 hover:bg-violet-50 transition cursor-pointer">
                    <div class="text-right">
                        <p class="text-sm font-semibold"> Paul Iglesias</p>
                        <p class="text-xs text-gray-400">Student</p>
                    </div>
                    <div class="bg-violet-500 text-xhite rounded-full w-9 h-9 flex items-center justify-center">P</div>
                    <span class="text-gray-400">{{ showProfileMenu ? '^' : '⌄' }}</span>
                </button>

                <div v-if="showProfileMenu && isDashboard" class="fixed inset-0 z-40" @click="closeProfileMenu"></div>
                <div v-if="showProfileMenu && isDashboard" class="absolute right-0 top-full mt-3 z-50"><ProfileMenu/></div>
            </div>
        </div>
    </header>
</template>