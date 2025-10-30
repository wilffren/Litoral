<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import RegistroEstudiante from '@/components/estudiante/RegistroEstudiante.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Si ya tiene perfil registrado, redirigir al dashboard
  if (authStore.user?.perfil_id) {
    router.push({ name: 'estudiante-dashboard' });
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Completa tu Registro</h1>
        <p class="mt-2 text-gray-600">
          Completa tu información personal y académica para comenzar a buscar prácticas
        </p>
      </div>

      <RegistroEstudiante />
    </div>
  </div>
</template>