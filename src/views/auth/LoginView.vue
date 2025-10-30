<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertNotification from '@/components/common/AlertNotification.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
  remember: false
});

const errors = ref<Record<string, string>>({});

const validarFormulario = (): boolean => {
  errors.value = {};
  
  if (!formData.email) {
    errors.value.email = 'El correo es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.value.email = 'Correo electrónico inválido';
  }
  
  if (!formData.password) {
    errors.value.password = 'La contraseña es requerida';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validarFormulario()) return;
  
  try {
    await authStore.login(formData);
    
    // Redirigir según el rol
    const redirect = route.query.redirect as string;
    if (redirect) {
      router.push(redirect);
    } else {
      const userRole = authStore.userRole;
      if (userRole === 'empresa') {
        router.push({ name: 'empresa-dashboard' });
      } else if (userRole === 'estudiante') {
        router.push({ name: 'estudiante-dashboard' });
      } else if (['admin', 'coordinador_extension', 'juridica', 'academico'].includes(userRole || '')) {
        router.push({ name: 'admin-dashboard' });
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Bienvenido</h2>
        <p class="mt-2 text-sm text-gray-600">Sistema de Gestión de Prácticas Empresariales</p>
      </div>

      <!-- Formulario de login -->
      <div class="bg-white shadow-xl rounded-lg p-8">
        <AlertNotification
          v-if="authStore.error"
          type="error"
          :message="authStore.error"
          class="mb-6"
          @close="authStore.error = null"
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

          <BaseInput
            v-model="formData.password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <router-link
              to="/recuperar-password"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <BaseButton
            variant="primary"
            full-width
            :loading="authStore.loading"
            @click="handleLogin"
          >
            Iniciar Sesión
          </BaseButton>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta?
            <router-link
              to="/registro"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>

      <!-- Enlaces adicionales -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          Al iniciar sesión, aceptas nuestros
          <a href="#" class="text-blue-600 hover:text-blue-500">Términos de Servicio</a>
          y
          <a href="#" class="text-blue-600 hover:text-blue-500">Política de Privacidad</a>
        </p>
      </div>
    </div>
  </div>
</template>