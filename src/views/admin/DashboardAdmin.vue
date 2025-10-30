<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import DashboardStats from '@/components/admin/DashboardStats.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const adminStore = useAdminStore();
const authStore = useAuthStore();

const mostrarAlertas = computed(() => adminStore.tieneAlertasPendientes);

onMounted(async () => {
  await Promise.all([
    adminStore.cargarEstadisticas(),
    adminStore.cargarAlertas(),
    adminStore.cargarConveniosPendientes()
  ]);
});

const navegarA = (ruta: string) => {
  router.push({ name: ruta });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p class="mt-1 text-sm text-gray-600">
              Bienvenido, {{ authStore.userName }}
            </p>
          </div>

          <!-- Badge de alertas -->
          <div
            v-if="mostrarAlertas"
            class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg"
          >
            <svg class="h-5 w-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium">{{ adminStore.totalAlertas }} tareas pendientes</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Alertas importantes -->
      <div v-if="mostrarAlertas" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Convenios pendientes -->
          <div
            v-if="adminStore.alertas.convenios_pendientes > 0"
            class="bg-white border-l-4 border-yellow-500 rounded-lg p-6 shadow hover:shadow-md transition cursor-pointer"
            @click="navegarA('admin-convenios')"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Convenios por Aprobar</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ adminStore.alertas.convenios_pendientes }} convenios esperando revisión
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Documentos pendientes -->
          <div
            v-if="adminStore.alertas.documentos_pendientes > 0"
            class="bg-white border-l-4 border-red-500 rounded-lg p-6 shadow hover:shadow-md transition cursor-pointer"
            @click="navegarA('admin-documentos')"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Documentos por Validar</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ adminStore.alertas.documentos_pendientes }} documentos esperando validación
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Candidatos seleccionados -->
          <div
            v-if="adminStore.alertas.candidatos_seleccionados > 0"
            class="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow hover:shadow-md transition"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Candidatos Seleccionados</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ adminStore.alertas.candidatos_seleccionados }} candidatos seleccionados recientemente
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Vacantes vencidas -->
          <div
            v-if="adminStore.alertas.vacantes_vencidas > 0"
            class="bg-white border-l-4 border-gray-500 rounded-lg p-6 shadow hover:shadow-md transition"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Vacantes Vencidas</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ adminStore.alertas.vacantes_vencidas }} vacantes han llegado a su fecha límite
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas Generales</h2>
        <DashboardStats :stats="adminStore.estadisticas" />
      </div>

      <!-- Accesos rápidos -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Gestionar Empresas -->
          <button
            @click="navegarA('admin-empresas')"
            class="bg-white rounded-lg p-6 shadow hover:shadow-md transition text-left"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Gestionar Empresas</h3>
                <p class="text-sm text-gray-600">Ver y administrar empresas</p>
              </div>
            </div>
          </button>

          <!-- Gestionar Estudiantes -->
          <button
            @click="navegarA('admin-estudiantes')"
            class="bg-white rounded-lg p-6 shadow hover:shadow-md transition text-left"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Gestionar Estudiantes</h3>
                <p class="text-sm text-gray-600">Ver y administrar estudiantes</p>
              </div>
            </div>
          </button>

          <!-- Gestionar Usuarios -->
          <button
            v-if="authStore.hasRole('admin')"
            @click="navegarA('admin-usuarios')"
            class="bg-white rounded-lg p-6 shadow hover:shadow-md transition text-left"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Usuarios Admin</h3>
                <p class="text-sm text-gray-600">Gestionar administradores</p>
              </div>
            </div>
          </button>

          <!-- Generar Reportes -->
          <button
            @click="navegarA('admin-reportes')"
            class="bg-white rounded-lg p-6 shadow hover:shadow-md transition text-left"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Reportes</h3>
                <p class="text-sm text-gray-600">Generar informes</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Convenios recientes -->
      <div v-if="adminStore.conveniosPendientes.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Convenios Pendientes Recientes</h2>
          <BaseButton
            variant="secondary"
            size="sm"
            @click="navegarA('admin-convenios')"
          >
            Ver Todos
          </BaseButton>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div
              v-for="convenio in adminStore.conveniosPendientes.slice(0, 5)"
              :key="convenio.id"
              class="p-4 hover:bg-gray-50 transition cursor-pointer"
              @click="navegarA('admin-convenios')"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">Empresa ID: {{ convenio.empresa_id }}</p>
                  <p class="text-sm text-gray-600">Estado: {{ convenio.estado }}</p>
                </div>
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>