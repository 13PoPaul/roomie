<script setup>
import {RouterView, useRoute} from 'vue-router'
import {computed} from 'vue'
import AppHeader from './components/AppHeader.vue'


const route = useRoute()
const headerUse=['dashboard-selection', 'create-dashboard', 'dashboard']
const showHeader=computed(()=>headerRoutes.includes(route.name))
</script>


<template>
  
  <div class="min-h-screen bg-purple-50">
    <AppHeader v-if="showHeader"/>
    <RouterView />
  </div>
</template>
