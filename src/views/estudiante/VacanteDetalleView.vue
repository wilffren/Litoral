<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEstudianteStore } from '@/stores/estudianteStore';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { estudianteService } from '@/services/estudianteService';
import type { Vacante } from '@/models/Vacante';

const route = useRoute();
const router = useRouter();
const estudianteStore = useEstudianteStore();
const authStore = useAuthStore();

const vacante = ref<Vacante | null>(null);
const loading = ref(true);
const showModalPostular = ref(false);
const showSuccess = ref(false);

const yaPostulado = computed(() => {
  if (!vacante.value?.id) return false;
  return estudianteStore.misPostulaciones.some(
    p => p.vacante_id === vacante.value!.id && p.estado !== 'retirada'
  );
});

onMounted(async () => {
  const vacanteId = Number(route.params.id);
  const estudianteId = authStore.user?.perfil_id;

  try {
    vacante.value = await estudianteService.obtenerVacante(vacanteId);
    if (estudianteId) {
      await estudianteStore.cargarMisPostulaciones(estudianteId);
    }
  } catch (error) {
    console.error('Error al cargar vacante:', error);
  } finally {
    loading.value = false;
  }
});

const confirmarPostulacion = () => {
  showModalPostular.value = true;
};

const postular = async () => {
  if (!vacante.value?.id) return;
  const estudianteId = authStore.user?.perfil_id;
  if (!estudianteId) return;

  try {
    await estudianteStore.postularVacante(vacante.value.id, estudianteId);
    showModalPostular.value = false;
    showSuccess.value = true;
    setTimeout(() => {
      router.push({ name: 'estudiante-postulaciones' });
    }, 2000);
  } catch (error) {
    console.error('Error al postular:', error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <svg class="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Contenido -->
    <div v-else-if="vacante" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <AlertNotification
          v-if="showSuccess"
          type="success"
          title="¡Postulación enviada!"
          message="Tu postulación ha sido enviada exitosamente. La empresa revisará tu perfil."
        />
      </div>

      <!-- Tarjeta principal -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Encabezado -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ vacante.perfil_cargo }}</h1>
              <p class="text-xl text-blue-100">{{ vacante.empresa?.nombre }}</p>
              <div class="flex items-center gap-4 mt-4 text-sm">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ vacante.ubicacion || vacante.empresa?.ciudad }}
                </span>
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ vacante.jornada }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-blue-100">Salario</p>
              <p class="text-2xl font-bold">{{ formatCurrency(vacante.salario) }}</p>
            </div>
          </div>
        </div>

        <!-- Información principal -->
        <div class="p-8">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {{ vacante.modalidad }}
            </span>
            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {{ vacante.tipo_contrato }}
            </span>
            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              {{ vacante.programa_academico }}
            </span>
            <span v-if="vacante.cantidad > 1" class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {{ vacante.cantidad }} vacantes disponibles
            </span>
          </div>

          <!-- Descripción -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">Descripción del Cargo</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ vacante.descripcion }}</p>
          </div>

          <!-- Requisitos -->
          <div v-if="vacante.requisitos" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">Requisitos</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ vacante.requisitos }}</p>
          </div>

          <!-- Detalles adicionales -->
          <div class="border-t pt-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Detalles</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Fecha Límite</p>
                <p class="font-medium text-gray-900">{{ formatDateShort(vacante.fecha_limite) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Sector</p>
                <p class="font-medium text-gray-900">{{ vacante.empresa?.sector_economico }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Código de Vacante</p>
                <p class="font-medium text-gray-900">{{ vacante.codigo_unico }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botón de acción -->
        <div class="bg-gray-50 px-8 py-6 flex justify-between items-center">
          <p class="text-sm text-gray-600">
            {{ yaPostulado ? 'Ya te has postulado a esta vacante' : '¿Te interesa esta vacante?' }}
          </p>
          <BaseButton
            v-if="!yaPostulado"
            variant="primary"
            size="lg"
            @click="confirmarPostulacion"
          >
            Postularme
          </BaseButton>
          <span v-else class="px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg">
            ✓ Postulado
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <BaseModal
      :show="showModalPostular"
      title="Confirmar Postulación"
      @close="showModalPostular = false"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          ¿Estás seguro que deseas postularte a la vacante 
          <strong>{{ vacante?.perfil_cargo }}</strong> en 
          <strong>{{ vacante?.empresa?.nombre }}</strong>?
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800">
            La empresa podrá ver tu perfil completo y contactarte si tu perfil es seleccionado.
          </p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showModalPostular = false">
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="estudianteStore.loading"
          @click="postular"
        >
          Confirmar Postulación
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>