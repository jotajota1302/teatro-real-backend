# Plan de Trabajo - Gestión Interna Teatro Real (TEMPO + TOPS)
## Guía Operacional para Equipo de Desarrollo

---

## 📋 Control de Documento

| Propiedad | Valor |
|-----------|-------|
| **Versión** | 1.0 |
| **Fecha Creación** | 04/12/2025 |
| **Última Actualización** | 04/12/2025 |
| **Estado** | Aprobado para implementación |
| **Responsable PM** | Project Manager - Teatro Real |
| **Duración Proyecto** | 18 semanas (9 Sprints) |
| **Fecha Inicio Estimada** | Semana próxima |
| **Fecha Go-Live** | 18 semanas después |

---

## 1. Introducción y Objetivos del Plan

### 1.1 Propósito del Documento
Este Plan de Trabajo define la **estrategia operacional, procesos, hitos y responsabilidades** para la implementación del sistema de Gestión Interna del Teatro Real (TEMPO + TOPS). Sirve como guía para el equipo de desarrollo, asegurando:

- ✅ Ejecución ordenada y predecible
- ✅ Comunicación clara entre equipos
- ✅ Calidad consistente del código
- ✅ Entrega incremental de valor
- ✅ Gestión efectiva de riesgos

### 1.2 Alcance del Proyecto
**Qué SÍ se incluye:**
- Módulo TEMPO (planificación y gestión de actividades)
- Módulo TOPS (coordinación técnica y guiones)
- Gestión de usuarios, roles y seguridad
- Logística Arganda
- Integración Google Calendar y Gmail
- Cartelería digital y visualización responsive
- Testing completo y documentación

**Qué NO se incluye:**
- Migración de datos históricos (Excel/Access previos)
- Sistemas externos más allá de Google
- Visualización especial en pantallas escenario
- Suscripción a salas para alertas

### 1.3 Objetivos Medibles
| Objetivo | Métrica | Target |
|----------|---------|--------|
| Funcionalidad | % HUs completadas | 100% |
| Calidad | % Tests pasando | ≥95% |
| Performance | Tiempo carga página | <3 segundos |
| Disponibilidad | Uptime en producción | ≥99.5% |
| Satisfacción | NPS usuarios | ≥8/10 |

---

## 2. Estructura Organizacional y Responsabilidades

### 2.1 Equipo del Proyecto (9 FTE)

```
PROJECT MANAGER (1.0 FTE)
├── BACKEND LEAD (1.0 FTE)
│   ├── Backend Developer (1.0 FTE)
│   ├── DBA / DevOps (0.5 FTE)
│   └── Security Engineer (0.5 FTE)
├── FRONTEND LEAD (1.0 FTE)
│   └── Frontend Developer (1.0 FTE)
└── QA LEAD (0.5 FTE)
    └── QA Automation Engineer (1.0 FTE)
```

### 2.2 Responsabilidades por Rol

#### **Project Manager**
- **Responsable de**: Planificación, riesgos, comunicación ejecutiva, cronograma
- **Tareas clave**:
  - Coordinación diaria del equipo
  - Seguimiento de sprint burndown
  - Identificación temprana de riesgos
  - Comunicación con stakeholders
  - Gestión de cambios de alcance
  - Reportes de estado (semanal)

#### **Backend Lead**
- **Responsable de**: Arquitectura backend, APIs, estándares de código
- **Tareas clave**:
  - Diseño de APIs REST y BD
  - Code review backend
  - Mentoring Backend Developer
  - Decisiones tecnológicas
  - Integración de librerías
  - Performance optimization

#### **Backend Developer**
- **Responsable de**: Implementación de APIs, servicios, integraciones
- **Tareas clave**:
  - Codificación de endpoints REST
  - Implementación de lógica de negocio
  - Integraciones Google Calendar / Gmail
  - Pruebas unitarias
  - Documentación de código

#### **Frontend Lead**
- **Responsable de**: Arquitectura UI, componentes, UX, diseño responsive
- **Tareas clave**:
  - Arquitectura Angular
  - Diseño de componentes reutilizables
  - Code review frontend
  - Mentoring Frontend Developer
  - Gestión de estados (RxJS/NgRx)
  - Optimización UX/UI

#### **Frontend Developer**
- **Responsable de**: Implementación de componentes, vistas, interactividad
- **Tareas clave**:
  - Desarrollo de formularios y listados
  - Implementación responsive
  - Integración con APIs backend
  - Tests unitarios frontend
  - Debugging y optimización

#### **DBA / DevOps**
- **Responsable de**: Infraestructura, BD, CI/CD, deployment
- **Tareas clave**:
  - Diseño de BD y esquemas
  - Setup Google Cloud / on-premise
  - Pipelines CI/CD (GitLab CI o similar)
  - Backup y disaster recovery
  - Monitoreo y alertas
  - Deployment automatizado

#### **Security Engineer** (0.5 FTE)
- **Responsable de**: Seguridad, autenticación, auditoría
- **Tareas clave**:
  - Configuración Google OAuth2
  - Implementación JWT
  - RBAC design
  - Validación inputs / OWASP Top 10
  - Security testing
  - Auditoría de logs

#### **QA Lead** (0.5 FTE)
- **Responsable de**: Estrategia testing, calidad, criterios aceptación
- **Tareas clave**:
  - Plan testing por sprint
  - Definición de test cases
  - Gestión de defectos
  - Reportes de calidad
  - Criterios de aceptación refinados

#### **QA Automation Engineer**
- **Responsable de**: Automatización de tests, E2E, performance
- **Tareas clave**:
  - Tests unitarios (JUnit, Jasmine)
  - Tests E2E (TestCafe, Protractor)
  - Performance testing
  - Tests de concurrencia
  - Cobertura de código

---

## 3. Fases de Ejecución

### 3.1 Fase 0: Preparación (Semana 1)

#### Objetivos
- Setup completo de infraestructura y herramientas
- Equipo listo para iniciar desarrollo
- Comunicación de baseline establecida

#### Actividades
| Actividad | Responsable | Duración | Entregable |
|-----------|-------------|----------|-----------|
| Setup Google Cloud / On-premise | DevOps | 1 día | Credenciales, acceso, doc |
| Inicializar Git + branch strategy | DevOps | 0.5 día | Repo con estructura |
| Setup CI/CD pipeline básico | DevOps | 1 día | Pipeline funcional |
| Configurar Google OAuth2 dev | Security Eng | 0.5 día | Credenciales OAuth |
| Kickoff team + contexto | PM | 1 día | Acta reunión, Q&A |
| Setup IDE + dependencias local | All | 0.5 día | Todos con env local |

#### Go/No-Go Checklist
- [ ] GCP/infraestructura accesible
- [ ] Git repository funcional
- [ ] Todos pueden hacer `git clone` y build
- [ ] OAuth2 dev sandbox funciona
- [ ] CI/CD ejecuta primer build exitoso

---

### 3.2 Fase 1: Autenticación + TEMPO Base (Semanas 2-3)

#### Objetivos
- Sistema de autenticación funcional
- CRUD básico de actividades
- Primeras pruebas exitosas

#### Tareas Incluidas
- T-006.1 a T-006.4: RBAC y OAuth2 (26h)
- T-001.1 a T-001.3: BD y API actividades (30h)
- T-007.1 a T-007.2: Parámetros base (12h)
- T-006.8: Tests autenticación (6h)

#### Hitos
| Hito | Día | Criterio |
|------|-----|----------|
| **Login exitoso** | D5 | Usuario puede autenticarse con Google |
| **Primera actividad** | D8 | Crear actividad vía API |
| **Tests verde** | D10 | >80% tests pasando |

#### Entregables
✅ API POST /auth/login  
✅ API POST /activities  
✅ Tests JUnit autenticación  
✅ Documentación Swagger  

---

### 3.3 Fase 2: TEMPO Avanzado + Logística (Semanas 4-5)

#### Objetivos
- UI TEMPO completa
- Logística Arganda registrada
- Google Calendar sincronizado

#### Tareas Incluidas
- T-001.3, T-002: Agenda y filtros (50h)
- T-005: Logística Arganda (52h)
- T-001.4: Google Calendar sync (10h)
- Tests UI y API (24h)

#### Hitos
| Hito | Día | Criterio |
|------|-----|----------|
| **Agenda visible** | D6 | Listar actividades por espacio |
| **Logística completa** | D9 | Registrar movimientos Arganda |
| **Calendar sync** | D10 | Actividades en Google Calendar |

#### Entregables
✅ Componente Angular agenda  
✅ Filtros dinámicos  
✅ UI logística Arganda  
✅ Documentación usuario TEMPO  

---

### 3.4 Fase 3: Admin + Notificaciones (Semanas 6-7)

#### Objetivos
- Panel administrativo funcional
- Notificaciones reales
- Gestión de usuarios operativa

#### Tareas Incluidas
- T-007.4: Panel admin parámetros (12h)
- T-001.5, T-010: Notificaciones (36h)
- T-006.5 a T-006.7: CRUD usuarios (22h)
- Tests notificaciones (14h)

#### Hitos
| Hito | Día | Criterio |
|------|-----|----------|
| **Admin accesible** | D5 | Cambiar colores, espacios |
| **WebSocket vivo** | D8 | Mensajes en tiempo real |
| **Usuarios gestionados** | D10 | Crear/asignar roles |

#### Entregables
✅ Panel admin responsivo  
✅ Sistema WebSocket funcional  
✅ API CRUD usuarios  
✅ Manual administración  

---

### 3.5 Fase 4-5: Editor de Guiones (Semanas 8-12) — **HITO CRÍTICO**

#### Objetivos
- Editor de guiones estable
- Lock exclusivo funcionando
- Tops únicos y validados

#### Tareas Incluidas
- T-003.1 a T-003.9: Editor jerárquico (90h)
- T-004: Tops (44h)
- Tests concurrencia (12h)
- Historial y adjuntos (8h)

#### Riesgos Críticos
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|-----------|
| Lock exclusivo falla bajo carga | Media | Crítico | Tests concurrencia exhaustivos desde D1 |
| Historial consume demasiada BD | Media | Alto | Diseño de snapshot con compresión |
| Adjuntos ralentizan UI | Baja | Medio | Async upload + progress bar |

#### Hitos
| Hito | Día | Criterio |
|------|-----|----------|
| **BD + API esqueleto** | D5 | Tablas creadas, endpoints básicos |
| **Editor interactivo** | D12 | Arrastrar/soltar actos, pasadas |
| **Lock funcional** | D16 | Exclusividad validada |
| **Tops únicos** | D18 | Validación unicidad por producción |

#### Entregables
✅ BD guiones con 7 tablas  
✅ API CRUD completo  
✅ Editor con árbol jerárquico  
✅ Sistema lock/unlock  
✅ Historial con versionado  
✅ Tests concurrencia >50 usuarios simultáneos  

#### Go/No-Go Critical
- [ ] Cero deadlocks en tests
- [ ] Cero corrupción de datos
- [ ] Performance <2s incluso con 10 actos
- [ ] Rollback versionado funciona

---

### 3.6 Fase 6: Mobile + Tops Completos (Semanas 13-14)

#### Objetivos
- Editor usable en tablets
- Visualización responsive
- Tops navegables

#### Tareas Incluidas
- T-008.1, T-008.4, T-008.5: Responsive (24h)
- T-004.4, T-004.5: UI Tops (12h)
- T-010.3, T-010.4: Notificaciones UI (10h)
- Tests responsive (12h)

#### Entregables
✅ Breakpoints móvil/tablet  
✅ Componente Tops interactivo  
✅ Gestos táctil (swipe, zoom)  
✅ Caché local mobile  

---

### 3.7 Fase 7: Exportación + Performance (Semana 15)

#### Objetivos
- Exportación a Word funcionando
- Performance optimizado
- <3 segundos carga

#### Tareas Incluidas
- T-009: Exportación Word (34h)
- T-008.2, T-002.5: Optimización (16h)
- T-008.6: Performance testing (6h)

#### Entregables
✅ Exportación .docx con estructura  
✅ Caché con Redis/Memcached  
✅ Lazy loading componentes  
✅ Reportes performance <3s  

---

### 3.8 Fase 8: Testing Integral y Fixes (Semanas 16-17)

#### Objetivos
- Testing exhaustivo
- 0 defectos críticos
- Cobertura >90%

#### Tareas Incluidas
- Tests E2E completos (todas HUs)
- Performance testing avanzado
- Security testing / penetration
- Documentación Swagger 100%
- Fixes y refinamientos

#### Hitos
| Hito | Día | Criterio |
|------|-----|----------|
| **95% tests verde** | D5 | Todos excepto edge cases |
| **0 críticos** | D8 | Defectos ≤medium priority |
| **Load testing OK** | D10 | 100 usuarios concurrentes |

#### Entregables
✅ Suite E2E completa  
✅ Reportes de cobertura  
✅ Performance baseline  
✅ Security audit completo  

---

### 3.9 Fase 9: Go-Live y Operacionalización (Semana 18)

#### Objetivos
- Sistema en producción
- Usuarios entrenados
- Monitoreo activo

#### Actividades
| Actividad | Responsable | Día |
|-----------|-------------|-----|
| Deploy a producción | DevOps | D1 |
| Validación endpoints | QA | D1 |
| Sesión formación usuarios | PM | D2-3 |
| Monitoreo post-go-live | DevOps + PM | D4-5 |
| Handover a soporte | PM | D5 |

#### Entregables
✅ Sistema vivo en producción  
✅ Runbook de operación  
✅ Material formación usuarios  
✅ Plan de soporte 24/7  

---

## 4. Procesos y Estándares de Desarrollo

### 4.1 Gestión de Código

#### Branch Strategy (Git Flow)
```
main (producción)
├── develop (integración)
│   ├── feature/HU-001-crear-actividad
│   ├── feature/HU-002-agenda
│   ├── bugfix/fix-calendario
│   └── hotfix/seguridad-jwt
```

#### Reglamentación
- **Commits**: Mensaje formato `[T-001.1] Descripción clara`
- **Pull Requests**: Revisor diferente, ≥1 aprobación
- **Merge**: Squash commits, delete branch
- **Frequency**: 1 commit diario mínimo

#### Code Review Checklist
- [ ] Código sigue estándares del proyecto
- [ ] Tests unitarios incluidos
- [ ] Documentación actualizada
- [ ] Sin code smells detectados
- [ ] Performance considerada

### 4.2 Estándares de Código

#### Backend (Java + Spring Boot)
```
- Naming: camelCase para variables, PascalCase para clases
- Métodos: máx 30 líneas, una responsabilidad
- Excepciones: Custom exceptions por dominio
- Logs: SLF4J con niveles: ERROR, WARN, INFO, DEBUG
- Validación: Bean Validation + custom validators
```

#### Frontend (Angular + TypeScript)
```
- Naming: camelCase variables, PascalCase componentes
- Componentes: Smart (container) + Presentational
- RxJS: Unsubscribe en ngOnDestroy
- Templates: *ngIf preferible a visibility:hidden
- CSS: BEM naming convention
```

### 4.3 Testing Requerido

| Tipo | Coverage | Tool | Timing |
|------|----------|------|--------|
| **Unit** | >80% por módulo | JUnit, Jasmine | Cada commit |
| **Integration** | >70% | TestContainers, Karma | Cada PR |
| **E2E** | Flujos críticos | TestCafe | Cada sprint |
| **Performance** | Baseline <3s | JMeter | Sprint 7+ |
| **Security** | OWASP Top 10 | SonarQube | Sprint 8 |

### 4.4 Documentación Requerida

#### Por Sprint
- [ ] Swagger/OpenAPI actualizado
- [ ] README backend/frontend
- [ ] CHANGELOG con cambios
- [ ] Diagrama ER BD si cambia

#### Por Release
- [ ] Guía Usuario (PDF)
- [ ] Guía Administrador
- [ ] Runbook operaciones
- [ ] FAQ problemas comunes

---

## 5. Comunicación y Seguimiento

### 5.1 Cadencia de Reuniones

| Reunión | Frecuencia | Duración | Asistentes | Objetivo |
|---------|-----------|----------|-----------|----------|
| **Daily Standup** | Diaria (10:00h) | 15 min | Todo equipo | Bloqueos, status |
| **Sprint Planning** | Inicio sprint | 2h | Todo equipo | Tareas a ejecutar |
| **Sprint Review** | Fin sprint | 1.5h | Equipo + Stakeholders | Demo avances |
| **Sprint Retro** | Fin sprint | 1h | Todo equipo | Lecciones aprendidas |
| **Tech Sync** | Miércoles | 1h | Leads | Decisiones arquitectura |
| **Status Ejecutivo** | Viernes | 30 min | PM + Stakeholders | Reportes C-level |

### 5.2 Reportes

#### Status Semanal (Viernes 14:00h)
- % completado vs planeado
- Riesgos identificados
- Defectos abiertos por severidad
- Bloqueadores
- Recomendaciones

#### Sprint Burndown
- Gráfico tareas completadas vs planeadas
- Tendencia (verde=OK, rojo=riesgo)
- Actualización diaria

#### Métricas de Calidad
- Cobertura de tests (%)
- Defectos encontrados por sprint
- Defectos reencontrados (regresión)
- Performance trends

### 5.3 Escalación de Problemas

```
BLOQUEO TÉCNICO
├─ Nivel 1: Equipo desarrollo (resolver <2h)
├─ Nivel 2: Tech Lead (resolver <4h)
├─ Nivel 3: Project Manager + Stakeholder (resolver <1 día)
└─ Nivel 4: Ejecutivos (decisión arquitectura/alcance)
```

---

## 6. Gestión de Riesgos

### 6.1 Registro de Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|----|--------|--------------|---------|-----------|-------|
| **R-001** | Lock exclusivo falla bajo carga | Media | Crítico | Tests concurrencia desde D1, diseño pessimistic lock | Backend Lead |
| **R-002** | Integración Google Calendar inestable | Baja | Alto | Tests con sandboxes Google, fallback manual | Backend Dev |
| **R-003** | Scope creep de usuarios | Alta | Alto | Change control riguroso, comunicación stakeholders | PM |
| **R-004** | Performance móvil insuficiente | Media | Medio | Profiling temprano, lazy loading, compresión | Frontend Lead |
| **R-005** | Miembro equipo ausencia prolongada | Baja | Medio | Documentación clara, knowledge sharing semanal | PM |
| **R-006** | Defectos en producción post go-live | Baja | Crítico | Testing exhaustivo, hotfix procedure, monitoreo 24/7 | QA + DevOps |

### 6.2 Plan de Contingencia

#### Si R-001 ocurre (Lock falla)
- Rollback a versión anterior
- Investigar deadlock con tracing
- Delay sprint hasta resolver
- Notificar stakeholders

#### Si R-003 ocurre (Scope creep)
- Crear epic de "Phase 2"
- Evaluar impacto cronograma
- Decisión de PM + Cliente
- Renegociar fechas si es necesario

---

## 7. Criterios de Éxito

### 7.1 Por Historia de Usuario

Cada HU se considera **COMPLETA** si:
- ✅ Código implementado y mergeado a `main`
- ✅ Tests unitarios >80% cobertura
- ✅ Tests E2E pasando
- ✅ Code review aprobado
- ✅ Documentación Swagger actualizada
- ✅ Aceptado por Product Owner

### 7.2 Por Sprint

Cada Sprint es **EXITOSO** si:
- ✅ ≥90% tareas comprometidas completadas
- ✅ ≥95% tests pasando
- ✅ 0 defectos críticos abiertos
- ✅ Demo funcional para stakeholders
- ✅ Retrospectiva completada

### 7.3 Go-Live

Proyecto es **APTO PARA PRODUCCIÓN** si:
- ✅ 100% HUs completadas
- ✅ ≥95% tests pasando
- ✅ Performance <3s en todos escenarios
- ✅ 0 defectos críticos
- ✅ Security audit completado sin hallazgos críticos
- ✅ Usuarios entrenados y confirmados

### 7.4 Post Go-Live (30 días)

Proyecto es **ÉXITO FINAL** si:
- ✅ Uptime ≥99.5%
- ✅ <5 defectos críticos reportados
- ✅ NPS usuarios ≥8/10
- ✅ Cero incidents de seguridad
- ✅ Adopción ≥80% usuarios objetivo

---

## 8. Herramientas y Tecnología

### 8.1 Stack Tecnológico Recomendado

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Angular 15+ | Escalabilidad, TypeScript, Google recomienda |
| **Backend** | Spring Boot 3.x | Java, Cloud-native, seguridad enterprise |
| **BD** | PostgreSQL 14+ | Relacional, ACID, JSON native, open-source |
| **Cache** | Redis 7.x | Performance, sesiones, pub-sub |
| **Auth** | Google OAuth2 + JWT | Seguro, sin gestionar contraseñas |
| **Infra** | Google Cloud Platform | Recomendado cliente, alternativa on-premise |
| **CI/CD** | GitLab CI / GitHub Actions | Automatización, testing, deployment |
| **Monitoreo** | Prometheus + Grafana | Métricas, alertas, dashboards |
| **Logs** | ELK Stack / Google Cloud Logging | Trazabilidad, debugging, auditoría |

### 8.2 Dependencias Clave

```
Backend:
- Spring Boot Security (OAuth2)
- Spring Data JPA (ORM)
- Springdoc OpenAPI (Swagger)
- Apache POI (exportación Word)
- JUnit 5 + Mockito (testing)

Frontend:
- Angular Material (UI components)
- RxJS (reactive programming)
- Angular HTTP Client (APIs)
- Jasmine + Karma (testing)
- TestCafe (E2E)

DevOps:
- Docker + Kubernetes (containerización)
- PostgreSQL (BD)
- Nginx (reverse proxy)
```

### 8.3 Repositorios y Accesos

| Recurso | URL/Ubicación | Acceso |
|---------|--------------|--------|
| **Git Backend** | `repo-backend.git` | Todos dev |
| **Git Frontend** | `repo-frontend.git` | Todos dev |
| **Google Cloud** | GCP Console | PM + DevOps |
| **SonarQube** | `sonarqube.interno` | Todos dev |
| **Jira/Azure DevOps** | Sistema de tareas | Todos |

---

## 9. Documentación Requerida

### 9.1 Documentación Técnica

Por completar al final de cada sprint:

- **API Swagger**: Auto-generada, siempre actualizada
- **ER Diagram**: Exportar de BD tool
- **Arquitectura**: C4 diagram (Context, Container, Component, Code)
- **Runbook**: Cómo desplegar, rollback, escalar
- **Troubleshooting**: Problemas comunes y soluciones

### 9.2 Documentación Usuario

Por completar en Sprint 9:

- **Guía TEMPO**: Cómo crear actividades, filtrar, buscar
- **Guía TOPS**: Cómo editar guiones, manejar Tops
- **Guía Admin**: Gestión usuarios, configuración, parámetros
- **FAQ**: Preguntas frecuentes
- **Videos**: Screen capture de flujos principales

### 9.3 Documentación Operacional

- **Deployment Guide**: Pasos para deploy a GCP/on-premise
- **Monitoring**: Qué alertas esperar, cómo responder
- **Backup/DR**: Cómo backup BD, recovery procedure
- **Security Checklist**: Validaciones pre-producción

---

## 10. Matriz de Cambios

### Cambios de Alcance

Cualquier cambio debe seguir este proceso:

```
Solicitud de Cambio
    ↓
PM evalúa impacto (tiempo, recursos, riesgos)
    ↓
Stakeholder + Tech Lead aprueban/rechazan
    ↓
Si aprobado: Actualizar backlog, replanning si es necesario
    ↓
Comunicar a equipo
```

### Ejemplos de Cambios Aprobables

✅ **Minor**: Bug fixes, refactoring, documentación  
✅ **Medium**: Pequeño requisito nuevos, mejora performance  
❌ **Major**: Nuevas HUs completas (→ Phase 2)  

---

## 11. Escalada de Decisiones

| Decisión | Autoridad | Plazo |
|----------|-----------|-------|
| Cambio arquitectura | Backend Lead + CTO | 24h |
| Cambio alcance | PM + Cliente | 2h |
| Delay sprint | PM | 4h |
| Go/No-Go producción | PM + QA Lead + Cliente | 1h |

---

**Fin del Plan de Trabajo - Teatro Real**

Versión 1.0 | Aprobado para implementación | 04/12/2025
