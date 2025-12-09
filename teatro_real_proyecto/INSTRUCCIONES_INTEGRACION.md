# 🎭 TEATRO REAL - Guía de Integración Frontend-Backend

## 📋 Descripción General

Este proyecto integra un **Frontend HTML/CSS/JavaScript** con un **Backend Java Spring Boot** para el Sistema de Gestión Integral del Teatro Real (TEMPO + TOPS).

**Estructura del Proyecto:**
```
teatro_real_proyecto/
├── frontend/
│   ├── index.html              # Página principal
│   ├── js/
│   │   ├── api-service.js      # Servicio de conexión con API
│   │   └── app.js              # Lógica principal de la app
│   └── assets/css/             # Estilos del sistema
└── backend/
    ├── src/main/java/          # Código Java
    ├── pom.xml                 # Configuración Maven
    └── RUN_BACKEND.ps1         # Script para ejecutar backend
```

---

## 🚀 Pasos para Ejecutar el Proyecto

### 1️⃣ Iniciar el Backend (Java Spring Boot)

**Opción A: Usando PowerShell Script**
```powershell
cd teatro_real_proyecto\backend
.\RUN_BACKEND.ps1
```

**Opción B: Manualmente con Maven**
```powershell
cd teatro_real_proyecto\backend
mvn clean package
mvn spring-boot:run
```

**Opción C: Ejecutar el JAR compilado**
```powershell
cd teatro_real_proyecto\backend\target
java -jar teatro-real-backend-1.0.0-SNAPSHOT.jar
```

✅ **El backend debe estar corriendo en:** `http://localhost:8080`

---

### 2️⃣ Abrir el Frontend

**Opción A: Abrir HTML directamente**
```powershell
start "teatro_real_proyecto\frontend\index.html"
```

**Opción B: Usar un servidor local (recomendado)**

Si tienes Python instalado:
```powershell
cd teatro_real_proyecto\frontend
python -m http.server 8000
```
Luego accede a: `http://localhost:8000`

Si tienes Node.js:
```powershell
npm install -g http-server
http-server teatro_real_proyecto/frontend
```

---

## 📡 Integración Frontend-Backend

### Archivo: `api-service.js`

Este archivo contiene la clase `ApiService` que gestiona todas las llamadas HTTP al backend.

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// Ejemplo de uso:
const actividades = await apiService.getAllActividades();
const espacios = await apiService.getAllEspacios();
```

### Endpoints Disponibles

#### **TEMPO - Actividades (Funciones)**
- `GET /api/tempo/actividades` - Obtener todas las actividades
- `POST /api/tempo/actividades` - Crear nueva actividad

#### **TEMPO - Espacios**
- `GET /api/tempo/espacios` - Obtener todos los espacios
- `POST /api/tempo/espacios` - Crear nuevo espacio

---

## 🔧 Configuración de CORS

El backend está configurado para aceptar requests desde el frontend. La configuración se encuentra en:

```
backend/src/main/java/com/teatroreal/shared/infrastructure/config/CorsConfig.java
```

Si necesitas cambiar la URL del frontend, edita la variable en `api-service.js`:

```javascript
const API_BASE_URL = 'http://tu-url:puerto/api';
```

---

## 📊 Flujo de Datos

```
Frontend (HTML/JS)
    ↓ (fetch/AJAX)
API Service (api-service.js)
    ↓ (HTTP Request)
Backend Spring Boot (port 8080)
    ↓ (Procesamiento)
Base de Datos (Datos Mock)
    ↓ (HTTP Response)
API Service (api-service.js)
    ↓ (Renderizado)
Frontend (UI actualizada)
```

---

## 🎨 Estructura de Componentes Frontend

### `index.html`
- Estructura HTML principal
- Navbar con logo y búsqueda
- Sidebar de navegación
- Main content area dinámico

### `app.js`
- Gestión del estado de la aplicación
- Funciones de navegación
- Renderizado de páginas
- Carga de datos del backend

### `api-service.js`
- Clase ApiService con métodos HTTP
- Manejo de errores
- Headers y configuración de fetch

---

## 🔍 Solución de Problemas

### Error: "No se puede conectar con el backend"
✅ Verifica que el backend esté corriendo en `http://localhost:8080`
✅ Abre la consola del navegador (F12) para ver los errores

### Error: CORS 
✅ Asegúrate que el backend tiene CORS habilitado
✅ Verifica que la URL en `API_BASE_URL` es correcta

### El frontend carga datos de demostración
✅ Esto es normal - el app carga datos demo si el backend no responde
✅ Es útil para testing del frontend sin backend

---

## 📱 Secciones del Sistema

### Dashboard
KPIs en tiempo real:
- Funciones esta semana
- Espacios disponibles
- Personal activo
- Incidencias pendientes

### TEMPO (Gestión de Temporada)
- **Calendario**: Programación anual
- **Funciones**: Gestión de funciones
- **Espacios**: Administración de salas

### TOPS (Gestión Técnica)
- **Operativa**: Control técnico
- **Incidencias**: Reportes de problemas
- **Personal**: Gestión de técnicos

### Admin
- Configuración del sistema

---

## 🔐 Autenticación

Actualmente, el sistema usa datos demo. Para añadir autenticación:

1. Añade un endpoint `/api/auth/login` en el backend
2. Modifica `api-service.js` para incluir métodos de login
3. Guarda el token en localStorage
4. Añade el token a todas las requests

---

## 📚 Recursos

- **Bootstrap 5**: https://getbootstrap.com/
- **Material Icons**: https://fonts.google.com/icons
- **Spring Boot**: https://spring.io/projects/spring-boot
- **MDN Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## ✅ Checklist de Implementación

- [ ] Backend compilado y corriendo
- [ ] Frontend abierto en navegador
- [ ] Dashboard cargando datos
- [ ] Navegación funcionando
- [ ] Llamadas API conectadas
- [ ] Estilos CSS aplicados correctamente

---

## 🎯 Próximos Pasos

1. Implementar formularios CRUD completos
2. Añadir persistencia de base de datos real
3. Implementar autenticación JWT
4. Crear tests unitarios
5. Desplegar en producción

---

**Última actualización:** 04/12/2025
**Estado:** ✅ Integración Completa
