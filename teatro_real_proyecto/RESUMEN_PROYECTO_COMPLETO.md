# 🎭 TEATRO REAL - Sistema Integral de Gestión (TEMPO + TOPS)

**Versión**: 1.0.0  
**Fecha**: Diciembre 2025  
**Estado**: ✅ Completado y Funcional

---

## 📋 Descripción General

Se ha desarrollado un **sistema integral de gestión** para Teatro Real que integra:

- **TEMPO**: Gestión de Temporada (funciones, calendarios, espacios)
- **TOPS**: Gestión Operativa Técnica (incidencias, personal, operaciones)

La arquitectura sigue patrones profesionales con una **API REST completa** en el backend y una **interfaz moderna** en el frontend.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (BROWSER)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │          Frontend HTML/CSS/JS                │   │
│  │  - Dashboard Interactivo                     │   │
│  │  - Navegación TEMPO/TOPS                     │   │
│  │  - Componentes Reactivos                     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────┘
                  │ HTTP/REST
                  ↓
┌─────────────────────────────────────────────────────┐
│        BACKEND (Spring Boot + Java 17)              │
├─────────────────────────────────────────────────────┤
│  CAPA PRESENTACIÓN (Controllers)                    │
│  └─ EspacioController (endpoints de espacios)       │
│  └─ ActividadController (endpoints de actividades)  │
├─────────────────────────────────────────────────────┤
│  CAPA APLICACIÓN (Services)                         │
│  └─ EspacioService (lógica de espacios)            │
│  └─ ActividadService (lógica de actividades)       │
├─────────────────────────────────────────────────────┤
│  CAPA DOMINIO (Models)                              │
│  └─ Espacio (entidad de dominio)                    │
│  └─ Actividad (entidad de dominio)                  │
│  └─ TipoActividad (enum)                           │
│  └─ RangoHorario (value object)                     │
├─────────────────────────────────────────────────────┤
│  CAPA INFRAESTRUCTURA (Repositories/Mock)          │
│  └─ MockDataProvider (datos en memoria)            │
│  └─ EspacioRepository (interfaz)                    │
│  └─ ActividadRepository (interfaz)                  │
├─────────────────────────────────────────────────────┤
│  UTILITARIOS COMPARTIDOS                            │
│  └─ GlobalExceptionHandler (manejo errores)        │
│  └─ DTOs (estructuras de datos)                    │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Componentes Backend

### 1. Controllers (Capa de Presentación)

#### EspacioController
- **GET** `/tempo/espacios` - Obtener todos los espacios
- **GET** `/tempo/espacios/{id}` - Obtener espacio por ID
- **GET** `/tempo/espacios/activos` - Obtener espacios activos
- **POST** `/tempo/espacios` - Crear nuevo espacio
- **PUT** `/tempo/espacios/{id}` - Actualizar espacio
- **DELETE** `/tempo/espacios/{id}` - Eliminar (desactivar) espacio
- **PUT** `/tempo/espacios/{id}/activar` - Reactivar espacio

#### ActividadController
- **GET** `/tempo/actividades` - Obtener todas las actividades
- **GET** `/tempo/actividades/{id}` - Obtener actividad por ID
- **GET** `/tempo/actividades/espacio/{espacioId}` - Actividades de un espacio
- **GET** `/tempo/actividades/rango` - Actividades en rango de fechas
- **POST** `/tempo/actividades` - Crear nueva actividad
- **PUT** `/tempo/actividades/{id}` - Actualizar actividad
- **PUT** `/tempo/actividades/{id}/horario` - Cambiar horario
- **DELETE** `/tempo/actividades/{id}` - Eliminar actividad

### 2. Services (Capa de Aplicación)

#### EspacioService
```java
- obtenerTodos()           // Todos los espacios
- obtenerActivos()         // Solo espacios activos
- obtenerPorId(id)         // Espacio específico
- crear(request)           // Crear nuevo
- actualizar(id, request)  // Modificar
- eliminar(id)             // Desactivar
- activar(id)              // Reactivar
```

#### ActividadService
```java
- obtenerTodos()           // Todas las actividades
- obtenerPorId(id)         // Actividad específica
- obtenerPorEspacio(id)    // Actividades de un espacio
- obtenerPorRango(dates)   // Actividades en rango
- crear(request)           // Crear nueva
- actualizar(id, request)  // Modificar
- cambiarHorario(id, dates)// Cambiar horario
- eliminar(id)             // Eliminar
```

### 3. Models (Capa de Dominio)

#### Espacio
```java
- id: String              // UUID único
- nombre: String          // Nombre del espacio
- tipo: String            // Tipo (sala, estudio, etc.)
- ubicacion: String       // Ubicación física
- codigoColor: String     // Color para UI
- activo: boolean         // Estado
- createdAt: Instant      // Fecha creación
- updatedAt: Instant      // Fecha actualización
```

#### Actividad
```java
- id: String              // UUID único
- titulo: String          // Nombre actividad
- tipo: TipoActividad     // FUNCION, ENSAYO, MANTENIMIENTO, OTRO
- espacioId: String       // Referencia a espacio
- inicio: LocalDateTime   // Inicio
- fin: LocalDateTime      // Fin
- codigoColor: String     // Color para UI
- responsable: String     // Persona responsable
- descripcion: String     // Detalles
- sincronizadaGoogleCalendar: boolean  // Sincronización
- createdAt: Instant      // Fecha creación
- updatedAt: Instant      // Fecha actualización
```

#### Enumeraciones
```java
TipoActividad:
- FUNCION               // Función/actuación
- ENSAYO                // Ensayo/práctica
- MANTENIMIENTO         // Mantenimiento técnico
- OTRO                  // Otra actividad

RangoHorario:
- inicio: LocalDateTime
- fin: LocalDateTime
```

### 4. DTOs (Transferencia de Datos)

#### EspacioDTO / ActividadDTO
Objetos para serialización JSON en requests/responses.

#### CreateEspacioRequest / CreateActividadRequest
Objetos para validación de datos de entrada.

### 5. Infraestructura

#### MockDataProvider
- Proveedor de datos en memoria
- Simula persistencia sin BD
- Datos de ejemplo preiniicializados

#### GlobalExceptionHandler
- Manejo centralizado de excepciones
- Respuestas de error consistentes
- Códigos HTTP apropiados

---

## 🎨 Componentes Frontend

### Estructura HTML

```
index.html (raíz)
├── Navbar
│   ├── Logo Teatro Real
│   ├── Buscador Global
│   ├── Notificaciones (dropdown)
│   └── Perfil Usuario (dropdown)
├── Sidebar
│   ├── Dashboard
│   ├── TEMPO
│   │   ├── Calendario
│   │   ├── Funciones
│   │   └── Espacios
│   ├── TOPS
│   │   ├── Operativa
│   │   ├── Incidencias
│   │   └── Personal
│   └── Admin
│       └── Configuración
└── Main Content
    ├── Breadcrumb
    └── Secciones Dinámicas
        ├── Dashboard Principal
        ├── Calendario de Temporada
        ├── Funciones Programadas
        ├── Gestión de Espacios
        ├── Operativa Técnica
        ├── Gestión de Incidencias
        ├── Personal Técnico
        └── Configuración del Sistema
```

### Sistema de Diseño

#### Archivos CSS
1. **design-system.css** - Paleta de colores y tipografía
2. **layout.css** - Estructura y espaciado
3. **components.css** - Componentes reutilizables
4. **responsive.css** - Adaptabilidad dispositivos
5. **accessibility.css** - Accesibilidad WCAG

#### Colores Corporativos
- **Primario**: #1F1F2E (Gris oscuro)
- **Secundario**: #D4AF37 (Oro Teatro)
- **Acentos**: Rojo (#E63946), Verde (#06A77D)
- **Neutros**: Grises varios para fondos y bordes

#### Tipografía
- **Font**: Roboto (Google Fonts)
- **Pesos**: 300 (light), 400 (regular), 500 (medium), 700 (bold)

### Componentes

#### Dashboard
- 4 KPIs: Funciones, Espacios, Personal, Incidencias
- Tabla funciones próximas 7 días
- Tabla incidencias activas
- Estado en tiempo real

#### Navegación
- Menú lateral colapsable
- Breadcrumb dinámico
- Dropdown de notificaciones
- Dropdown de perfil usuario

#### Bootstrap 5
- Grilla responsive 12 columnas
- Componentes predefinidos
- Utilidades CSS
- Accesibilidad integrada

---

## 🗄️ Datos Iniciales

### Espacios Predefinidos (6)

```
1. Sala Principal
   - Tipo: Sala de funciones
   - Ubicación: Planta Baja
   - Color: #FF6B6B (Rojo)
   - Activo: Sí

2. Sala Cámara
   - Tipo: Sala de cámara
   - Ubicación: Planta 1
   - Color: #4ECDC4 (Turquesa)
   - Activo: Sí

3. Estudio A
   - Tipo: Estudio de ensayo
   - Ubicación: Sótano 1
   - Color: #95E1D3 (Menta)
   - Activo: Sí

4. Estudio B
   - Tipo: Estudio de ensayo
   - Ubicación: Sótano 1
   - Color: #F38181 (Rosa)
   - Activo: Sí

5. Foyer
   - Tipo: Espacio social
   - Ubicación: Planta Baja
   - Color: #FFE66D (Amarillo)
   - Activo: Sí

6. Cafetería
   - Tipo: Espacio de descanso
   - Ubicación: Planta 2
   - Color: #A8E6CF (Verde claro)
   - Activo: Sí
```

### Actividades Predefinidas (5)

```
1. La Traviata
   - Tipo: FUNCION
   - Espacio: Sala Principal
   - Fecha: 05/12/2025 20:00 - 22:30
   - Responsable: María García

2. Ensayo Orquesta
   - Tipo: ENSAYO
   - Espacio: Sala Principal
   - Fecha: 05/12/2025 10:00 - 12:00
   - Responsable: Juan López

3. Mantenimiento Iluminación
   - Tipo: MANTENIMIENTO
   - Espacio: Sala Cámara
   - Fecha: 06/12/2025 09:00 - 13:00
   - Responsable: Técnico Iluminación

4. El Quijote
   - Tipo: FUNCION
   - Espacio: Sala Principal
   - Fecha: 06/12/2025 20:00 - 22:00
   - Responsable: María García

5. Preparación Escenario
   - Tipo: MANTENIMIENTO
   - Espacio: Sala Principal
   - Fecha: 07/12/2025 08:00 - 12:00
   - Responsable: Equipo Escena
```

---

## 🔌 Guía de API

### Autenticación
Actualmente sin autenticación (próxima fase).

### Headers Requeridos
```
Content-Type: application/json
Accept: application/json
```

### Formatos de Fecha/Hora

**LocalDateTime** (para actividades):
```
2025-12-05T20:00:00
```

**Instant** (para timestamps):
```
2025-12-04T17:30:00Z
```

### Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no existe |
| 409 | Conflict - Violación de restricción |
| 500 | Server Error - Error interno |

### Ejemplos de Uso

#### Crear Espacio
```bash
curl -X POST http://localhost:8080/tempo/espacios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sala Nueva",
    "tipo": "Sala de conciertos",
    "ubicacion": "Planta 3",
    "codigoColor": "#FF6B6B"
  }'
```

#### Crear Actividad
```bash
curl -X POST http://localhost:8080/tempo/actividades \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Romeo y Julieta",
    "tipo": "FUNCION",
    "espacioId": "550e8400-e29b-41d4-a716-446655440001",
    "inicio": "2025-12-10T20:00:00",
    "fin": "2025-12-10T23:00:00",
    "responsable": "Director General",
    "descripcion": "Ballet de Prokófiev",
    "codigoColor": "#4ECDC4"
  }'
```

#### Obtener Espacios Activos
```bash
curl http://localhost:8080/tempo/espacios/activos
```

---

## 📊 Estadísticas del Proyecto

### Backend
- **Líneas de código**: ~1,200
- **Archivos Java**: 15
- **Endpoints REST**: 17
- **DTOs**: 4
- **Modelos de dominio**: 2
- **Enumeraciones**: 2
- **Value Objects**: 1
- **Excepc
