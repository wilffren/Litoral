<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEmpresaStore } from '@/stores/empresaStore';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formatDate, formatCurrency } from '@/utils/formatters';
import type { Postulacion } from '@/models/Vacante';

interface Props {
  vacanteId: number;
}

const props = defineProps<Props>();
const empresaStore = useEmpresaStore();

const showModal = ref(false);
const selectedPostulacion = ref<Postulacion | null>(null);
const showSuccess = ref(false);
const successMessage = ref('');

const postulacionesFiltradas = computed(() => {
  return empresaStore.postulaciones;
});

const abrirDetalle = (postulacion: Postulacion) => {
  selectedPostulacion.value = postulacion;
  showModal.value = true;
};

const seleccionarCandidato = async () => {
  if (!selectedPostulacion.value?.id) return;

  try {
    await empresaStore.seleccionarCandidato(selectedPostulacion.value.id);
    successMessage.value = 'Candidato seleccionado exitosamente';
    showSuccess.value = true;
    showModal.value = false;
  } catch (error) {
    console.error('Error al seleccionar candidato:', error);
  }
};

const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    enviada: 'bg-blue-100 text-blue-800',
    en_revision: 'bg-yellow-100 text-yellow-800',
    seleccionada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800';
};

const getEstadoTexto = (estado: string) => {
  const textos: Record<string, string> = {
    enviada: 'Enviada',
    en_revision: 'En Revisión',
    seleccionada: 'Seleccionada',
    rechazada: 'Rechazada'
  };
  return textos[estado] || estado;
};
</script>

<template>
  <div>
    <AlertNotification
      v-if="showSuccess"
      type="success"
      :message="successMessage"
      class="mb-6"
      @close="showSuccess = false"
    />

    <!-- Lista de postulaciones -->
    <div class="space-y-4">
      <div
        v-for="postulacion in postulacionesFiltradas"
        :key="postulacion.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
        @click="abrirDetalle(postulacion)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ postulacion.estudiante?.nombre_completo }}
              </h3>
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="getEstadoBadgeClass(postulacion.estado)"
              >
                {{ getEstadoTexto(postulacion.estado) }}
              </span>
            </div>

            <div class="space-y-1 text-sm text-gray-600">
              <p>
                <span class="font-medium">Programa:</span>
                {{ postulacion.estudiante?.programa_academico }}
              </p>
              <p>
                <span class="font-medium">Semestre:</span>
                {{ postulacion.estudiante?.semestre }}
              </p>
              <p>
                <span class="font-medium">Correo:</span>
                {{ postulacion.estudiante?.correo }}
              </p>
              <p>
                <span class="font-medium">Teléfono:</span>
                {{ postulacion.estudiante?.telefono }}
              </p>
            </div>

            <p class="text-xs text-gray-500 mt-2">
              Postulado el {{ formatDate(postulacion.fecha_postulacion || '') }}
            </p>
          </div>

          <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div v-if="postulacionesFiltradas.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay postulaciones</h3>
        <p class="mt-1 text-sm text-gray-500">Aún no se han recibido postulaciones para esta vacante.</p>
      </div>
    </div>

    <!-- Modal de detalle -->
    <BaseModal
      :show="showModal"
      title="Detalle del Candidato"
      size="lg"
      @close="showModal = false"
    >
      <div v-if="selectedPostulacion" class="space-y-6">
        <!-- Información personal -->
        <div>
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Información Personal</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Nombre</p>
              <p class="font-medium">{{ selectedPostulacion.estudiante?.nombre_completo }}</p>
            </div>
            <div>
              <p class="text-gray-500">Programa</p>
              <p class="font-medium">{{ selectedPostulacion.estudiante?.programa_academico }}</p>
            </div>
            <div>
              <p class="text-gray-500">Semestre</p>
              <p class="font-medium">{{ selectedPostulacion.estudiante?.semestre }}</p>
            </div>
            <div>
              <p class="text-gray-500">Correo</p>
              <p class="font-medium">{{ selectedPostulacion.estudiante?.correo }}</p>
            </div>
            <div>
              <p class="text-gray-500">Teléfono</p>
              <p class="font-medium">{{ selectedPostulacion.estudiante?.telefono }}</p>
            </div>
            <div>
              <p class="text-gray-500">Estado</p>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getEstadoBadgeClass(selectedPostulacion.estado)"
              >
                {{ getEstadoTexto(selectedPostulacion.estado) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div v-if="selectedPostulacion.observaciones">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Observaciones</h4>
          <p class="text-sm text-gray-700">{{ selectedPostulacion.observaciones }}</p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showModal = false">
          Cerrar
        </BaseButton>
        <BaseButton
          v-if="selectedPostulacion?.estado !== 'seleccionada'"
          variant="primary"
          @click="seleccionarCandidato"
        >
          Seleccionar Candidato
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>