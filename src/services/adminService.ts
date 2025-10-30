import api from '../api/axios.config';
import type { Usuario } from '../models/Usuario';
import type { Empresa, Convenio } from '../models/Empresa';
import type { Estudiante } from '../models/Estudiante';
import type { Vacante, Postulacion } from '../models/Vacante';

/**
 * Servicio de administración
 * Solo accesible para usuarios con rol de administrador
 */
export const adminService = {
  // === ESTADÍSTICAS Y DASHBOARD ===

  /**
   * Obtener estadísticas generales del dashboard
   */
  async obtenerEstadisticas(): Promise<{
    total_empresas: number;
    total_estudiantes: number;
    total_vacantes_activas: number;
    total_postulaciones: number;
    convenios_pendientes: number;
    documentos_pendientes: number;
  }> {
    const response = await api.get('/admin/estadisticas');
    return response.data;
  },

  // === GESTIÓN DE USUARIOS ===

  /**
   * Obtener todos los usuarios administrativos
   */
  async obtenerUsuarios(): Promise<Usuario[]> {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  /**
   * Crear usuario administrativo
   */
  async crearUsuario(data: {
    nombre: string;
    email: string;
    password: string;
    rol: string;
    permisos?: string[];
  }): Promise<Usuario> {
    const response = await api.post('/admin/usuarios', data);
    return response.data;
  },

  /**
   * Actualizar usuario
   */
  async actualizarUsuario(
    id: number,
    data: Partial<Usuario>
  ): Promise<Usuario> {
    const response = await api.put(`/admin/usuarios/${id}`, data);
    return response.data;
  },

  /**
   * Cambiar estado del usuario
   */
  async cambiarEstadoUsuario(
    id: number,
    estado: 'activo' | 'inactivo' | 'suspendido'
  ): Promise<Usuario> {
    const response = await api.patch(`/admin/usuarios/${id}/estado`, { estado });
    return response.data;
  },

  /**
   * Eliminar usuario
   */
  async eliminarUsuario(id: number): Promise<void> {
    await api.delete(`/admin/usuarios/${id}`);
  },

  // === GESTIÓN DE CONVENIOS ===

  /**
   * Obtener convenios pendientes
   */
  async obtenerConveniosPendientes(): Promise<Convenio[]> {
    const response = await api.get('/admin/convenios/pendientes');
    return response.data;
  },

  /**
   * Aprobar convenio
   */
  async aprobarConvenio(convenioId: number): Promise<Convenio> {
    const response = await api.post(`/admin/convenios/${convenioId}/aprobar`);
    return response.data;
  },

  /**
   * Rechazar convenio
   */
  async rechazarConvenio(
    convenioId: number,
    motivo: string
  ): Promise<Convenio> {
    const response = await api.post(`/admin/convenios/${convenioId}/rechazar`, {
      motivo
    });
    return response.data;
  },

  // === VALIDACIÓN DE DOCUMENTOS ===

  /**
   * Obtener documentos pendientes de validación
   */
  async obtenerDocumentosPendientes(): Promise<any[]> {
    const response = await api.get('/admin/documentos/pendientes');
    return response.data;
  },

  /**
   * Validar documento
   */
  async validarDocumento(
    documentoId: number,
    aprobado: boolean,
    observaciones?: string
  ): Promise<any> {
    const response = await api.post(`/admin/documentos/${documentoId}/validar`, {
      aprobado,
      observaciones
    });
    return response.data;
  },

  // === REPORTES ===

  /**
   * Generar reporte de empresas
   */
  async generarReporteEmpresas(filtros?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    sector?: string;
  }): Promise<Blob> {
    const response = await api.get('/admin/reportes/empresas', {
      params: filtros,
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Generar reporte de estudiantes
   */
  async generarReporteEstudiantes(filtros?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    programa?: string;
  }): Promise<Blob> {
    const response = await api.get('/admin/reportes/estudiantes', {
      params: filtros,
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Generar reporte de vacantes y postulaciones
   */
  async generarReporteVacantes(filtros?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: string;
  }): Promise<Blob> {
    const response = await api.get('/admin/reportes/vacantes', {
      params: filtros,
      responseType: 'blob'
    });
    return response.data;
  },

  // === NOTIFICACIONES Y ALERTAS ===

  /**
   * Obtener alertas pendientes
   */
  async obtenerAlertas(): Promise<{
    convenios_pendientes: number;
    documentos_pendientes: number;
    candidatos_seleccionados: number;
    vacantes_vencidas: number;
  }> {
    const response = await api.get('/admin/alertas');
    return response.data;
  },

  /**
   * Enviar notificación masiva
   */
  async enviarNotificacionMasiva(data: {
    destinatarios: 'empresas' | 'estudiantes' | 'todos';
    asunto: string;
    mensaje: string;
  }): Promise<{ enviadas: number }> {
    const response = await api.post('/admin/notificaciones/masiva', data);
    return response.data;
  }
};