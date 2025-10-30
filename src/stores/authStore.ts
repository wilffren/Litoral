import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario, LoginDTO, RegistroDTO } from '../models/Usuario';

/**
 * Store de autenticación (simulado sin backend)
 */
export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<Usuario | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.rol);
  const userName = computed(() => user.value?.nombre);

  // Inicializar desde sessionStorage
  const init = () => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  };

  /**
   * Iniciar sesión (simulado)
   * Roles disponibles: empresa, estudiante, admin
   */
  const login = async (credentials: LoginDTO) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulación de usuarios predefinidos
      let rol: Usuario['rol'] | null = null;
      let nombre = '';
      switch (credentials.email) {
        case 'admin@example.com':
          if (credentials.password === 'admin') {
            rol = 'admin';
            nombre = 'Administrador';
          }
          break;
        case 'empresa@example.com':
          if (credentials.password === '1234') {
            rol = 'empresa';
            nombre = 'Empresa Demo';
          }
          break;
        case 'estudiante@example.com':
          if (credentials.password === '1234') {
            rol = 'estudiante';
            nombre = 'Estudiante Demo';
          }
          break;
      }

      if (!rol) throw new Error('Credenciales inválidas');

      token.value = 'fake-token-123';
      user.value = {
        id: 1,
        nombre,
        email: credentials.email,
        rol,
        estado: 'activo',
        perfil_id: 1,
        permisos: [],
      };

      sessionStorage.setItem('token', token.value);
      sessionStorage.setItem('user', JSON.stringify(user.value));

      return { token: token.value, user: user.value };
    } catch (e: any) {
      error.value = e.message || 'Error al iniciar sesión';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Registrar usuario (simulado)
   */
  const registrar = async (data: RegistroDTO) => {
    loading.value = true;
    error.value = null;

    try {
      // Cualquier registro crea usuario con rol 'estudiante' por defecto
      token.value = 'fake-token-123';
      user.value = {
        id: 2,
        nombre: data.nombre,
        email: data.email,
        rol: 'estudiante',
        estado: 'activo',
        perfil_id: 2,
        permisos: [],
      };
      sessionStorage.setItem('token', token.value);
      sessionStorage.setItem('user', JSON.stringify(user.value));
      return { token: token.value, user: user.value };
    } catch (e: any) {
      error.value = e.message || 'Error al registrar usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    loading.value = true;
    try {
      token.value = null;
      user.value = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUser = (userData: Partial<Usuario>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData };
      sessionStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  /**
   * Verificar permisos
   */
  const hasPermission = (permiso: string): boolean => {
    if (!user.value?.permisos) return false;
    return user.value.permisos.includes(permiso);
  };

  /**
   * Verificar rol
   */
  const hasRole = (rol: string | string[]): boolean => {
    if (!user.value?.rol) return false;
    if (Array.isArray(rol)) return rol.includes(user.value.rol);
    return user.value.rol === rol;
  };

  /**
   * Obtener usuario actual (simulado)
   */
  const fetchCurrentUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value) throw new Error('No autenticado');
      return user.value;
    } catch (e: any) {
      error.value = e.message || 'Error al obtener usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Inicializar al crear el store
  init();

  return {
    // Estado
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    userRole,
    userName,

    // Acciones
    login,
    registrar,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    fetchCurrentUser,
    init,
  };
});
