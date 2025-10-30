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
  <div class="min-h-screen flex">
    <!-- Panel izquierdo - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden p-12">
      <!-- Patrón decorativo de fondo -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply blur-xl animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <!-- Contenido del panel izquierdo -->
      <div class="relative z-10 flex flex-col justify-center text-white w-full">
        <div class="mb-8">
          <div class="flex items-center mb-6">
            <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold">Prácticas Pro</h1>
          </div>
          
          <h2 class="text-4xl font-bold mb-4 leading-tight">
            Gestiona tus prácticas empresariales de forma inteligente
          </h2>
          <p class="text-blue-100 text-lg leading-relaxed">
            Conectamos estudiantes con empresas, simplificando el proceso de prácticas profesionales con tecnología de vanguardia.
          </p>
        </div>

        <div class="space-y-4 mt-8">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-1">
              <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Gestión centralizada</h3>
              <p class="text-blue-100 text-sm">Administra todas tus prácticas desde un solo lugar</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-1">
              <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Seguimiento en tiempo real</h3>
              <p class="text-blue-100 text-sm">Monitorea el progreso y evaluaciones al instante</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-1">
              <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Documentación automática</h3>
              <p class="text-blue-100 text-sm">Genera reportes y certificados automáticamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel derecho - Formulario -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="w-full max-w-md">
        <!-- Logo móvil -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl items-center justify-center mb-4 shadow-lg">
            <svg class="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Prácticas Pro</h2>
        </div>

        <!-- Encabezado del formulario -->
        <div class="mb-8">
          <h3 class="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h3>
          <p class="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <!-- Formulario -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <AlertNotification
            v-if="authStore.error"
            type="error"
            :message="authStore.error"
            class="mb-6"
            @close="authStore.error = null"
          />

          <form @submit.prevent="handleLogin" class="space-y-5">
            <BaseInput
              v-model="formData.email"
              label="Correo Electrónico"
              type="email"
              placeholder="tu@ejemplo.com"
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
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors cursor-pointer"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                  Mantener sesión iniciada
                </label>
              </div>

              <router-link
                to="/recuperar-password"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>

            <BaseButton
              variant="primary"
              full-width
              :loading="authStore.loading"
              type="submit"
            >
              <span v-if="!authStore.loading" class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </span>
            </BaseButton>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">¿Nuevo en la plataforma?</span>
              </div>
            </div>

            <div class="mt-6">
              <router-link
                to="/registro"
                class="w-full flex justify-center items-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Crear una cuenta nueva
              </router-link>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500 leading-relaxed">
            Al iniciar sesión, aceptas nuestros
            <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">Términos de Servicio</a>
            y
            <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Asegurar que las clases de Tailwind funcionen correctamente */
.blur-xl {
  filter: blur(64px);
}
</style>