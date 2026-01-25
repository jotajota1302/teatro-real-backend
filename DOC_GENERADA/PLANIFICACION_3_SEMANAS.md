# Teatro Real - Planificación Desarrollo 3 Semanas
## Equipo: Fran + Sandra | Supervisor: Sergio

---

**Período:** 3 semanas (15 días laborables)
**Metodología:** Desarrollo asistido por agentes de codificación (Claude Code)
**Estimación base:** ~512h pendientes
**Factor productividad IA:** x2.5 → ~205h efectivas necesarias
**Capacidad equipo:** 2 devs × 15 días × 6h productivas = 180h + supervisión

---

## Resumen Ejecutivo

| Semana | Fran (Backend focus) | Sandra (Frontend focus) | Sergio (Validación) | Estado |
|--------|---------------------|------------------------|---------------------|--------|
| **S1** | Auth + Entidades base | Auth + Layout + Componentes shared | Daily review código | ✅ Completado |
| **S2** | TEMPO + Logística API | TEMPO + Logística UI | Sprint review miércoles | ✅ Completado |
| **S3** | TOPS API + Integraciones | TOPS UI + Cartelería | Demo final viernes | ⏳ En Progreso |

---

## Semana 1: Fundamentos (Auth + Base)

### Lunes S1

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidades JPA: Usuario, Rol (4 roles), Departamento | 4h | Generar con prompt estructurado |
| **Fran** | Entidades JPA: Temporada, PermisoModulo | 2h | Añadir a mismo prompt |
| **Sandra** | Modelos TypeScript actualizados v2 (auth.models.ts) | 2h | Basarse en plan frontend v2 |
| **Sandra** | AuthService con signals (4 roles) | 3h | Incluir computed signals |
| **Sergio** | Review: Validar modelos coinciden backend/frontend | 1h | EOD |

**Entregable:** Modelos de datos alineados backend ↔ frontend

### Martes S1

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Migración V1: Schema completo (todas las tablas) | 3h | SQL con constraints |
| **Fran** | Migración V2: Datos semilla (roles, temporada inicial) | 2h | INSERT statements |
| **Fran** | SecurityConfig + JWT básico | 3h | Spring Security config |
| **Sandra** | AuthGuard + RoleGuard + ModulePermissionGuard | 3h | Guards con inject() |
| **Sandra** | Auth Interceptor (JWT header) | 2h | HttpInterceptorFn |
| **Sergio** | Review: Flujo auth completo | 1h | EOD |

**Entregable:** Autenticación JWT funcional

### Miércoles S1

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | AuthController (login, me, logout, refresh) | 3h | REST endpoints |
| **Fran** | UsuarioService + UsuarioController | 3h | CRUD usuarios |
| **Sandra** | Página Login (Material + formulario) | 3h | Standalone component |
| **Sandra** | TemporadaService + TemporadaSelector component | 3h | Con selector dropdown |
| **Sergio** | **CHECKPOINT:** Login E2E funcionando | 2h | Test manual completo |

**Entregable:** Login funcional frontend → backend

### Jueves S1

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | TemporadaService + TemporadaController | 2h | CRUD + activar |
| **Fran** | Actualizar Espacio.java (campos v2: color, dimensiones) | 1h | Añadir campos |
| **Fran** | DepartamentoService + DepartamentoController | 3h | Con jefe y personal |
| **Sandra** | NotificationService (polling cada 30s) | 2h | Con signals |
| **Sandra** | NotificationBell component (header) | 2h | Badge + dropdown |
| **Sandra** | Actualizar Header con NotificationBell + TemporadaSelector | 2h | Integrar en navbar |
| **Sergio** | Review: Componentes header integrados | 1h | EOD |

**Entregable:** Header completo con temporada + notificaciones

### Viernes S1

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Tests unitarios Auth (JUnit) | 3h | Mínimo 70% coverage auth |
| **Fran** | Documentar endpoints Swagger (anotaciones) | 2h | @Operation, @ApiResponse |
| **Sandra** | Shared components: StatusBadge, ColorPicker | 3h | Reutilizables |
| **Sandra** | Tests unitarios Auth frontend (Jasmine) | 2h | AuthService tests |
| **Sergio** | **SPRINT REVIEW S1** | 2h | Demo + feedback |

### Entregables Semana 1 ✅ COMPLETADO
- [x] Autenticación JWT con 4 roles funcionando
- [x] Login/logout operativo
- [x] Header con selector temporada y notificaciones
- [x] Entidades base creadas (Usuario, Rol, Departamento, Temporada, PermisoModulo)
- [ ] Tests básicos auth (pendiente para Sprint 5)

---

## Semana 2: Módulos TEMPO + Logística

### Lunes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidad TipoActividad + Repository + Service + Controller | 4h | CRUD completo |
| **Fran** | Entidad Actividad (v2: temporadaId, descripcion, estado) | 3h | Con enums |
| **Sandra** | Modelos TypeScript TEMPO (actividad.model.ts completo) | 2h | Interfaces v2 |
| **Sandra** | ActividadService + EspacioService + TipoActividadService | 4h | Con métodos v2 |
| **Sergio** | Review: Modelos TEMPO alineados | 1h | EOD |

**Entregable:** Capa de datos TEMPO completa

### Martes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | ActividadController: CRUD + filtros (espacio, tipo, temporada, fecha) | 4h | Query params |
| **Fran** | POST /actividades/{id}/clone | 2h | Clonar a nueva fecha |
| **Fran** | PUT /actividades/{id}/status | 2h | Máquina estados almacén |
| **Sandra** | Instalar y configurar FullCalendar | 2h | npm + módulos |
| **Sandra** | CalendarioComponent base con FullCalendar | 4h | Eventos + vistas |
| **Sergio** | Review: API TEMPO + Calendario base | 1h | EOD |

**Entregable:** API TEMPO completa + Calendario visual

### Miércoles S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidad ActividadDocumento (origen: LOCAL/DRIVE) | 2h | |
| **Fran** | Endpoint upload documentos actividad | 3h | MultipartFile |
| **Fran** | GET /signage/global (cartelería todas las salas) | 2h | DTO especial |
| **Sandra** | WeeklyExcelView component (landing TEMPO) | 5h | Tabla estilo Excel |
| **Sandra** | TEMPO Landing component (contenedor) | 2h | Tabs: Excel / Calendario |
| **Sergio** | **CHECKPOINT:** Landing TEMPO funcionando | 2h | Test manual |

**Entregable:** Landing TEMPO con vista semanal Excel

### Jueves S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Migración V3: Datos semilla (espacios, tipos actividad) | 2h | INSERT realistas |
| **Fran** | Tests ActividadService (clone, status) | 3h | JUnit |
| **Sandra** | Dialog Actividad (crear/editar) con campos v2 | 4h | Material Dialog |
| **Sandra** | Actividad Status Control (botones transición estados) | 2h | Para almacén |
| **Sandra** | Actividad Clone Dialog | 2h | Selector fecha destino |
| **Sergio** | Review: Flujos actividad completos | 1h | EOD |

**Entregable:** CRUD actividades completo con estados y clone

### Jueves S2 (Logística - según requisitos v1.3)

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidad OperacionLogistica completa (campos v1.3) | 3h | Ver nota campos |
| **Fran** | Entidad Almacen (Arganda-Campa, Arganda-Nave) | 1h | Tipo espacio=ALMACEN |
| **Fran** | LogisticaRepository + LogisticaService | 3h | CRUD + filtros + estados |
| **Sandra** | LogisticaComponent (landing con calendario) | 4h | Vista mes/semana/día |
| **Sandra** | LogisticaService frontend (filtros completos) | 2h | Signals |
| **Sergio** | Review: Flujos logística | 1h | EOD |

> **Campos OperacionLogistica (v1.3):**
> - tipo: RECOGIDA (verde) / SALIDA (rosa)
> - fechaProgramada, numeroCamiones
> - lugarOrigen, lugarDestino (para recogida: origen externo → Arganda-Campa/Nave)
> - estado: PENDIENTE_INICIO → EN_TRANSITO → COMPLETADO
> - actividadId (relación opcional con actividad TEMPO)

**Entregable:** Landing Logística con calendario por almacén

### Viernes S2

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | LogisticaController (CRUD + filtros + cambio estado) | 3h | REST endpoints |
| **Fran** | Admin: CRUD Espacios (tipo SALA/ALMACEN) | 2h | Controller completo |
| **Fran** | Admin: CRUD TiposActividad (con colores) | 2h | Controller completo |
| **Sandra** | Calendario Logística (FullCalendar para almacenes) | 4h | Colores: verde/rosa |
| **Sandra** | Dialog Operación Logística (crear/editar con campos v1.3) | 3h | Material Dialog |
| **Sandra** | Botones transición estado (Pendiente→Tránsito→Completado) | 2h | Con confirmación |
| **Sandra** | Admin: Lista + Form Espacios, TiposActividad, Departamentos | 2h | Material components |
| **Sergio** | **SPRINT REVIEW S2** | 2h | Demo TEMPO + Logística |

### Entregables Semana 2 ✅ COMPLETADO
- [x] Landing TEMPO con vista semanal Excel
- [x] Calendario FullCalendar integrado (TEMPO) - mes/semana/día sin scroll
- [x] Modal "Nueva Actividad" en calendario
- [x] CRUD actividades con estados almacén
- [x] Clonar actividades funcionando
- [x] **Landing Logística con calendario (mes/semana/día)**
- [x] **Calendario Logística por almacén (Arganda-Campa, Arganda-Nave)**
- [x] **CRUD operaciones logística (RECOGIDA verde/SALIDA rosa)** - Backend + Frontend completo
- [x] **Campos v1.3: nº camiones, lugar origen/destino**
- [x] **Botones transición: Pendiente → En tránsito → Completado**
- [x] **Filtros: por almacén, tipo, temporada, fecha**
- [x] Admin: Espacios (SALA/ALMACEN) - Dashboard completo
- [x] Admin: Tipos, Departamentos
- [x] Filtros por temporada operativos
- [x] **Backend CRUD completo: POST/PUT/DELETE /api/logistica/operaciones**
- [x] **Manejo errores: error banners + retry cuando backend no disponible**

> **Nota (2026-01-25):** TEMPO completado al 100%. Backend y Frontend totalmente funcionales.
> Sin fallbacks silenciosos - errores se muestran claramente al usuario.

---

## Semana 3: TOPS + Integraciones + Cierre

### Lunes S3

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Entidades TOPS: Guion, Acto, Escena, ElementoGuion | 5h | Jerarquía completa |
| **Fran** | Entidad ColorElementoGuion (colores configurables) | 1h | |
| **Fran** | Repositorios TOPS | 2h | Con queries custom |
| **Sandra** | Modelos TypeScript TOPS (guion.model.ts completo) | 2h | Interfaces v2 |
| **Sandra** | GuionService (con filtro temporada, misGuiones) | 3h | Computed signals |
| **Sandra** | TOPS Landing component (2 listas) | 3h | Temporada + Mis guiones |
| **Sergio** | Review: Modelos TOPS alineados | 1h | EOD |

**Entregable:** Base TOPS frontend + backend

### Martes S3

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | GuionService (CRUD + lock/unlock) | 4h | Bloqueo pesimista |
| **Fran** | GuionController completo | 3h | Todos endpoints |
| **Sandra** | Lista Guiones con filtro temporada | 2h | Material table |
| **Sandra** | Editor Guion estructura base | 4h | Contenedor principal |
| **Sandra** | Estilos editor emulando Word | 2h | CSS específico |
| **Sergio** | Review: Editor TOPS base | 1h | EOD |

**Entregable:** Editor TOPS estructura visual

### Miércoles S3

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Endpoints jerárquicos: crear acto/escena/elemento | 4h | POST anidados |
| **Fran** | PUT /guiones/{id}/reordenar (drag & drop API) | 2h | Batch update orden |
| **Fran** | ColorElementoService + Controller | 2h | CRUD colores |
| **Sandra** | Panel Acto expandible (CDK accordion) | 2h | |
| **Sandra** | Panel Escena con elementos | 3h | Lista drag & drop |
| **Sandra** | Elemento item con colores configurables | 2h | Usa ColorElementoService |
| **Sergio** | **CHECKPOINT:** Editor TOPS operativo | 2h | Crear estructura |

**Entregable:** Editor TOPS con jerarquía completa

### Jueves S3

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | NotificacionService + NotificacionController | 3h | CRUD + marcar leída |
| **Fran** | Entidad Notificacion + Migración | 2h | |
| **Fran** | DriveService (mock/stub para integración futura) | 2h | Interface preparada |
| **Sandra** | Dialog TOP (crear/editar elemento) | 3h | Formulario completo |
| **Sandra** | Drag & drop elementos (CDK) | 3h | Reordenar |
| **Sandra** | Cartelería Global component | 3h | Vista todas las salas |
| **Sergio** | Review: Integraciones | 1h | EOD |

**Entregable:** Notificaciones + Cartelería global

### Viernes S3

| Dev | Tarea | Horas | Con Agente |
|-----|-------|-------|------------|
| **Fran** | Tests TOPS (GuionService) | 2h | JUnit |
| **Fran** | Revisión Swagger completo | 2h | Documentar todo |
| **Fran** | Fixes y ajustes finales backend | 2h | Bugs detectados |
| **Sandra** | Vista solo TOPs + Vista por departamento | 3h | Filtros |
| **Sandra** | Admin: Temporadas (CRUD) | 2h | Lista + form |
| **Sandra** | Fixes y ajustes finales frontend | 2h | Bugs detectados |
| **Sergio** | **DEMO FINAL + ENTREGA** | 3h | Con cliente |

### Entregables Semana 3 ✓
- [ ] Landing TOPS con 2 listas
- [ ] Editor TOPS funcional (crear actos/escenas/elementos)
- [ ] Drag & drop para reordenar
- [ ] Colores elementos configurables
- [ ] Cartelería global
- [ ] Sistema notificaciones operativo
- [ ] Admin temporadas
- [ ] MVP v2 completo

---

## Resumen de Horas por Persona

### Fran (Backend Focus)
| Semana | Horas Desarrollo | Horas Tests | Total |
|--------|------------------|-------------|-------|
| S1 | 25h | 5h | 30h |
| S2 | 25h | 5h | 30h |
| S3 | 24h | 4h | 28h |
| **Total** | **74h** | **14h** | **88h** |

### Sandra (Frontend Focus)
| Semana | Horas Desarrollo | Horas Tests | Total |
|--------|------------------|-------------|-------|
| S1 | 26h | 4h | 30h |
| S2 | 29h | 1h | 30h |
| S3 | 28h | 0h | 28h |
| **Total** | **83h** | **5h** | **88h** |

### Sergio (Supervisión)
| Semana | Reviews Daily | Checkpoints | Sprint Review | Total |
|--------|---------------|-------------|---------------|-------|
| S1 | 4h | 2h | 2h | 8h |
| S2 | 4h | 2h | 2h | 8h |
| S3 | 4h | 2h | 3h | 9h |
| **Total** | **12h** | **6h** | **7h** | **25h** |

---

## Protocolo de Trabajo con Agentes IA

### Para Fran (Backend)
```
1. Usar PROMPT_BACKEND.md como template
2. Incluir siempre: entidad + repository + service + controller + DTO
3. Pedir tests junto con implementación
4. Validar SQL generado antes de ejecutar migraciones
5. Revisar anotaciones Swagger generadas
```

### Para Sandra (Frontend)
```
1. Usar PROMPT_FRONTEND.md como template
2. Pedir componentes standalone con imports explícitos
3. Incluir siempre: component + service + model
4. Solicitar estilos TailwindCSS inline cuando sea posible
5. Pedir signals en lugar de BehaviorSubject
```

### Para Sergio (Validación)
```
1. Daily review: 30 min por dev al final del día
2. Checkpoints: Probar flujo completo E2E
3. Sprint review: Demo con capturas/video
4. Documentar bugs encontrados en ESTADO_DESARROLLO.md
5. Actualizar progreso en dashboard
```

---

## Checkpoints de Validación

| Día | Checkpoint | Responsable | Criterio OK |
|-----|------------|-------------|-------------|
| Mié S1 | Login E2E | Sergio | Usuario puede hacer login y ver dashboard |
| Vie S1 | Sprint 1 | Sergio | Auth completa, header con temporada+notif |
| Mié S2 | Landing TEMPO | Sergio | Vista semanal Excel muestra actividades |
| Vie S2 | Sprint 2 | Sergio | CRUD actividades, estados, clone, admin |
| Mié S3 | Editor TOPS | Sergio | Crear guion con actos/escenas/elementos |
| Vie S3 | **DEMO FINAL** | Todos | MVP v2 funcionando E2E |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Integración FullCalendar compleja | Media | Alto | Sandra tiene S2 completo para esto |
| Editor TOPS muy complejo | Alta | Alto | Priorizar estructura > features avanzadas |
| Drive integration no lista | Alta | Bajo | Usar mock/stub, fase 2 real |
| Bloqueos por dependencias | Media | Medio | Fran adelanta APIs día anterior |

---

## Definición de "Hecho"

Una tarea se considera **DONE** cuando:

### Backend
- [ ] Endpoint funciona en Swagger
- [ ] Tests unitarios pasan
- [ ] Sin errores en logs
- [ ] Documentación Swagger actualizada

### Frontend
- [ ] Componente renderiza sin errores consola
- [ ] Conecta correctamente con API
- [ ] Responsive básico (desktop)
- [ ] Estilos consistentes con diseño

### Integración
- [ ] Flujo E2E funciona
- [ ] Sergio ha validado
- [ ] ESTADO_DESARROLLO.md actualizado

---

## Contacto y Escalación

| Rol | Persona | Responsabilidad |
|-----|---------|-----------------|
| Dev Backend | **Fran** | APIs, BD, Seguridad |
| Dev Frontend | **Sandra** | UI, UX, Componentes |
| Supervisor | **Sergio** | Validación, Arquitectura, Cliente |

**Daily Standup:** 9:30 AM (15 min)
**Canales:** Teams/Slack para dudas rápidas

---

## Fase 2 (Post-MVP) - Parking Lot

Tareas que quedan para después de las 3 semanas:
- [ ] Integración real Google Calendar
- [ ] Integración real Drive Intranet
- [ ] OAuth 2.0 con Google (actualmente JWT local)
- [ ] Exportación Word (Apache POI)
- [ ] WebSocket tiempo real
- [ ] Tests E2E (Playwright)
- [ ] Responsive móvil completo
- [ ] Accesibilidad WCAG AA

---

*Planificación generada: 2025-12-20*
*Válida para: Semanas 1-3 post-aprobación*
