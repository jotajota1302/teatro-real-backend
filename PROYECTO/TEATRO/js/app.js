/**
 * App.js - Controlador Principal de TEATRO REAL
 * Sistema de Gestión Integral (TEMPO + TOPS)
 */

// Estado global de la aplicación
const appState = {
  currentSection: 'dashboard',
  user: {
    name: 'María García Rodríguez',
    role: 'Coordinadora TEMPO'
  },
  sidebar: {
    isOpen: true
  },
  backendAvailable: false,
  usingDemoData: false
};

// Datos de demostración (Mock Data)
const DEMO_DATA = {
  espacios: [
    { id: '1', nombre: 'Sala Principal', capacidad: 1000, activo: true, ubicacion: 'Planta Principal' },
    { id: '2', nombre: 'Sala de Cámara', capacidad: 300, activo: true, ubicacion: 'Planta 1' },
    { id: '3', nombre: 'Estudio de Ensayo A', capacidad: 200, activo: true, ubicacion: 'Sótano' },
    { id: '4', nombre: 'Estudio de Ensayo B', capacidad: 200, activo: true, ubicacion: 'Sótano' },
    { id: '5', nombre: 'Sala de Conferencias', capacidad: 150, activo: false, ubicacion: 'Planta 2' },
    { id: '6', nombre: 'Almacén Técnico', capacidad: 500, activo: true, ubicacion: 'Sótano' }
  ],
  actividades: [
    { id: 'ACT-001', nombre: 'La Traviata', fecha: '2025-12-05', hora: '19:30', sala: 'Sala Principal', estado: 'Confirmada', responsable: 'Juan Pérez' },
    { id: 'ACT-002', nombre: 'El Quijote', fecha: '2025-12-06', hora: '20:00', sala: 'Sala de Cámara', estado: 'Confirmada', responsable: 'María López' },
    { id: 'ACT-003', nombre: 'Don Giovanni', fecha: '2025-12-07', hora: '19:00', sala: 'Sala Principal', estado: 'En preparación', responsable: 'Carlos García' },
    { id: 'ACT-004', nombre: 'Carmen', fecha: '2025-12-08', hora: '20:30', sala: 'Sala Principal', estado: 'Confirmada', responsable: 'Ana Martín' },
    { id: 'ACT-005', nombre: 'Ensayo General', fecha: '2025-12-09', hora: '18:00', sala: 'Estudio A', estado: 'Programada', responsable: 'Pedro Ruiz' }
  ]
};

/**
 * Función principal de navegación
 * @param {string} sectionId - ID de la sección a mostrar
 */
function navigate(sectionId) {
  console.log('Navegando a:', sectionId);
  
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.section-content');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Mostrar la sección solicitada
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
    appState.currentSection = sectionId;
    
    // Actualizar breadcrumb
    updateBreadcrumb(sectionId);
    
    // Actualizar navegación activa
    updateActiveNavLink(sectionId);
  } else {
    console.warn(`Sección no encontrada: ${sectionId}-section`);
  }
}

/**
 * Actualiza el breadcrumb según la sección actual
 * @param {string} sectionId - ID de la sección actual
 */
function updateBreadcrumb(sectionId) {
  const breadcrumbMap = {
    'dashboard': 'Dashboard',
    'tempo-calendar': 'Calendario de Temporada',
    'tempo-functions': 'Funciones Programadas',
    'tempo-spaces': 'Gestión de Espacios',
    'tops-operations': 'Operativa Técnica',
    'tops-incidents': 'Gestión de Incidencias',
    'tops-personnel': 'Personal Técnico',
    'admin-config': 'Configuración del Sistema'
  };

  const breadcrumbElement = document.getElementById('breadcrumb-current');
  if (breadcrumbElement) {
    breadcrumbElement.textContent = breadcrumbMap[sectionId] || 'Sección Desconocida';
  }
}

/**
 * Actualiza el link activo en la navegación
 * @param {string} sectionId - ID de la sección actual
 */
function updateActiveNavLink(sectionId) {
  // Remover clase active de todos los links
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  // Agregar clase active al link correspondiente
  const activeLink = document.querySelector(
    `.sidebar .nav-link[onclick*="${sectionId}"]`
  );
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('TEATRO REAL - Sistema de Gestión Integral iniciado');
  
  // Inicializar navegación
  setupNavigation();
  
  // Inicializar búsqueda global
  setupGlobalSearch();
  
  // Cargar datos iniciales desde el backend
  loadInitialData();
  
  // Verificar disponibilidad del backend
  checkBackendConnection();
});

/**
 * Configura los listeners para la navegación
 */
function setupNavigation() {
  // Los links ya tienen onclick handlers inline
  // Aquí podríamos agregar lógica adicional si es necesario
  console.log('Navegación configurada');
}

/**
 * Configura la búsqueda global
 */
function setupGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query.length > 0) {
          performSearch(query);
        }
      }
    });
  }
}

/**
 * Realiza una búsqueda global
 * @param {string} query - Término de búsqueda
 */
function performSearch(query) {
  console.log('Buscando:', query);
  // Implementar lógica de búsqueda cuando haya backend
  alert(`Búsqueda por: "${query}"\n\nEsta funcionalidad se conectará con el backend próximamente.`);
}

/**
 * Alterna la visibilidad del sidebar en móviles
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    appState.sidebar.isOpen = !appState.sidebar.isOpen;
    sidebar.classList.toggle('show');
  }
}

/**
 * Obtiene información del usuario autenticado
 * (Placeholder para backend)
 */
function getUserInfo() {
  return appState.user;
}

/**
 * Establece información del usuario
 * @param {object} userInfo - Datos del usuario
 */
function setUserInfo(userInfo) {
  appState.user = { ...appState.user, ...userInfo };
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
  if (confirm('¿Deseas cerrar la sesión?')) {
    console.log('Cerrando sesión...');
    // Implementar lógica de logout con backend
    alert('Funcionalidad de logout se integrará con el backend');
  }
}

/**
 * Carga datos iniciales desde el backend
 */
async function loadInitialData() {
  console.log('Cargando datos iniciales desde el backend...');
  
  try {
    // Obtener actividades (funciones)
    const actividades = await APIService.getActividades();
    console.log('Actividades cargadas:', actividades);
    
    // Obtener espacios
    const espacios = await APIService.getEspacios();
    console.log('Espacios cargados:', espacios);
    
    // Actualizar dashboard con datos reales
    updateDashboardWithData(actividades, espacios);
    
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    console.warn('Usando datos de demostración...');
    appState.usingDemoData = true;
    
    // Usar datos de demostración
    const demoActividades = DEMO_DATA.actividades;
    const demoEspacios = DEMO_DATA.espacios;
    
    console.log('✓ Datos de demostración cargados exitosamente');
    console.log('Demo Actividades:', demoActividades);
    console.log('Demo Espacios:', demoEspacios);
    
    updateDashboardWithData(demoActividades, demoEspacios);
  }
}

/**
 * Verifica la conexión con el backend
 */
async function checkBackendConnection() {
  try {
    const isAvailable = await APIService.checkBackendAvailability();
    
    if (isAvailable) {
      console.log('✓ Backend disponible y conectado');
      showBackendStatus(true);
    } else {
      console.warn('✗ Backend no disponible');
      showBackendStatus(false);
    }
  } catch (error) {
    console.error('Error al verificar backend:', error);
    showBackendStatus(false);
  }
}

/**
 * Actualiza el dashboard con datos reales del backend
 * @param {Array} actividades - Lista de actividades
 * @param {Array} espacios - Lista de espacios
 */
function updateDashboardWithData(actividades, espacios) {
  console.log('Actualizando dashboard con datos reales...');
  
  // Por ahora, solo registramos que se recibieron los datos
  // La integración visual se hará en futuras iteraciones
  
  if (actividades && actividades.length > 0) {
    console.log(`Dashboard: ${actividades.length} actividades disponibles`);
  }
  
  if (espacios && espacios.length > 0) {
    console.log(`Dashboard: ${espacios.length} espacios disponibles`);
  }
}

/**
 * Muestra el estado de la conexión con el backend
 * @param {boolean} isConnected - Estado de la conexión
 */
function showBackendStatus(isConnected) {
  const statusClass = isConnected ? 'alert-success' : 'alert-warning';
  const statusText = isConnected 
    ? '✓ Backend conectado' 
    : '⚠ Backend no disponible (usando datos locales)';
  
  // Aquí se podría mostrar un indicador visual en la UI
  console.log(`Estado del backend: ${statusText}`);
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} message - Mensaje de error
 */
function showErrorMessage(message) {
  console.error('Error UI:', message);
  // Se podría mostrar un toast o alert aquí
}

// Exportar funciones para uso en eventos inline (si es necesario)
window.navigate = navigate;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
