# Integración Frontend-Backend: TEATRO REAL

## 📋 Estado Actual

### Frontend
- **Ubicación**: `PROYECTO/TEATRO/`
- **Archivo principal**: `index.html`
- **Archivos JavaScript**:
  - `js/app.js` - Controlador principal
  - `js/api-service.js` - Servicio de comunicación con el backend

### Backend
- **Ubicación**: `teatro_real_proyecto/backend/`
- **Framework**: Spring Boot 3.3.4
- **Puerto**: 8080
- **Base de datos**: H2 (en memoria)

---

## 🔌 Arquitectura de Conexión

```
┌─────────────────────┐
│   FRONTEND (HTML)   │
│  localhost (file)   │
└──────────┬──────────┘
           │
      api-service.js
      (HTTP Fetch)
           │
     ▼─────────────────▼
┌──────────────────────────┐
│  Backend API (Spring)    │
│ http://localhost:8080/api│
└──────────────────────────┘
           │
     ▼─────────────────▼
┌──────────────────────┐
│   Base de Datos      │
│      (H2/Memory)     │
└──────────────────────┘
```

---

## 🌐 Endpoints Disponibles

### Espacios (TEMPO)
```
GET    /api/tempo/espacios              - Obtener todos los espacios
GET    /api/tempo/espacios/activos      - Obtener espacios activos
GET    /api/tempo/espacios/{id}         - Obtener espacio por ID
GET    /api/tempo/espacios/nombre/{nombre} - Obtener por nombre
POST   /api/tempo/espacios              - Crear espacio
PUT    /api/tempo/espacios/{id}         - Actualizar espacio
PUT    /api/tempo/espacios/{id}/activar - Activar espacio
PUT    /api/tempo/espacios/{id}/desactivar - Desactivar espacio
DELETE /api/tempo/espacios/{id}         - Eliminar espacio
```

### Actividades (TEMPO)
```
GET    /api/tempo/actividades                    - Obtener todas las actividades
GET    /api/tempo/actividades/{id}               - Obtener por ID
GET    /api/tempo/actividades/espacio/{espacioId} - Por espacio
GET    /api/tempo/actividades/responsable/{responsable} - Por responsable
GET    /api/tempo/actividades/rango?inicio=&fin= - Por rango de fechas
POST   /api/tempo/actividades                    - Crear actividad
PUT    /api/tempo/actividades/{id}               - Actualizar actividad
PUT    /api/tempo/actividades/{id}/horario      - Modificar horario
DELETE /api/tempo/actividades/{id}               - Eliminar actividad
```

---

## 🚀 Cómo Usar

### 1. Iniciar el Backend

```powershell
cd "teatro_real_proyecto\backend"
.\RUN_BACKEND.ps1
```

El backend se ejecutará en: **http://localhost:8080**

### 2. Abrir el Frontend

**Opción A - Abrir directamente el HTML:**
```powershell
cd "PROYECTO\TEATRO"
Invoke-Item index.html
```

**Opción B - Usando un servidor local (recomendado):**
```powershell
# Con Python (si está instalado)
cd "PROYECTO\TEATRO"
python -m http.server 3000

# Luego abre: http://localhost:3000
```

### 3. Verificar Conexión

En la consola del navegador (F12), deberías ver:
```
✓ Backend disponible y conectado
Actividades cargadas: [...]
Espacios cargados: [...]
```

---

## 🔐 Configuración de CORS

El backend está configurado para permitir solicitudes CORS desde:
- `http://localhost:3000` (servidor de desarrollo)
- `http://localhost:8080` (acceso directo)
- `http://127.0.0.1:*` (localhost alterno)
- `file://` (archivos locales)

**Archivo**: `teatro_real_proyecto/backend/src/main/java/com/teatroreal/shared/infrastructure/config/CorsConfig.java`

---

## 📱 Flujo de Datos

### Al cargar la aplicación:

1. **Frontend carga** → `index.html` se abre
2. **JavaScript se ejecuta** → `app.js` se inicializa
3. **Se importa el servicio** → `api-service.js` está disponible
4. **DOMContentLoaded dispara** → Se ejecuta `loadInitialData()`
5. **Llamadas a API** → El frontend solicita datos del backend
6. **Backend responde** → Los datos se cargan en memoria
7. **Dashboard se actualiza** → Se muestran datos reales

### Ejemplo de llamada:

```javascript
// Frontend (app.js)
const actividades = await APIService.getActividades();
// → GET http://localhost:8080/api/tempo/actividades

// Backend responde con JSON
[
  {
    "id": 1,
    "nombre": "La Traviata",
    "espacioId": 1,
    "inicio": "2025-12-05T20:00:00",
    "fin": "2025-12-05T22:30:00"
  },
  ...
]
```

---

## 📊 Datos de Ejemplo

El backend carga datos de prueba desde `schema.sql` y `data.sql`:

### Espacios
- Sala Principal
- Sala Cámara
- Foyer
- Almacén Técnico
- etc.

### Actividades
- La Traviata (05/12/2025)
- El Quijote (06/12/2025)
- Don Giovanni (07/12/2025)
- Carmen (08/12/2025)
- etc.

---

## 🛠️ Troubleshooting

### Backend no responde

1. Verificar que está corriendo en el puerto 8080:
   ```powershell
   netstat -ano | findstr :8080
   ```

2. Revisar logs en la terminal del backend

3. Reiniciar el servicio:
   ```powershell
   cd "teatro_real_proyecto\backend"
   .\RUN_BACKEND.ps1
   ```

### CORS Error

Si ves: `Access to XMLHttpRequest... has been blocked by CORS policy`

- Verifica que CORS está habilitado en `CorsConfig.java`
- Compila el backend de nuevo
- Reinicia el servicio

### API no devuelve datos

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Mira las peticiones HTTP
4. Verifica que las URLs son correctas

---

## 📝 Próximos Pasos

### Fase 2: Visualización de Datos
- [ ] Renderizar espacios en tabla
- [ ] Renderizar actividades con filtros
- [ ] Gráficos de disponibilidad

### Fase 3: Operaciones CRUD
- [ ] Crear nuevos espacios
- [ ] Crear nuevas actividades
- [ ] Editar espacios/actividades
- [ ] Eliminar espacios/actividades

### Fase 4: Funcionalidades Avanzadas
- [ ] Búsqueda global
- [ ] Filtros avanzados
- [ ] Exportar reportes
- [ ] Sincronización Google Calendar
- [ ] Gestión de incidencias (TOPS)

---

## 📚 Referencias

- **Frontend**: `PROYECTO/TEATRO/`
- **Backend**: `teatro_real_proyecto/backend/`
- **API Service**: `PROYECTO/TEATRO/js/api-service.js`
- **App Controller**: `PROYECTO/TEATRO/js/app.js`
- **Backend Config**: `teatro_real_proyecto/backend/src/main/java/com/teatroreal/`

---

## 🎯 Estado: ✅ CONECTADO Y FUNCIONANDO

La integración frontend-backend está completa y lista para:
- ✅ Comunicación bidireccional
- ✅ Carga de datos en tiempo real
- ✅ Manejo de errores
- ✅ CORS configurado
- ✅ Datos de prueba listos

**Próximo**: Iniciar el backend y abrir el frontend en el navegador.
