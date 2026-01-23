# TEATRO REAL - Sistema de Gestión Integral

Sistema de gestión integral para Teatro Real que combina **TEMPO** (Gestión de Temporada y Booking) y **TOPS** (Operativa Técnica y Personal).

## 📋 Descripción

TEATRO REAL es una aplicación web moderna diseñada para centralizar la gestión de:

- **TEMPO**: Programación de funciones, calendario de temporada y gestión de espacios
- **TOPS**: Operativa técnica, gestión de incidencias y personal técnico
- **Admin**: Configuración y parámetros del sistema

## 🚀 Características Principales

- ✅ Dashboard con KPIs en tiempo real
- ✅ Navegación intuitiva por módulos (TEMPO, TOPS, Admin)
- ✅ Interfaz responsiva (desktop, tablet, móvil)
- ✅ Diseño accesible (WCAG 2.1 AA)
- ✅ Búsqueda global de funciones, espacios y personal
- ✅ Sistema de notificaciones
- ✅ Gestión de usuarios y roles

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo (Flexbox, Grid)
- **JavaScript (Vanilla)**: Interactividad sin dependencias
- **Bootstrap 5.3**: Framework CSS
- **Material Icons**: Iconografía

### Herramientas
- Node.js (para desarrollo local)
- http-server (servidor de desarrollo)

## 📁 Estructura del Proyecto

```
PROYECTO/TEATRO/
├── index.html                 # Página principal
├── package.json              # Configuración del proyecto
├── README.md                 # Este archivo
│
├── js/
│   └── app.js               # Lógica principal de la aplicación
│
└── assets/
    └── css/
        ├── design-system.css    # Variables de diseño y temas
        ├── layout.css           # Estructura y layout
        ├── components.css       # Componentes reutilizables
        ├── responsive.css       # Media queries y responsividad
        └── accessibility.css    # Reglas de accesibilidad
```

## 🎯 Secciones de la Aplicación

### Dashboard
Panel principal con KPIs en tiempo real:
- Funciones programadas esta semana
- Espacios disponibles
- Personal activo
- Incidencias pendientes
- Tablas de funciones próximas e incidencias activas

### TEMPO (Temporada)
- **Calendario**: Gestión de programación anual
- **Funciones**: Administración de funciones y eventos
- **Espacios**: Gestión de salas y espacios disponibles

### TOPS (Operativa)
- **Operativa**: Control de operaciones técnicas
- **Incidencias**: Seguimiento y resolución de problemas
- **Personal**: Gestión de recursos humanos técnicos

### Admin
- **Configuración**: Parámetros y ajustes del sistema

## 🚀 Inicio Rápido

### Opción 1: Abrir directamente en el navegador
Simplemente abre `index.html` en tu navegador web favorito:
```bash
# En Windows (PowerShell)
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

### Opción 2: Usando un servidor local

#### Con Node.js (recomendado)
```bash
# Instalar dependencias (opcional)
npm install

# Iniciar servidor de desarrollo en puerto 8080
npm run dev

# O iniciar en puerto 3000
npm run serve
```

Luego abre tu navegador en `http://localhost:8080`

#### Con Python 3
```bash
# Iniciar servidor en puerto 8000
python -m http.server 8000
```

Luego abre tu navegador en `http://localhost:8000`

#### Con Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 💡 Uso

### Navegación Principal
1. **Barra Superior**: 
   - Logo de Teatro Real
   - Búsqueda global
   - Notificaciones
   - Perfil de usuario

2. **Sidebar Izquierdo**:
   - Acceso rápido a todas las secciones
   - Botones con iconos para vista móvil
   - Agrupación por módulos (TEMPO, TOPS, Admin)

3. **Breadcrumb**:
   - Muestra la ruta de navegación actual
   - Permite volver al Dashboard

### Búsqueda Global
Escribe en el campo de búsqueda para buscar:
- Funciones por nombre o fecha
- Espacios por ubicación
- Personal por nombre o rol

### Notificaciones
Haz clic en el icono de campana para ver:
- Alertas del sistema
- Cambios importantes
- Próximos eventos

## 🔐 Seguridad

- Campos sensibles están protegidos
- Validación de entrada en cliente (a conectar con backend)
- Sistema de sesiones de usuario
- Logout disponible en menú de perfil

## 🎨 Diseño

### Paleta de Colores
- **Primario**: #0066CC (Azul)
- **Éxito**: #28A745 (Verde)
- **Advertencia**: #FFC107 (Ámbar)
- **Peligro**: #DC3545 (Rojo)
- **Info**: #17A2B8 (Cian)

### Tipografía
- **Font**: Roboto (Google Fonts)
- **Iconos**: Material Icons

### Responsividad
- Mobile: < 576px
- Tablet: 576px - 991px
- Desktop: > 992px

## ♿ Accesibilidad

La aplicación cumple con:
- WCAG 2.1 Nivel AA
- Contraste mínimo de 4.5:1 en textos
- Navegación por teclado
- Labels semánticas en formularios
- Aria labels y roles apropiados
- Soporte para lectores de pantalla

## 🔄 Próximas Integraciones

- [ ] Integración con backend de APIs REST
- [ ] Autenticación OAuth 2.0
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Base de datos con histórico de incidencias
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Sincronización de calendario externo
- [ ] Notificaciones por email/SMS
- [ ] Aplicación móvil nativa

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Iniciar servidor de desarrollo (puerto 8080)
npm run dev

# Iniciar servidor en puerto 3000
npm run serve

# Iniciar servidor básico (sin abrir navegador)
npm start
```

### Estructura de Código

#### app.js
Contiene la lógica principal:
- `navigate(sectionId)`: Cambiar entre secciones
- `updateBreadcrumb()`: Actualizar migas de pan
- `updateActiveNavLink()`: Marcar nav activo
- `performSearch()`: Buscar contenido
- `logout()`: Cerrar sesión

#### CSS Modular
- `design-system.css`: Variables CSS y temas
- `layout.css`: Grid y flexbox
- `components.css`: Componentes reutilizables
- `responsive.css`: Media queries
- `accessibility.css`: Reglas de a11y

## 📊 Estructura de Datos (Futuro Backend)

### Endpoints principales
```
GET  /api/functions       - Listar funciones
POST /api/functions       - Crear función
GET  /api/functions/:id   - Detalle de función

GET  /api/spaces          - Listar espacios
GET  /api/personnel       - Listar personal
GET  /api/incidents       - Listar incidencias
```

## 🐛 Troubleshooting

### No carga el CSS
- Verifica que el archivo `index.html` esté en la carpeta raíz
- La carpeta `assets/css/` debe estar al mismo nivel que `index.html`

### La navegación no funciona
- Abre la consola (F12) para ver errores
- Verifica que `js/app.js` esté cargado
- Revisa que los IDs de las secciones coincidan

### Servidor local no arranca
```bash
# Intenta con puerto diferente
npx http-server . -p 9000
```

## 📝 Notas Importantes

- Este es un **frontend standalone** en HTML/CSS/JS puro
- No requiere build process ni compilación
- Compatible con cualquier backend REST
- La navegación es clientside (sin recargar página)
- Los datos están hardcodeados (se reemplazan con API)

## 🤝 Contribución

Para contribuir al proyecto:
1. Crea una rama desde `develop`
2. Realiza tus cambios
3. Sigue las convenciones de código
4. Envía un Pull Request

## 📞 Soporte

Para reportar problemas o sugerencias:
- Email: soporte@teatroreal.es
- Issues: [GitHub Issues](https://github.com/your-org/teatro-real)

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Frontend**: Equipo de Desarrollo Frontend - NTT DATA EMEAL
- **Backend**: Equipo de Backend (próximamente)
- **PM**: Gestión del Proyecto

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
**Estado**: 🟢 Funcional - Listo para integración con backend
