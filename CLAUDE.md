# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Teatro Real is an internal management system for Teatro Real de Madrid, integrating TEMPO (spaces/calendar management) and TOPS (production/technical scripts) systems. The MVP is deployed at https://teatro-real-app.vercel.app

## Tech Stack

- **Frontend:** Angular 18.2 (standalone components) + Angular Material 18 + TailwindCSS 3.4 + FullCalendar 6
- **Backend:** Spring Boot 3.3.0 + Java 17 + Spring Security + JWT
- **Database:** H2 file-based (dev), PostgreSQL 16 (prod)
- **Migrations:** Flyway

## Development Commands

### Frontend
```bash
cd teatro-real-frontend
npm install
npm start                    # http://localhost:4200 (proxies /api to :8080)
npm run build               # Production build
```

### Backend
```bash
cd teatro-real-backend

# Windows CMD nativo
build.bat spring-boot:run   # Arranca el servidor
build.bat install           # Compila el proyecto
build.bat test              # Ejecuta tests

# Windows desde bash/Claude Code (requiere cd + ruta completa al .bat)
cd "C:/Users/Nitropc/Desktop/TEATRO REAL/teatro-real-backend" && "C:/Users/Nitropc/Desktop/TEATRO REAL/teatro-real-backend/build.bat" spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
./mvnw test
```

> **Nota:** En Windows, usar `build.bat` que configura Java 17 automáticamente.
> Si `mvn` falla con errores de versión, configurar `JAVA_HOME=C:\Program Files\Java\jdk-17`
> **Claude Code:** Ejecutar en background con `run_in_background: true` ya que Spring Boot no termina.

### Development URLs
- Frontend: http://localhost:4200
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console (user: `sa`, password: empty)

## Architecture

### Backend Structure (`teatro-real-backend/src/main/java/com/teatroreal/`)
```
├── config/          # SecurityConfig (JWT + Spring Security)
├── controller/
│   ├── auth/        # AuthController (login, me, logout)
│   ├── tempo/       # Actividad, Espacio, TipoActividad, Signage, Notificacion
│   ├── tops/        # Acto, Escena, ElementoGuion (GuionController MISSING)
│   ├── dashboard/   # Dashboard stats
│   └── admin/       # Admin operations
├── domain/
│   ├── tempo/       # Actividad, Espacio, TipoActividad, Temporada, Departamento
│   ├── tops/        # Guion, Acto, Escena, ElementoGuion, ColorElementoGuion
│   └── user/        # Usuario, Rol, PermisoModulo
├── dto/             # request/ and response/ DTOs
├── repository/      # JPA repositories by module
├── security/        # JwtAuthFilter, JwtUtil
└── service/         # Business logic by module
```

### Frontend Structure (`teatro-real-frontend/src/app/`)
```
├── core/
│   ├── auth/        # AuthService (signals), guards, interceptor, models
│   ├── guards/      # roleGuard, modulePermissionGuard
│   └── services/    # ApiService, NotificationService, TemporadaService
├── features/
│   ├── tempo/       # Calendar, spaces, activities, logistics (COMPLETE)
│   ├── tops/        # Technical scripts editor (PLACEHOLDER ONLY)
│   ├── carteleria/  # Digital signage (global + per-room)
│   ├── dashboard/   # Overview with stats
│   └── admin/       # User/role management (placeholder)
├── layout/          # MainLayout, Sidebar, Header
└── shared/          # Reusable components (notification-bell, temporada-selector, etc.)
```

### Key Patterns
- **Frontend:** Standalone components, Angular signals for state, lazy loading via routes
- **Backend:** Controller → Service → Repository pattern, DTOs for API boundaries
- **Auth:** JWT tokens, 4 roles (ADMIN, GESTOR, OPERADOR, VISUALIZADOR), module-based permissions
- **Database:** Flyway migrations in `db/migration/` (V1__schema.sql, V2__seed.sql, etc.)

### Coding Context (MUST READ)
Before implementing features, read these documents for patterns and conventions:
- **[CONTEXTO_FRONTEND.md](DOC_GENERADA/CONTEXTO_FRONTEND.md)** - Angular patterns, signals, services, components structure
- **[CONTEXTO_BACKEND.md](DOC_GENERADA/CONTEXTO_BACKEND.md)** - Spring Boot patterns, controllers, services, DTOs, entities

## Module Status

| Module | Backend | Frontend | Notes |
|--------|---------|----------|-------|
| TEMPO | 95% | 95% | Calendar, spaces, activities complete |
| TOPS | 40% | 5% | Entities exist, GuionService/Controller missing, frontend is placeholder |
| Logística | 0% | 30% | Frontend exists, backend not implemented |
| Admin | 20% | 5% | Basic controllers, UI is placeholder |
| Cartelería | 100% | 100% | Global and per-room signage complete |

## Design System

- **Primary colors:** Negro (#010101), Carmesí (#CF102D), Blanco (#FFFFFF)
- **Font:** Montserrat (Gotham alternative)
- **Activity colors:** Función (#1E3A5F), Ensayo (#2E7D32), Montaje (#E57373), etc.
- See `DOC_GENERADA/GUIA_ESTILOS_TEATRO.md` for full palette

## Important Notes

- Two git repos exist: main project (GitLab NTTData) and `teatro-real-app/` (GitHub for Vercel deploy)
- H2 database is file-based (`./data/teatroreal.mv.db`) - shared between developers
- Frontend components use inline templates (`inlineTemplate: true` in angular.json schematics)
- Proxy config routes `/api/*` to backend on port 8080
