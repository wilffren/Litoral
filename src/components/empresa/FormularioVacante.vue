<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useEmpresaStore } from '@/stores/empresaStore';
import { useAuthStore } from '@/stores/authStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { MODALIDADES, TIPOS_CONTRATO, JORNADAS, PROGRAMAS_ACADEMICOS, CIUDADES_COLOMBIA } from '@/utils/constants';
import type { CrearVacanteDTO } from '@/models/Vacante';

const router = useRouter();
const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

const formData = reactive<Partial<CrearVacanteDTO>>({
  empresa_id: 0,
  programa_academico: '',
  perfil_cargo: '',
  descripcion: '',
  requisitos: '',
  cantidad: 1,
  salario: 0,
  modalidad: undefined,
  tipo_contrato: undefined,
  jornada: undefined,
  fecha_limite: '',
  ubicacion: ''
});

const errors = ref<Record<string, string>>({});
const showSuccess = ref(false);

const validarFormulario = (): boolean => {
  errors.value = {};

  if (!formData.programa_academico) {
    errors.value.programa_academico = 'Debe seleccionar un programa académico';
  }

  if (!formData.perfil_cargo) {
    errors.value.perfil_cargo = 'El perfil del cargo es requerido';
  }

  if (!formData.descripcion) {
    errors.value.descripcion = 'La descripción es requerida';
  }

  if (!formData.cantidad || formData.cantidad < 1) {
    errors.value.cantidad = 'La cantidad debe ser mayor a 0';
  }

  if (!formData.salario || formData.salario < 0) {
    errors.value.salario = 'El salario debe ser mayor a 0';
  }

  if (!formData.modalidad) {
    errors.value.modalidad = 'Debe seleccionar una modalidad';
  }

  if (!formData.tipo_contrato) {
    errors.value.tipo_contrato = 'Debe seleccionar un tipo de contrato';
  }

  if (!formData.jornada) {
    errors.value.jornada = 'Debe seleccionar una jornada';
  }

  if (!formData.fecha_limite) {
    errors.value.fecha_limite = 'La fecha límite es requerida';
  } else {
    const fechaLimite = new Date(formData.fecha_limite);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaLimite <= hoy) {
      errors.value.fecha_limite = 'La fecha límite debe ser futura';
    }
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;

  const empresaId = authStore.user?.perfil_id;
  if (!empresaId) return;

  try {
    // Agregar el empresa_id al formData
    formData.empresa_id = empresaId;
    
    // Hacer el cast a CrearVacanteDTO
    const vacanteData = formData as CrearVacanteDTO;
    
    await empresaStore.crearVacante(empresaId, vacanteData);
    showSuccess.value = true;

    setTimeout(() => {
      router.push({ name: 'empresa-vacantes' });
    }, 2000);
  } catch (error) {
    console.error('Error al crear vacante:', error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <AlertNotification
      v-if="showSuccess"
      type="success"
      title="¡Vacante creada!"
      message="La vacante ha sido publicada correctamente."
      @close="showSuccess = false"
    />

    <AlertNotification
      v-if="empresaStore.error"
      type="error"
      :message="empresaStore.error"
      @close="empresaStore.error = null"
    />

    <div class="bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Nueva Vacante</h2>

      <div class="space-y-6">
        <!-- Programa Académico -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Programa Académico <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.programa_academico"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.programa_academico }"
          >
            <option value="">Seleccione...</option>
            <option v-for="programa in PROGRAMAS_ACADEMICOS" :key="programa" :value="programa">
              {{ programa }}
            </option>
          </select>
          <p v-if="errors.programa_academico" class="mt-1 text-sm text-red-500">
            {{ errors.programa_academico }}
          </p>
        </div>

        <!-- Perfil del Cargo -->
        

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Cargo <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.descripcion"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.descripcion }"
            placeholder="Describe las responsabilidades y funciones del cargo..."
          ></textarea>
          <p v-if="errors.descripcion" class="mt-1 text-sm text-red-500">
            {{ errors.descripcion }}
          </p>
        </div>

        <!-- Requisitos -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Requisitos
          </label>
          <textarea
            v-model="formData.requisitos"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Lista los requisitos y habilidades necesarias..."
          ></textarea>
        </div>

        <!-- Cantidad y Salario -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cantidad de Vacantes <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.cantidad"
              type="number"
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.cantidad }"
            />
            <p v-if="errors.cantidad" class="mt-1 text-sm text-red-500">
              {{ errors.cantidad }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Salario Mensual (COP) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.salario"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.salario }"
              placeholder="1500000"
            />
            <p v-if="errors.salario" class="mt-1 text-sm text-red-500">
              {{ errors.salario }}
            </p>
          </div>
        </div>

        <!-- Modalidad, Tipo de Contrato, Jornada -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Modalidad <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.modalidad"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.modalidad }"
            >
              <option value="">Seleccione...</option>
              <option v-for="(value, key) in MODALIDADES" :key="key" :value="value">
                {{ value }}
              </option>
            </select>
            <p v-if="errors.modalidad" class="mt-1 text-sm text-red-500">
              {{ errors.modalidad }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contrato <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.tipo_contrato"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.tipo_contrato }"
            >
              <option value="">Seleccione...</option>
              <option v-for="(value, key) in TIPOS_CONTRATO" :key="key" :value="value">
                {{ value }}
              </option>
            </select>
            <p v-if="errors.tipo_contrato" class="mt-1 text-sm text-red-500">
              {{ errors.tipo_contrato }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jornada <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.jornada"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.jornada }"
            >
              <option value="">Seleccione...</option>
              <option v-for="(value, key) in JORNADAS" :key="key" :value="value">
                {{ value }}
              </option>
            </select>
            <p v-if="errors.jornada" class="mt-1 text-sm text-red-500">
              {{ errors.jornada }}
            </p>
          </div>
        </div>

        <!-- Ubicación y Fecha Límite -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <select
              v-model="formData.ubicacion"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione...</option>
              <option v-for="ciudad in CIUDADES_COLOMBIA" :key="ciudad" :value="ciudad">
                {{ ciudad }}
              </option>
            </select>
          </div>

          
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-4 mt-8">
        <BaseButton
          variant="secondary"
          @click="router.back()"
        >
          Cancelar
        </BaseButton>

        <BaseButton
          variant="primary"
          :loading="empresaStore.loading"
          @click="handleSubmit"
        >
          Publicar Vacante
        </BaseButton>
      </div>
    </div>
  </div>
</template>