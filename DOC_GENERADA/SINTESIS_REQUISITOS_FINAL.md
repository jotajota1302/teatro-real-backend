# Teatro Real - Síntesis Consolidada de Requisitos
## Documento Base para Implementación

---
**Proyecto:** Gestión Interna del Teatro Real
**Versión:** 1.0 CONSOLIDADA
**Fecha:** 2025-12-11
**Fuentes:** Síntesis de requisitos v1 + v2 (20251112)

---

## 1. Resumen Ejecutivo

### 1.1 Problema de Negocio

El **Teatro Real de Madrid** gestiona actualmente sus operaciones mediante herramientas dispersas (Excel, Access, Google Calendar), lo que genera:

- Duplicidad de información entre departamentos
- Falta de trazabilidad en cambios y decisiones
- Dificultad para obtener visión unificada de actividades
- Procesos manuales propensos a errores
- Baja eficiencia operativa en coordinación técnica

### 1.2 Solución Propuesta

Desarrollar una **plataforma web unificada** con tres módulos principales:

| Módulo | Función Principal |
|--------|-------------------|
| **TEMPO** | Planificación y gestión de actividades/calendario |
| **TOPS** | Coordinación técnica y escénica (guiones técnicos) |
| **ADMIN** | Gestión de usuarios, roles y configuración |

### 1.3 Stack Tecnológico Sugerido

> Nota: El stack se ha alineado con el proyecto real en este repositorio.

- **Frontend:** Angular (SPA, última LTS estable)
- **Backend:** Java + Spring Boot (API REST)
- **Base de datos:** PostgreSQL
- **Almacenamiento de documentos/imágenes:** Solución compatible con Google Cloud (Cloud Storage o almacenamiento de ficheros accesible desde la intranet para el Drive interno)
- **Hosting:** Google Cloud (preferente por infraestructura actual del Teatro; posibilidad de componentes on-premise si el Teatro lo requiere)
- **Autenticación:** OAuth 2.0 con Google (Gmail corporativo)

---

## 2. Contexto del Negocio

### 2.1 Conceptos Clave

#### TOPS (Technical Operation Points / Puntos de Sincronización Técnica)
- **Definición:** Señales que marcan el inicio de acciones sincronizadas durante una función o ensayo
- **Ejemplos:** "Top luces" (cambio iluminación), "Top sonido" (entrada música), "Top escena" (subida telón)
- **Responsable:** El regidor/realizador coordina desde cabina o intercom
- **Objetivo:** Asegurar sincronía perfecta entre elementos técnicos y acción escénica

#### TEMPO (Planificación Temporal)
- **Definición:** Ritmo y cadencia de la programación de actividades del teatro
- **Aplicación:** Planificación de ensayos, producciones, eventos, montajes/desmontajes
- **Alcance:** Coordina los departamentos Técnico, Artístico y Administrativo

### 2.2 Departamentos Involucrados

| Código | Departamento | Ámbito |
|--------|--------------|--------|
| M.E. | Mecánica Escénica | Técnico |
| MAQ. | Maquinaria | Técnico |
| Útil. | Utilería | Técnico |
| Elec. | Electricidad | Técnico |
| A/V. | Audio-Visuales | Técnico |
| Sast. | Sastrería | Artístico |
| Carac. | Caracterización | Artístico |
| Log. | Logística | Operaciones |

### 2.3 Espacios del Teatro

#### Tipo "Sala" (dentro del Teatro)
| Espacio | Uso Principal |
|---------|---------------|
| Sala Principal - Escenario | Funciones y ensayos generales |
| Sala S.E.P.E. | Ensayos escénicos |
| Sala de Ballet | Ensayos de ballet |
| Sala de Orquesta | Ensayos orquestales |
| Sala Gayarre | Ensayos vocales |
| Sala del Coro | Ensayos corales |
| Salón de Baile | Eventos, ensayos |
| Salas de Cuerda | Ensayos secciones |
| Salas de Cantantes | Ensayos individuales |
| Salones (Falla, Felipe, Arrieta, Carlos, Vergara) | Varios usos |

#### Tipo "Almacén" (externos - Arganda del Rey)
| Espacio | Función |
|---------|---------|
| Arganda-Campa | Almacenamiento temporal |
| Arganda-Nave | Almacenamiento principal |

---

## 3. Actores y Usuarios

### 3.1 Roles del Sistema

| Rol | Descripción | Permisos | Cantidad Est. |
|-----|-------------|----------|---------------|
| **Administrador** | Configura sistema, gestiona usuarios | Superusuario (acceso total) | 1 máx |
| **Colaborador** | Regidor/técnico - crea y edita contenido | CRUD actividades y guiones | 2-3 |
| **Consulta** | Personal del teatro | Solo lectura, exportación | ~50 |

### 3.2 Perfiles de Usuario Detallados

| Perfil | Módulo Principal | Necesidad | Acciones Típicas |
|--------|------------------|-----------|------------------|
| **Regidor/a** | TOPS | Gestionar guiones y TOPs con precisión | Crear/editar guiones, coordinar TOPs durante ensayos |
| **Director/a de Escena** | TOPS | Consultar y aprobar cambios | Revisar guiones, aprobar versiones finales |
| **Jefe de Departamento** | TOPS + TEMPO | Ver solo lo que afecta a su equipo | Consultar TOPs de su área, recibir notificaciones |
| **Técnico de Escena** | TOPS | Consultar instrucciones en tiempo real | Ver TOPs asignados, añadir notas |
| **Coordinador de Producción** | TEMPO | Organizar calendario sin conflictos | Crear/mover actividades, gestionar plantillas |
| **Director Técnico** | TEMPO + TOPS | Visión global de operación | Dashboard, reportes, exportaciones |
| **Personal Administrativo** | TEMPO | Gestionar eventos institucionales | Crear eventos, reservar salas |
| **Gestor de Almacenes** | TEMPO | Coordinar movimientos de material | Registrar recogidas/salidas, tracking |

### 3.3 Mapa de Interacción

```
                    ┌─────────────────────────────────┐
                    │      DIRECCIÓN ARTÍSTICA        │
                    │   (Consulta y aprobación)       │
                    └───────────────┬─────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
    ▼                               ▼                               ▼
┌─────────┐                  ┌─────────────┐                 ┌─────────────┐
│REGIDURÍA│◄────────────────►│ PRODUCCIÓN  │◄───────────────►│  TÉCNICOS   │
│ (TOPS)  │   Coordina       │  (TEMPO)    │   Informa       │(Departamentos)
└────┬────┘                  └──────┬──────┘                 └──────┬──────┘
     │                              │                               │
     │         ┌────────────────────┼────────────────────┐          │
     │         │                    │                    │          │
     │         ▼                    ▼                    ▼          │
     │   ┌──────────┐        ┌──────────┐        ┌──────────┐       │
     │   │ Escenario│        │  Salas   │        │ Almacenes│       │
     │   └──────────┘        └──────────┘        └──────────┘       │
     │                                                              │
     └──────────────────────────────────────────────────────────────┘
                        Guiones técnicos por producción
```

---

## 4. Módulo TEMPO - Requisitos Funcionales

### 4.1 Gestión de Actividades

**RF-TEMPO-1: CRUD de Actividades**
- **Prioridad:** MUST
- **Complejidad:** Media

**Descripción:** Crear, editar, ver y eliminar actividades del teatro.

**Campos de una Actividad:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| titulo | string | Sí | Nombre de la producción/evento |
| tipo_actividad | enum | Sí | Categoría (determina color) |
| espacio | FK | Sí | Sala o Almacén |
| fecha | date | Sí | Fecha programada |
| hora_inicio | time | Sí | Hora de inicio |
| hora_fin | time | Sí | Hora de finalización |
| departamento | FK | Sí | Departamento responsable |
| documentacion | array[url] | No | Planos, dossier, partitura |
| notas | text | No | Observaciones adicionales |

**Historia de Usuario:**
```
Como Colaborador
quiero crear/editar una actividad con toda su metadata
para que quede registrada y disponible para todos los departamentos.
```

**Criterios de Aceptación:**
```gherkin
Dado que estoy en la pantalla de creación de actividad
Cuando completo los campos obligatorios y guardo
Entonces la actividad aparece en el calendario
Y se envían notificaciones a los departamentos afectados
```

---

**RF-TEMPO-2: Código de Colores por Tipo de Actividad**
- **Prioridad:** MUST
- **Complejidad:** Baja

#### Para Salas
| Color | Código HEX | Tipo de Actividad |
|-------|------------|-------------------|
| Naranja | #FFA500 | Nocturnas |
| Morado | #800080 | Visitas |
| Amarillo | #FFFF00 | Cargas y descargas |
| Blanco | #FFFFFF | Actividad en el escenario |
| Gris | #808080 | Pauta técnica |
| Salmón | #FA8072 | Montaje |
| Verde | #008000 | Ensayo |
| Azul | #0000FF | Función |
| Rosa | #FFC0CB | Cursos |
| Rosa oscuro | #FF1493 | Eventos |
| Rojo | #FF0000 | Rueda de prensa |
| Morado claro | #DDA0DD | Flamenco Real |

#### Para Almacenes
| Color | Código HEX | Tipo de Actividad |
|-------|------------|-------------------|
| Verde | #008000 | Recogida de producciones |
| Rosa | #FFC0CB | Salida de producciones |

---

**RF-TEMPO-3: Actividades de Almacén (Logística)**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Campos adicionales para actividades en Almacén:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipo_movimiento | enum | Recogida / Salida |
| num_camiones | integer | Número de camiones |
| lugar_origen | string | Lugar de recogida/salida |
| lugar_destino | string | Lugar de llegada/envío |
| produccion | string | Nombre de la producción |

**Ejemplo de datos reales:**
- Moses und Pharaon: 3 camiones desde Marsella (Dic 2025)
- Otello: 5 camiones a Londres (Dic 2025)

---

**RF-TEMPO-4: Alertas y Notificaciones**
- **Prioridad:** MUST
- **Complejidad:** Media

**Triggers de alerta:**
- Creación de nueva actividad
- Modificación de fecha, horario o sala
- Cancelación o reprogramación de evento

**Destinatarios:**
- Jefes de departamento afectados por la actividad
- Usuarios suscritos a la sala específica

---

**RF-TEMPO-5: Sincronización con Google Calendar**
- **Prioridad:** MUST
- **Complejidad:** Alta

**Requisitos:**
- Sincronización bidireccional (crear/modificar/eliminar)
- Cada sala tiene un calendario de Google asociado
- Autenticación mediante OAuth 2.0
- Control de cuotas y manejo de errores

**Reglas de negocio:**
- Actividad en TEMPO → se crea/actualiza evento en Google Calendar correspondiente
- Conflicto de sincronización → TEMPO es fuente de verdad (master)

---

**RF-TEMPO-6: Importador/Exportador Excel/CSV**
- **Prioridad:** SHOULD
- **Complejidad:** Media

**Funcionalidades:**
- Importar hojas mensuales desde plantillas TEMPO existentes
- Exportar calendario por sala/mes
- Mapeo asistido de columnas (UI para seleccionar correspondencias)

---

**RF-TEMPO-7: Modo Cartelería**
- **Prioridad:** SHOULD
- **Complejidad:** Baja

**Descripción:**
- URL única por espacio: `/carteleria/{espacio_id}`
- Muestra programación del día actual
- Actualización automática cada X minutos
- Diseño optimizado para pantallas digitales (landscape)

---

## 5. Módulo TOPS - Requisitos Funcionales

### 5.1 Estructura del Guion Técnico

**RF-TOPS-1: Editor Estructurado de Guion**
- **Prioridad:** MUST
- **Complejidad:** Alta

**Jerarquía del Guion:**
```
Guion (Producción)
├── Encabezado
│   ├── Nombre de la obra
│   ├── Compañía productora
│   ├── Productor
│   ├── Responsable de edición
│   ├── Director de escena
│   └── Director musical
│
├── Acto I
│   ├── Pasada Acto I (preparación previa)
│   │   └── [Elementos por departamento]
│   ├── Escena 1 (ej: Prélude)
│   │   ├── Top 1
│   │   ├── Top 2
│   │   ├── E (Entrada)
│   │   ├── M (Mutis)
│   │   └── Otras acciones
│   └── Escena N...
│
├── Acto II
│   ├── Pasada Acto II
│   └── Escenas...
│
└── Acto N...
```

**Requisitos del Editor:**
- Soporte para adjuntar imágenes y documentos por elemento
- Bloqueo exclusivo de edición (1 editor a la vez)
- Interfaz drag-and-drop para reordenar elementos

---

**RF-TOPS-2: Elementos de la Pasada**
- **Prioridad:** MUST
- **Complejidad:** Media

**Campos de un elemento de Pasada:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| departamento | FK | M.E., MAQ., Útil., etc. |
| lugar | string | Escena, Varas, Plataformas, Fosos, etc. |
| descripcion | text | Detalle de la preparación |
| imagenes | array[url] | Referencias visuales |

**Ejemplo real (CARMEN - Pasada Acto I):**

| Depto | Lugar | Descripción |
|-------|-------|-------------|
| M.E. | Varas | Telón negro de boca V-0 + Telón acústico MP abajo |
| M.E. | Plataf. | Rosas 1-4 en posición, con vagones encima |
| M.E. | Fosos | Foso orquesta mediano |
| MAQ. | Escena | Tableros suelo base texturizado montados |
| Útil. | Escena | 28 sillas blancas, mesas en posición |
| Elec. | Escena | Canal 900 + pasillos azules + ojos de buey |
| A/V. | Sala | Publicidad en pantallas laterales |
| Sast. | Escena | Chaqueta Zúñiga colgada en gancho |
| Carac. | Felipe | Pañuelo ensangrentado pelea cigarreras |

---

**RF-TOPS-3: Gestión de TOPs**
- **Prioridad:** MUST
- **Complejidad:** Alta

**Atributos de un TOP:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| numero | string | Numeración única (22, 23, 23.1, 23.2...) |
| parent_top | FK | Para sub-Tops (nullable) |
| ref_partitura_pagina | integer | Página en partitura |
| ref_partitura_linea | integer | Línea en partitura |
| ref_partitura_compas | string | Compás musical |
| ref_timecode | string | Timecode (HH:MM:SS:FF) |
| departamentos | array[FK] | Departamentos implicados |
| descripcion | text | Qué sucede en este TOP |
| observaciones | text | Notas adicionales |
| adjuntos | array[url] | Imágenes, documentos |

**Tipos de Acciones (además de TOPs):**
| Código | Tipo | Descripción |
|--------|------|-------------|
| E | Entrada | Entrada de personaje/elemento |
| M | Mutis | Salida de personaje/elemento |
| INT | Interno | Acción interna |
| Avs | Aviso | Aviso previo |

**Regla de negocio crítica:**
> La numeración de TOPs debe ser única por producción. Los sub-TOPs (23.1, 23.2) permiten insertar acciones sin renumerar el histórico.

---

**RF-TOPS-4: Vistas y Exportación**
- **Prioridad:** MUST
- **Complejidad:** Media

**Vistas disponibles:**
1. **Global Guion:** Todos los elementos del guion completo
2. **Global Tops:** Solo los TOPs de la producción
3. **Departamento Tops:** Filtrado por área técnica específica

**Exportación:**
- Formato: Microsoft Word (.docx)
- Mantener estructura y formato visual
- Incluir imágenes embebidas (opcional)

---

**RF-TOPS-5: Control de Edición y Auditoría**
- **Prioridad:** MUST
- **Complejidad:** Media

**Bloqueo exclusivo:**
- Solo un usuario puede editar un guion simultáneamente
- Timeout de bloqueo configurable (ej: 30 min inactividad)
- Indicador visual de quién está editando

**Historial de cambios:**
- Registro de todas las modificaciones
- Quién, qué, cuándo
- Posibilidad de ver versiones anteriores (solo lectura)

---

**RF-TOPS-6: Visualización en Tiempo Real (EVALUAR PARA FASE 2)**
- **Prioridad:** SHOULD/COULD
- **Complejidad:** Alta

**Funcionalidad:**
- Proyección en pantallas del teatro durante ensayos
- TOP actual llamado (destacado)
- TOPs recientemente llamados
- TOPs próximos a ser llamados
- Control desde tablet por el regidor

---

## 6. Módulo ADMIN - Requisitos Funcionales

**RF-ADMIN-1: Gestión de Usuarios y Roles**
- **Prioridad:** MUST
- **Complejidad:** Media

**Funcionalidades:**
- CRUD de usuarios
- Asignación de roles: Administrador, Colaborador, Consulta
- Autenticación: OAuth 2.0 con Google (Gmail)
- Permisos por módulo (TEMPO, TOPS)

---

**RF-ADMIN-2: Configuración del Sistema**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Configurables:**
- Espacios (salas y almacenes)
- Tipos de actividad y colores
- Departamentos
- Parámetros de sincronización con Google Calendar

---

**RF-ADMIN-3: Entornos**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Entornos requeridos:**
- DEV: Desarrollo y pruebas
- PROD: Producción

---

## 7. Requisitos No Funcionales

### 7.1 Rendimiento
| Métrica | Objetivo |
|---------|----------|
| Usuarios totales | <50 usuarios |
| Editores concurrentes | 5-10 usuarios |
| Latencia API (consultas simples) | <300ms |

> **Nota:** Con <50 usuarios, no se requiere infraestructura de escalado complejo.

### 7.2 Seguridad
- Autenticación OAuth 2.0 con Google
- TLS/HTTPS en todas las comunicaciones
- Cifrado en reposo para documentos sensibles
- RBAC (Role-Based Access Control)
- Cumplimiento RGPD

### 7.3 Disponibilidad
| Métrica | Objetivo |
|---------|----------|
| Uptime | ~99% (estándar) |
| Backups | Diarios |

> **Nota:** No hay requisitos SLA/RTO/RPO específicos. Se usarán valores estándar razonables.

### 7.4 Usabilidad
- Aplicación web responsive (desktop, tablet, móvil)
- Modo cartelería para pantallas digitales
- Vista simplificada para rol Consulta

### 7.5 Compatibilidad
- Import/Export: .xlsx, .csv
- Export Word: .docx
- Integración: Google Calendar, Gmail

### 7.6 Mantenibilidad
- Tests automáticos (unit, integration)
- Documentación técnica
- CI/CD pipeline

---

## 8. Modelo de Datos (Esquema Propuesto)

### 8.1 Entidades Principales

```
┌─────────────────┐     ┌─────────────────┐
│     usuario     │     │      rol        │
├─────────────────┤     ├─────────────────┤
│ id (uuid)       │────▶│ id              │
│ email           │     │ nombre          │
│ nombre          │     │ permisos[]      │
│ rol_id          │     └─────────────────┘
│ created_at      │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    espacio      │     │ tipo_actividad  │
├─────────────────┤     ├─────────────────┤
│ id (uuid)       │     │ id              │
│ nombre          │     │ nombre          │
│ tipo (Sala|Alm) │     │ color (hex)     │
│ gcal_id         │     │ descripcion     │
└─────────────────┘     └─────────────────┘

┌─────────────────────────────────────────┐
│              actividad                   │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ titulo                                   │
│ tipo_actividad_id ──────────────────────▶│
│ espacio_id ─────────────────────────────▶│
│ fecha                                    │
│ hora_inicio                              │
│ hora_fin                                 │
│ departamento_id                          │
│ documentos[] (urls)                      │
│ notas                                    │
│ -- Campos logística (si almacén) --      │
│ tipo_movimiento                          │
│ num_camiones                             │
│ lugar_origen                             │
│ lugar_destino                            │
│ produccion_nombre                        │
│ -- Auditoría --                          │
│ created_at                               │
│ updated_at                               │
│ created_by                               │
└─────────────────────────────────────────┘

┌─────────────────┐
│  departamento   │
├─────────────────┤
│ id              │
│ codigo          │
│ nombre          │
└─────────────────┘
```

### 8.2 Entidades TOPS

```
┌─────────────────────────────────────────┐
│                guion                     │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ produccion_nombre                        │
│ compania                                 │
│ productor                                │
│ responsable_edicion                      │
│ director_escena                          │
│ director_musical                         │
│ version                                  │
│ locked_by (usuario_id, nullable)         │
│ locked_at                                │
│ created_at                               │
│ updated_at                               │
└─────────────────────────────────────────┘
            │
            ▼ 1:N
┌─────────────────────────────────────────┐
│                acto                      │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ guion_id                                 │
│ numero                                   │
│ titulo                                   │
│ orden                                    │
└─────────────────────────────────────────┘
            │
            ▼ 1:N
┌─────────────────────────────────────────┐
│               escena                     │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ acto_id                                  │
│ numero                                   │
│ titulo                                   │
│ orden                                    │
│ es_pasada (boolean)                      │
└─────────────────────────────────────────┘
            │
            ▼ 1:N
┌─────────────────────────────────────────┐
│          elemento_guion                  │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ escena_id                                │
│ tipo (TOP|E|M|INT|Avs|PASADA)           │
│ codigo (ej: "23", "23.1", "E1")         │
│ parent_id (para sub-tops, nullable)      │
│ ref_partitura_pagina                     │
│ ref_partitura_linea                      │
│ ref_partitura_compas                     │
│ ref_timecode                             │
│ descripcion                              │
│ observaciones                            │
│ lugar (para pasadas)                     │
│ orden                                    │
└─────────────────────────────────────────┘
            │
            ▼ N:M
┌─────────────────────────────────────────┐
│    elemento_departamento (junction)      │
├─────────────────────────────────────────┤
│ elemento_id                              │
│ departamento_id                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              adjunto                     │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ elemento_id                              │
│ tipo (imagen|documento)                  │
│ url                                      │
│ nombre_archivo                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         historial_cambios                │
├─────────────────────────────────────────┤
│ id (uuid)                                │
│ guion_id                                 │
│ usuario_id                               │
│ accion                                   │
│ detalle (json)                           │
│ created_at                               │
└─────────────────────────────────────────┘
```

---

## 9. API Contract (Endpoints Principales)

### 9.1 Autenticación
```
POST /auth/google/callback    # OAuth callback
GET  /auth/me                 # Usuario actual
POST /auth/logout             # Cerrar sesión
```

### 9.2 TEMPO - Actividades
```
GET    /api/activities                    # Listar (filtros: space, date, type)
GET    /api/activities/:id                # Detalle
POST   /api/activities                    # Crear
PUT    /api/activities/:id                # Actualizar
DELETE /api/activities/:id                # Eliminar
POST   /api/activities/import             # Importar CSV/XLSX
GET    /api/activities/export             # Exportar CSV/XLSX
```

### 9.3 TEMPO - Configuración
```
GET    /api/spaces                        # Listar espacios
POST   /api/spaces                        # Crear espacio
PUT    /api/spaces/:id                    # Actualizar
DELETE /api/spaces/:id                    # Eliminar

GET    /api/activity-types                # Listar tipos
POST   /api/activity-types                # Crear tipo
PUT    /api/activity-types/:id            # Actualizar
DELETE /api/activity-types/:id            # Eliminar
```

### 9.4 TOPS - Guiones
```
GET    /api/scripts                       # Listar guiones
GET    /api/scripts/:id                   # Detalle completo
POST   /api/scripts                       # Crear guion
PUT    /api/scripts/:id                   # Actualizar metadata
DELETE /api/scripts/:id                   # Eliminar

POST   /api/scripts/:id/lock              # Bloquear para edición
POST   /api/scripts/:id/unlock            # Desbloquear
GET    /api/scripts/:id/history           # Historial de cambios
POST   /api/scripts/:id/export            # Exportar a Word
```

### 9.5 TOPS - Elementos
```
POST   /api/scripts/:id/acts              # Crear acto
PUT    /api/acts/:id                      # Actualizar acto
DELETE /api/acts/:id                      # Eliminar acto

POST   /api/acts/:id/scenes               # Crear escena
PUT    /api/scenes/:id                    # Actualizar escena
DELETE /api/scenes/:id                    # Eliminar escena

POST   /api/scenes/:id/elements           # Crear elemento (TOP, E, M, etc.)
PUT    /api/elements/:id                  # Actualizar elemento
DELETE /api/elements/:id                  # Eliminar elemento
POST   /api/elements/:id/attachments      # Subir adjunto
```

### 9.6 TOPS - Vistas
```
GET    /api/scripts/:id/view/full         # Vista global guion
GET    /api/scripts/:id/view/tops         # Vista solo TOPs
GET    /api/scripts/:id/view/department/:code  # Vista por departamento
```

### 9.7 Admin
```
GET    /api/users                         # Listar usuarios
POST   /api/users                         # Crear usuario
PUT    /api/users/:id                     # Actualizar
DELETE /api/users/:id                     # Eliminar

GET    /api/departments                   # Listar departamentos
POST   /api/departments                   # Crear
PUT    /api/departments/:id               # Actualizar
DELETE /api/departments/:id               # Eliminar
```

---

## 10. Integraciones

### 10.1 Google Calendar
| Aspecto | Detalle |
|---------|---------|
| Tipo | API REST (Google Calendar API v3) |
| Autenticación | OAuth 2.0 |
| Sincronización | **Tiempo real** (webhooks/push notifications) |
| Mapeo | 1 espacio = 1 calendario |
| Configuración | calendar_id configurable por sala (a integrar posteriormente) |
| Fuente de verdad | TEMPO (en conflictos) |

> **Decisión:** La sincronización será en tiempo real. Los IDs de calendarios de Google se configurarán por sala cuando estén disponibles.

### 10.2 Gmail
| Aspecto | Detalle |
|---------|---------|
| Uso | Autenticación OAuth + envío de notificaciones |
| Tipo | Gmail API / SMTP |

### 10.3 Futuras (fuera de MVP)
- ERP/CRM del Teatro (a definir)

---

## 11. Priorización MoSCoW

### MUST (MVP - Obligatorio)
| ID | Requisito |
|----|-----------|
| RF-TEMPO-1 | CRUD de actividades |
| RF-TEMPO-2 | Código de colores |
| RF-TEMPO-3 | Actividades de almacén |
| RF-TEMPO-4 | Alertas básicas |
| RF-TEMPO-5 | Sincronización Google Calendar (básica) |
| RF-TOPS-1 | Editor estructurado de guion |
| RF-TOPS-2 | Elementos de pasada |
| RF-TOPS-3 | Gestión de TOPs |
| RF-TOPS-4 | Vistas y exportación Word |
| RF-TOPS-5 | Control de edición y auditoría |
| RF-ADMIN-1 | Gestión de usuarios y roles |
| RF-ADMIN-2 | Configuración del sistema |

### SHOULD (Alta prioridad post-MVP)
| ID | Requisito |
|----|-----------|
| RF-TEMPO-6 | Importador/Exportador Excel avanzado |
| RF-TEMPO-7 | Modo cartelería |
| RF-ADMIN-2b | Permisos finos por módulo |

### FASE 2 (Post-MVP)
| ID | Requisito | Descripción |
|----|-----------|-------------|
| RF-TEMPO-8 | Detección de conflictos | Alertar automáticamente solapamientos de sala/recursos |
| RF-TEMPO-9 | Plantillas de producción | Reutilizar estructuras típicas (ópera, ballet, concierto) |
| RF-TOPS-6 | Visualización tiempo real | Proyección en pantallas + control tablet regidor |
| RF-TOPS-7 | Biblioteca de elementos | Bloques reutilizables por departamento |
| RF-TOPS-8 | Guiones anteriores | Importar/comparar con producciones previas de la misma obra |
| RF-TOPS-9 | Validación inteligente | Detectar TOPs sin departamento, escenas vacías, etc. |
| RF-TOPS-10 | Versiones de guion | Crear versiones nombradas (v1-pre-ensayo, v2-final) |
| RF-TEMPO-X | Suscripción a salas | Notificaciones personalizadas por espacio |

### FUTURO (Mejoras posteriores)
| ID | Requisito | Descripción |
|----|-----------|-------------|
| RF-INT-X | Integración ERP/CRM | Conexión con sistemas administrativos |
| RF-IA-X | Asistente IA | Sugerencias de programación, detección de omisiones |
| RF-CC-X | Centro de Comando | Dashboard ejecutivo, timeline de temporada |

---

## 12. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Complejidad del modelo de guiones | Alta | Alto | Prototipo de datos incremental; migración progresiva desde Access |
| Cuotas API Google Calendar | Media | Medio | Diseño con backoff exponencial, logs, opción batch |
| Heterogeneidad datos Excel | Alta | Medio | Herramienta de pre-validación; mapeo asistido por UI |
| Adopción por usuarios | Media | Alto | Sesiones formativas; UX intuitiva; soporte inicial |
| Bloqueo de edición en guiones | Baja | Medio | Timeout automático; indicadores claros de estado |

---

## 13. Decisiones de Diseño (Preguntas Resueltas)

### Prioridad A - RESUELTAS ✅

| # | Pregunta | Respuesta | Implicación Técnica |
|---|----------|-----------|---------------------|
| 1 | Número aproximado de usuarios | **<50 usuarios totales** | Infraestructura ligera, no requiere escalado complejo |
| 2 | Sincronización con Google Calendar | **Tiempo real** | Implementar webhooks/push notifications con Google Calendar API |
| 3 | Plantilla canonical TEMPO | **No existe, usar TEMPO 2025-2026.xlsx como referencia** | Diseñar importador flexible basado en estructura actual del Excel |
| 4 | Listado de calendarios Google | **No disponible ahora, cada sala tendrá su calendario** | Diseñar sistema para configurar calendar_id por sala posteriormente |

### Prioridad B - RESUELTAS ✅

| # | Pregunta | Respuesta | Implicación Técnica |
|---|----------|-----------|---------------------|
| 5 | Proyección en pantallas (tablet regidor) | **FASE 2** | Mover RF-TOPS-6 a backlog post-MVP |
| 6 | Requisitos SLA/RTO/RPO específicos | **Descartado** | Usar valores estándar razonables (99% uptime, backups diarios) |

### Prioridad C - RESUELTAS ✅

| # | Pregunta | Respuesta | Implicación Técnica |
|---|----------|-----------|---------------------|
| 7 | Integración ERP/CRM | **Mejoras futuras** | Fuera de alcance MVP y Fase 1 |

---

## 14. Checklist Preparación Kickoff

### Resueltos ✅
- [x] Confirmar número de usuarios por rol → **<50 usuarios totales**
- [x] Plantilla Excel para TEMPO → **Usar TEMPO 2025-2026.xlsx como referencia**
- [x] Definición SLA → **Estándar (99% uptime, backups diarios)**
- [x] Integraciones externas → **ERP/CRM para futuro**
- [x] Guiones de referencia → **Guion CARMEN (único disponible, sin históricos)**
- [x] Entorno de desarrollo → **Local (cloud para producción posterior)**
- [x] Credenciales OAuth → **Se proporcionarán durante el desarrollo**
- [x] Calendarios Google por sala → **Se configurarán posteriormente en la app**

### Estado: ✅ LISTO PARA INICIAR DESARROLLO

---

## 15. Casos de Uso Principales

### CU-01: Planificar Nueva Producción
**Actor:** Coordinador de Producción

| Paso | Acción |
|------|--------|
| 1 | Accede al módulo TEMPO |
| 2 | Selecciona "Nueva Producción" |
| 3 | Introduce datos: nombre, fechas, tipo (ópera/ballet/concierto) |
| 4 | Crea actividades asociadas (montaje, ensayos, funciones, desmontaje) |
| 5 | Sistema detecta conflictos de sala si los hay |
| 6 | Coordinador resuelve conflictos |
| 7 | Sistema sincroniza con Google Calendar |
| 8 | Sistema notifica a jefes de departamento |

**Resultado:** Producción planificada con calendario completo.

---

### CU-02: Crear Guion Técnico
**Actor:** Regidor/a

| Paso | Acción |
|------|--------|
| 1 | Accede al módulo TOPS |
| 2 | Selecciona producción existente |
| 3 | Crea nuevo guion con metadatos (directores, compañía) |
| 4 | Define estructura: actos y escenas |
| 5 | Para cada acto, crea sección "Pasada" |
| 6 | Añade TOPs con numeración, departamentos, descripciones |
| 7 | Adjunta imágenes de referencia |
| 8 | Solicita revisión de jefes de departamento |
| 9 | Incorpora feedback y marca como "Versión Final" |

**Resultado:** Guion técnico completo y validado.

---

### CU-03: Consultar TOPs Durante Ensayo
**Actor:** Técnico de Escena (ej: Jefe de Luces)

| Paso | Acción |
|------|--------|
| 1 | Accede desde tablet al módulo TOPS |
| 2 | Selecciona producción y vista "Mi Departamento" |
| 3 | Sistema muestra solo TOPs de Electricidad |
| 4 | Navega por escenas del acto actual |
| 5 | Consulta detalles de TOP específico |
| 6 | Añade nota personal si es necesario |

**Resultado:** Técnico informado de sus responsabilidades.

---

### CU-04: Gestionar Cambio de Última Hora
**Actor:** Coordinador de Producción

| Paso | Acción |
|------|--------|
| 1 | Recibe solicitud de cambio |
| 2 | Localiza actividad en TEMPO |
| 3 | Modifica fecha/hora/espacio |
| 4 | Sistema detecta impactos (conflictos, departamentos afectados) |
| 5 | Coordinador confirma cambio con justificación |
| 6 | Sistema sincroniza con Google Calendar |
| 7 | Sistema envía notificaciones a afectados |
| 8 | Sistema registra cambio en historial |

**Resultado:** Cambio aplicado con trazabilidad completa.

---

## 16. Beneficios Esperados

### 16.1 Beneficios Cuantificables

| Área | Situación Actual | Con la Solución | Mejora |
|------|------------------|-----------------|--------|
| Tiempo planificación producción | 2-3 días | 4-6 horas | **-70%** |
| Errores por conflictos de sala | 3-4 / mes | <1 / mes | **-75%** |
| Tiempo creación guion técnico | 2 semanas | 3-5 días | **-60%** |
| Tiempo búsqueda información | 15-30 min | <2 min | **-90%** |
| Comunicación de cambios | Manual, incompleta | Automática | **100% cobertura** |

### 16.2 Beneficios Cualitativos

- **Trazabilidad completa:** Saber quién cambió qué y cuándo
- **Conocimiento preservado:** Guiones reutilizables entre temporadas
- **Coordinación mejorada:** Todos trabajan con la misma información
- **Profesionalización:** Documentación de calidad para coproducciones
- **Reducción de estrés:** Menos sorpresas, más previsibilidad
- **Base para mejora continua:** Datos para analizar y optimizar

---

## 17. Diagrama de Arquitectura

```
                         ┌─────────────────────┐
                         │    Google Cloud     │
                         │     (Hosting)       │
                         └──────────┬──────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     │                              │                              │
     │          PLATAFORMA GESTIÓN TEATRO REAL                     │
     │                              │                              │
     │   ┌───────────┐    ┌────────┴────────┐    ┌───────────┐    │
     │   │   TEMPO   │    │     ADMIN       │    │   TOPS    │    │
     │   │           │    │                 │    │           │    │
     │   │ Actividad │    │ Usuarios/Roles  │    │  Guiones  │    │
     │   │ Calendario│    │ Configuración   │    │   TOPs    │    │
     │   │ Alertas   │    │                 │    │  Pasadas  │    │
     │   └─────┬─────┘    └────────┬────────┘    └─────┬─────┘    │
     │         │                   │                   │          │
     └─────────┼───────────────────┼───────────────────┼──────────┘
               │                   │                   │
     ┌─────────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
     │ Google Calendar │   │  Gmail/OAuth  │   │ Export Word   │
     │ (por sala)      │   │               │   │ (.docx)       │
     └─────────────────┘   └───────────────┘   └───────────────┘
               │                   │
               │                   │
     ┌─────────┴───────────────────┴───────────┐
     │              USUARIOS                    │
     │  ┌───────┐  ┌───────────┐  ┌─────────┐  │
     │  │ Admin │  │Colaborador│  │Consulta │  │
     │  └───────┘  └───────────┘  └─────────┘  │
     └─────────────────────────────────────────┘
```

---

## 18. Datos de Entrada (Archivos Actuales)

### TEMPO - Temporada 2025-2026.xlsx
- 12 hojas mensuales (Agosto 2025 - Julio 2026)
- ~400-500 filas por mes
- Columnas: Fecha, Escenario, Sala Gayarre, S.E.P.E, Sala Ballet, Sala Orquesta, Otras Salas
- **Ruta procesada:** `DOC_INICIAL/processed/TEMPO_-_Temporada_2025-2026/`

### CALENDARIO 2025.xlsx
- Gestión logística de almacenes Arganda
- Recogidas y envíos de producciones
- **Ruta procesada:** `DOC_INICIAL/processed/CALENDARIO_2025/`

### Guion Regiduria CARMEN.docx
- Ejemplo completo de guion técnico
- Estructura: Actos → Pasadas → Escenas → TOPs
- Referencia para modelo de datos TOPS

---

## 19. Próximos Pasos

### Inmediato (Arranque)
1. ~~Validar este documento~~ ✅ Documento consolidado y validado
2. ~~Resolver preguntas pendientes~~ ✅ Todas las decisiones tomadas
3. **Definir arquitectura técnica** detallada (frontend, backend, infra)
4. **Configurar entorno de desarrollo** local (repositorio, estructura proyecto)

### Desarrollo MVP
5. **Implementar módulo ADMIN** (usuarios, roles, autenticación)
6. **Implementar módulo TEMPO** (actividades, espacios, calendario)
7. **Implementar módulo TOPS** (guiones, TOPs, pasadas)
8. **Integración Google Calendar** (sincronización tiempo real)

### Post-MVP
9. **Importador Excel** desde datos existentes
10. **Exportación Word** para guiones
11. **Despliegue en cloud** y configuración producción
12. **Sesiones formativas** con usuarios finales

---
