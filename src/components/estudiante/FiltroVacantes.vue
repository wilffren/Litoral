<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { MODALIDADES, PROGRAMAS_ACADEMICOS, CIUDADES_COLOMBIA, RANGOS_SALARIO } from '@/utils/constants';
import type { FiltrosVacante } from '@/models/Vacante';

const emit = defineEmits<{
  aplicar: [filtros: FiltrosVacante];
  limpiar: [];
}>();

const filtros = reactive<FiltrosVacante>({
  programa_academico: '',
  modalidad: '',
  ubicacion: '',
  salario_min: undefined,
  salario_max: undefined,
  search: ''
});

const rangoSalarioSeleccionado = ref('');

const aplicarFiltros = () => {
  // Si se seleccionó un rango predefinido, aplicar esos valores
  if (rangoSalarioSeleccionado.value) {
    const rango = RANGOS_SALARIO.find(r => r.label === rangoSalarioSeleccionado.value);
    if (rango) {
      filtros.salario_min = rango.min;
      filtros.salario_max = rango.max;
    }
  }

  // Limpiar valores vacíos - Método corregido
  const filtrosLimpios: FiltrosVacante = {};
  
  if (filtros.programa_academico) {
    filtrosLimpios.programa_academico = filtros.programa_academico;
  }
  if (filtros.modalidad) {
    filtrosLimpios.modalidad = filtros.modalidad;
  }
  if (filtros.ubicacion) {
    filtrosLimpios.ubicacion = filtros.ubicacion;
  }
  if (filtros.salario_min !== undefined) {
    filtrosLimpios.salario_min = filtros.salario_min;
  }
  if (filtros.salario_max !== undefined) {
    filtrosLimpios.salario_max = filtros.salario_max;
  }
  if (filtros.search) {
    filtrosLimpios.search = filtros.search;
  }
  if (filtros.estado) {
    filtrosLimpios.estado = filtros.estado;
  }
  if (filtros.empresa_id !== undefined) {
    filtrosLimpios.empresa_id = filtros.empresa_id;
  }
  if (filtros.tipo_contrato) {
    filtrosLimpios.tipo_contrato = filtros.tipo_contrato;
  }

  emit('aplicar', filtrosLimpios);
};

const limpiarFiltros = () => {
  filtros.programa_academico = '';
  filtros.modalidad = '';
  filtros.ubicacion = '';
  filtros.salario_min = undefined;
  filtros.salario_max = undefined;
  filtros.search = '';
  filtros.estado = undefined;
  filtros.empresa_id = undefined;
  filtros.tipo_contrato = undefined;
  rangoSalarioSeleccionado.value = '';
  emit('limpiar');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
      <button
        @click="limpiarFiltros"
        class="text-sm text-blue-600 hover:text-blue-700"
      >
        Limpiar filtros
      </button>
    </div>

    <div class="space-y-4">
      <!-- Búsqueda por texto -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Buscar
        </label>
        <input
          v-model="filtros.search"
          type="text"
          placeholder="Buscar por cargo, empresa..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @keyup.enter="aplicarFiltros"
        />
      </div>

      <!-- Programa Académico -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Programa Académico
        </label>
        <select
          v-model="filtros.programa_academico"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los programas</option>
          <option v-for="programa in PROGRAMAS_ACADEMICOS" :key="programa" :value="programa">
            {{ programa }}
          </option>
        </select>
      </div>

      <!-- Modalidad -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Modalidad
        </label>
        <select
          v-model="filtros.modalidad"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las modalidades</option>
          <option v-for="(value, key) in MODALIDADES" :key="key" :value="value">
            {{ value }}
          </option>
        </select>
      </div>

      <!-- Ubicación -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
        <select
          v-model="filtros.ubicacion"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las ciudades</option>
          <option v-for="ciudad in CIUDADES_COLOMBIA" :key="ciudad" :value="ciudad">
            {{ ciudad }}
          </option>
        </select>
      </div>

      <!-- Rango de Salario -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Rango de Salario
        </label>
        <select
          v-model="rangoSalarioSeleccionado"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Cualquier salario</option>
          <option v-for="rango in RANGOS_SALARIO" :key="rango.label" :value="rango.label">
            {{ rango.label }}
          </option>
        </select>
      </div>

      <!-- Botones -->
      <div class="pt-4">
        <BaseButton
          variant="primary"
          full-width
          @click="aplicarFiltros"
        >
          Aplicar Filtros
        </BaseButton>
      </div>
    </div>
  </div>
</template>