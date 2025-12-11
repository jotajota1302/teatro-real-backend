# Teatro Real - Sistema de Gestión Interna

Sistema integral de gestión interna para el Teatro Real de Madrid, desarrollado para optimizar la coordinación de producciones, espacios, logística y recursos técnicos.

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
├── AGENTES/                    # Prompts de agentes IA especializados
├── DOC_GENERADA/               # Documentación técnica generada
│   ├── GUIA_ESTILOS_TEATRO.md
│   ├── PLAN_IMPLEMENTACION_BACKEND.md
│   ├── PLAN_IMPLEMENTACION_FRONTEND.md
│   └── SINTESIS_REQUISITOS_FINAL.md
├── DOC_INICIAL/                # Documentación de requisitos original
├── teatro-real-frontend/       # Frontend Angular 18.2
└── teatro-real-backend/        # Backend Java 8 + Spring Boot 2.7.18
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
| Java | 8 | Lenguaje de programación |
| Spring Boot | 2.7.18 | Framework principal |
| Spring Data JPA | - | Acceso a datos |
| H2 Database | - | Base de datos en memoria (desarrollo) |
| PostgreSQL | 16 | Base de datos (producción) |
| SpringDoc OpenAPI | 1.7 | Documentación API (Swagger UI) |
| Lombok | - | Reducción de boilerplate |

> **Nota:** Migración a Java 17+ y Spring Boot 3.x planificada para fase posterior.

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

| Documento | Descripción |
|-----------|-------------|
| [Plan Completo](DOC_GENERADA/PLAN_IMPLEMENTACION_COMPLETO.md) | Visión general del proyecto y sprints |
| [Plan Backend](DOC_GENERADA/PLAN_IMPLEMENTACION_BACKEND.md) | Arquitectura y APIs del backend |
| [Plan Frontend](DOC_GENERADA/PLAN_IMPLEMENTACION_FRONTEND.md) | Componentes y servicios Angular |
| [Guía de Estilos](DOC_GENERADA/GUIA_ESTILOS_TEATRO.md) | Paleta de colores y tipografía |
| [Síntesis Requisitos](DOC_GENERADA/SINTESIS_REQUISITOS_FINAL.md) | Requisitos funcionales |

## Equipo

Proyecto desarrollado por NTT DATA para el Teatro Real de Madrid.

## Licencia

Proyecto privado - Todos los derechos reservados.
