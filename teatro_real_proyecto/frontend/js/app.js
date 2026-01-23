/**
 * Aplicación principal - Teatro Real
 * Renderizado dinámico y demo completa
 */

const appState = {
    currentPage: 'dashboard',
    actividades: [],
    espacios: [],
    incidencias: [],
    personal: []
};

const demoOperativas = [
    { tarea: 'Revisión de maquinaria escénica', responsable: 'Lucía Fernández', estado: 'Realizada', fecha: '01/12/2025' },
    { tarea: 'Ensayo pre-general ópera Carmen', responsable: 'Antonio López', estado: 'Pendiente', fecha: '06/12/2025' },
    { tarea: 'Protocolo antiincendios', responsable: 'Borja Ruiz', estado: 'Requiere validación', fecha: '05/12/2025' },
    { tarea: 'Control de acceso a patio de butacas', responsable: 'Elena García', estado: 'En curso', fecha: '05/12/2025' },
    { tarea: 'Checklist de limpieza escenario', responsable: 'Rosa Jiménez', estado: 'Completada', fecha: '04/12/2025' },
    { tarea: 'Verificación emergencia eléctrica', responsable: 'Javier Torres', estado: 'Incidencia detectada', fecha: '05/12/2025' },
    { tarea: 'Chequeo cableado producción', responsable: 'Clara Medina', estado: 'Realizada', fecha: '03/12/2025' },
    { tarea: 'Montaje escenografía ballet', responsable: 'Marcos Pérez', estado: 'Pendiente', fecha: '07/12/2025' }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    await loadDashboardData();
    bindNavigation();
    navigate('dashboard');
}

async function loadDashboardData() {
    try {
        appState.espacios = await apiService.getAllEspacios();
    } catch (e) {
        appState.espacios = [];
        console.error("Error cargando espacios desde backend:", e);
    }
    try {
        appState.actividades = await apiService.getAllActividades();
    } catch (e) {
        appState.actividades = [];
        console.error("Error cargando actividades desde backend:", e);
    }
    // Incidencias y personal permanecen estáticos por ahora (puedes añadir endpoints para ellos si lo deseas)
}

// --- resto del archivo intacto ---
function loadDemoData() {
    appState.actividades = [
        { id: '1', nombre: 'La Traviata', fecha: '05/12/2025', hora: '19:00', sala: 'Principal', estado: 'Confirmada' },
        { id: '2', nombre: 'El Quijote', fecha: '06/12/2025', hora: '18:00', sala: 'Cámara', estado: 'Confirmada' },
        { id: '3', nombre: 'Don Giovanni', fecha: '07/12/2025', hora: '20:00', sala: 'Principal', estado: 'En preparación' },
        { id: '4', nombre: 'Carmen', fecha: '08/12/2025', hora: '19:30', sala: 'Principal', estado: 'Confirmada' }
    ];
    appState.espacios = [
        { id: '1', nombre: 'Sala Principal', capacidad: 2000, disponible: true },
        { id: '2', nombre: 'Sala Cámara', capacidad: 500, disponible: true },
        { id: '3', nombre: 'Estudio 1', capacidad: 100, disponible: false },
        { id: '4', nombre: 'Estudio 2', capacidad: 100, disponible: true }
    ];
    appState.incidencias = [
        { id: '#INC-101', descripcion: 'Elevador de escenografía averiado', prioridad: 'Alta', estado: 'En proceso' },
        { id: '#INC-205', descripcion: 'Aire acondicionado no funciona en Sala Cámara', prioridad: 'Media', estado: 'Reportada' },
        { id: '#INC-066', descripcion: 'Fuga de agua en camerino 3', prioridad: 'Alta', estado: 'En proceso' },
        { id: '#INC-077', descripcion: 'Proyector multimedia sin señal de vídeo', prioridad: 'Baja', estado: 'Por revisar' },
        { id: '#INC-122', descripcion: 'Cortina principal atasca al subir', prioridad: 'Media', estado: 'Pendiente' },
        { id: '#INC-132', descripcion: 'Luces de sala parpadean', prioridad: 'Alta', estado: 'En proceso' },
        { id: '#INC-145', descripcion: 'Filtración de agua patio de butacas', prioridad: 'Alta', estado: 'Reportada' },
        { id: '#INC-158', descripcion: 'Sonido ambiente distorsionado', prioridad: 'Media', estado: 'Por revisar' }
    ];
    appState.personal = [
        { id: 'P01', nombre: 'Antonio López', puesto: 'Regidor General', turno: 'Mañana', disponible: true },
        { id: 'P02', nombre: 'Lucía Fernández', puesto: 'Jefa de Maquinaria', turno: 'Mañana', disponible: true },
        { id: 'P03', nombre: 'Sergio Martínez', puesto: 'Técnico de Sonido', turno: 'Tarde', disponible: false },
        { id: 'P04', nombre: 'Marcos Pérez', puesto: 'Iluminador', turno: 'Tarde', disponible: true },
        { id: 'P05', nombre: 'Marta García', puesto: 'Responsable de Utillería', turno: 'Tarde', disponible: true },
        { id: 'P06', nombre: 'Luis Torres', puesto: 'Jefe de Escenografía', turno: 'Mañana', disponible: false },
        { id: 'P07', nombre: 'Elena Martín', puesto: 'Técnica de Vídeo', turno: 'Tarde', disponible: true },
        { id: 'P08', nombre: 'Alicia Romero', puesto: 'Técnica de Vestuario', turno: 'Mañana', disponible: true },
        { id: 'P09', nombre: 'Rosa Jiménez', puesto: 'Responsable de Limpieza', turno: 'Noche', disponible: true },
        { id: 'P10', nombre: 'Javier Torres', puesto: 'Jefe de Seguridad', turno: 'Noche', disponible: false },
        { id: 'P11', nombre: 'Borja Ruiz', puesto: 'Tramoyista', turno: 'Mañana', disponible: true },
        { id: 'P12', nombre: 'Clara Medina', puesto: 'Ayudante de Producción', turno: 'Tarde', disponible: true },
        { id: 'P13', nombre: 'Isabel Suárez', puesto: 'Maquinista', turno: 'Mañana', disponible: false },
        { id: 'P14', nombre: 'Carlos Peña', puesto: 'Técnico de Montaje', turno: 'Tarde', disponible: true },
        { id: 'P15', nombre: 'Andrés Díaz', puesto: 'Tramoyista', turno: 'Noche', disponible: false }
    ];
}

// Resto del archivo igual que antes (sin cambios)...
// Todas las funciones de render, helpers, y otros módulos permanecen igual.
