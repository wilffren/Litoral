<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useEstudianteStore } from '@/stores/estudianteStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { TIPOS_DOCUMENTO, GRUPOS_ETNICOS } from '@/models/Estudiante';
import type { RegistroEstudianteDTO } from '@/models/Estudiante';

const router = useRouter();
const estudianteStore = useEstudianteStore();

const paso = ref(1);

// Tipar correctamente el formData
const formData = reactive<RegistroEstudianteDTO & { 
  grupo_etnico?: string;
  discapacidad?: string;
}>({
  tipo_documento: 'CC',
  documento: '',
  nombre_completo: '',
  fecha_nacimiento: '',
  sexo: 'M',
  correo: '',
  telefono: '',
  programa_academico: '',
  semestre: 1,
  disponibilidad_horaria: '',
  perfil_laboral: '',
  grupo_etnico: '',
  discapacidad: ''
});

const errors = ref<Record<string, string>>({});
const showSuccess = ref(false);

const programasAcademicos = [
  'Ingeniería de Sistemas',
  'Administración de Empresas',
  'Contaduría Pública',
  'Derecho',
  'Psicología',
  'Ingeniería Industrial'
];

const validarPaso1 = (): boolean => {
  errors.value = {};
  
  if (!formData.documento) {
    errors.value.documento = 'El documento es requerido';
  }
  
  if (!formData.nombre_completo) {
    errors.value.nombre_completo = 'El nombre completo es requerido';
  }
  
  if (!formData.fecha_nacimiento) {
    errors.value.fecha_nacimiento = 'La fecha de nacimiento es requerida';
  }
  
  if (!formData.sexo) {
    errors.value.sexo = 'Debe seleccionar el sexo';
  }
  
  return Object.keys(errors.value).length === 0;
};

const validarPaso2 = (): boolean => {
  errors.value = {};
  
  if (!formData.correo) {
    errors.value.correo = 'El correo es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errors.value.correo = 'Correo electrónico inválido';
  }
  
  if (!formData.telefono) {
    errors.value.telefono = 'El teléfono es requerido';
  }
  
  return Object.keys(errors.value).length === 0;
};

const validarPaso3 = (): boolean => {
  errors.value = {};
  
  if (!formData.programa_academico) {
    errors.value.programa_academico = 'Debe seleccionar un programa';
  }
  
  if (!formData.disponibilidad_horaria) {
    errors.value.disponibilidad_horaria = 'Debe especificar la disponibilidad';
  }
  
  if (!formData.perfil_laboral) {
    errors.value.perfil_laboral = 'Debe describir su perfil laboral';
  }
  
  return Object.keys(errors.value).length === 0;
};

const siguiente = () => {
  let valido = false;
  
  switch (paso.value) {
    case 1:
      valido = validarPaso1();
      break;
    case 2:
      valido = validarPaso2();
      break;
  }
  
  if (valido) {
    paso.value++;
  }
};

const anterior = () => {
  if (paso.value > 1) {
    paso.value--;
    errors.value = {};
  }
};

const handleSubmit = async () => {
  if (!validarPaso3()) return;
  
  try {
    // Extraer solo los campos necesarios para el DTO
    const estudianteDTO: RegistroEstudianteDTO = {
      tipo_documento: formData.tipo_documento,
      documento: formData.documento,
      nombre_completo: formData.nombre_completo,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      correo: formData.correo,
      telefono: formData.telefono,
      programa_academico: formData.programa_academico,
      semestre: formData.semestre,
      disponibilidad_horaria: formData.disponibilidad_horaria,
      perfil_laboral: formData.perfil_laboral
    };
    
    await estudianteStore.registrarEstudiante(estudianteDTO);
    showSuccess.value = true;
    
    setTimeout(() => {
      router.push({ name: 'estudiante-perfil' });
    }, 2000);
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <AlertNotification
      v-if="showSuccess"
      type="success"
      title="¡Registro exitoso!"
      message="Tu perfil ha sido creado correctamente. Redirigiendo..."
      @close="showSuccess = false"
    />

    <AlertNotification
      v-if="estudianteStore.error"
      type="error"
      :message="estudianteStore.error"
      @close="estudianteStore.error = null"
    />

    <!-- Indicador de progreso -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div
          v-for="n in 3"
          :key="n"
          class="flex items-center flex-1"
        >
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition"
            :class="paso >= n ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'"
          >
            {{ n }}
          </div>
          <div
            v-if="n < 3"
            class="flex-1 h-1 mx-4 transition"
            :class="paso > n ? 'bg-blue-600' : 'bg-gray-300'"
          ></div>
        </div>
      </div>
      <div class="flex justify-between mt-2 text-sm">
        <span :class="paso >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'">Datos Personales</span>
        <span :class="paso >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'">Contacto</span>
        <span :class="paso >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'">Información Académica</span>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-8">
      <!-- Paso 1: Datos Personales -->
      <div v-if="paso === 1">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.tipo_documento"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="tipo in TIPOS_DOCUMENTO" :key="tipo" :value="tipo">
                {{ tipo }}
              </option>
            </select>
          </div>

          <BaseInput
            v-model="formData.documento"
            label="Número de Documento"
            :error="errors.documento"
            required
          />

          <div class="md:col-span-2">
            <BaseInput
              v-model="formData.nombre_completo"
              label="Nombre Completo"
              :error="errors.nombre_completo"
              required
            />
          </div>

          <BaseInput
            v-model="formData.fecha_nacimiento"
            label="Fecha de Nacimiento"
            type="date"
            :error="errors.fecha_nacimiento"
            required
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sexo <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.sexo"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.sexo }"
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <p v-if="errors.sexo" class="mt-1 text-sm text-red-500">{{ errors.sexo }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Grupo Étnico</label>
            <select
              v-model="formData.grupo_etnico"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="grupo in GRUPOS_ETNICOS" :key="grupo" :value="grupo">
                {{ grupo }}
              </option>
            </select>
          </div>

          
        </div>
      </div>

      <!-- Paso 2: Contacto -->
      <div v-if="paso === 2">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Datos de Contacto</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="formData.correo"
            label="Correo Electrónico"
            type="email"
            :error="errors.correo"
            required
          />

          <BaseInput
            v-model="formData.telefono"
            label="Teléfono"
            type="tel"
            :error="errors.telefono"
            required
          />
        </div>
      </div>

      <!-- Paso 3: Información Académica -->
      <div v-if="paso === 3">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Información Académica</h2>
        <div class="space-y-6">
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
              <option v-for="programa in programasAcademicos" :key="programa" :value="programa">
                {{ programa }}
              </option>
            </select>
            <p v-if="errors.programa_academico" class="mt-1 text-sm text-red-500">
              {{ errors.programa_academico }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Semestre <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.semestre"
              type="number"
              min="1"
              max="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <BaseInput
            v-model="formData.disponibilidad_horaria"
            label="Disponibilidad Horaria"
            placeholder="Ej: Lunes a Viernes 8am-5pm"
            :error="errors.disponibilidad_horaria"
            required
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Perfil Laboral <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.perfil_laboral"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.perfil_laboral }"
              placeholder="Describe tus habilidades, conocimientos y áreas de interés..."
            ></textarea>
            <p v-if="errors.perfil_laboral" class="mt-1 text-sm text-red-500">
              {{ errors.perfil_laboral }}
            </p>
          </div>
        </div>
      </div>

      <!-- Botones de navegación -->
      <div class="flex justify-between mt-8">
        <BaseButton
          v-if="paso > 1"
          variant="secondary"
          @click="anterior"
        >
          Anterior
        </BaseButton>
        <div v-else></div>

        <BaseButton
          v-if="paso < 3"
          variant="primary"
          @click="siguiente"
        >
          Siguiente
        </BaseButton>

        <BaseButton
          v-else
          variant="primary"
          :loading="estudianteStore.loading"
          @click="handleSubmit"
        >
          Finalizar Registro
        </BaseButton>
      </div>
    </div>
  </div>
</template>