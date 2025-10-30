<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEstudianteStore } from '@/stores/estudianteStore';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const estudianteStore = useEstudianteStore();
const authStore = useAuthStore();

const estudianteId = computed(() => authStore.user?.perfil_id);

onMounted(async () => {
  if (estudianteId.value) {
    await Promise.all([
      estudianteStore.cargarPerfil(estudianteId.value),
      estudianteStore.cargarMisPostulaciones(estudianteId.value),
      estudianteStore.buscarVacantes()
    ]);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ estudianteStore.estudiante?.nombre_completo }}
            </p>
          </div>
          <BaseButton
            variant="primary"
            @click="router.push({ name: 'estudiante-vacantes' })"
          >
            Buscar Vacantes
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Postulaciones Activas -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Postulaciones Activas</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ estudianteStore.postulacionesActivas.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Postulaciones Seleccionadas -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Seleccionado</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ estudianteStore.postulacionesSeleccionadas.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Vacantes Disponibles -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Vacantes Disponibles</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ estudianteStore.vacantesDisponibles.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Perfil Académico -->
      <div class="bg-white rounded-lg shadow mb-8 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Información Académica</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-500">Programa</p>
            <p class="font-medium text-gray-900">{{ estudianteStore.estudiante?.programa_academico }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Semestre</p>
            <p class="font-medium text-gray-900">{{ estudianteStore.estudiante?.semestre }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Disponibilidad</p>
            <p class="font-medium text-gray-900">{{ estudianteStore.estudiante?.disponibilidad_horaria }}</p>
          </div>
        </div>
        <div class="mt-6">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="router.push({ name: 'estudiante-perfil' })"
          >
            Editar Perfil
          </BaseButton>
        </div>
      </div>

      <!-- Postulaciones Recientes -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">Postulaciones Recientes</h2>
          <BaseButton
            variant="secondary"
            size="sm"
            @click="router.push({ name: 'estudiante-postulaciones' })"
          >
            Ver Todas
          </BaseButton>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="postulacion in estudianteStore.misPostulaciones.slice(0, 5)"
            :key="postulacion.id"
            class="px-6 py-4 hover:bg-gray-50 transition cursor-pointer"
            @click="router.push({ name: 'estudiante-postulaciones' })"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ postulacion.vacante?.perfil_cargo }}
                </h3>
                <p class="text-sm text-gray-600">{{ postulacion.vacante?.empresa?.nombre }}</p>
              </div>
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': postulacion.estado === 'enviada',
                  'bg-yellow-100 text-yellow-800': postulacion.estado === 'en_revision',
                  'bg-green-100 text-green-800': postulacion.estado === 'seleccionada',
                  'bg-red-100 text-red-800': postulacion.estado === 'rechazada'
                }"
              >
                {{ postulacion.estado }}
              </span>
            </div>
          </div>

          <div v-if="estudianteStore.misPostulaciones.length === 0" class="px-6 py-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay postulaciones</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza buscando vacantes disponibles.</p>
            <div class="mt-6">
              <BaseButton
                variant="primary"
                @click="router.push({ name: 'estudiante-vacantes' })"
              >
                Buscar Vacantes
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>