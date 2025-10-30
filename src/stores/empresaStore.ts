import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Empresa, RegistroEmpresaDTO, Convenio } from '../models/Empresa';
import type { Vacante, CrearVacanteDTO, Postulacion } from '../models/Vacante';
import { empresaService } from '../services/empresaService';

/**
 * Store de empresas
 * Maneja el estado y operaciones relacionadas con empresas
 */
export const useEmpresaStore = defineStore('empresa', () => {
  // Estado
  const empresa = ref<Empresa | null>(null);
  const vacantes = ref<Vacante[]>([]);
  const convenio = ref<Convenio | null>(null);
  const postulaciones = ref<Postulacion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const tieneConvenioAprobado = computed(() => {
    return convenio.value?.estado === 'aprobado';
  });

  const vacantesActivas = computed(() => {
    return vacantes.value.filter(v => v.estado === 'activa');
  });

  const totalPostulaciones = computed(() => {
    return vacantes.value.reduce((total, v) => total + (v.postulaciones_count || 0), 0);
  });

  /**
   * Registrar nueva empresa
   */
  const registrarEmpresa = async (data: RegistroEmpresaDTO) => {
    loading.value = true;
    error.value = null;
    
    try {
      empresa.value = await empresaService.registrar(data);
      return empresa.value;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar empresa';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar datos de la empresa
   */
  const cargarEmpresa = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      empresa.value = await empresaService.obtenerPorId(id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar empresa';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar empresa
   */
  const actualizarEmpresa = async (id: number, data: Partial<Empresa>) => {
    loading.value = true;
    error.value = null;
    
    try {
      empresa.value = await empresaService.actualizar(id, data);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar empresa';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Subir documentos del convenio
   */
  const subirDocumentosConvenio = async (empresaId: number, documentos: FormData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await empresaService.subirDocumentosConvenio(empresaId, documentos);
      await cargarConvenio(empresaId);
      return response;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al subir documentos';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar estado del convenio
   */
  const cargarConvenio = async (empresaId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      convenio.value = await empresaService.obtenerConvenio(empresaId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar convenio';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear nueva vacante
   */
  const crearVacante = async (empresaId: number, vacante: CrearVacanteDTO) => {
    loading.value = true;
    error.value = null;
    
    try {
      const nuevaVacante = await empresaService.crearVacante(empresaId, vacante);
      vacantes.value.unshift(nuevaVacante);
      return nuevaVacante;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al crear vacante';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar vacantes de la empresa
   */
  const cargarVacantes = async (empresaId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      vacantes.value = await empresaService.obtenerVacantes(empresaId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar vacantes';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cambiar estado de vacante
   */
  const cambiarEstadoVacante = async (
    vacanteId: number,
    estado: 'activa' | 'cerrada' | 'pausada'
  ) => {
    loading.value = true;
    error.value = null;
    
    try {
      const vacanteActualizada = await empresaService.cambiarEstadoVacante(vacanteId, estado);
      const index = vacantes.value.findIndex(v => v.id === vacanteId);
      if (index !== -1) {
        vacantes.value[index] = vacanteActualizada;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cambiar estado';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar postulaciones de una vacante
   */
  const cargarPostulaciones = async (vacanteId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      postulaciones.value = await empresaService.obtenerPostulaciones(vacanteId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar postulaciones';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Seleccionar candidato
   */
  const seleccionarCandidato = async (postulacionId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const postulacionActualizada = await empresaService.seleccionarCandidato(postulacionId);
      const index = postulaciones.value.findIndex(p => p.id === postulacionId);
      if (index !== -1) {
        postulaciones.value[index] = postulacionActualizada;
      }
      return postulacionActualizada;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al seleccionar candidato';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpiar store
   */
  const reset = () => {
    empresa.value = null;
    vacantes.value = [];
    convenio.value = null;
    postulaciones.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // Estado
    empresa,
    vacantes,
    convenio,
    postulaciones,
    loading,
    error,
    
    // Computed
    tieneConvenioAprobado,
    vacantesActivas,
    totalPostulaciones,
    
    // Acciones
    registrarEmpresa,
    cargarEmpresa,
    actualizarEmpresa,
    subirDocumentosConvenio,
    cargarConvenio,
    crearVacante,
    cargarVacantes,
    cambiarEstadoVacante,
    cargarPostulaciones,
    seleccionarCandidato,
    reset
  };
});