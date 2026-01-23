/**
 * Aplicación principal - Teatro Real
 * Restauración funcional: navegación, fetching y renderizado demo/dashboard
 * 2025-12-09
 */

// Estado de la aplicación
const appState = {
    currentPage: 'dashboard',
    actividades: [],
    espacios: [],
    incidencias: [],
    personal: []
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/** INICIALIZADOR principal **/
async function initializeApp() {
    await loadDashboardData();
    bindNavigation();
    navigate('dashboard');
}

// Fetch inicial con enriquecimiento de mock
async function loadDashboardData() {
    try {
        const fetchedEspacios = await apiService.getAllEspacios();
        appState.espacios = [
            ...fetchedEspacios,
            { id: '7', nombre: 'Sala Polivalente', tipo: 'Sala multiuso', ubicacion: 'Planta -1', codigoColor: '#888', activo: false, disponible: false }
        ].slice(0, 7);
    } catch (e) {
        appState.espacios = [
            { id: '1', nombre: 'Sala Principal', tipo: 'Sala de conciertos', ubicacion: 'Principal', codigoColor: '#E74C3C', activo: true, disponible: true },
            { id: '2', nombre: 'Sala Cámara', tipo: 'Sala de cámara', ubicacion: 'Planta 1', codigoColor: '#3498DB', activo: true, disponible: true },
            { id: '3', nombre: 'Estudio A', tipo: 'Estudio de ensayo', ubicacion: 'Planta 2', codigoColor: '#2ECC71', activo: true, disponible: false },
            { id: '4', nombre: 'Estudio B', tipo: 'Estudio de ensayo', ubicacion: 'Planta 2', codigoColor: '#F39C12', activo: true, disponible: true },
            { id: '5', nombre: 'Foyer', tipo: 'Sala de espera', ubicacion: 'Planta Baja', codigoColor: '#9B59B6', activo: true, disponible: true },
            { id: '6', nombre: 'Cafetería', tipo: 'Área de descanso', ubicacion: 'Planta Baja', codigoColor: '#1ABC9C', activo: true, disponible: true },
            { id: '7', nombre: 'Sala Polivalente', tipo: 'Sala multiuso', ubicacion: 'Planta -1', codigoColor: '#888', activo: false, disponible: false }
        ];
    }
    try {
        const fetchedActividades = await apiService.getAllActividades();
        const baseFunciones = [
            { nombre: 'La Traviata', fecha: '05/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { nombre: 'El Quijote', fecha: '06/12/2025', sala: 'Cámara', estado: 'Confirmada' },
            { nombre: 'Don Giovanni', fecha: '07/12/2025', sala: 'Principal', estado: 'En preparación' },
            { nombre: 'Carmen', fecha: '08/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { nombre: 'El Barbero de Sevilla', fecha: '09/12/2025', sala: 'Cámara', estado: 'Pendiente' },
            { nombre: 'La Bohème', fecha: '10/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { nombre: 'Concierto Sinfónico', fecha: '11/12/2025', sala: 'Foyer', estado: 'Pendiente' },
            { nombre: 'Ensayo Ballet', fecha: '12/12/2025', sala: 'Estudio A', estado: 'Confirmada' },
            { nombre: 'Otello', fecha: '13/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { nombre: 'Madame Butterfly', fecha: '14/12/2025', sala: 'Sala Polivalente', estado: 'En preparación' }
        ];
        appState.actividades = baseFunciones.map((f, i) => ({
            id: (i + 1).toString(),
            ...f
        }));
    } catch (e) {
        appState.actividades = [
            { id: '1', nombre: 'La Traviata', fecha: '05/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { id: '2', nombre: 'El Quijote', fecha: '06/12/2025', sala: 'Cámara', estado: 'Confirmada' },
            { id: '3', nombre: 'Don Giovanni', fecha: '07/12/2025', sala: 'Principal', estado: 'En preparación' },
            { id: '4', nombre: 'Carmen', fecha: '08/12/2025', sala: 'Principal', estado: 'Confirmada' },
            { id: '5', nombre: 'El Barbero de Sevilla', fecha: '09/12/2025', sala: 'Cámara', estado: 'Pendiente' },
            { id: '6', nombre: 'La Bohème', fecha: '10/12/2025', sala: 'Principal', estado: 'Confirmada' }
        ];
    }
    appState.personal = [
        { nombre: "Antonio López", puesto: "Regidor General" },
        { nombre: "Lucía Fernández", puesto: "Jefa de Maquinaria" },
        { nombre: "Marcos Pérez", puesto: "Iluminador" },
        { nombre: "Rosa Jiménez", puesto: "Responsable de Limpieza" },
        { nombre: "Javier Torres", puesto: "Jefe de Seguridad" },
        { nombre: "Sergio Martínez", puesto: "Técnico de Sonido" },
        { nombre: "Elena Martín", puesto: "Técnica de Vídeo" },
        { nombre: "Alicia Romero", puesto: "Técnica de Vestuario" }
    ];
    appState.incidencias = [
        { id: 101, estado: "Por resolver", descripcion: "Elevador de escenografía averiado" },
        { id: 102, estado: "Por resolver", descripcion: "Aire acondicionado no funciona en Sala Cámara" },
        { id: 103, estado: "En proceso", descripcion: "Fuga de agua en camerino 3" },
        { id: 104, estado: "Pendiente", descripcion: "Cortina principal atasca al subir" },
        { id: 105, estado: "Por revisar", descripcion: "Luces de sala parpadean" },
        { id: 106, estado: "En proceso", descripcion: "Proyector multimedia sin señal de vídeo" },
        { id: 107, estado: "Reportada", descripcion: "Filtración de agua patio de butacas" },
        { id: 108, estado: "En proceso", descripcion: "Sonido ambiente distorsionado" },
        { id: 109, estado: "En preparación", descripcion: "Checklist seguridad antiincendios" },
        { id: 110, estado: "Confirmada", descripcion: "Sustitución de telón principal" },
        { id: 111, estado: "Por resolver", descripcion: "Pantalla LED fallando" },
        { id: 112, estado: "Por revisar", descripcion: "Microfonía inestable" }
    ];
}

// NAV: manejador global para clicks del menú
function bindNavigation() {
    // Menú lateral
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', ev => {
            ev.preventDefault();
            const ruta = link.getAttribute('onclick')?.match(/navigate\(['"]([^'"]+)['"]\)/);
            if (ruta && ruta[1]) navigate(ruta[1]);
        });
    });
}

// Función global para navegación por páginas
function navigate(page) {
    appState.currentPage = page;
    // Indicar activo en el menú
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.classList.remove('active');
        if (
            link.getAttribute('onclick')?.includes(`'${page}'`) ||
            link.getAttribute('onclick')?.includes(`"${page}"`)
        ) {
            link.classList.add('active');
        }
    });
    renderPage(page);

    // Inicializa el datepicker cuando estamos en la pestaña calendario
    if (page === 'tempo-calendar') {
        setTimeout(initVanillaCalendar, 0);
    }

    // Actualizar breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = MENU_BREADCRUMB[page] || 'Dashboard';
}

// Diccionario sencillo para breadcrumb por sección/clave
const MENU_BREADCRUMB = {
    'dashboard':    'Dashboard',
    'tempo-calendar': 'Calendario',
    'tempo-functions': 'Funciones',
    'tempo-spaces':   'Espacios',
    'tops-operations': 'Operativa',
    'tops-incidents':  'Incidencias',
    'tops-personnel':  'Personal',
    'admin-config':    'Configuración'
};

// Renderizado principal de sección
function renderPage(page) {
    const container = document.getElementById('mainContent');
    if (!container) return;

    switch (page) {
        case 'dashboard':
            container.innerHTML = renderDashboard();
            break;
        case 'tempo-calendar':
            container.innerHTML = renderCalendar();
            break;
        case 'tempo-functions':
            container.innerHTML = renderFunciones();
            break;
        case 'tempo-spaces':
            container.innerHTML = renderEspacios();
            break;
        case 'tops-operations':
            container.innerHTML = renderOperativa();
            break;
        case 'tops-incidents':
            container.innerHTML = renderIncidencias();
            break;
        case 'tops-personnel':
            container.innerHTML = renderPersonal();
            break;
        case 'admin-config':
            container.innerHTML = renderConfiguracion();
            break;
        default:
            container.innerHTML = '<div class="alert alert-info">Sección en construcción.</div>';
    }
}

// Nuevo dashboard: estructura tipo tarjetas + tabla, como la imagen
function renderDashboard() {
    const funcionesTotales = appState.actividades.length;
    const funcionesConfirmadas = appState.actividades.filter(a => (a.estado || a.status) === "Confirmada").length;
    const espaciosTotales = appState.espacios.length;
    const espaciosDisponibles = appState.espacios.filter(e => e.disponible === true || e.activo === true).length;
    const personalTotal = appState.personal.length;
    const incidenciasPendientes = appState.incidencias.filter(inc => (inc.estado || "").toLowerCase().includes('por')).length;
    const funcionesProximas = appState.actividades.slice(0, 4);

    return `
        <h2 class="mb-0 fw-bold">Dashboard Principal</h2>
        <div class="mb-2 text-muted">Bienvenido al Centro de Control de Teatro Real</div>
        <div class="row g-3 my-2 flex-nowrap">
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <span class="material-icons me-2 text-success">check_circle</span>
                            <div><strong>Funciones Esta Semana</strong></div>
                        </div>
                        <div class="h3 fw-bold">${funcionesConfirmadas} de ${funcionesTotales}</div>
                        <div class="text-success small">
                            <span class="material-icons align-bottom" style="font-size: 18px;">check</span>
                            Confirmadas
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <span class="material-icons me-2 text-primary">assignment_turned_in</span>
                            <div><strong>Espacios Disponibles</strong></div>
                        </div>
                        <div class="h3 fw-bold">${espaciosDisponibles} de ${espaciosTotales}</div>
                        <div class="text-warning small">
                            <span class="material-icons align-bottom" style="font-size:18px;">warning</span>
                            Según TEMPO
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <span class="material-icons me-2 text-info">groups</span>
                            <div><strong>Personal Activo</strong></div>
                        </div>
                        <div class="h3 fw-bold">${personalTotal}</div>
                        <div class="text-primary small">
                            <a href="#" class="text-decoration-none">técnicos confirmados</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <span class="material-icons me-2 text-danger">report_problem</span>
                            <div><strong>Incidencias Pendientes</strong></div>
                        </div>
                        <div class="h3 fw-bold">${incidenciasPendientes}</div>
                        <div class="text-danger small">
                            <span class="material-icons align-bottom" style="font-size:18px;">warning</span>
                            Por resolver
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mt-4">
            <div class="card-header bg-white fw-bold">
                <span class="material-icons align-bottom text-primary me-2">event</span>
                Funciones Próximas (7 días)
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-sm mb-0">
                        <thead>
                        <tr>
                            <th>Función</th>
                            <th>Fecha</th>
                            <th>Sala</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
${funcionesProximas.map(a => `
<tr>
    <td>${a.nombre || a.titulo || '-'}</td>
    <td>${a.fecha || '-'}</td>
    <td>${a.sala || '-'}</td>
    <td>
        ${getEstadoBadge(a.estado || a.status)}
    </td>
</tr>
`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Badge visual para el estado de una función
function getEstadoBadge(estado) {
    if (!estado) return '';
    if (estado === "Confirmada") 
        return `<span class="badge bg-success bg-opacity-75 px-2 py-1">Confirmada</span>`;
    if (estado.toLowerCase().includes("prepar")) 
        return `<span class="badge bg-warning text-dark px-2 py-1">En preparación</span>`;
    if (estado.toLowerCase().includes("pend")) 
        return `<span class="badge bg-secondary bg-opacity-75 px-2 py-1">Pendiente</span>`;
    if (estado.toLowerCase().includes("resuelto")) 
        return `<span class="badge bg-info text-dark px-2 py-1">Resuelta</span>`;
    return `<span class="badge bg-secondary bg-opacity-75 px-2 py-1">${estado}</span>`;
}

// === CALENDARIO ===
function renderCalendar() {
    return `
        <style>
        /* Calendario más grande y con paleta Teatro Real */
        #calendarContainer {
            margin-top: 1rem;
        }
        #datepicker-teatroreal .datepicker {
            width: 640px;
            max-width: 100%;
            font-size: 1.12rem;
            min-height: 420px;
        }
        #datepicker-teatroreal .datepicker-inline {
            border-radius: 18px;
            background: #fff;
            border: 3px solid var(--color-primary, #D63543);
            box-shadow: 0 8px 24px rgba(31,58,69,0.07), 0 2px 4px rgba(214,53,67,0.08);
        }

        #datepicker-teatroreal .datepicker-header {
            background: var(--color-secondary, #1F3A45);
            border-bottom: 4px solid var(--color-primary, #D63543);
            color: #fff;
            border-radius: 16px 16px 0 0;
        }

        #datepicker-teatroreal .datepicker-controls .button {
            background: none;
            color: var(--color-primary, #D63543);
            transition: color 0.2s;
        }

        #datepicker-teatroreal .datepicker-controls .button:hover {
            color: var(--color-accent-gold, #D4AF37);
        }

        #datepicker-teatroreal .datepicker-title,
        #datepicker-teatroreal .datepicker-switch {
            color: #fff;
            font-weight: bold;
            font-size: 1.20rem;
        }

        #datepicker-teatroreal .datepicker-cell.selected,
        #datepicker-teatroreal .datepicker-cell.focused {
            background: var(--color-primary, #D63543);
            color: #fff !important;
            border-radius: 10px;
        }

        #datepicker-teatroreal .datepicker-cell.today {
            outline: 2px solid var(--color-primary, #D63543);
            color: var(--color-primary, #D63543);
            background: var(--color-light, #F0F0F0);
        }

        #datepicker-teatroreal .datepicker-cell {
            transition: background 0.2s;
        }

        #datepicker-teatroreal .datepicker-cell:hover:not(.selected):not(.disabled) {
            background: var(--color-accent-gold,#D4AF37);
            color: #2C2C2C;
        }
        </style>
        <h2 class="mb-3 fw-bold">Calendario</h2>
        <div id="calendarContainer" class="d-flex justify-content-center">
            <div class="card shadow-sm" style="min-width:650px;max-width:840px;">
                <div class="card-body">
                    <div id="datepicker-teatroreal"></div>
                </div>
            </div>
        </div>
    `;
}

// Inicialización de Vanilla JS Datepicker ES/Bootstrap
function initVanillaCalendar() {
    if (window.Datepicker) {
        // Cargar idioma español si está disponible
        if (window.Datepicker.locales && !window.Datepicker.locales.es) {
            Datepicker.locales.es = {
                days: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
                daysShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
                daysMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
                months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
                monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
                today: 'Hoy',
                clear: 'Limpiar',
                titleFormat: 'MM yyyy',
                format: 'dd/mm/yyyy'
            };
        }
        let el = document.getElementById('datepicker-teatroreal');
        if (el) {
            // Destroy previo si re-navegamos
            if (el.datepicker) el.datepicker.destroy();
            const dp = new Datepicker(el, {
                language: 'es',
                calendarWeeks: false,
                autohide: false,
                todayHighlight: true,
                clearBtn: false,
                format: 'dd/mm/yyyy',
                orientation: "auto",
                weekStart: 1,
            });
            // Save instance para futuras referencias si es necesario
            el.datepicker = dp;
        }
    }
}


function renderFunciones() {
    return `<h2>Funciones Programadas</h2>
    <ul>${appState.actividades.map(a=>`<li>${a.nombre||a.titulo} - ${a.fecha}</li>`).join('')}</ul>`;
}
function renderEspacios() {
    return `<h2>Espacios Disponibles</h2>
    <ul>${appState.espacios.map(e=>`<li>${e.nombre} (${e.tipo||''})</li>`).join('')}</ul>`;
}
function renderOperativa() {
    return `<h2>Operativa Técnica</h2><div class="alert alert-info">Operativas técnicas en desarrollo.</div>`;
}
function renderIncidencias() {
    return `<h2>Incidencias</h2><div class="alert alert-warning">Gestión de incidencias en desarrollo.</div>`;
}
function renderPersonal() {
    return `<h2>Personal Técnico</h2><div class="alert alert-info">Gestión de personal en desarrollo.</div>`;
}
function renderConfiguracion() {
    return `<h2>Configuración</h2><div class="alert alert-info">Parámetros del sistema en desarrollo.</div>`;
}

// Exponer funciones globales (para uso en HTML onclicks si es necesario)
window.navigate = navigate;
window.bindNavigation = bindNavigation;
