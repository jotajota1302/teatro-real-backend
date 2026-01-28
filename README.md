# Teatro Real - Sistema de Gestión Interna

Sistema integral de gestión interna para el Teatro Real de Madrid, desarrollado para optimizar la coordinación de producciones, espacios, logística y recursos técnicos.

## Demo en Producción

| Componente | URL | Hosting |
|------------|-----|---------|
| **Frontend** | https://teatro-real-frontend.vercel.app | Vercel |
| **Backend API** | https://teatro-real-backend.onrender.com/api | Render |
| **Swagger UI** | https://teatro-real-backend.onrender.com/swagger-ui/index.html | Render |

**Credenciales de prueba:**
- Usuario: `admin`
- Password: `admin123`

> **Nota:** El backend en Render (plan free) se "duerme" tras 15 min de inactividad. La primera petición puede tardar ~30 segundos en despertar.

## Descripción

Este proyecto implementa una plataforma digital que integra los sistemas **TEMPO** (gestión de espacios y calendario) y **TOPS** (gestión de producciones y guiones técnicos) del Teatro Real, proporcionando:

- **Gestión de Calendario**: Planificación y visualización de actividades (funciones, ensayos, montajes, eventos)
- **Gestión de Espacios**: Control de ocupación de salas, escenarios y espacios técnicos
- **Gestión de Producciones**: Seguimiento de óperas y espectáculos
- **Guiones Técnicos**: Digitalización de guiones de regiduría con gestión de cues
- **Logística**: Coordinación de cargas, descargas y transportes
- **Cartelería Digital**: Gestión de contenidos para pantallas informativas

## Estructura del Proyecto

```
teatro-real/
├── teatro-real-frontend/       # Frontend Angular 18.2
├── teatro-real-backend/        # Backend Java 17 + Spring Boot 3.3
├── DOC_GENERADA/               # Documentación técnica generada
├── DOC_INICIAL/                # Documentación de requisitos original
├── PROMPT_FRAMEWORK/           # Templates para solicitar desarrollos
├── AGENTES/                    # Prompts de agentes IA especializados
├── deploy.sh                   # Script de deploy automatizado
└── CLAUDE.md                   # Instrucciones para Claude Code
```

## Tecnologías

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 18.2 | Framework principal con Standalone Components |
| TypeScript | 5.5 | Lenguaje de programación |
| TailwindCSS | 3.4 | Framework CSS utility-first |
| RxJS | 7.8 | Programación reactiva |
| Signals | - | Gestión de estado reactivo (built-in Angular 18) |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Java | 17 | Lenguaje de programación |
| Spring Boot | 3.3.0 | Framework principal |
| Spring Data JPA | - | Acceso a datos |
| H2 Database | - | Base de datos en memoria (desarrollo) |
| PostgreSQL | 16 | Base de datos (producción) |
| SpringDoc OpenAPI | 2.2 | Documentación API (Swagger UI) |
| Lombok | 1.18 | Reducción de boilerplate |
| Flyway | - | Migraciones de base de datos |

## Requisitos Previos

- Node.js 18+ (recomendado 20 LTS)
- Java 8 (JDK 1.8)
- PostgreSQL 16 (solo producción)

## Instalación y Ejecución

### Frontend (Angular)

```bash
cd teatro-real-frontend
npm install
npm start
```

| URL | Descripción |
|-----|-------------|
| http://localhost:4200 | Aplicación Angular |

### Backend (Spring Boot)

```bash
# Windows
cd teatro-real-backend
mvnw.cmd spring-boot:run

# Linux/Mac
cd teatro-real-backend
./mvnw spring-boot:run
```

| URL | Descripción |
|-----|-------------|
| http://localhost:8080/api | API REST |
| http://localhost:8080/swagger-ui.html | Documentación Swagger |
| http://localhost:8080/h2-console | Consola H2 (desarrollo) |

### Credenciales H2 (Desarrollo)
```
JDBC URL: jdbc:h2:mem:teatroreal
Usuario: sa
Password: (vacío)
```

## Documentación

### Planes de Implementación
| Documento | Descripción |
|-----------|-------------|
| [Plan Completo](DOC_GENERADA/PLAN_IMPLEMENTACION_COMPLETO.md) | Visión general del proyecto y sprints |
| [Plan Backend](DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND.md) | Arquitectura y APIs del backend |
| [Plan Frontend](DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md) | Componentes y servicios Angular |
| [Guía de Estilos](DOC_GENERADA/GUIA_ESTILOS_TEATRO.md) | Paleta de colores y tipografía |
| [Síntesis Requisitos](DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md) | Requisitos funcionales |

### Framework de Prompts
| Template | Descripción |
|----------|-------------|
| [PROMPT_BACKEND](PROMPT_FRAMEWORK/PROMPT_BACKEND.md) | Template para desarrollo de APIs Spring Boot |
| [PROMPT_FRONTEND](PROMPT_FRAMEWORK/PROMPT_FRONTEND.md) | Template para componentes Angular |
| [PROMPT_FEATURE](PROMPT_FRAMEWORK/PROMPT_FEATURE.md) | Template para features fullstack |
| [PROMPT_BUGFIX](PROMPT_FRAMEWORK/PROMPT_BUGFIX.md) | Template para reportar y corregir bugs |

## Deploy y Repositorios

### Repositorios

| Repositorio | URL | Descripción |
|-------------|-----|-------------|
| GitLab NTTData | `origin` | Repositorio principal corporativo |
| GitHub Backend | https://github.com/jotajota1302/teatro-real-backend | Espejo para deploy en Render |
| GitHub Frontend | https://github.com/jotajota1302/teatro-real-frontend | Espejo para deploy en Vercel |

### Script de Deploy

Para desplegar cambios a producción, usa el script `deploy.sh`:

```bash
# Deploy completo (backend + frontend)
./deploy.sh

# Solo backend
./deploy.sh backend

# Solo frontend
./deploy.sh frontend

# Solo a GitHub (sin push a GitLab)
./deploy.sh --no-push-origin
```

El script automáticamente:
1. Hace push a GitLab (origin/development)
2. Sincroniza el backend con GitHub → Render redespliega automáticamente
3. Despliega el frontend a Vercel

### Deploy Manual

Si prefieres hacerlo manualmente:

```bash
# 1. Push a GitLab
git push origin development

# 2. Backend → GitHub (Render)
git subtree split --prefix=teatro-real-backend -b backend-only --rejoin
git push github backend-only:main --force

# 3. Frontend → Vercel
cd teatro-real-frontend
vercel --prod --yes
```

### Variables de Entorno

**Backend (Render):**
| Variable | Valor |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | (generado automáticamente) |
| `CORS_ORIGINS` | `*` |

**Frontend (Vercel):**
- No requiere variables adicionales (la URL del backend está en `environment.prod.ts`)

## Equipo

Proyecto desarrollado por NTT DATA para el Teatro Real de Madrid.

## Licencia

Proyecto privado - Todos los derechos reservados.
