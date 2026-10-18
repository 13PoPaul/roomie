<script setup>

import AppHeader from './components/AppHeader.vue'
import Dashboard from './views/Dashboard.vue'
</script>


<template>
  <RouterView />
  <div class="min-h-screen bg-white">
    <AppHeader />
    <Dashboard />
  </div>
</template>
