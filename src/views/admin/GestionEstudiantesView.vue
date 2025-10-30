<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Gestión de Estudiantes</h1>
      <p class="text-gray-600 mb-8">Esta vista está en desarrollo</p>
      <button @click="router.push({ name: 'admin-dashboard' })" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Volver al Dashboard
      </button>
    </div>
  </div>
</template>