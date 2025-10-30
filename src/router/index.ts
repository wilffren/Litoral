import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

/**
 * Definición de rutas de la aplicación
 */
const routes: RouteRecordRaw[] = [
  // === RUTAS PÚBLICAS ===
  {
    path: '/',
    name: 'home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/recuperar-password',
    name: 'recuperar-password',
    component: () => import('../views/auth/RecuperarPasswordView.vue'),
    meta: { requiresAuth: false }
  },

  // === RUTAS DE EMPRESA ===
  {
    path: '/empresa',
    component: () => import('../layouts/EmpresaLayout.vue'), // 👈 NUEVO
    meta: { requiresAuth: true, roles: ['empresa'] },
    children: [
      {
        path: 'dashboard',
        name: 'empresa-dashboard',
        component: () => import('../views/empresa/DashboardEmpresa.vue')
      
      },
      {
        path: 'registro',
        name: 'empresa-registro',
        component: () => import('../views/empresa/RegistroEmpresaView.vue')
      },
      {
        path: 'perfil',
        name: 'empresa-perfil',
        component: () => import('../views/empresa/PerfilEmpresaView.vue')
      },
      {
        path: 'vacantes',
        name: 'empresa-vacantes',
        component: () => import('../views/empresa/VacantesView.vue')
      },
      {
        path: 'vacantes/crear',
        name: 'empresa-crear-vacante',
        component: () => import('../views/empresa/CrearVacanteView.vue')
      }
    ]
  },

  // === RUTAS DE ESTUDIANTE ===
  {
    path: '/estudiante',
    component: () => import('../layouts/EstudianteLayout.vue'), // 👈 NUEVO
    meta: { requiresAuth: true, roles: ['estudiante'] },
    children: [
      {
        path: 'dashboard',
        name: 'estudiante-dashboard',
        component: () => import('../views/estudiante/DashboardEstudiante.vue')
      },
      {
        path: 'registro',
        name: 'estudiante-registro',
        component: () => import('../views/estudiante/RegistroEstudianteView.vue')
      },
      {
        path: 'perfil',
        name: 'estudiante-perfil',
        component: () => import('../views/estudiante/PerfilEstudianteView.vue')
      },
      {
        path: 'vacantes',
        name: 'estudiante-vacantes',
        component: () => import('../views/estudiante/BuscarVacantesView.vue')
      },
      {
        path: 'vacantes/:id',
        name: 'estudiante-vacante-detalle',
        component: () => import('../views/estudiante/VacanteDetalleView.vue')
      }
    ]
  },

  // === RUTAS DE ADMINISTRADOR ===
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'), // 👈 NUEVO
    meta: { 
      requiresAuth: true, 
      roles: ['admin', 'coordinador_extension', 'juridica', 'academico'] 
    },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/DashboardAdmin.vue')
      },
      {
        path: 'usuarios',
        name: 'admin-usuarios',
        component: () => import('../views/admin/GestionUsuariosView.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'empresas',
        name: 'admin-empresas',
        component: () => import('../views/admin/GestionEmpresasView.vue')
      },
      {
        path: 'estudiantes',
        name: 'admin-estudiantes',
        component: () => import('../views/admin/GestionEstudiantesView.vue')
      },
      {
        path: 'vacantes',
        name: 'admin-vacantes',
        component: () => import('../views/admin/GestionVacantesView.vue')
      },
      {
        path: 'convenios',
        name: 'admin-convenios',
        component: () => import('../views/admin/ConveniosView.vue'),
        meta: { roles: ['admin', 'coordinador_extension', 'juridica'] }
      },
      {
        path: 'documentos',
        name: 'admin-documentos',
        component: () => import('../views/admin/ValidacionDocumentosView.vue'),
        meta: { roles: ['admin', 'juridica'] }
      },
      {
        path: 'reportes',
        name: 'admin-reportes',
        component: () => import('../views/admin/ReportesView.vue')
      }
    ]
  },

 
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

/**
 * Guard de navegación global
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const hideForAuth = to.matched.some(record => record.meta.hideForAuth);
  const requiredRoles = to.meta.roles as string[] | undefined;

  // Si la ruta requiere autenticación
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  // Si está autenticado y trata de acceder a login/registro
  if (hideForAuth && authStore.isAuthenticated) {
    const userRole = authStore.userRole;
    if (userRole === 'empresa') next({ name: 'empresa-dashboard' });
    else if (userRole === 'estudiante') next({ name: 'estudiante-dashboard' });
    else if (['admin', 'coordinador_extension', 'juridica', 'academico'].includes(userRole || ''))
      next({ name: 'admin-dashboard' });
    else next();
    return;
  }

  // Verificar roles requeridos
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authStore.userRole;
    if (!userRole || !requiredRoles.includes(userRole)) {
      next({ name: 'not-found' });
      return;
    }
  }

  next();
});

export default router;
