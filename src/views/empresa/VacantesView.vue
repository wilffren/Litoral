<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEmpresaStore } from '@/stores/empresaStore';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import type { Vacante } from '@/models/Vacante';

const router = useRouter();
const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

const filtroEstado = ref<'todas' | 'activa' | 'cerrada' | 'pausada'>('todas');
const showModalEstado = ref(false);
const vacanteSeleccionada = ref<Vacante | null>(null);
const nuevoEstado = ref<'activa' | 'cerrada' | 'pausada'>('activa');

const vacantesFiltradas = computed(() => {
  if (filtroEstado.value === 'todas') {
    return empresaStore.vacantes;
  }
  return empresaStore.vacantes.filter(v => v.estado === filtroEstado.value);
});

onMounted(async () => {
  const empresaId = authStore.user?.perfil_id;
  if (empresaId) {
    await empresaStore.cargarVacantes(empresaId);
  }
});

const abrirModalEstado = (vacante: Vacante) => {
  vacanteSeleccionada.value = vacante;
  nuevoEstado.value = vacante.estado as 'activa' | 'cerrada' | 'pausada';
  showModalEstado.value = true;
};

const cambiarEstado = async () => {
  if (!vacanteSeleccionada.value?.id) return;

  try {
    await empresaStore.cambiarEstadoVacante(vacanteSeleccionada.value.id, nuevoEstado.value);
    showModalEstado.value = false;
  } catch (error) {
    console.error('Error al cambiar estado:', error);
  }
};

const verPostulaciones = (vacanteId: number) => {
  router.push({ name: 'empresa-postulaciones', params: { id: vacanteId } });
};

const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    activa: 'bg-green-100 text-green-800',
    cerrada: 'bg-gray-100 text-gray-800',
    pausada: 'bg-yellow-100 text-yellow-800'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800';
};

const getEstadoTexto = (estado: string) => {
  const textos: Record<string, string> = {
    activa: 'Activa',
    cerrada: 'Cerrada',
    pausada: 'Pausada'
  };
  return textos[estado] || estado;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Vacantes</h1>
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
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-700">Filtrar por estado:</span>
          <div class="flex gap-2">
            <button
              @click="filtroEstado = 'todas'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="filtroEstado === 'todas' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Todas
            </button>
            <button
              @click="filtroEstado = 'activa'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="filtroEstado === 'activa' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Activas
            </button>
            <button
              @click="filtroEstado = 'pausada'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="filtroEstado === 'pausada' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Pausadas
            </button>
            <button
              @click="filtroEstado = 'cerrada'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="filtroEstado === 'cerrada' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Cerradas
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de vacantes -->
      <div class="space-y-4">
        <div
          v-for="vacante in vacantesFiltradas"
          :key="vacante.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Encabezado -->
              <div class="flex items-center gap-3 mb-3">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ vacante.perfil_cargo }}
                </h3>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getEstadoBadgeClass(vacante.estado)"
                >
                  {{ getEstadoTexto(vacante.estado) }}
                </span>
                <span class="text-sm text-gray-500">
                  Código: {{ vacante.codigo_unico }}
                </span>
              </div>

              <!-- Detalles -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p class="text-gray-500">Programa</p>
                  <p class="font-medium">{{ vacante.programa_academico }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Modalidad</p>
                  <p class="font-medium">{{ vacante.modalidad }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Salario</p>
                  <p class="font-medium">{{ formatCurrency(vacante.salario) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Postulaciones</p>
                  <p class="font-medium">{{ vacante.postulaciones_count || 0 }}</p>
                </div>
              </div>

              <!-- Fecha límite -->
              <p class="text-xs text-gray-500">
                Fecha límite: {{ formatDateShort(vacante.fecha_limite) }}
              </p>
            </div>

            <!-- Acciones -->
            <div class="ml-4 flex flex-col gap-2">
              <BaseButton
                variant="primary"
                size="sm"
                @click="verPostulaciones(vacante.id!)"
              >
                Ver Postulaciones ({{ vacante.postulaciones_count || 0 }})
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                @click="abrirModalEstado(vacante)"
              >
                Cambiar Estado
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="vacantesFiltradas.length === 0" class="text-center py-12 bg-white rounded-lg">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No hay vacantes {{ filtroEstado !== 'todas' ? `en estado ${filtroEstado}` : '' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ filtroEstado === 'todas' ? 'Comienza creando tu primera vacante.' : 'Intenta con otro filtro.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal cambiar estado -->
    <BaseModal
      :show="showModalEstado"
      title="Cambiar Estado de Vacante"
      @close="showModalEstado = false"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Cambia el estado de la vacante <strong>{{ vacanteSeleccionada?.perfil_cargo }}</strong>
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nuevo Estado</label>
          <select
            v-model="nuevoEstado"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showModalEstado = false">
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="empresaStore.loading"
          @click="cambiarEstado"
        >
          Guardar Cambios
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>