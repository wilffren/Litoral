<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEstudianteStore } from '@/stores/estudianteStore';
import FiltroVacantes from '@/components/estudiante/FiltroVacantes.vue';
import ListaVacantes from '@/components/estudiante/ListaVacantes.vue';
import type { FiltrosVacante } from '@/models/Vacante';

const estudianteStore = useEstudianteStore();
const mostrarFiltros = ref(true);

onMounted(async () => {
  await estudianteStore.buscarVacantes();
});

const aplicarFiltros = async (filtros: FiltrosVacante) => {
  await estudianteStore.buscarVacantes(filtros);
};

const limpiarFiltros = async () => {
  await estudianteStore.buscarVacantes();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Buscar Vacantes</h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ estudianteStore.vacantesDisponibles.length }} vacantes disponibles
            </p>
          </div>
          <button
            @click="mostrarFiltros = !mostrarFiltros"
            class="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ mostrarFiltros ? 'Ocultar' : 'Mostrar' }} Filtros
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar de filtros -->
        <aside
          v-show="mostrarFiltros"
          class="lg:col-span-1"
        >
          <div class="sticky top-4">
            <FiltroVacantes
              @aplicar="aplicarFiltros"
              @limpiar="limpiarFiltros"
            />
          </div>
        </aside>

        <!-- Lista de vacantes -->
        <div
          :class="mostrarFiltros ? 'lg:col-span-3' : 'lg:col-span-4'"
        >
          <ListaVacantes
            :vacantes="estudianteStore.vacantesDisponibles"
            :loading="estudianteStore.loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>