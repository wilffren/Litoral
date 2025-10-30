<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/common/BaseButton.vue';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import type { Vacante } from '@/models/Vacante';

interface Props {
  vacantes: Vacante[];
  loading?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

const verDetalle = (vacanteId: number) => {
  router.push({ name: 'estudiante-vacante-detalle', params: { id: vacanteId } });
};

const getModalidadIcon = (modalidad: string) => {
  const icons: Record<string, string> = {
    'Presencial': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    'Remoto': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    'Híbrido': 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
  };
  return icons[modalidad] || icons['Presencial'];
};
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-gray-600">Cargando vacantes...</p>
    </div>

    <!-- Lista de vacantes -->
    <div v-else class="space-y-4">
      <div
        v-for="vacante in vacantes"
        :key="vacante.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
        @click="verDetalle(vacante.id!)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Título y empresa -->
            <div class="flex items-start gap-3 mb-3">
              <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-1">
                  {{ vacante.perfil_cargo }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ vacante.empresa?.nombre }}
                </p>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-gray-700 mb-4 line-clamp-2">
              {{ vacante.descripcion }}
            </p>

            <!-- Detalles -->
            <div class="flex flex-wrap gap-4 text-sm">
              <!-- Modalidad -->
              <div class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getModalidadIcon(vacante.modalidad)" />
                </svg>
                {{ vacante.modalidad }}
              </div>

              <!-- Ubicación -->
              <div v-if="vacante.ubicacion" class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ vacante.ubicacion }}
              </div>

              <!-- Salario -->
              <div class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatCurrency(vacante.salario) }}
              </div>

              <!-- Programa -->
              <div class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ vacante.programa_academico }}
              </div>
            </div>

            <!-- Tags adicionales -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ vacante.tipo_contrato }}
              </span>
              <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {{ vacante.jornada }}
              </span>
              <span v-if="vacante.cantidad > 1" class="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                {{ vacante.cantidad }} vacantes
              </span>
            </div>

            <!-- Fecha límite -->
            <div class="mt-4 text-xs text-gray-500">
              Fecha límite: {{ formatDateShort(vacante.fecha_limite) }}
            </div>
          </div>

          <!-- Botón de acción -->
          <div class="ml-4 flex-shrink-0">
            <BaseButton
              variant="primary"
              size="sm"
              @click.stop="verDetalle(vacante.id!)"
            >
              Ver Detalles
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="vacantes.length === 0" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay vacantes disponibles</h3>
        <p class="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>