<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEmpresaStore } from '@/stores/empresaStore';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';

const router = useRouter();
const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

const showConvenioAlert = ref(false);

const empresaId = computed(() => authStore.user?.perfil_id);

onMounted(async () => {
  if (empresaId.value) {
    await Promise.all([
      empresaStore.cargarEmpresa(empresaId.value),
      empresaStore.cargarVacantes(empresaId.value),
      empresaStore.cargarConvenio(empresaId.value)
    ]);

    // Mostrar alerta si no tiene convenio aprobado
    if (!empresaStore.tieneConvenioAprobado) {
      showConvenioAlert.value = true;
    }
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
              {{ empresaStore.empresa?.nombre }}
            </p>
          </div>
          <BaseButton
            variant="primary"
            @click="router.push({ name: 'empresa-crear-vacante' })"
          >
            + Nueva Vacante
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Alerta de convenio pendiente -->
      <AlertNotification
        v-if="showConvenioAlert && !empresaStore.tieneConvenioAprobado"
        type="warning"
        title="Convenio Pendiente"
        message="Tu convenio está pendiente de aprobación. No podrás publicar vacantes hasta que sea aprobado."
        class="mb-6"
        @close="showConvenioAlert = false"
      />

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Vacantes Activas -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Vacantes Activas</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ empresaStore.vacantesActivas.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Vacantes -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Total Vacantes</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ empresaStore.vacantes.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Postulaciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Postulaciones</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">
                {{ empresaStore.totalPostulaciones }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado del convenio -->
      <div class="bg-white rounded-lg shadow mb-8 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Estado del Convenio</h2>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="h-3 w-3 rounded-full mr-3"
              :class="{
                'bg-green-500': empresaStore.convenio?.estado === 'aprobado',
                'bg-yellow-500': empresaStore.convenio?.estado === 'pendiente',
                'bg-red-500': empresaStore.convenio?.estado === 'rechazado'
              }"
            ></div>
            <span class="text-gray-700">
              {{ empresaStore.convenio?.estado === 'aprobado' ? 'Aprobado' : 
                 empresaStore.convenio?.estado === 'pendiente' ? 'Pendiente de Aprobación' : 
                 'Rechazado' }}
            </span>
          </div>
          <BaseButton
            variant="secondary"
            @click="router.push({ name: 'empresa-convenio' })"
          >
            Ver Detalles
          </BaseButton>
        </div>
      </div>

      <!-- Lista de vacantes recientes -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Vacantes Recientes</h2>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="vacante in empresaStore.vacantes.slice(0, 5)"
            :key="vacante.id"
            class="px-6 py-4 hover:bg-gray-50 transition cursor-pointer"
            @click="router.push({ name: 'empresa-postulaciones', params: { id: vacante.id } })"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ vacante.perfil_cargo }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ vacante.programa_academico }} • {{ vacante.modalidad }}
                </p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': vacante.estado === 'activa',
                      'bg-gray-100 text-gray-800': vacante.estado === 'cerrada',
                      'bg-yellow-100 text-yellow-800': vacante.estado === 'pausada'
                    }"
                  >
                    {{ vacante.estado }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ vacante.postulaciones_count || 0 }} postulaciones
                  </span>
                </div>
              </div>
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div v-if="empresaStore.vacantes.length === 0" class="px-6 py-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay vacantes</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza creando tu primera vacante.</p>
            <div class="mt-6">
              <BaseButton
                variant="primary"
                @click="router.push({ name: 'empresa-crear-vacante' })"
              >
                + Crear Vacante
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>