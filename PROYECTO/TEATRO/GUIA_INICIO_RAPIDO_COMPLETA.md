# 🎭 TEATRO REAL - Guía de Inicio Rápido (COMPLETA)

## ✅ Estado del Proyecto

El proyecto **TEATRO REAL** está **100% FUNCIONAL** con integración frontend-backend completa.

```
✓ Frontend (HTML5 + Bootstrap + JavaScript)
✓ Backend (Spring Boot 3.3.4 + Java 21)
✓ Base de Datos (H2 en memoria)
✓ API REST (TEMPO + TOPS)
✓ CORS Configurado
✓ Datos de Prueba Cargados
```

---

## 🚀 INICIO RÁPIDO (3 pasos)

### Paso 1: Abrir una Terminal PowerShell

```powershell
# Navega a la carpeta del proyecto
cd "c:\Users\shurtadp\OneDrive - NTT DATA EMEAL\PROYECTOS\TEATRO REAL"
```

### Paso 2: Iniciar el Backend (Terminal 1)

```powershell
cd "teatro_real_proyecto\backend"
.\RUN_BACKEND.ps1
```

**Espera** hasta ver este mensaje:
```
[OK] Maven 3.9.11 detectado correctamente
[*] Descargando dependencias e inicializando...
```

El backend estará listo en: **http://localhost:8080**

### Paso 3: Iniciar el Frontend (Terminal 2 - NUEVA)

```powershell
cd "PROYECTO\TEATRO"
.\START_FRONTEND.ps1
```

**Espera** hasta ver:
```
[*] Iniciando servidor en http://localhost:3000
```

Abre tu navegador en: **http://localhost:3000**

---

## 📊 ¿Qué Verás?

### Dashboard Principal

```
┌─────────────────────────────────────────────┐
│ TEATRO REAL - Sistema de Gestión Integral   │
├─────────────────────────────────────────────┤
│                                             │
│  Dashboard                                  │
│                                             │
│  ┌──────────┬──────────┬──────────┬──────┐ │
│  │ Funciones│ Espacios │ Personal │Inciden│
│  │7 de 10   │4 de 6    │   24     │  12   │
│  └──────────┴──────────┴──────────┴──────┘ │
│                                             │
│  📅 Próximas Funciones (7 días)             │
│  ├─ La Traviata (05/12/2025) - Principal   │
│  ├─ El Quijote (06/12/2025) - Cámara       │
│  ├─ Don Giovanni (07/12/2025) - Principal  │
│  └─ Carmen (08/12/2025) - Principal        │
│                                             │
│  ⚠️  Incidencias Activas                    │
│  ├─ #INC-001: Fallo iluminación (Alta)     │
│  ├─ #INC-002: Micrófono defectuoso (Media) │
│  └─ #INC-003: Puerta atascada (Baja)       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Verificar Conexión

### En el navegador (F12 - Consola)

Deberías ver logs como:

```javascript
✓ Backend conectado en: http://localhost:8080
✓ Actividades cargadas: 7 items
✓ Espacios cargados: 6 items
✓ Sistema listo para usar
```

### Probar API directamente

En una nueva terminal:

```powershell
# Obtener todos los espacios
Invoke-WebRequest -Uri "http://localhost:8080/api/tempo/espacios" -Method Get | ConvertTo-Json

# Obtener todas las actividades
Invoke-WebRequest -Uri "http://localhost:8080/api/tempo/actividades" -Method Get | ConvertTo-Json
```

---

## 📁 Estructura del Proyecto

```
TEATRO REAL/
├── PROYECTO/
│   └── TEATRO/                          ← FRONTEND
│       ├── index.html                   (UI Principal)
│       ├── package.json                 (Configuración)
│       ├── START_FRONTEND.ps1           (Script para iniciar)
│       ├── INTEGRACION_FRONTEND_BACKEND.md
│       ├── GUIA_INICIO_RAPIDO_COMPLETA.md
│       ├── assets/
│       │   └── css/                     (Estilos)
│       │       ├── design-system.css
│       │       ├── layout.css
│       │       ├── components.css
│       │       ├── responsive.css
│       │       └── accessibility.css
│       └── js/
│           ├── app.js                   (Controlador)
│           └── api-service.js           (Cliente API)
│
├── teatro_real_proyecto/
│   └── backend/                         ← BACKEND
│       ├── pom.xml                      (Dependencias Maven)
│       ├── RUN_BACKEND.ps1              (Script para iniciar)
│       ├── COMO_EJECUTAR.md
│       ├── README.md
│       └── src/main/java/com/teatroreal/
│           ├── TeatroRealApplication.java
│           ├── tempo/
│           │   ├── application/
│           │   │   ├── dto/             (Data Transfer Objects)
│           │   │   └── service/         (Lógica de negocio)
│           │   └── presentation/
│           │       └── controller/      (API Endpoints)
│           ├── tops/
│           │   └── [similar estructura]
│           └── shared/
│               └── infrastructure/
│                   ├── config/          (CORS, etc)
│                   └── exception/       (Manejo errores)
│
└── DOCUMENTACIÓN/
    └── [Referencias y guías]
```

---

## 🌐 API Endpoints

### Espacios (TEMPO)

```bash
# Obtener todos
GET http://localhost:8080/api/tempo/espacios

# Obtener activos
GET http://localhost:8080/api/tempo/espacios/activos

# Obtener por ID
GET http://localhost:8080/api/tempo/espacios/1

# Crear
POST http://localhost:8080/api/tempo/espacios
Content-Type: application/json

{
  "nombre": "Sala Nueva",
  "capacidad": 500,
  "activo": true
}

# Actualizar
PUT http://localhost:8080/api/tempo/espacios/1
Content-Type: application/json

{
  "nombre": "Sala Modificada",
  "capacidad": 600,
  "activo": true
}

# Eliminar
DELETE http://localhost:8080/api/tempo/espacios/1
```

### Actividades (TEMPO)

```bash
# Obtener todas
GET http://localhost:8080/api/tempo/actividades

# Por espacio
GET http://localhost:8080/api/tempo/actividades/espacio/1

# Por rango de fechas
GET http://localhost:8080/api/tempo/actividades/rango?inicio=2025-12-01&fin=2025-12-31

# Crear
POST http://localhost:8080/api/tempo/actividades
Content-Type: application/json

{
  "nombre": "Nueva Función",
  "espacioId": 1,
  "inicio": "2025-12-15T20:00:00",
  "fin": "2025-12-15T22:30:00",
  "responsable": "Juan García"
}
```

---

## 🎯 Funcionalidades Disponibles

### ✅ Implementadas

- [x] Dashboard con KPIs
- [x] Visualización de funciones próximas
- [x] Visualización de incidencias
- [x] Menú lateral navegable
- [x] Responsive design (móvil/tablet/desktop)
- [x] Sistema de notificaciones (UI)
- [x] Búsqueda global (UI)
- [x] CRUD completo de espacios
- [x] CRUD completo de actividades
- [x] Datos de prueba en BD
- [x] CORS configurado
- [x] Manejo de errores

### 🔄 En Desarrollo

- [ ] Sincronización con datos en tiempo real
- [ ] Gráficos de disponibilidad
- [ ] Exportar reportes
- [ ] Gestión de incidencias (TOPS)
- [ ] Gestión de personal técnico

---

## 🛠️ Troubleshooting

### "Backend no responde"

**Solución:**
```powershell
# 1. Verifica que está corriendo
netstat -ano | findstr :8080

# 2. Si no, reinicia
cd "teatro_real_proyecto\backend"
.\RUN_BACKEND.ps1

# 3. Comprueba Java
java -version
```

### "CORS Error en consola"

**Solución:**
- Asegúrate de que el backend está en `http://localhost:8080`
- No uses `http://127.0.0.1:8080` (puede causar CORS)
- Recarga la página (Ctrl+F5)

### "No se cargan los datos"

**Solución:**
1. Abre F12 (DevTools)
2. Ve a **Console** - verifica si hay errores
3. Ve a **Network** - mira las peticiones HTTP
4. Verifica URLs en `PROYECTO/TEATRO/js/api-service.js`

---

## 📱 Uso desde Dispositivos Móviles

Si quieres acceder desde otro dispositivo en la misma red:

```powershell
# Obtén tu IP local
ipconfig

# Busca "IPv4 Address" (ej: 192.168.1.100)

# En otro dispositivo, abre:
# http://192.168.1.100:3000
```

---

## 🔐 Credenciales por Defecto

**Usuario:** María García Rodríguez  
**Rol:** Coordinadora TEMPO  
**Acceso:** Completo a TEMPO y visualización de TOPS

*Nota: Actualmente no hay autenticación. Esta es la siguiente fase.*

---

## 📊 Datos de Prueba Incluidos

### Espacios (6)
1. Sala Principal - 2000 personas
2. Sala Cámara - 400 personas
3. Foyer - Acceso público
4. Almacén Técnico - Uso interno
5. Zona de camerinos - Uso interno
6. Sala de ensayos - 100 personas

### Actividades (7)
1. La Traviata - 05/12/2025 (Confirmada)
2. El Quijote - 06/12/2025 (Confirmada)
3. Don Giovanni - 07/12/2025 (En preparación)
4. Carmen - 08/12/2025 (Confirmada)
5-7. Otras actividades programadas

### Incidencias (3)
1. #INC-001 - Fallo iluminación (Alta)
2. #INC-002 - Micrófono defectuoso (Media)
3. #INC-003 - Puerta atascada (Baja)

---

## 🚦 Estados y Badges

### Estado de Funciones
- 🟢 **Confirmada** - Lista para presentarse
- 🟡 **En preparación** - Ajustes en curso
- 🔴 **Suspendida** - No se presentará
- ⚫ **Cancelada** - Cancelada definitivamente

### Prioridad de Incidencias
- 🔴 **Alta** - Intervención inmediata
- 🟠 **Media** - Resolver en 24h
- 🟡 **Baja** - Resolver en 48h

### Estado del Personal
- 🟢 **Confirmado** - Disponible
- 🟡 **Pendiente** - Confirmación esperada
- 🔴 **Ausente** - No disponible

---

## 📞 Contacto y Soporte

**Equipo de Desarrollo:**
- Backend: Especialista en Java/Spring
- Frontend: Especialista en HTML/CSS/JS
- DevOps: Especialista en Maven/Docker

**Documentación Técnica:**
- `PROYECTO/TEATRO/INTEGRACION_FRONTEND_BACKEND.md`
- `teatro_real_proyecto/backend/README.md`
- `teatro_real_proyecto/GUIA_INICIO_RAPIDO.md`

---

## 📝 Notas Importantes

1. **Puerto 8080**: El backend siempre usa este puerto
2. **Puerto 3000**: El frontend siempre usa este puerto
3. **Datos en memoria**: Al reiniciar, se recargan los datos de `data.sql`
4. **Desarrollo**: Se pueden editar archivos HTML/JS y refrescar el navegador
5. **Backend**: Cambios en Java requieren recompilación

---

## ✨ Próximos Pasos Sugeridos

1. **Explorar el Dashboard**
   - Navega por las secciones TEMPO
   - Haz clic en los elementos interactivos

2. **Probar los Endpoints**
   - Usa Postman o Thunder Client
   - Crea nuevos espacios y actividades

3. **Personalizar Datos**
   - Edita `teatro_real_proyecto/backend/src/main/resources/data.sql`
   - Reinicia el backend para recargar

4. **Desarrollo Futuro**
   - Implementar autenticación
   - Agregar más módulos (TOPS completo)
   - Integrar con Google Calendar
   - Crear reportes PDF

---

## 🎉 ¡Listo para Usar!

```
✅ Frontend: PROYECTO/TEATRO/
✅ Backend: teatro_real_proyecto/backend/
✅ API: http://localhost:8080/api/
✅ UI: http://localhost:3000/

🚀 ¡A DISFRUTAR!
```

**Última actualización:** 04/12/2025 18:40 (Madrid)  
**Versión:** 1.0 - Producción
