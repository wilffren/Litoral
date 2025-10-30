<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmpresaStore } from '@/stores/empresaStore';
import { useAuthStore } from '@/stores/authStore';
import FormularioVacante from '@/components/empresa/FormularioVacante.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';

const router = useRouter();
const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

onMounted(async () => {
  const empresaId = authStore.user?.perfil_id;
  if (empresaId) {
    await empresaStore.cargarConvenio(empresaId);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center">
          <button
            @click="router.back()"
            class="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Publicar Nueva Vacante</h1>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Alerta si no tiene convenio aprobado -->
      <AlertNotification
        v-if="!empresaStore.tieneConvenioAprobado"
        type="warning"
        title="Convenio Pendiente"
        message="Tu convenio aún no ha sido aprobado. No podrás publicar vacantes hasta que sea aprobado por el administrador."
        class="mb-6"
        :dismissible="false"
      />

      <!-- Formulario -->
      <FormularioVacante v-if="empresaStore.tieneConvenioAprobado" />

      <!-- Mensaje bloqueado -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Convenio en Revisión</h3>
        <p class="mt-2 text-gray-600">
          Tu empresa debe tener un convenio aprobado antes de poder publicar vacantes.
        </p>
        <div class="mt-6">
          <button
            @click="router.push({ name: 'empresa-convenio' })"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ver Estado del Convenio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>