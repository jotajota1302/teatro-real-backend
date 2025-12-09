# 🎭 Guía de Inicio Rápido - Teatro Real TEMPO

## ✅ Lo que se ha completado

Se ha desarrollado un **sistema integral de gestión** para Teatro Real con arquitectura profesional:

### 📦 Backend (Java/Spring Boot)
- ✅ API REST completa con 17 endpoints
- ✅ Arquitectura hexagonal de 4 capas
- ✅ Base de datos MySQL optimizada
- ✅ Documentación automática con Swagger
- ✅ Manejo global de excepciones
- ✅ Validaciones de negocio
- ✅ CORS habilitado

### 🎨 Frontend (HTML/CSS/JavaScript)
- ✅ Interfaz moderna con Bootstrap 5
- ✅ Dashboard interactivo
- ✅ Sistema de navegación completo
- ✅ Diseño responsive
- ✅ Componentes accesibles
- ✅ Datos de ejemplo

---

## 🚀 Instalación y Ejecución

### Paso 1: Requisitos Previos

Instala lo siguiente si no lo tienes:

1. **Java 17+**
   ```powershell
   # Verificar
   java -version
   ```

2. **Maven 3.8+**
   ```powershell
   # Verificar
   mvn -version
   ```

3. **MySQL 8.0+**
   ```powershell
   # Verificar
   mysql --version
   ```

### Paso 2: Crear Base de Datos

Abre MySQL y ejecuta:

```sql
CREATE DATABASE teatro_real CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Paso 3: Compilar el Backend

En PowerShell, navega a la carpeta del backend:

```powershell
cd teatro_real_proyecto/backend
mvn clean compile
```

### Paso 4: Ejecutar el Backend

```powershell
mvn spring-boot:run
```

**Espera** hasta ver en consola:
```
Started TeatroRealApplication in X.XXX seconds
```

El backend estará disponible en: **http://localhost:8080**

### Paso 5: Abrir el Frontend

En tu navegador, abre el archivo:
```
PROYECTO\TEATRO\index.html
```

O arrastra el archivo al navegador.

---

## 📍 URLs Importantes

| Componente | URL |
|-----------|-----|
| **Frontend** | `PROYECTO\TEATRO\index.html` |
| **Backend** | http://localhost:8080 |
| **API Docs (Swagger)** | http://localhost:8080/swagger-ui.html |
| **API JSON** | http://localhost:8080/v3/api-docs |

---

## 🧪 Probar la Aplicación

### 1. Dashboard (Frontend)
- Abre `index.html` en navegador
- Verás un dashboard con KPIs
- Navega usando el menú lateral

### 2. API (Backend)

**Listar todos los espacios:**
```bash
curl http://localhost:8080/tempo/espacios
```

**Listar todas las actividades:**
```bash
curl http://localhost:8080/tempo/actividades
```

**Ver documentación interactiva:**
- Ve a http://localhost:8080/swagger-ui.html
- Prueba los endpoints desde la UI

---

## 📁 Estructura del Proyecto

```
teatro_real_proyecto/
├── backend/                              # API Java/Spring Boot
│   ├── pom.xml                          # Dependencias
│   ├── README.md                        # Documentación backend
│   └── src/main/
│       ├── java/com/teatroreal/         # Código fuente
│       └── resources/                   # Configuración
├── RESUMEN_PROYECTO_COMPLETO.md         # Descripción completa
└── GUIA_INICIO_RAPIDO.md               # Esta guía

PROYECTO/TEATRO/
├── index.html                           # Frontend principal
├── assets/css/                          # Estilos
└── js/app.js                           # Lógica
```

---

## 🔌 Endpoints Principales

### Espacios

```bash
# Listar todos
GET /tempo/espacios

# Crear uno nuevo
POST /tempo/espacios
Content-Type: application/json
{
  "nombre": "Sala Nueva",
  "tipo": "Sala de conciertos",
  "ubicacion": "Planta 1",
  "codigoColor": "#FF6B6B"
}

# Obtener uno por ID
GET /tempo/espacios/{id}

# Actualizar
PUT /tempo/espacios/{id}
Content-Type: application/json
{
  "nombre": "Sala Actualizada",
  "tipo": "Sala de cámara"
}

# Desactivar
PUT /tempo/espacios/{id}/desactivar

# Eliminar
DELETE /tempo/espacios/{id}
```

### Actividades

```bash
# Listar todas
GET /tempo/actividades

# Crear una nueva
POST /tempo/actividades
Content-Type: application/json
{
  "titulo": "La Traviata",
  "tipo": "FUNCION",
  "espacioId": "550e8400-e29b-41d4-a716-446655440001",
  "inicio": "2025-12-05T20:00:00",
  "fin": "2025-12-05T22:30:00",
  "responsable": "María García",
  "descripcion": "Ópera de Verdi"
}

# Obtener por ID
GET /tempo/actividades/{id}

# Actividades por espacio
GET /tempo/actividades/espacio/{espacioId}

# Cambiar horario
PUT /tempo/actividades/{id}/horario
Content-Type: application/json
{
  "inicio": "2025-12-06T20:00:00",
  "fin": "2025-12-06T22:30:00"
}

# Eliminar
DELETE /tempo/actividades/{id}
```

---

## 💾 Datos Iniciales

Al iniciar, la BD se carga automáticamente con:

**Espacios (6):**
- Sala Principal
- Sala Cámara
- Estudio A
- Estudio B
- Foyer
- Cafetería

**Actividades (5):**
- La Traviata (05/12/2025)
- Ensayo Orquesta (05/12/2025)
- Mantenimiento Iluminación (06/12/2025)
- El Quijote (06/12/2025)
- Preparación Escenario (07/12/2025)

---

## 🐛 Solución de Problemas

### ❌ Error: "Puerto 8080 en uso"

```powershell
# Cambiar puerto en: backend/src/main/resources/application.properties
server.port=8081
```

### ❌ Error: "Cannot connect to database"

Verificar:
```powershell
# MySQL está corriendo
mysql -u root -p

# Base de datos existe
CREATE DATABASE teatro_real;
```

### ❌ Error: "Class not found: com.mysql.cj.jdbc.Driver"

```powershell
# Limpiar y recompilar
mvn clean install -U
```

### ❌ Frontend no ve los datos del backend

Verificar:
1. Backend está corriendo (http://localhost:8080 accesible)
2. CORS está habilitado en `application.properties`
3. Browser console sin errores (F12)

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Líneas de código (Backend) | ~1,200 |
| Archivos Java | 15 |
| Endpoints REST | 17 |
| DTOs | 4 |
| Tablas BD | 2 |
| Componentes HTML | 10+ |
| Archivos CSS | 5 |

---

## 🎯 Próximos Pasos

Para extender el sistema:

1. **Agregar Autenticación**
   - Implementar JWT
   - Roles y permisos

2. **Integración Google Calendar**
   - Sincronizar eventos
   - Biconexión

3. **Módulo TOPS**
   - Gestión técnica
   - Operaciones

4. **Tests Automáticos**
   - JUnit 5
   - Mockito

5. **Docker**
   - Containerizar aplicación
   - docker-compose

---

## 📞 Soporte

**Teatro Real**
- Web: https://www.teatroreal.es
- Teléfono: +34 91 516 06 06

---

## 📚 Documentación Adicional

- Resumen completo: `RESUMEN_PROYECTO_COMPLETO.md`
- Backend: `backend/README.md`
- API Swagger: http://localhost:8080/swagger-ui.html

---

**¡Sistema listo para usar! 🎉**

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
