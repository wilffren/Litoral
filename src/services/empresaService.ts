import api from '../api/axios.config';
import type { Empresa, RegistroEmpresaDTO, Convenio } from '../models/Empresa';
import type { Vacante, CrearVacanteDTO } from '../models/Vacante';
import type { Postulacion } from '../models/Vacante';

/**
 * Servicio para gestión de empresas
 * Maneja todas las operaciones relacionadas con empresas
 */
export const empresaService = {
  /**
   * Registrar una nueva empresa
   */
  async registrar(data: RegistroEmpresaDTO): Promise<Empresa> {
    const response = await api.post('/empresas', data);
    return response.data;
  },

  /**
   * Obtener empresa por ID
   */
  async obtenerPorId(id: number): Promise<Empresa> {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  },

  /**
   * Actualizar datos de empresa
   */
  async actualizar(id: number, data: Partial<Empresa>): Promise<Empresa> {
    const response = await api.put(`/empresas/${id}`, data);
    return response.data;
  },

  /**
   * Obtener todas las empresas (solo admin)
   */
  async obtenerTodas(filtros?: {
    search?: string;
    sector?: string;
    ciudad?: string;
    estado_convenio?: string;
  }): Promise<Empresa[]> {
    const response = await api.get('/empresas', { params: filtros });
    return response.data;
  },

  /**
   * Subir documentos para convenio
   */
  async subirDocumentosConvenio(empresaId: number, documentos: FormData): Promise<any> {
    const response = await api.post(
      `/empresas/${empresaId}/convenio/documentos`,
      documentos,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  /**
   * Obtener estado del convenio
   */
  async obtenerConvenio(empresaId: number): Promise<Convenio> {
    const response = await api.get(`/empresas/${empresaId}/convenio`);
    return response.data;
  },

  /**
   * Crear nueva vacante
   */
  async crearVacante(empresaId: number, vacante: CrearVacanteDTO): Promise<Vacante> {
    const response = await api.post(`/empresas/${empresaId}/vacantes`, vacante);
    return response.data;
  },

  /**
   * Obtener vacantes de la empresa
   */
  async obtenerVacantes(empresaId: number): Promise<Vacante[]> {
    const response = await api.get(`/empresas/${empresaId}/vacantes`);
    return response.data;
  },

  /**
   * Actualizar vacante
   */
  async actualizarVacante(
    vacanteId: number,
    data: Partial<Vacante>
  ): Promise<Vacante> {
    const response = await api.put(`/vacantes/${vacanteId}`, data);
    return response.data;
  },

  /**
   * Cerrar/pausar vacante
   */
  async cambiarEstadoVacante(
    vacanteId: number,
    estado: 'activa' | 'cerrada' | 'pausada'
  ): Promise<Vacante> {
    const response = await api.patch(`/vacantes/${vacanteId}/estado`, { estado });
    return response.data;
  },

  /**
   * Obtener postulaciones de una vacante
   */
  async obtenerPostulaciones(vacanteId: number): Promise<Postulacion[]> {
    const response = await api.get(`/vacantes/${vacanteId}/postulaciones`);
    return response.data;
  },

  /**
   * Seleccionar candidato
   */
  async seleccionarCandidato(postulacionId: number): Promise<Postulacion> {
    const response = await api.post(`/postulaciones/${postulacionId}/seleccionar`);
    return response.data;
  },

  /**
   * Rechazar candidato
   */
  async rechazarCandidato(
    postulacionId: number,
    motivo?: string
  ): Promise<Postulacion> {
    const response = await api.post(`/postulaciones/${postulacionId}/rechazar`, {
      motivo
    });
    return response.data;
  },

  /**
   * Solicitar documentos al candidato seleccionado
   */
  async solicitarDocumentos(postulacionId: number): Promise<any> {
    const response = await api.post(
      `/postulaciones/${postulacionId}/solicitar-documentos`
    );
    return response.data;
  }
};