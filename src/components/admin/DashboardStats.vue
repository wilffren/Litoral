<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  stats: {
    total_empresas: number;
    total_estudiantes: number;
    total_vacantes_activas: number;
    total_postulaciones: number;
    convenios_pendientes: number;
    documentos_pendientes: number;
  };
}

const props = defineProps<Props>();

const estadisticas = computed(() => [
  {
    titulo: 'Empresas Registradas',
    valor: props.stats.total_empresas,
    icono: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    titulo: 'Estudiantes Activos',
    valor: props.stats.total_estudiantes,
    icono: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    titulo: 'Vacantes Activas',
    valor: props.stats.total_vacantes_activas,
    icono: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    titulo: 'Postulaciones Totales',
    valor: props.stats.total_postulaciones,
    icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    titulo: 'Convenios Pendientes',
    valor: props.stats.convenios_pendientes,
    icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    alert: props.stats.convenios_pendientes > 0
  },
  {
    titulo: 'Documentos Pendientes',
    valor: props.stats.documentos_pendientes,
    icono: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    alert: props.stats.documentos_pendientes > 0
  }
]);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="stat in estadisticas"
      :key="stat.titulo"
      class="bg-white rounded-lg shadow p-6 relative overflow-hidden"
      :class="{ 'ring-2 ring-red-500': stat.alert }"
    >
      <!-- Badge de alerta -->
      <div
        v-if="stat.alert"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse"
      >
        Requiere atención
      </div>

      <div class="flex items-center">
        <!-- Icono -->
        <div class="flex-shrink-0 rounded-lg p-3" :class="stat.bgColor">
          <svg class="h-8 w-8" :class="stat.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icono" />
          </svg>
        </div>

        <!-- Contenido -->
        <div class="ml-5 flex-1">
          <p class="text-sm font-medium text-gray-500">{{ stat.titulo }}</p>
          <p class="mt-1 text-3xl font-semibold text-gray-900">
            {{ stat.valor }}
          </p>
        </div>
      </div>

      <!-- Indicador de tendencia (opcional) -->
      <div class="mt-4 flex items-center text-sm">
        <svg class="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span class="text-gray-600">Últimos 30 días</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>