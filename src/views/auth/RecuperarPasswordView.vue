<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/authService';
import BaseInput from '../../components/common/BaseInput.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import AlertNotification from '../../components/common/AlertNotification.vue';

const router = useRouter();

const formData = reactive({
  email: ''
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');

const validarFormulario = (): boolean => {
  errors.value = {};
  
  if (!formData.email) {
    errors.value.email = 'El correo es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.value.email = 'Correo electrónico inválido';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validarFormulario()) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    await authService.recuperarPassword(formData);
    showSuccess.value = true;
    
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Error al enviar el correo de recuperación';
  } finally {
    loading.value = false;
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Recuperar Contraseña</h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <!-- Formulario -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <AlertNotification
          v-if="showSuccess"
          type="success"
          title="¡Correo Enviado!"
          message="Hemos enviado un enlace de recuperación a tu correo electrónico."
          class="mb-6"
        />

        <AlertNotification
          v-if="errorMessage"
          type="error"
          :message="errorMessage"
          class="mb-6"
          @close="errorMessage = ''"
        />

        <div class="space-y-6">
          <BaseInput
            v-model="formData.email"
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            :error="errors.email"
            required
          />

          <BaseButton
            variant="primary"
            full-width
            :loading="loading"
            @click="handleSubmit"
          >
            Enviar Enlace de Recuperación
          </BaseButton>
        </div>

        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Volver al inicio de sesión
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>