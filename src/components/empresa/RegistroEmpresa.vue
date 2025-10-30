<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useEmpresaStore } from '@/stores/empresaStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { SECTORES_ECONOMICOS } from '@/models/Empresa';

const router = useRouter();
const empresaStore = useEmpresaStore();

const formData = reactive({
  nombre: '',
  nit: '',
  correo_institucional: '',
  telefono: '',
  representante_legal: '',
  sector_economico: '',
  direccion: '',
  ciudad: ''
});

const errors = ref<Record<string, string>>({});
const showSuccess = ref(false);

const validarFormulario = (): boolean => {
  errors.value = {};
  
  if (!formData.nombre) {
    errors.value.nombre = 'El nombre de la empresa es requerido';
  }
  
  if (!formData.nit) {
    errors.value.nit = 'El NIT es requerido';
  } else if (!/^\d{9,10}-?\d?$/.test(formData.nit)) {
    errors.value.nit = 'NIT inválido. Formato: 123456789-0';
  }
  
  if (!formData.correo_institucional) {
    errors.value.correo_institucional = 'El correo institucional es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_institucional)) {
    errors.value.correo_institucional = 'Correo electrónico inválido';
  }
  
  if (!formData.telefono) {
    errors.value.telefono = 'El teléfono es requerido';
  } else if (!/^\d{7,10}$/.test(formData.telefono.replace(/\s/g, ''))) {
    errors.value.telefono = 'Teléfono inválido';
  }
  
  if (!formData.representante_legal) {
    errors.value.representante_legal = 'El representante legal es requerido';
  }
  
  if (!formData.sector_economico) {
    errors.value.sector_economico = 'Debe seleccionar un sector económico';
  }
  
  if (!formData.direccion) {
    errors.value.direccion = 'La dirección es requerida';
  }
  
  if (!formData.ciudad) {
    errors.value.ciudad = 'La ciudad es requerida';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;
  
  try {
    await empresaStore.registrarEmpresa(formData);
    showSuccess.value = true;
    
    setTimeout(() => {
      router.push({ name: 'empresa-convenio' });
    }, 2000);
  } catch (error) {
    console.error('Error al registrar empresa:', error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <AlertNotification
      v-if="showSuccess"
      type="success"
      title="¡Registro exitoso!"
      message="La empresa ha sido registrada correctamente. Redirigiendo..."
      @close="showSuccess = false"
    />

    <AlertNotification
      v-if="empresaStore.error"
      type="error"
      :message="empresaStore.error"
      @close="empresaStore.error = null"
    />

    <div class="bg-white shadow-md rounded-lg p-8 mt-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Datos de la Empresa</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="formData.nombre"
          label="Nombre de la Empresa"
          placeholder="Ej: Tecnologías Avanzadas S.A.S"
          :error="errors.nombre"
          required
        />

        <BaseInput
          v-model="formData.nit"
          label="NIT"
          placeholder="123456789-0"
          :error="errors.nit"
          required
        />

        <BaseInput
          v-model="formData.correo_institucional"
          label="Correo Institucional"
          type="email"
          placeholder="contacto@empresa.com"
          :error="errors.correo_institucional"
          required
        />

        <BaseInput
          v-model="formData.telefono"
          label="Teléfono"
          type="tel"
          placeholder="3001234567"
          :error="errors.telefono"
          required
        />

        <BaseInput
          v-model="formData.representante_legal"
          label="Representante Legal"
          placeholder="Nombre completo"
          :error="errors.representante_legal"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sector Económico <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.sector_economico"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.sector_economico }"
          >
            <option value="">Seleccione...</option>
            <option v-for="sector in SECTORES_ECONOMICOS" :key="sector" :value="sector">
              {{ sector }}
            </option>
          </select>
          <p v-if="errors.sector_economico" class="mt-1 text-sm text-red-500">
            {{ errors.sector_economico }}
          </p>
        </div>

        <BaseInput
          v-model="formData.direccion"
          label="Dirección"
          placeholder="Calle 123 # 45-67"
          :error="errors.direccion"
          required
        />

        <BaseInput
          v-model="formData.ciudad"
          label="Ciudad"
          placeholder="Barranquilla"
          :error="errors.ciudad"
          required
        />
      </div>

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
          Registrar Empresa
        </BaseButton>
      </div>
    </div>
  </div>
</template>