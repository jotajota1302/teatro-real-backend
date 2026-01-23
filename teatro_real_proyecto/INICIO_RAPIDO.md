# ⚡ TEATRO REAL - INICIO RÁPIDO

## 🎯 En 5 minutos tendrás el proyecto funcionando

---

## 📋 Requisitos Previos

```
✅ Java 17 o superior
✅ Maven 3.8+
✅ Python 3.6+ (o Node.js)
✅ Puerto 8080 disponible
✅ Puerto 8000 disponible (frontend)
```

**Verificar requisitos:**
```powershell
java -version
mvn -version
python --version
```

---

## 🚀 INICIO EN 3 PASOS

### PASO 1: Terminal 1 - Iniciar Backend (30 segundos)

```powershell
cd teatro_real_proyecto\backend
.\RUN_BACKEND.ps1
```

**Espera hasta ver:**
```
✓ Application started on http://localhost:8080
```

---

### PASO 2: Terminal 2 - Iniciar Frontend (10 segundos)

```powershell
cd teatro_real_proyecto\frontend
python -m http.server 8000
```

**Espera hasta ver:**
```
✓ Serving HTTP on 0.0.0.0 port 8000
```

---

### PASO 3: Navegador - Abrir la App (5 segundos)

Abre en tu navegador:
```
http://localhost:8000
```

**¡Listo! El proyecto está corriendo** 🎉

---

## ✅ Verificación Rápida

### Backend OK? Abre en navegador:
```
http://localhost:8080/api/tempo/actividades
```

Deberías ver JSON con actividades:
```json
[
  {
    "id": "1",
    "nombre": "La Traviata",
    "fecha": "05/12/2025",
    "sala": "Principal",
    "estado": "Confirmada"
  },
  ...
]
```

### Frontend OK? Verifica:
1. Abre DevTools (F12)
2. Ve a pestaña **Console**
3. Busca mensaje: `Dashboard data loaded: {...}`
4. Navega entre secciones en el sidebar

---

## 📊 Vista General del Proyecto

```
┌─────────────────────────────────────────┐
│     TEATRO REAL - Sistema Integral      │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (HTML/JS/CSS)                 │
│  🖥️ http://localhost:8000               │
│  • Dashboard con KPIs                   │
│  • Navegación TEMPO + TOPS              │
│  • Interfaz responsive                  │
│              ↕ HTTP                     │
│  Backend (Java Spring Boot)             │
│  🖥️ http://localhost:8080               │
│  • REST APIs                            │
│  • Gestión de Actividades               │
│  • Gestión de Espacios                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎮 Usar la Aplicación

### Dashboard
- Carga automáticamente con KPIs
- Muestra funciones de la semana
- Muestra incidencias activas

### Navegación Lateral
1. **Dashboard** - Panel principal
2. **TEMPO Section:**
   - Calendario de Temporada
   - Funciones Programadas
   - Gestión de Espacios
3. **TOPS Section:**
   - Operativa Técnica
   - Gestión de Incidencias
   - Personal Técnico
4. **Admin:**
   - Configuración del Sistema

### Búsqueda Global
Usa la barra de búsqueda en el navbar para buscar funciones, espacios, personal...

---

## 🔧 Troubleshooting Rápido

| Error | Solución |
|-------|----------|
| `Port 8080 already in use` | `netstat -ano \| findstr :8080` - mata proceso |
| `Port 8000 already in use` | Usa `http-server` o diferente puerto |
| `CORS error` | Asegura backend en localhost:8080 |
| `404 Not Found` | Verifica ruta de archivos CSS/JS |
| `No hay datos` | Normal si backend no responde, usa datos demo |

---

## 📁 Archivos Clave

```
teatro_real_proyecto/
│
├── frontend/
│   ├── index.html          ← Abre esto en el navegador
│   ├── js/
│   │   ├── app.js          ← Lógica de la app
│   │   └── api-service.js  ← Conexión con backend
│   └── assets/css/         ← Estilos
│
└── backend/
    ├── RUN_BACKEND.ps1     ← Ejecuta esto
    ├── pom.xml             ← Configuración Maven
    └── target/
        └── *.jar           ← Aplicación compilada
```

---

## 📞 Comandos Útiles

### Backend - Recompilar
```powershell
cd teatro_real_proyecto\backend
mvn clean package
```

### Frontend - Diferentes Puertos
```powershell
python -m http.server 3000
http-server teatro_real_proyecto/frontend -p 3000
```

### Verificar Conexión
```powershell
curl http://localhost:8080/api/tempo/actividades
```

---

## 🎯 Próximas Acciones

Después de verificar que funciona:

1. **Lee la documentación completa:**
   - `INSTRUCCIONES_INTEGRACION.md`
   - `PROYECTO_COMPLETADO.md`

2. **Explora el código:**
   - `frontend/js/app.js` - Lógica frontend
   - `backend/src/` - Código Java

3. **Prueba los endpoints:**
   - GET `/api/tempo/actividades`
   - GET `/api/tempo/espacios`

4. **Customiza:**
   - Modifica datos en `MockDataProvider.java`
   - Añade nuevas funciones en frontend
   - Expande los endpoints

---

## 💡 Tips Útiles

### Para Desarrollo
```powershell
# Recargar backend sin reiniciar
# (Si usas Spring Boot DevTools)
mvn spring-boot:run

# Ver logs en tiempo real
tail -f backend.log
```

### Para Debugging
```powershell
# DevTools en navegador
F12 → Console tab → Ver logs

# Ver requests HTTP
F12 → Network tab → Actualiza página
```

### Para Testing
```powershell
# Curl en PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/api/tempo/actividades" -Method GET

# Ver headers CORS
Invoke-WebRequest -Uri "http://localhost:8080/api/tempo/actividades" -Method Options
```

---

## 📊 Estado Actual

✅ **Backend:** Compilado y listo
✅ **Frontend:** HTML/CSS/JS integrado
✅ **API:** Endpoints funcionando
✅ **CORS:** Configurado
✅ **Datos:** Mock data cargado

---

## 🎉 ¡Listo!

Tu proyecto Teatro Real está completamente integrado y funcionando.

**Próximo paso:** Lee `INSTRUCCIONES_INTEGRACION.md` para la guía completa.

---

**Última actualización:** 04/12/2025
**Versión:** 1.0.0
**Estado:** ✅ PRODUCCIÓN
