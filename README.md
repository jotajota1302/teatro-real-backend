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
├── teatro-real-angular/        # Frontend Angular 18
└── teatro-real-backend/        # Backend Java Spring Boot
```

## Tecnologías

### Frontend
- **Angular 18** con Standalone Components
- **Tailwind CSS** con paleta de colores corporativa
- **TypeScript 5.4+**
- **Signals** para gestión de estado reactivo

### Backend
- **Java 21**
- **Spring Boot 3.x**
- **PostgreSQL** / **Supabase**
- **Spring Security** con JWT

## Requisitos Previos

- Node.js 18+
- Java 21+
- PostgreSQL 15+ o cuenta en Supabase

## Instalación

### Frontend (Angular)

```bash
cd teatro-real-angular
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Backend (Java)

```bash
cd teatro-real-backend
./mvnw spring-boot:run
```

La API estará disponible en `http://localhost:8080`

## Equipo

Proyecto desarrollado por NTT DATA para el Teatro Real de Madrid.

## Licencia

Proyecto privado - Todos los derechos reservados.
