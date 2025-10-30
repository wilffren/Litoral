<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';

const router = useRouter();
const authStore = useAuthStore();

const tipoUsuario = ref<'empresa' | 'estudiante'>('estudiante');

const formData = reactive({
  nombre: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const errors = ref<Record<string, string>>({});

const validarFormulario = (): boolean => {
  errors.value = {};
  
  if (!formData.nombre) {
    errors.value.nombre = 'El nombre es requerido';
  }
  
  if (!formData.email) {
    errors.value.email = 'El correo es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.value.email = 'Correo electrónico inválido';
  }
  
  if (!formData.password) {
    errors.value.password = 'La contraseña es requerida';
  } else if (formData.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (formData.password !== formData.password_confirmation) {
    errors.value.password_confirmation = 'Las contraseñas no coinciden';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleRegister = async () => {
  if (!validarFormulario()) return;
  
  try {
    await authStore.registrar({
      ...formData,
      rol: tipoUsuario.value
    });
    
    // Redirigir según el tipo de usuario
    if (tipoUsuario.value === 'empresa') {
      router.push({ name: 'empresa-registro' });
    } else {
      router.push({ name: 'estudiante-registro' });
    }
  } catch (error) {
    console.error('Error al registrar:', error);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p class="mt-2 text-sm text-gray-600">Sistema de Gestión de Prácticas Empresariales</p>
      </div>

      <!-- Formulario de registro -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <AlertNotification
          v-if="authStore.error"
          type="error"
          :message="authStore.error"
          class="mb-6"
          @close="authStore.error = null"
        />

        <!-- Selector de tipo de usuario -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Usuario</label>
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="tipoUsuario = 'estudiante'"
              class="p-4 border-2 rounded-lg transition"
              :class="tipoUsuario === 'estudiante' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <svg class="h-8 w-8 mx-auto mb-2" :class="tipoUsuario === 'estudiante' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p class="text-sm font-medium" :class="tipoUsuario === 'estudiante' ? 'text-blue-900' : 'text-gray-700'">
                Estudiante
              </p>
            </button>

            <button
              @click="tipoUsuario = 'empresa'"
              class="p-4 border-2 rounded-lg transition"
              :class="tipoUsuario === 'empresa' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <svg class="h-8 w-8 mx-auto mb-2" :class="tipoUsuario === 'empresa' ? 'text-blue-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p class="text-sm font-medium" :class="tipoUsuario === 'empresa' ? 'text-blue-900' : 'text-gray-700'">
                Empresa
              </p>
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <BaseInput
            v-model="formData.nombre"
            label="Nombre Completo"
            type="text"
            placeholder="Juan Pérez"
            :error="errors.nombre"
            required
          />

          <BaseInput
            v-model="formData.email"
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="formData.password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            hint="Mínimo 8 caracteres"
            required
          />

          <BaseInput
            v-model="formData.password_confirmation"
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            :error="errors.password_confirmation"
            required
          />

          <BaseButton
            variant="primary"
            full-width
            :loading="authStore.loading"
            @click="handleRegister"
          >
            Crear Cuenta
          </BaseButton>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </div>

      <!-- Términos y condiciones -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          Al registrarte, aceptas nuestros
          <a href="#" class="text-blue-600 hover:text-blue-500">Términos de Servicio</a>
          y
          <a href="#" class="text-blue-600 hover:text-blue-500">Política de Privacidad</a>
        </p>
      </div>
    </div>
  </div>
</template>