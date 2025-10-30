import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Usuario } from '../models/Usuario';
import type { Convenio } from '../models/Empresa';
import { adminService } from '../services/adminService';

/**
 * Store de administración
 * Maneja el estado y operaciones administrativas
 */
export const useAdminStore = defineStore('admin', () => {
  // Estado
  const estadisticas = ref({
    total_empresas: 0,
    total_estudiantes: 0,
    total_vacantes_activas: 0,
    total_postulaciones: 0,
    convenios_pendientes: 0,
    documentos_pendientes: 0
  });
  
  const usuarios = ref<Usuario[]>([]);
  const conveniosPendientes = ref<Convenio[]>([]);
  const documentosPendientes = ref<any[]>([]);
  const alertas = ref({
    convenios_pendientes: 0,
    documentos_pendientes: 0,
    candidatos_seleccionados: 0,
    vacantes_vencidas: 0
  });
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const totalAlertas = computed(() => {
    return Object.values(alertas.value).reduce((sum, val) => sum + val, 0);
  });

  const tieneAlertasPendientes = computed(() => {
    return totalAlertas.value > 0;
  });

  /**
   * Cargar estadísticas del dashboard
   */
  const cargarEstadisticas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      estadisticas.value = await adminService.obtenerEstadisticas();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar estadísticas';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar usuarios administrativos
   */
  const cargarUsuarios = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      usuarios.value = await adminService.obtenerUsuarios();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar usuarios';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear usuario administrativo
   */
  const crearUsuario = async (data: any) => {
    loading.value = true;
    error.value = null;
    
    try {
      const nuevoUsuario = await adminService.crearUsuario(data);
      usuarios.value.unshift(nuevoUsuario);
      return nuevoUsuario;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al crear usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar usuario
   */
  const actualizarUsuario = async (id: number, data: Partial<Usuario>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const usuarioActualizado = await adminService.actualizarUsuario(id, data);
      const index = usuarios.value.findIndex(u => u.id === id);
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado;
      }
      return usuarioActualizado;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cambiar estado de usuario
   */
  const cambiarEstadoUsuario = async (
    id: number,
    estado: 'activo' | 'inactivo' | 'suspendido'
  ) => {
    loading.value = true;
    error.value = null;
    
    try {
      const usuarioActualizado = await adminService.cambiarEstadoUsuario(id, estado);
      const index = usuarios.value.findIndex(u => u.id === id);
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cambiar estado';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Eliminar usuario
   */
  const eliminarUsuario = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      await adminService.eliminarUsuario(id);
      usuarios.value = usuarios.value.filter(u => u.id !== id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al eliminar usuario';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar convenios pendientes
   */
  const cargarConveniosPendientes = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      conveniosPendientes.value = await adminService.obtenerConveniosPendientes();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar convenios';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Aprobar convenio
   */
  const aprobarConvenio = async (convenioId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      await adminService.aprobarConvenio(convenioId);
      conveniosPendientes.value = conveniosPendientes.value.filter(
        c => c.id !== convenioId
      );
      await cargarEstadisticas();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al aprobar convenio';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Rechazar convenio
   */
  const rechazarConvenio = async (convenioId: number, motivo: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      await adminService.rechazarConvenio(convenioId, motivo);
      conveniosPendientes.value = conveniosPendientes.value.filter(
        c => c.id !== convenioId
      );
      await cargarEstadisticas();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al rechazar convenio';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar documentos pendientes
   */
  const cargarDocumentosPendientes = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      documentosPendientes.value = await adminService.obtenerDocumentosPendientes();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar documentos';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Validar documento
   */
  const validarDocumento = async (
    documentoId: number,
    aprobado: boolean,
    observaciones?: string
  ) => {
    loading.value = true;
    error.value = null;
    
    try {
      await adminService.validarDocumento(documentoId, aprobado, observaciones);
      documentosPendientes.value = documentosPendientes.value.filter(
        d => d.id !== documentoId
      );
      await cargarEstadisticas();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al validar documento';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar alertas
   */
  const cargarAlertas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      alertas.value = await adminService.obtenerAlertas();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar alertas';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Generar reporte
   */
  const generarReporte = async (
    tipo: 'empresas' | 'estudiantes' | 'vacantes',
    filtros?: any
  ) => {
    loading.value = true;
    error.value = null;
    
    try {
      let blob: Blob;
      
      switch (tipo) {
        case 'empresas':
          blob = await adminService.generarReporteEmpresas(filtros);
          break;
        case 'estudiantes':
          blob = await adminService.generarReporteEstudiantes(filtros);
          break;
        case 'vacantes':
          blob = await adminService.generarReporteVacantes(filtros);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      // Crear enlace para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al generar reporte';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpiar store
   */
  const reset = () => {
    estadisticas.value = {
      total_empresas: 0,
      total_estudiantes: 0,
      total_vacantes_activas: 0,
      total_postulaciones: 0,
      convenios_pendientes: 0,
      documentos_pendientes: 0
    };
    usuarios.value = [];
    conveniosPendientes.value = [];
    documentosPendientes.value = [];
    alertas.value = {
      convenios_pendientes: 0,
      documentos_pendientes: 0,
      candidatos_seleccionados: 0,
      vacantes_vencidas: 0
    };
    loading.value = false;
    error.value = null;
  };

  return {
    // Estado
    estadisticas,
    usuarios,
    conveniosPendientes,
    documentosPendientes,
    alertas,
    loading,
    error,
    
    // Computed
    totalAlertas,
    tieneAlertasPendientes,
    
    // Acciones
    cargarEstadisticas,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
    cargarConveniosPendientes,
    aprobarConvenio,
    rechazarConvenio,
    cargarDocumentosPendientes,
    validarDocumento,
    cargarAlertas,
    generarReporte,
    reset
  };
});