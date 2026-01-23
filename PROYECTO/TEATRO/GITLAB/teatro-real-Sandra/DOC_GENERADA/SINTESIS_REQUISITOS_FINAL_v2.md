# Teatro Real - Síntesis Consolidada de Requisitos v2
## Documento Base para Implementación

---
**Proyecto:** Gestión Interna del Teatro Real
**Versión:** 2.0 CONSOLIDADA
**Fecha:** 2025-01-13
**Fuentes:** Síntesis v1 + TR-Requisitos Generales v1.3 (reuniones 12/12/2025 y 17/12/2025)

---

## Changelog v1 → v2

| Sección | Cambio | Tipo |
|---------|--------|------|
| 4.1 Actividades | +Campos: temporada, descripción | NUEVO |
| 4.1 Espacios | +Atributos: color, capacidad, dimensiones | NUEVO |
| 4.1 Departamentos | +Atributos: descripción, jefe, personal | NUEVO |
| 4.3 Almacén | +Flujo estados: Pendiente→Tránsito→Completado | NUEVO |
| 4.4 Documentación | 2 fuentes: Drive intranet + Local | MODIFICADO |
| 4.8 Clonar | Copiar actividades a otros días/semanas/meses | NUEVO |
| 4.9 Landing TEMPO | Calendario semanal tipo Excel | NUEVO |
| 4.7 Cartelería | 2 vistas: Global + Por Sala | MODIFICADO |
| 5.0 TOPS | Organización por Temporadas | NUEVO |
| 5.4 Landing TOPS | 2 listas: En curso + Mis guiones | NUEVO |
| 5.1 Editor | Emular formato Word exacto | MODIFICADO |
| 5.1 Colores | Código colores elementos guion configurable | NUEVO |
| 6.1 Roles | Gestor, Operador, Visualizador (renombrados) | MODIFICADO |
| 6.2 Drive | Integración Drive intranet | NUEVO |
| 11 Fase 2 | Sistema Reservas de Espacios | NUEVO |

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

### 1.3 Stack Tecnológico (Actual)

- **Frontend:** Angular 18.2 + Angular Material
- **Backend:** Java 8 + Spring Boot 2.7.18
- **Base de datos:** H2 (dev) / PostgreSQL (prod)
- **Almacenamiento:** Drive intranet + S3-compatible para documentos
- **Hosting:** Google Cloud (preferente)
- **Autenticación:** OAuth 2.0 con Google

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
| Otros | Otros departamentos | Varios |

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

### 3.1 Roles del Sistema (ACTUALIZADO v2)

| Rol | Descripción | Permisos | Cantidad Est. |
|-----|-------------|----------|---------------|
| **Administrador** | Configura sistema, gestiona usuarios | Superusuario (acceso total) | 1 máx |
| **Gestor** | Regidor/coordinador - crea y edita contenido | CRUD actividades y guiones | 2-3 |
| **Operador** | Técnico - visualiza y edita su trabajo asignado | Lectura + edición propia | ~10-15 |
| **Visualizador** | Personal consulta - solo lectura | Solo lectura, exportación | ~30-40 |

> **CAMBIO v2:** Roles renombrados y añadido Operador con permisos granulares

### 3.2 Permisos por Módulo (NUEVO v2)

| Rol | TEMPO | TOPS | ADMIN |
|-----|-------|------|-------|
| Administrador | ✅ Total | ✅ Total | ✅ Total |
| Gestor | ✅ CRUD | ✅ CRUD | ❌ |
| Operador | 📖 Lectura + ✏️ Asignado | 📖 Lectura + ✏️ Asignado | ❌ |
| Visualizador | 📖 Solo lectura | 📖 Solo lectura | ❌ |

> **Nota:** Un usuario puede tener acceso solo a TEMPO, solo a TOPS, o a ambos según configuración.

### 3.3 Perfiles de Usuario Detallados

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

---

## 4. Módulo TEMPO - Requisitos Funcionales

### 4.1 Gestión de Actividades (ACTUALIZADO v2)

**RF-TEMPO-1: CRUD de Actividades**
- **Prioridad:** MUST
- **Complejidad:** Media

**Campos de una Actividad (ACTUALIZADO):**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| titulo | string | Sí | Nombre de la producción/evento |
| **temporada** | string | **Sí** | Temporada (ej: "2025-2026") **NUEVO v2** |
| **descripcion** | text | No | Descripción detallada del evento **NUEVO v2** |
| tipo_actividad | enum | Sí | Categoría (determina color) |
| espacio | FK | Sí | Sala o Almacén |
| fecha | date | Sí | Fecha programada |
| hora_inicio | time | Sí | Hora de inicio |
| hora_fin | time | Sí | Hora de finalización |
| departamento | FK | Sí | Departamento responsable |
| documentacion | array[documento] | No | Planos, dossier, partitura (ver 4.4) |
| notas | text | No | Observaciones adicionales |

**Entidad Espacio (ACTUALIZADO v2):**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| nombre | string | Sí | Nombre del espacio |
| tipo | enum | Sí | Sala \| Almacén |
| gcal_id | string | No | ID calendario Google asociado |
| **color** | string | No | Color identificativo **NUEVO v2** |
| **capacidad** | integer | No | Aforo máximo **NUEVO v2** |
| **dimensiones** | string | No | Dimensiones físicas **NUEVO v2** |

**Entidad Departamento (ACTUALIZADO v2):**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| codigo | string | Sí | Código corto (M.E., MAQ., etc.) |
| nombre | string | Sí | Nombre completo |
| **descripcion** | text | No | Descripción del departamento **NUEVO v2** |
| **jefe_id** | FK(usuario) | No | Jefe del departamento **NUEVO v2** |
| **personal** | array[FK(usuario)] | No | Miembros del departamento **NUEVO v2** |

---

### 4.2 Código de Colores por Tipo de Actividad

**RF-TEMPO-2: Código de Colores**
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

### 4.3 Actividades de Almacén - Logística (ACTUALIZADO v2)

**RF-TEMPO-3: Actividades de Almacén**
- **Prioridad:** MUST
- **Complejidad:** Media (actualizado por flujo de estados)

**Campos adicionales para actividades en Almacén:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipo_movimiento | enum | Recogida / Salida |
| num_camiones | integer | Número de camiones |
| lugar_origen | string | Lugar de recogida/salida |
| lugar_destino | string | Lugar de llegada/envío |
| produccion | string | Nombre de la producción |
| **estado** | enum | **Pendiente \| En tránsito \| Completado** **NUEVO v2** |

**Flujo de Estados (NUEVO v2):**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    PENDIENTE    │────▶│   EN TRÁNSITO   │────▶│   COMPLETADO    │
│    (default)    │     │  (btn manual)   │     │  (btn manual)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Reglas de negocio:**
- Estado inicial al crear: "Pendiente"
- Transición a "En tránsito": Botón manual cuando inicia el traslado
- Transición a "Completado": Botón manual cuando llega a destino

---

### 4.4 Documentación Asociada (NUEVO v2)

**RF-TEMPO-3b: Gestión de Documentación**
- **Prioridad:** MUST
- **Complejidad:** Media

**Fuentes de documentos:**

| Fuente | Descripción | Implementación |
|--------|-------------|----------------|
| **Drive Intranet** | Carpetas compartidas en la red del Teatro | Integración con Drive API o ruta de red |
| **Local** | Archivos desde el dispositivo del usuario | Upload tradicional a S3/storage |

**Entidad Documento:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | Identificador único |
| nombre | string | Nombre del archivo |
| tipo | enum | plano \| dossier \| partitura \| horario \| imagen \| otro |
| fuente | enum | drive \| local |
| url | string | URL o ruta al archivo |
| actividad_id | FK | Actividad asociada |

---

### 4.5 Alertas y Notificaciones (ACTUALIZADO v2)

**RF-TEMPO-4: Alertas y Notificaciones**
- **Prioridad:** MUST
- **Complejidad:** Media

**Visualización (NUEVO v2):**
- Sección dedicada en pantalla "Alertas y Notificaciones"
- Relevante al contexto del usuario conectado

**Triggers de alerta:**
- Creación de nueva actividad
- Modificación de fecha, horario o sala
- Cancelación o reprogramación de evento
- Recordatorios de próximas actividades vinculadas al usuario

**Destinatarios:**
- Jefes de departamento afectados por la actividad
- Usuarios vinculados a la actividad
- Usuarios suscritos a la sala específica

---

### 4.6 Sincronización con Google Calendar

**RF-TEMPO-5: Sincronización Google Calendar**
- **Prioridad:** MUST
- **Complejidad:** Alta

**Requisitos:**
- Sincronización bidireccional (crear/modificar/eliminar)
- Cada sala tiene un calendario de Google asociado
- Autenticación mediante OAuth 2.0
- Control de cuotas y manejo de errores
- **Incluir toda la información relevante en el evento de Google Calendar**
- **Incluir enlaces a documentos adjuntos**

**Reglas de negocio:**
- Actividad en TEMPO → se crea/actualiza evento en Google Calendar correspondiente
- Conflicto de sincronización → TEMPO es fuente de verdad (master)

---

### 4.7 Modo Cartelería (ACTUALIZADO v2)

**RF-TEMPO-7: Modo Cartelería Digital**
- **Prioridad:** SHOULD
- **Complejidad:** Media (actualizado por vistas adicionales)

**Vistas disponibles (NUEVO v2):**

| Vista | URL | Descripción |
|-------|-----|-------------|
| **Global** | `/carteleria/global` | Todas las salas del día en una pantalla |
| **Por Sala** | `/carteleria/{espacio_id}` | Actividades de una sala específica |

**Características:**
- Actualización automática cada X minutos (configurable)
- Diseño optimizado para pantallas digitales (landscape)
- Vista Global: Todas las salas visibles en una sola pantalla, limpia y visible
- Vista Por Sala: Detalle de actividades de esa sala

---

### 4.8 Clonar Actividades (NUEVO v2)

**RF-TEMPO-8: Clonar/Copiar Actividades**
- **Prioridad:** SHOULD
- **Complejidad:** Baja

**Funcionalidad:**
- Copiar una actividad existente a otra fecha
- Opciones de destino: día específico, semana, mes
- Mantiene todos los campos excepto fecha
- Disponible para actividades de Salas y Almacenes

**Historia de Usuario:**
```
Como Gestor
quiero clonar una actividad existente a otras fechas
para agilizar el trabajo reutilizando información.
```

---

### 4.9 Landing Page TEMPO (NUEVO v2)

**RF-TEMPO-9: Vista Principal Calendario**
- **Prioridad:** MUST
- **Complejidad:** Alta

**Descripción:**
Landing page para usuarios con acceso a TEMPO = Calendario semanal tipo Excel

**Especificaciones de la vista:**

```
┌─────────┬──────────┬───────────┬───────────┬───────────┬─────────┐
│  Día    │  Franja  │ Escenario │   SEPE    │  Ballet   │  ...    │
│  Fecha  │  Horaria │           │           │           │         │
├─────────┼──────────┼───────────┼───────────┼───────────┼─────────┤
│ Lunes   │ 09:00    │ [Ensayo]  │           │ [Clase]   │         │
│ 13/01   │ 10:00    │  Carmen   │ [Montaje] │  Ballet   │         │
│         │ 11:00    │           │  Otello   │           │         │
├─────────┼──────────┼───────────┼───────────┼───────────┼─────────┤
│ Martes  │ 09:00    │ [Función] │           │           │         │
│ 14/01   │ ...      │  Carmen   │           │           │         │
└─────────┴──────────┴───────────┴───────────┴───────────┴─────────┘
```

**Características:**
- Semana actual completa (lunes a domingo)
- Primera columna: día de la semana + fecha
- Segunda columna: franjas horarias
- Columnas siguientes: una por cada sala
- Actividades con código de colores
- Click en actividad → detalle completo
- Navegación entre semanas/meses
- Filtros: salas, nombre evento, tipo actividad

---

### 4.10 Importador/Exportador Excel/CSV

**RF-TEMPO-6: Importador/Exportador**
- **Prioridad:** SHOULD
- **Complejidad:** Alta

**Funcionalidades:**
- Importar hojas mensuales desde plantillas TEMPO existentes
- Exportar calendario por sala/mes
- Mapeo asistido de columnas (UI para seleccionar correspondencias)

**Consideraciones especiales (de v1.3):**
- Interpretar colores de celdas para determinar tipo de actividad
- Manejar celdas agrupadas vs desagrupadas
- Manejar columnas que contienen múltiples salas

---

### 4.11 Filtros y Búsqueda

**RF-TEMPO-10: Filtros de Búsqueda**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Criterios de filtrado:**
- Temporada
- Año
- Mes
- Semana
- Día
- Tipo de espacio (Sala/Almacén)
- Espacio específico
- Tipo de actividad
- Nombre de evento/actividad

---

## 5. Módulo TOPS - Requisitos Funcionales

### 5.0 Organización por Temporadas (NUEVO v2)

**RF-TOPS-0: Guiones por Temporada**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Descripción:**
Los guiones deben organizarse y filtrarse por temporadas.

**Entidad Guion (campo adicional):**
| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| **temporada** | string | Sí |

---

### 5.1 Estructura del Guion Técnico (ACTUALIZADO v2)

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

**Requisitos del Editor (ACTUALIZADO v2):**
- **Emular formato Word exacto** - Mantener estructura de tablas y columnas del documento actual
- Soporte para adjuntar imágenes y documentos por elemento
- Bloqueo exclusivo de edición (1 editor a la vez)
- Interfaz drag-and-drop para reordenar elementos
- **Código de colores configurable** para tipos de elementos

**Código de Colores Elementos (NUEVO v2):**
| Tipo Elemento | Color Default | Configurable |
|---------------|---------------|--------------|
| TOP | A definir | ✅ |
| Entrada (E) | A definir | ✅ |
| Mutis (M) | A definir | ✅ |
| Interno (INT) | A definir | ✅ |
| Aviso (Avs) | A definir | ✅ |
| Pasada | A definir | ✅ |

---

### 5.2 Elementos de la Pasada

**RF-TOPS-2: Elementos de Pasada**
- **Prioridad:** MUST
- **Complejidad:** Media

**Campos de un elemento de Pasada:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| identificacion | string | Ej: "Pasada Acto I" |
| departamento | FK | M.E., MAQ., Útil., etc. |
| lugar | string | Escena, Varas, Plataformas, Fosos, etc. |
| descripcion | text | Detalle de la preparación |
| imagenes | array[url] | Referencias visuales |

---

### 5.3 Gestión de TOPs

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
| descripcion | text | Quién/Qué - descripción de la acción |
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

### 5.4 Landing Page TOPS (NUEVO v2)

**RF-TOPS-4b: Vista Principal TOPS**
- **Prioridad:** MUST
- **Complejidad:** Media

**Contenido del Landing Page:**

| Sección | Descripción |
|---------|-------------|
| **Guiones en curso** | Lista de todos los guiones activos de la temporada actual |
| **Mis guiones** | Lista de guiones donde el usuario está involucrado |

**Filtros disponibles:**
- Por temporada
- Por estado (en edición, finalizado, etc.)

---

### 5.5 Vistas y Exportación

**RF-TOPS-4: Vistas y Exportación**
- **Prioridad:** MUST
- **Complejidad:** Media

**Vistas disponibles:**
1. **Global Guion:** Todos los elementos del guion completo
2. **Global Tops:** Solo los TOPs de la producción
3. **Departamento Tops:** Filtrado por área técnica específica

**Exportación:**
- Formato: Microsoft Word (.docx)
- Mantener estructura y formato visual (tablas)
- Incluir imágenes embebidas (opcional)
- Exportar cualquiera de las 3 vistas

---

### 5.6 Control de Edición y Auditoría

**RF-TOPS-5: Control de Edición y Auditoría**
- **Prioridad:** MUST
- **Complejidad:** Media

**Bloqueo exclusivo:**
- Solo un usuario puede editar un guion simultáneamente
- **Bloqueo a nivel de guion completo** (no por sección)
- Timeout de bloqueo configurable (ej: 30 min inactividad)
- Indicador visual de quién está editando

**Historial de cambios:**
- Registro de todas las modificaciones
- Quién, qué, cuándo
- Cambios visibles a todos los usuarios con permisos de lectura una vez confirmados
- Posibilidad de ver versiones anteriores (solo lectura)

---

### 5.7 Visualización en Tiempo Real (FASE 2)

**RF-TOPS-6: Visualización en Tiempo Real**
- **Prioridad:** SHOULD/COULD
- **Complejidad:** Alta
- **Fase:** 2

**Funcionalidad:**
- Proyección en pantallas del teatro durante ensayos
- TOP actual llamado (destacado)
- TOPs recientemente llamados
- TOPs próximos a ser llamados
- Control desde tablet por el regidor

---

## 6. Módulo ADMIN - Requisitos Funcionales

### 6.1 Gestión de Usuarios y Roles (ACTUALIZADO v2)

**RF-ADMIN-1: Gestión de Usuarios y Roles**
- **Prioridad:** MUST
- **Complejidad:** Media

**Funcionalidades:**
- Crear, editar, desactivar usuarios (no eliminar - soft delete)
- Asignación de roles: **Administrador, Gestor, Operador, Visualizador**
- Autenticación: OAuth 2.0 con Google (Gmail)
- **Permisos configurables por módulo** (TEMPO, TOPS)

**Roles (ACTUALIZADO v2):**

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Administrador** | Superusuario - acceso total | CRUD todo + config sistema |
| **Gestor** | Crea y edita actividades/guiones | CRUD actividades, CRUD guiones |
| **Operador** | Visualiza y edita su trabajo asignado | Lectura + edición tareas propias |
| **Visualizador** | Solo lectura (auditorías, reportes) | Solo lectura |

---

### 6.2 Integración con Drive (NUEVO v2)

**RF-ADMIN-4: Integración Drive Intranet**
- **Prioridad:** MUST
- **Complejidad:** Media

**Funcionalidad:**
- Acceso a carpetas compartidas en la intranet del Teatro
- Adjuntar documentos desde Drive a actividades y guiones
- Usuarios con permisos adecuados pueden navegar y seleccionar archivos

---

### 6.3 Configuración del Sistema

**RF-ADMIN-2: Configuración del Sistema**
- **Prioridad:** MUST
- **Complejidad:** Baja

**Configurables:**
- Espacios (salas y almacenes) con atributos extendidos
- Tipos de actividad y colores
- Departamentos con jefe y personal
- Parámetros de sincronización con Google Calendar
- **Colores de elementos de guion** (NUEVO v2)
- **Temporadas activas** (NUEVO v2)

---

### 6.4 Entornos

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

### 7.2 Seguridad
- Autenticación OAuth 2.0 con Google
- TLS/HTTPS en todas las comunicaciones
- Cifrado en reposo para documentos sensibles
- RBAC (Role-Based Access Control) con permisos por módulo
- Cumplimiento RGPD

### 7.3 Disponibilidad
| Métrica | Objetivo |
|---------|----------|
| Uptime | ~99% (estándar) |
| Backups | Diarios |

### 7.4 Usabilidad
- Aplicación web **responsive** (desktop, tablet, móvil)
- Teclado virtual en formato móvil para campos de edición
- Modo cartelería para pantallas digitales
- Vista adaptada por perfil (consulta, edición, administración)

### 7.5 Compatibilidad
- Import/Export: .xlsx, .csv
- Export Word: .docx
- Integración: Google Calendar, Gmail, Drive

### 7.6 Mantenibilidad
- Tests automáticos (unit, integration)
- Documentación técnica
- CI/CD pipeline

---

## 8. Modelo de Datos (Esquema Actualizado v2)

### 8.1 Entidades Principales

```
┌─────────────────────┐     ┌─────────────────┐
│      usuario        │     │      rol        │
├─────────────────────┤     ├─────────────────┤
│ id (uuid)           │────▶│ id              │
│ email               │     │ nombre          │
│ nombre              │     │ permisos[]      │
│ rol_id              │     │ modulos[]       │ ← NUEVO: permisos por módulo
│ activo              │     └─────────────────┘
│ created_at          │
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────┐
│      espacio        │     │ tipo_actividad  │
├─────────────────────┤     ├─────────────────┤
│ id (uuid)           │     │ id              │
│ nombre              │     │ nombre          │
│ tipo (Sala|Alm)     │     │ color (hex)     │
│ gcal_id             │     │ tipo_espacio    │
│ color        ← NUEVO│     │ descripcion     │
│ capacidad    ← NUEVO│     └─────────────────┘
│ dimensiones  ← NUEVO│
└─────────────────────┘

┌─────────────────────┐
│    departamento     │
├─────────────────────┤
│ id                  │
│ codigo              │
│ nombre              │
│ descripcion  ← NUEVO│
│ jefe_id      ← NUEVO│ FK → usuario
└─────────────────────┘

┌─────────────────────┐
│ departamento_usuario│ ← NUEVO: N:M
├─────────────────────┤
│ departamento_id     │
│ usuario_id          │
└─────────────────────┘
```

### 8.2 Entidades Actividad (Actualizado)

```
┌─────────────────────────────────────────────┐
│                actividad                     │
├─────────────────────────────────────────────┤
│ id (uuid)                                    │
│ titulo                                       │
│ temporada                            ← NUEVO │
│ descripcion                          ← NUEVO │
│ tipo_actividad_id ──────────────────────────▶│
│ espacio_id ─────────────────────────────────▶│
│ fecha                                        │
│ hora_inicio                                  │
│ hora_fin                                     │
│ departamento_id                              │
│ notas                                        │
│ -- Campos logística (si almacén) --          │
│ tipo_movimiento                              │
│ num_camiones                                 │
│ lugar_origen                                 │
│ lugar_destino                                │
│ produccion_nombre                            │
│ estado (Pendiente|Transito|Completado) ←NUEVO│
│ -- Auditoría --                              │
│ created_at                                   │
│ updated_at                                   │
│ created_by                                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              documento                       │ ← NUEVO
├─────────────────────────────────────────────┤
│ id (uuid)                                    │
│ nombre                                       │
│ tipo (plano|dossier|partitura|horario|otro)  │
│ fuente (drive|local)                         │
│ url                                          │
│ actividad_id (nullable)                      │
│ elemento_guion_id (nullable)                 │
│ created_at                                   │
└─────────────────────────────────────────────┘
```

### 8.3 Entidades TOPS (Actualizado)

```
┌─────────────────────────────────────────────┐
│                 guion                        │
├─────────────────────────────────────────────┤
│ id (uuid)                                    │
│ temporada                            ← NUEVO │
│ produccion_nombre                            │
│ compania                                     │
│ productor                                    │
│ responsable_edicion                          │
│ director_escena                              │
│ director_musical                             │
│ version                                      │
│ locked_by (usuario_id, nullable)             │
│ locked_at                                    │
│ created_at                                   │
│ updated_at                                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          color_elemento_guion                │ ← NUEVO
├─────────────────────────────────────────────┤
│ id                                           │
│ tipo_elemento (TOP|E|M|INT|Avs|PASADA)       │
│ color (hex)                                  │
└─────────────────────────────────────────────┘
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
GET    /api/activities                    # Listar (filtros: space, date, type, temporada)
GET    /api/activities/:id                # Detalle
POST   /api/activities                    # Crear
PUT    /api/activities/:id                # Actualizar
DELETE /api/activities/:id                # Eliminar
POST   /api/activities/:id/clone          # Clonar actividad ← NUEVO
POST   /api/activities/:id/status         # Cambiar estado (almacén) ← NUEVO
POST   /api/activities/import             # Importar CSV/XLSX
GET    /api/activities/export             # Exportar CSV/XLSX
```

### 9.3 TEMPO - Documentos (NUEVO)
```
GET    /api/documents                     # Listar documentos
POST   /api/documents                     # Subir documento
DELETE /api/documents/:id                 # Eliminar documento
GET    /api/drive/browse                  # Navegar Drive intranet
```

### 9.4 TEMPO - Configuración
```
GET    /api/spaces                        # Listar espacios
POST   /api/spaces                        # Crear espacio
PUT    /api/spaces/:id                    # Actualizar
DELETE /api/spaces/:id                    # Eliminar

GET    /api/activity-types                # Listar tipos
POST   /api/activity-types                # Crear tipo
PUT    /api/activity-types/:id            # Actualizar
DELETE /api/activity-types/:id            # Eliminar

GET    /api/departments                   # Listar departamentos
POST   /api/departments                   # Crear
PUT    /api/departments/:id               # Actualizar
DELETE /api/departments/:id               # Eliminar
PUT    /api/departments/:id/staff         # Gestionar personal ← NUEVO
```

### 9.5 TOPS - Guiones
```
GET    /api/scripts                       # Listar guiones (filtro: temporada)
GET    /api/scripts/mine                  # Mis guiones ← NUEVO
GET    /api/scripts/:id                   # Detalle completo
POST   /api/scripts                       # Crear guion
PUT    /api/scripts/:id                   # Actualizar metadata
DELETE /api/scripts/:id                   # Eliminar

POST   /api/scripts/:id/lock              # Bloquear para edición
POST   /api/scripts/:id/unlock            # Desbloquear
GET    /api/scripts/:id/history           # Historial de cambios
POST   /api/scripts/:id/export            # Exportar a Word
```

### 9.6 TOPS - Elementos
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
PUT    /api/elements/reorder              # Reordenar elementos ← NUEVO
```

### 9.7 TOPS - Vistas
```
GET    /api/scripts/:id/view/full         # Vista global guion
GET    /api/scripts/:id/view/tops         # Vista solo TOPs
GET    /api/scripts/:id/view/department/:code  # Vista por departamento
```

### 9.8 Admin
```
GET    /api/users                         # Listar usuarios
POST   /api/users                         # Crear usuario
PUT    /api/users/:id                     # Actualizar
PUT    /api/users/:id/deactivate          # Desactivar (soft delete)
PUT    /api/users/:id/permissions         # Configurar permisos módulo ← NUEVO

GET    /api/config/element-colors         # Colores elementos guion ← NUEVO
PUT    /api/config/element-colors         # Actualizar colores ← NUEVO
GET    /api/config/seasons                # Temporadas ← NUEVO
POST   /api/config/seasons                # Crear temporada ← NUEVO
```

### 9.9 Cartelería
```
GET    /api/signage/global                # Vista global todas las salas ← NUEVO
GET    /api/signage/:espacio_id           # Vista por sala
```

### 9.10 Notificaciones (NUEVO)
```
GET    /api/notifications                 # Mis notificaciones
PUT    /api/notifications/:id/read        # Marcar como leída
GET    /api/notifications/unread-count    # Contador no leídas
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
| Contenido evento | Toda la info + enlaces a documentos |
| Fuente de verdad | TEMPO (en conflictos) |

### 10.2 Gmail
| Aspecto | Detalle |
|---------|---------|
| Uso | Autenticación OAuth |
| Tipo | OAuth 2.0 |

### 10.3 Drive Intranet (NUEVO v2)
| Aspecto | Detalle |
|---------|---------|
| Uso | Adjuntar documentos desde carpetas compartidas |
| Tipo | Drive API o acceso a ruta de red |
| Permisos | Según configuración de usuario |

---

## 11. Priorización MoSCoW (Actualizada v2)

### MUST (MVP - Obligatorio)
| ID | Requisito |
|----|-----------|
| RF-TEMPO-1 | CRUD de actividades (con temporada, descripción) |
| RF-TEMPO-2 | Código de colores |
| RF-TEMPO-3 | Actividades de almacén con flujo de estados |
| RF-TEMPO-3b | Gestión documentación (drive + local) |
| RF-TEMPO-4 | Alertas y notificaciones en pantalla |
| RF-TEMPO-5 | Sincronización Google Calendar |
| RF-TEMPO-9 | Landing page calendario semanal |
| RF-TEMPO-10 | Filtros de búsqueda |
| RF-TOPS-0 | Organización por temporadas |
| RF-TOPS-1 | Editor estructurado de guion (formato Word) |
| RF-TOPS-2 | Elementos de pasada |
| RF-TOPS-3 | Gestión de TOPs |
| RF-TOPS-4 | Vistas y exportación Word |
| RF-TOPS-4b | Landing page TOPS (en curso + mis guiones) |
| RF-TOPS-5 | Control de edición y auditoría |
| RF-ADMIN-1 | Gestión usuarios y roles (4 roles + permisos módulo) |
| RF-ADMIN-2 | Configuración del sistema |
| RF-ADMIN-4 | Integración Drive intranet |

### SHOULD (Alta prioridad post-MVP)
| ID | Requisito |
|----|-----------|
| RF-TEMPO-6 | Importador/Exportador Excel avanzado |
| RF-TEMPO-7 | Modo cartelería (global + por sala) |
| RF-TEMPO-8 | Clonar actividades |

### FASE 2 (Post-MVP)
| ID | Requisito | Descripción |
|----|-----------|-------------|
| RF-TEMPO-11 | **Reservas de Espacios** | Sistema solicitud/aprobación de reservas **NUEVO** |
| RF-TEMPO-8b | Detección de conflictos | Alertar solapamientos de sala/recursos |
| RF-TEMPO-9b | Plantillas de producción | Reutilizar estructuras típicas |
| RF-TOPS-6 | Visualización tiempo real | Proyección pantallas + control tablet |
| RF-TOPS-7 | Biblioteca de elementos | Bloques reutilizables por departamento |
| RF-TOPS-8 | Guiones anteriores | Importar/comparar producciones previas |

---

## 12. Sistema de Reservas de Espacios (FASE 2 - NUEVO v2)

**RF-TEMPO-11: Reservas de Espacios**
- **Prioridad:** FASE 2
- **Complejidad:** Media

**Flujo de reserva:**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  SOLICITUD   │────▶│   REVISIÓN   │────▶│  APROBADA /  │
│  (Usuario)   │     │   (Gestor)   │     │  RECHAZADA   │
└──────────────┘     └──────────────┘     └──────────────┘
```

**Campos de solicitud:**
- Sala
- Fecha
- Hora inicio y fin
- Título de la actividad
- Descripción
- Tipo de actividad
- Departamento responsable

**Acciones del Gestor:**
- **Rechazar:** Notificación al solicitante, solicitud descartada
- **Aceptar:** Notificación al solicitante, actividad creada automáticamente

---

## 13. Próximos Pasos

### Inmediato
1. ✅ Analizar documento v1.3
2. ✅ Crear síntesis v2 actualizada
3. **Actualizar PLAN_IMPLEMENTACION_BACKEND.md**
4. **Actualizar PLAN_IMPLEMENTACION_FRONTEND.md**
5. **Revisar impacto en código existente**

### Desarrollo MVP (Actualizado)
6. Actualizar modelo de datos con nuevos campos
7. Implementar nuevos endpoints API
8. Actualizar UI con landing pages específicos
9. Implementar flujo estados almacén
10. Integrar con Drive intranet

---

## 14. Resumen de Impacto en Código Existente

### Backend
| Área | Cambios Necesarios |
|------|-------------------|
| Entidad Actividad | +temporada, +descripcion, +estado |
| Entidad Espacio | +color, +capacidad, +dimensiones |
| Entidad Departamento | +descripcion, +jefe_id, +relación N:M usuarios |
| Entidad Guion | +temporada |
| Nueva Entidad | Documento (fuente drive/local) |
| Nueva Entidad | ColorElementoGuion |
| Nueva Entidad | Notificacion |
| Endpoints | +clone, +status, +drive/browse, +signage/global, +notifications |
| Roles | Renombrar Colaborador→Gestor, +Operador, +Visualizador |

### Frontend
| Área | Cambios Necesarios |
|------|-------------------|
| Landing TEMPO | Calendario semanal tipo Excel (nueva vista) |
| Landing TOPS | 2 listas: en curso + mis guiones |
| Cartelería | +Vista global |
| Formulario Actividad | +temporada, +descripcion, +selector documentos |
| Formulario Espacio | +color, +capacidad, +dimensiones |
| Panel Almacén | +Botones cambio estado |
| Editor Guion | Mejorar para emular Word |
| Notificaciones | Sección en header/sidebar |
| Admin Roles | Actualizar gestión 4 roles |

---

**Documento generado:** 2025-01-13
**Basado en:** TR-Requisitos Generales v1.3 (reuniones 12/12/2025 y 17/12/2025)
