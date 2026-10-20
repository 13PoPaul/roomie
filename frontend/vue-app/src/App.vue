<script setup>
import {RouterView, useRoute} from 'vue-router'
import {computed} from 'vue'
import AppHeader from './components/AppHeader.vue'
import Dashboard from './views/Dashboard.vue'

const route = useRoute()
const isDashboardRoute = computed(() => route.name === 'dashboard')
</script>


<template>
  
  <div class="min-h-screen bg-purple-50">
    <AppHeader v-if="isDashboardRoute"/>
    <RouterView />
  </div>
</template>
