<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ProfileMenu from './ProfileMenu.vue'

const route = useRoute()

const authStore = useAuthStore()
const userName = computed(() =>
  authStore.user?.fullname || 'User'
)
const userInitial = computed(() =>
  userName.value.charAt(0).toUpperCase()
)
const showProfileMenu = ref(false)
const isDashboard = computed(() => route.name === 'dashboard')

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function closeProfileMenu() {
  showProfileMenu.value = false
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="bg-violet-500 text-white rounded-lg p-2">🏠</div>
        <span class="text-xl font-bold text-violet-600">Roomie</span>
      </div>

      <!-- Le conteneur reste en z-50 pour que le bouton soit au-dessus de l'overlay de fermeture -->
      <div class="relative z-50">
        <!-- Overlay invisible pour fermer le menu au clic en dehors -->
        <div 
          v-if="showProfileMenu"
          class="fixed inset-0 z-40" 
          @click="closeProfileMenu"
        ></div>

        <!-- Bouton utilisateur : ne devient violet QUE lors du survol (hover) -->
        <button 
          type="button" 
          @click="toggleProfileMenu" 
          :aria-expanded="showProfileMenu" 
          aria-label="Open profile menu" 
          class="group relative z-50 flex items-center gap-3 rounded-xl p-2 hover:bg-violet-50 transition-colors cursor-pointer"
        >
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
              {{userName}}
            </p>
            <p class="text-xs text-gray-400 group-hover:text-violet-400 transition-colors">
              Student
            </p>
          </div>
          <div class="bg-violet-500 group-hover:bg-violet-600 text-white font-semibold rounded-full w-9 h-9 flex items-center justify-center transition-colors shadow-sm">
            {{ userInitial }}
          </div>
        </button>

        <!-- Pop-up ProfileMenu -->
        <div 
          v-if="showProfileMenu"
          class="absolute right-0 top-full mt-3 z-50"
        >
          <ProfileMenu />
        </div>
      </div>
    </div>
  </header>
</template>