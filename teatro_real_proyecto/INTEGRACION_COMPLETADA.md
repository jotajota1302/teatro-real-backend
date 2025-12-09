# 🎭 TEATRO REAL - Integración Frontend/Backend Completada

## ✅ Estado: FUNCIONAL

La integración entre el frontend (HTML/CSS/JavaScript) y el backend (Java Spring Boot) ha sido completada exitosamente.

---

## 📋 Resumen de la Integración

### Frontend
- **Ubicación:** `PROYECTO/TEATRO/index.html`
- **Tecnologías:** HTML5, CSS3, Bootstrap 5, JavaScript vanilla
- **Características:**
  - Dashboard interactivo con KPI cards
  - Navegación lateral con menú completo
  - Tablas de datos con información en tiempo real
  - Sistema de notificaciones
  - Interfaz responsive y accesible

### Backend
- **Ubicación:** `teatro_real_proyecto/backend/`
- **Tecnologías:** Java 24, Spring Boot 3.3.4, Maven, H2 Database
- **Puerto:** `8081`
- **Endpoints Implementados:**
  - `GET /api/tempo/espacios` - Obtener todos los espacios
  - `GET /api/tempo/espacios/activos` - Obtener espacios activos
  - `GET /api/tempo/espacios/{id}` - Obtener espacio por ID
  - `POST /api/tempo/espacios` - Crear nuevo espacio
  - `PUT /api/tempo/espacios/{id}` - Actualizar espacio
  - `GET /api/tempo/actividades` - Obtener todas las actividades
  - `GET /api/tempo/actividades/{id}` - Obtener actividad por ID
  - `POST /api/tempo/actividades` - Crear nueva actividad
  - `PUT /api/tempo/actividades/{id}` - Actualizar actividad

---

## 🔌 Conexión Backend-Frontend

### Configuración de la API
- **Base URL:** `http://localhost:8081/api`
- **Protocolo:** REST HTTP/JSON
- **CORS:** Habilitado
- **Content-Type:** `application/json`
- **Timeout:** 5 segundos

### Servicio de API (`api-service.js`)
El archivo `PROYECTO/TEATRO/js/api-service.js` contiene:
- Función genérica `apiRequest()` para todas las llamadas HTTP
- Métodos para CRUD de Espacios
- Métodos para CRUD de Actividades
- Validación de errores y logging
- Funciones de utilidad (verificación de disponibilidad, resúmenes)

### Iniciailización en Frontend (`app.js`)
Al cargar la página:
1. Se verifica la disponibilidad del backend
2. Se cargan todos los espacios
3. Se cargan todas las actividades
4. Se actualiza el dashboard con datos reales
5. Se establece el sistema de navegación

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar el Backend

```powershell
cd "teatro_real_proyecto\backend"
java -jar target/teatro-real-backend-1.0.0-SNAPSHOT.jar
```

**Verificar que se inicia en puerto 8081:**
```
Tomcat started on port 8081 (http) with context path '/api'
```

### 2. Abrir el Frontend

Simplemente abrir en navegador:
```
file:///C:/Users/shurtadp/OneDrive - NTT DATA EMEAL/PROYECTOS/TEATRO REAL/PROYECTO/TEATRO/index.html
```

**O** usar un servidor local:
```powershell
cd "PROYECTO\TEATRO"
python -m http.server 8000
# Luego acceder a http://localhost:8000
```

### 3. Verificar la Conexión

En la consola del navegador (F12) deberías ver:
```
✓ Backend disponible y conectado
Actividades cargadas: Array(5)
Espacios cargados: Array(6)
Dashboard: 5 actividades disponibles
Dashboard: 6 espacios disponibles
```

---

## 📊 Datos de Ejemplo

### Base de Datos
El backend viene con datos precargados:

**Espacios (6):**
- Sala Principal (1000 m²)
- Sala de Cámara (300 m²)
- Estudio de Ensayo A (200 m²)
- Estudio de Ensayo B (200 m²)
- Sala de Conferencias (150 m²)
- Almacén Técnico (500 m²)

**Actividades (5):**
- La Traviata - 05/12/2025 - Sala Principal - Confirmada
- El Quijote - 06/12/2025 - Sala de Cámara - Confirmada
- Don Giovanni - 07/12/2025 - Sala Principal - En preparación
- Carmen - 08/12/2025 - Sala Principal - Confirmada
- Ensayo General - 09/12/2025 - Estudio A - Programada

---

## 🔍 Verificación de Funcionalidad

### ✅ Tests Realizados

1. **Carga del Backend**
   - [x] Backend inicia correctamente en puerto 8081
   - [x] Swagger UI disponible en `/api/swagger-ui.html`
   - [x] Base de datos inicializada con datos

2. **Carga del Frontend**
   - [x] HTML se renderiza sin errores
   - [x] CSS carga correctamente
   - [x] JavaScript se ejecuta sin excepciones

3. **Integración Frontend-Backend**
   - [x] Se verifica disponibilidad del backend
   - [x] Se obtienen espacios desde la API
   - [x] Se obtienen actividades desde la API
   - [x] Dashboard actualiza con datos reales
   - [x] CORS funciona correctamente
   - [x] Errores se manejan sin romper la aplicación

4. **Interfaz de Usuario**
   - [x] Dashboard principal carga datos
   - [x] KPI cards muestran números actualizados
   - [x] Tablas muestran información completa
   - [x] Navegación funciona correctamente
   - [x] Responsive design se adapta a diferentes tamaños

---

## 📁 Estructura del Proyecto

```
teatro_real_proyecto/
├── backend/                          # Backend Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/teatroreal/
│   │   │   │   ├── TeatroRealApplication.java
│   │   │   │   ├── tempo/
│   │   │   │   │   ├── presentation/controller/
│   │   │   │   │   ├── application/service/
│   │   │   │   │   ├── application/dto/
│   │   │   │   │   └── domain/model/
│   │   │   │   └── shared/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application.yml
│   │   │       ├── schema.sql
│   │   │       └── data.sql
│   │   └── test/
│   ├── pom.xml
│   ├── RUN_BACKEND.ps1
│   └── README.md
│
├── GUIA_INICIO_RAPIDO.md
├── RESUMEN_PROYECTO_COMPLETO.md
└── INTEGRACION_COMPLETADA.md

PROYECTO/TEATRO/                      # Frontend
├── index.html                        # Página principal
├── package.json
├── assets/
│   └── css/
│       ├── design-system.css
│       ├── layout.css
│       ├── components.css
│       ├── responsive.css
│       └── accessibility.css
└── js/
    ├── app.js                        # Lógica principal
    └── api-service.js                # Cliente HTTP API
```

---

## 🔧 Configuración Técnica

### Backend (application.properties)
```properties
server.port=8081
spring.application.name=teatro-real-backend
logging.level.com.teatroreal=DEBUG
springdoc.swagger-ui.enabled=true
spring.jackson.time-zone=Europe/Madrid
```

### Frontend (api-service.js)
```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:8081/api',
  timeout: 5000
};
```

### CORS Configuration
```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false)
            .maxAge(3600);
  }
}
```

---

## 📝 Próximas Funcionalidades (Roadmap)

### Fase 2: Mejoras de Funcionalidad
- [ ] Autenticación y autorización de usuarios
- [ ] Formularios completos CRUD para Espacios y Actividades
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de datos a Excel/PDF
- [ ] Notificaciones en tiempo real (WebSocket)

### Fase 3: Integración con TOPS
- [ ] Módulo de gestión de incidencias
- [ ] Sistema de operativa técnica
- [ ] Gestión de personal técnico

### Fase 4: Características Avanzadas
- [ ] Sincronización con Google Calendar
- [ ] Sistema de reportes
- [ ] Dashboard de análisis
- [ ] Mobile app (React Native)

---

## 🛠️ Troubleshooting

### El backend no inicia
```powershell
# Verificar que el puerto 8081 no está en uso
Get-NetTCPConnection -LocalPort 8081

# Si está en uso, matar el proceso
Stop-Process -Name java -Force
```

### El frontend no se conecta al backend
1. Verificar que el backend está en `http://localhost:8081/api`
2. Abrir F12 en el navegador y revisar Network tab
3. Verificar CORS headers en la respuesta

### Base de datos no inicializa
1. Verificar que `schema.sql` y `data.sql` existen
2. Revisar logs en la consola del backend
3. Hacer mvn clean package nuevamente

---

## 📚 Documentación Relacionada

- `teatro_real_proyecto/backend/README.md` - Documentación del backend
- `PROYECTO/TEATRO/README.md` - Documentación del frontend
- `GUIA_INICIO_RAPIDO.md` - Guía rápida de inicio
- `RESUMEN_PROYECTO_COMPLETO.md` - Resumen general del proyecto

---

## 👤 Información del Proyecto

- **Proyecto:** TEATRO REAL - Sistema de Gestión Integral
- **Versión:** 1.0.0
- **Fecha de Completación:** 04/12/2025
- **Estado:** ✅ Funcional y listo para desarrollo posterior

---

**Última actualización:** 04/12/2025 19:12
