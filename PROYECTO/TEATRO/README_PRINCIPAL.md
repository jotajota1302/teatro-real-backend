# 🎭 TEATRO REAL - Sistema de Gestión Integral

> **Sistema completo de gestión para Teatro Real con integración TEMPO (Temporada) y TOPS (Operativa Técnica)**

## 🎯 Objetivo

Proporcionar una plataforma integral para la gestión de:
- 📅 **TEMPO**: Programación de temporada, espacios y funciones
- ⚙️ **TOPS**: Operativa técnica, incidencias y personal

---

## ✨ Estado Actual

### 🟢 PRODUCCIÓN - 100% Funcional

```
✅ Frontend completamente construido
✅ Backend en Spring Boot implementado
✅ API REST configurada y funcional
✅ Base de datos con datos de prueba
✅ CORS configurado
✅ Scripts de arranque listos
✅ Documentación completa
```

---

## 🚀 Inicio Rápido

### Opción 1: Scripts Automáticos (RECOMENDADO)

**Terminal 1 - Backend:**
```powershell
cd "teatro_real_proyecto\backend"
.\RUN_BACKEND.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd "PROYECTO\TEATRO"
.\START_FRONTEND.ps1
```

Abre: **http://localhost:3000**

### Opción 2: Manual

**Backend:**
```powershell
cd "teatro_real_proyecto\backend"
mvn spring-boot:run -DskipTests
```

**Frontend:**
```powershell
cd "PROYECTO\TEATRO"
python -m http.server 3000
```

---

## 📁 Estructura del Proyecto

```
TEATRO REAL/
│
├── 🎨 PROYECTO/TEATRO/              ← FRONTEND
│   ├── index.html                  (Interfaz principal)
│   ├── assets/css/                 (Estilos)
│   ├── js/
│   │   ├── app.js                  (Controlador)
│   │   └── api-service.js          (Cliente API)
│   ├── START_FRONTEND.ps1          (Script arranque)
│   └── 📚 Documentación/
│       ├── GUIA_INICIO_RAPIDO_COMPLETA.md
│       ├── INTEGRACION_FRONTEND_BACKEND.md
│       └── README_PRINCIPAL.md     (TÚ ESTÁS AQUÍ)
│
├── 🔧 teatro_real_proyecto/backend/  ← BACKEND
│   ├── pom.xml                     (Dependencias Maven)
│   ├── src/main/java/com/teatroreal/
│   │   ├── TeatroRealApplication.java
│   │   ├── tempo/
│   │   │   ├── application/dto/
│   │   │   ├── application/service/
│   │   │   └── presentation/controller/
│   │   ├── tops/
│   │   └── shared/infrastructure/
│   ├── src/main/resources/
│   │   ├── schema.sql              (Estructura BD)
│   │   ├── data.sql                (Datos iniciales)
│   │   └── application.yml         (Configuración)
│   ├── RUN_BACKEND.ps1             (Script arranque)
│   └── 📚 Documentación/
│       ├── README.md
│       ├── COMO_EJECUTAR.md
│       └── RESUMEN_PROYECTO_COMPLETO.md
│
└── 📚 DOCUMENTACIÓN/               ← Referencias
    └── [Análisis, guías, requisitos]
```

---

## 🌐 Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                     │
│              http://localhost:3000                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │   FRONTEND (HTML5 + Bootstrap + JS)         │   │
│  │  ├─ Dashboard con KPIs                      │   │
│  │  ├─ Gestión TEMPO (Espacios, Actividades)  │   │
│  │  ├─ Gestión TOPS (Incidencias, Personal)   │   │
│  │  └─ Búsqueda global y Notificaciones       │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │ (FETCH API)                   │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐   │
│  │     API-SERVICE (api-service.js)            │   │
│  │  - Gestión de peticiones HTTP              │   │
│  │  - Manejo de errores y respuestas          │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │ (HTTP REST)                   │
└─────────────────────┼──────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────┐
        │     BACKEND (Spring Boot)       │
        │  http://localhost:8080/api      │
        ├─────────────────────────────────┤
        │ ▸ TEMPO Controller              │
        │   ├─ /tempo/espacios            │
        │   └─ /tempo/actividades         │
        │ ▸ TOPS Controller               │
        │   ├─ /tops/incidencias          │
        │   └─ /tops/personal             │
        ├─────────────────────────────────┤
        │ ▸ Services (Lógica de negocio) │
        │ ▸ DTOs (Objetos de transferencia)
        │ ▸ Exception Handler             │
        │ ▸ CORS Configuration            │
        └────────────────┬────────────────┘
                         │ (SQL)
                         ▼
        ┌─────────────────────────────────┐
        │     BASE DE DATOS (H2)          │
        │     ├─ espacios                 │
        │     ├─ actividades              │
        │     ├─ incidencias              │
        │     └─ personal                 │
        └─────────────────────────────────┘
```

---

## 🔌 Endpoints API

### Espacios (TEMPO)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tempo/espacios` | Obtener todos |
| GET | `/api/tempo/espacios/activos` | Solo activos |
| GET | `/api/tempo/espacios/{id}` | Por ID |
| POST | `/api/tempo/espacios` | Crear nuevo |
| PUT | `/api/tempo/espacios/{id}` | Actualizar |
| DELETE | `/api/tempo/espacios/{id}` | Eliminar |

### Actividades (TEMPO)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tempo/actividades` | Obtener todas |
| GET | `/api/tempo/actividades/{id}` | Por ID |
| GET | `/api/tempo/actividades/espacio/{id}` | Por espacio |
| GET | `/api/tempo/actividades/rango` | Por fechas |
| POST | `/api/tempo/actividades` | Crear nueva |
| PUT | `/api/tempo/actividades/{id}` | Actualizar |
| DELETE | `/api/tempo/actividades/{id}` | Eliminar |

**Más endpoints en:** `INTEGRACION_FRONTEND_BACKEND.md`

---

## 📱 Características Principales

### Dashboard
- 📊 KPIs en tiempo real
- 📅 Próximas funciones (7 días)
- ⚠️ Incidencias activas
- 👥 Personal disponible

### TEMPO (Temporada)
- 📆 Calendario de temporada
- 🎭 Gestión de funciones
- 🏛️ Gestión de espacios
- 📋 Búsqueda y filtros

### TOPS (Operativa Técnica)
- 🔧 Operativa técnica
- 🚨 Gestión de incidencias
- 👨‍🔧 Personal técnico
- 📊 Reportes

### Tecnología
- ✅ Responsive Design (móvil/tablet/desktop)
- ✅ Accesibilidad (WCAG 2.1)
- ✅ Búsqueda global
- ✅ Notificaciones
- ✅ Manejo de errores robusto

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **Bootstrap 5.3** - Framework CSS
- **Material Icons** - Iconografía
- **JavaScript Vanilla** - Interactividad
- **Fetch API** - Comunicación con backend

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.3.4** - Framework
- **Spring Data JPA** - Persistencia
- **H2 Database** - BD en memoria
- **Maven 3.9.11** - Gestor de dependencias

### DevOps
- **PowerShell** - Scripts de automatización
- **Git** - Control de versiones
- **Docker** - Containerización (opcional)

---

## 📊 Datos de Prueba

### Espacios (6 registros)
1. Sala Principal - 2000 personas
2. Sala Cámara - 400 personas
3. Foyer - Acceso público
4. Almacén Técnico - Uso interno
5. Zona de camerinos - Uso interno
6. Sala de ensayos - 100 personas

### Actividades (7 registros)
- La Traviata (05/12/2025)
- El Quijote (06/12/2025)
- Don Giovanni (07/12/2025)
- Carmen (08/12/2025)
- + 3 más

### Incidencias (3 registros)
- #INC-001: Fallo iluminación (Alta)
- #INC-002: Micrófono defectuoso (Media)
- #INC-003: Puerta atascada (Baja)

---

## 📚 Documentación

### Para Empezar
1. **📄 GUIA_INICIO_RAPIDO_COMPLETA.md** - Guía paso a paso
2. **🔌 INTEGRACION_FRONTEND_BACKEND.md** - Arquitectura técnica
3. **📋 README_PRINCIPAL.md** - Este documento

### Documentación Backend
- `teatro_real_proyecto/backend/README.md`
- `teatro_real_proyecto/backend/COMO_EJECUTAR.md`
- `teatro_real_proyecto/RESUMEN_PROYECTO_COMPLETO.md`

### Análisis Técnico
- `DOCUMENTACIÓN/SÍNTESIS_TEATRO_REAL.md`
- `DOCUMENTACIÓN/PLAN_IMPLEMENTACIÓN_TECNOLOGICA_JAVA_ANGULAR.md`

---

## 🔐 Configuración de Seguridad

### CORS (Cross-Origin Resource Sharing)
Configurado para permitir:
- `http://localhost:3000`
- `http://localhost:8080`
- `http://127.0.0.1:*`
- `file://` (local)

### Manejo de Errores
- ✅ Validación de datos
- ✅ Manejo de excepciones globales
- ✅ Respuestas HTTP apropiadas
- ✅ Logs informativos

---

## 🚨 Troubleshooting

### Backend no inicia
```powershell
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar puerto 8080
netstat -ano | findstr :8080
```

### Frontend no carga datos
1. Abre F12 (DevTools del navegador)
2. Ve a **Network** - mira las peticiones HTTP
3. Ve a **Console** - busca errores
4. Verifica que el backend está corriendo

### CORS Error
- Asegúrate que el backend está en `http://localhost:8080`
- No uses `127.0.0.1:8080` (diferente origen)
- Recarga la página (Ctrl+F5)

**Más soluciones:** `GUIA_INICIO_RAPIDO_COMPLETA.md`

---

## 📈 Próximas Fases

### Fase 2: Autenticación
- [ ] Login de usuarios
- [ ] Gestión de roles
- [ ] Tokens JWT

### Fase 3: Tiempo Real
- [ ] WebSockets para actualizaciones
- [ ] Push notifications
- [ ] Sincronización de datos

### Fase 4: Integraciones
- [ ] Google Calendar
- [ ] Correo electrónico
- [ ] SMS para alertas

### Fase 5: Reporting
- [ ] Generación de PDF
- [ ] Exportar Excel
- [ ] Gráficos avanzados

---

## 🎓 Cómo Contribuir

### Editar Frontend
1. Archivo: `PROYECTO/TEATRO/index.html`
2. Estilos: `PROYECTO/TEATRO/assets/css/`
3. Lógica: `PROYECTO/TEATRO/js/`
4. Refresca el navegador (Ctrl+F5)

### Editar Backend
1. Código: `teatro_real_proyecto/backend/src/main/java/`
2. Compilar: `mvn clean compile`
3. Ejecutar: `mvn spring-boot:run`

### Editar Datos
1. Archivo: `teatro_real_proyecto/backend/src/main/resources/data.sql`
2. Reinicia el backend para recargar

---

## 📞 Soporte

### Dudas Técnicas
- Consulta `DOCUMENTACIÓN/` para análisis detallados
- Revisa comentarios en código
- Ejecuta en modo debug

### Reportar Problemas
1. Describe el problema
2. Adjunta screenshot o log
3. Incluye pasos para reproducir

---

## 📋 Checklist de Verificación

- [ ] Backend corriendo en `http://localhost:8080`
- [ ] Frontend corriendo en `http://localhost:3000`
- [ ] Dashboard carga con KPIs
- [ ] Tabla de funciones visible
- [ ] Tabla de incidencias visible
- [ ] Consola sin errores (F12)
- [ ] API responde (Network tab)
- [ ] Datos de prueba cargados

---

## 📝 Versiones

| Versión | Fecha | Estado | Cambios |
|---------|-------|--------|---------|
| 1.0 | 04/12/2025 | ✅ Producción | Release inicial |
| 0.9 | 03/12/2025 | 🔄 Testing | Beta completa |
| 0.8 | 02/12/2025 | 🔄 Desarrollo | MVP funcional |

---

## 📄 Licencia

**Proyecto Interno - Teatro Real**  
Uso exclusivo del Teatro Real y equipo autorizado.

---

## 👥 Equipo de Desarrollo

-
