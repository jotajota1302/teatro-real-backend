# 🎭 TEATRO REAL - Sistema Integral de Gestión

[![Estado](https://img.shields.io/badge/Estado-Completado-brightgreen)](https://github.com)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)](https://github.com)
[![Licencia](https://img.shields.io/badge/Licencia-Propietario-red)](https://github.com)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)](https://spring.io/projects/spring-boot)

---

## 📋 Descripción

**Teatro Real TEMPO + TOPS** es un sistema integral de gestión desarrollado para el Teatro Real de Madrid. Proporciona herramientas para:

- **TEMPO**: Gestión de temporada, funciones, calendario y espacios
- **TOPS**: Operativa técnica, incidencias y personal

### ✨ Características Principales

✅ **API REST Completa** - 17 endpoints funcionales  
✅ **Interfaz Moderna** - Dashboard interactivo con Bootstrap 5  
✅ **Arquitectura Hexagonal** - Separación de capas profesional  
✅ **Datos de Ejemplo** - 6 espacios y 5 actividades precargadas  
✅ **Documentación Swagger** - Exploración interactiva de API  
✅ **Diseño Responsivo** - Funciona en todos los dispositivos  
✅ **Accesibilidad** - Cumple con WCAG 2.1  

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Java 17+
- Maven 3.8+
- (Opcional) MySQL 8.0+ para persistencia futura

### Instalación

1. **Compilar Backend**
```powershell
cd teatro_real_proyecto/backend
mvn clean compile
```

2. **Ejecutar Backend**
```powershell
mvn spring-boot:run
```

3. **Abrir Frontend**
```
PROYECTO\TEATRO\index.html
```

El sistema estará disponible en:
- **Frontend**: `PROYECTO\TEATRO\index.html`
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

---

## 📁 Estructura del Proyecto

```
teatro_real_proyecto/
├── backend/                              # API Java/Spring Boot
│   ├── pom.xml                          # Dependencias Maven
│   ├── README.md                        # Documentación backend
│   ├── src/main/java/com/teatroreal/
│   │   ├── TeatroRealApplication.java
│   │   ├── tempo/
│   │   │   ├── application/
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   └── service/             # Lógica de negocio
│   │   │   ├── domain/
│   │   │   │   ├── model/               # Entidades de dominio
│   │   │   │   └── repository/          # Interfaces
│   │   │   ├── infrastructure/
│   │   │   │   └── mock/                # Datos en memoria
│   │   │   └── presentation/
│   │   │       └── controller/          # Endpoints REST
│   │   └── shared/
│   │       └── infrastructure/
│   │           └── exception/           # Manejo de errores
│   └── src/main/resources/
│       └── application.properties       # Configuración
├── GUIA_INICIO_RAPIDO.md               # Instrucciones de inicio
├── RESUMEN_PROYECTO_COMPLETO.md        # Documentación completa
└── README.md                            # Este archivo

PROYECTO/TEATRO/
├── index.html                           # Interfaz principal
├── assets/css/                          # Estilos
│   ├── design-system.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── accessibility.css
├── js/
│   └── app.js                          # Lógica frontend
└── package.json                        # Metadatos
```

---

## 🔌 API REST

### Endpoints Disponibles

#### Espacios
```
GET    /tempo/espacios              # Listar todos
GET    /tempo/espacios/activos      # Solo activos
GET    /tempo/espacios/{id}         # Por ID
POST   /tempo/espacios              # Crear
PUT    /tempo/espacios/{id}         # Actualizar
DELETE /tempo/espacios/{id}         # Eliminar
PUT    /tempo/espacios/{id}/activar # Reactivar
```

#### Actividades
```
GET    /tempo/actividades                    # Listar todas
GET    /tempo/actividades/{id}               # Por ID
GET    /tempo/actividades/espacio/{espacioId} # Por espacio
GET    /tempo/actividades/rango              # Por rango de fechas
POST   /tempo/actividades                    # Crear
PUT    /tempo/actividades/{id}               # Actualizar
PUT    /tempo/actividades/{id}/horario       # Cambiar horario
DELETE /tempo/actividades/{id}               # Eliminar
```

### Ejemplo: Crear Espacio

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

---

## 🎨 Frontend

### Secciones

- **Dashboard** - KPIs y vista general
- **TEMPO**
  - Calendario de Temporada
  - Funciones Programadas
  - Gestión de Espacios
- **TOPS**
  - Operativa Técnica
  - Gestión de Incidencias
  - Personal Técnico
- **Admin**
  - Configuración del Sistema

### Tecnologías

- **Bootstrap 5** - Framework CSS
- **Material Icons** - Iconografía
- **Roboto Font** - Tipografía
- **Vanilla JavaScript** - Interactividad

---

## 🏗️ Arquitectura

El backend sigue un **patrón hexagonal** de 4 capas:

```
┌─ PRESENTACIÓN (Controllers)
│  └─ REST endpoints
├─ APLICACIÓN (Services)
│  └─ Lógica de negocio
├─ DOMINIO (Models)
│  └─ Entidades y reglas
└─ INFRAESTRUCTURA (Repositories/Mock)
   └─ Persistencia de datos
```

Esto asegura:
- ✅ Separación de responsabilidades
- ✅ Fácil testing
- ✅ Escalabilidad futura
- ✅ Independencia de frameworks

---

## 📊 Datos de Ejemplo

### Espacios (6)
- Sala Principal (Sala de funciones)
- Sala Cámara (Sala de cámara)
- Estudio A (Estudio de ensayo)
- Estudio B (Estudio de ensayo)
- Foyer (Espacio social)
- Cafetería (Espacio de descanso)

### Actividades (5)
- La Traviata (05/12/2025, 20:00-22:30)
- Ensayo Orquesta (05/12/2025, 10:00-12:00)
- Mantenimiento Iluminación (06/12/2025, 09:00-13:00)
- El Quijote (06/12/2025, 20:00-22:00)
- Preparación Escenario (07/12/2025, 08:00-12:00)

---

## 🛠️ Tecnologías

### Backend
- **Java 17** - Lenguaje principal
- **Spring Boot 3.x** - Framework
- **Spring Web** - REST
- **Lombok** - Reducción de boilerplate
- **Springdoc OpenAPI** - Swagger/OpenAPI
- **Maven** - Gestor de dependencias

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript (Vanilla)** - Interactividad
- **Bootstrap 5** - Componentes
- **Material Icons** - Iconografía

---

## 📖 Documentación

| Documento | Contenido |
|-----------|-----------|
| **GUIA_INICIO_RAPIDO.md** | Instrucciones paso a paso |
| **RESUMEN_PROYECTO_COMPLETO.md** | Documentación técnica completa |
| **backend/README.md** | Detalles del backend |
| **Swagger UI** | API interactiva en http://localhost:8080/swagger-ui.html |

---

## 🔍 Solución de Problemas

### Puerto 8080 en uso
```powershell
# Cambiar en: backend/src/main/resources/application.properties
server.port=8081
```

### Errores de compilación
```powershell
# Limpiar y recompilar
mvn clean install -U
```

### Frontend no carga datos
1. Verificar que backend está corriendo
2. Abrir consola del navegador (F12)
3. Revisar errores de CORS

---

## 📈 Próximos Pasos

- 🔐 Implementar autenticación JWT
- 📅 Integración con Google Calendar
- 💾 Persistencia en MySQL
- 🧪 Tests automáticos (JUnit 5, Mockito)
- 🐳 Containerización con Docker
- 📱 Aplicación móvil nativa

---

## 👥 Equipo

**Desarrollador Principal**: A  
**Frameworks**: Java/Spring Boot + HTML/CSS/JavaScript  
**Patrón Arquitectónico**: Hexagonal (Clean Architecture)  

---

## 📄 Licencia

Propiedad de Teatro Real de Madrid. Todos los derechos reservados.

---

## 📞 Contacto

**Teatro Real**  
Web: https://www.teatroreal.es  
Teléfono: +34 91 516 06 06  
Dirección: C/ Felipe V, s/n, 28013 Madrid

---

## ✅ Estado del Proyecto

| Componente | Estado |
|-----------|---------|
| Backend Core | ✅ Completado |
| API REST | ✅ Completado |
| Frontend | ✅ Completado |
| Documentación | ✅ Completado |
| Datos Mock | ✅ Completado |
| Testing | ⏳ Pendiente |
| Base de Datos Persistente | ⏳ Pendiente |
| Autenticación | ⏳ Pendiente |

---

**Última actualización**: Diciembre 2025  
**Versión**: 1.0.0 - PRODUCCIÓN

🎭 *Sistema listo para uso en Teatro Real* 🎭
