# 🛡️ Resiliencia del Frontend - Modo Demostración

## ¿Qué cambió?

El frontend ahora es **resiliente** y puede funcionar **SIN necesidad del backend**. 

### Antes:
- ❌ Si el backend no estaba corriendo → No había datos, solo alertas de error

### Ahora:
- ✅ Si el backend está ON → Usa datos reales desde la API
- ✅ Si el backend está OFF → Usa datos de demostración automáticamente
- ✅ La aplicación funciona completamente en modo local

---

## 🚀 Cómo Funciona

### Escenario 1: CON Backend (Recomendado)

```powershell
# Terminal 1: Iniciar backend
cd "teatro_real_proyecto\backend"
java -jar target/teatro-real-backend-1.0.0-SNAPSHOT.jar

# Terminal 2: Abrir frontend en navegador
# file:///C:/Users/shurtadp/OneDrive - NTT DATA EMEAL/PROYECTOS/TEATRO REAL/PROYECTO/TEATRO/index.html
```

**Resultado en consola:**
```
✓ Backend disponible y conectado
Actividades cargadas: Array(5)
Espacios cargados: Array(6)
Dashboard: 5 actividades disponibles
Dashboard: 6 espacios disponibles
```

**Estado:** Backend real + Datos en tiempo real

---

### Escenario 2: SIN Backend (Demostración)

```powershell
# Solo abrir el frontend en navegador
# file:///C:/Users/shurtadp/OneDrive - NTT DATA EMEAL/PROYECTOS/TEATRO REAL/PROYECTO/TEATRO/index.html
```

**Resultado en consola:**
```
Cargando datos iniciales desde el backend...
Error al cargar datos iniciales: [error details]
✓ Usando datos de demostración...
✓ Datos de demostración cargados exitosamente
Demo Actividades: Array(5)
Demo Espacios: Array(6)
Dashboard: 5 actividades disponibles
Dashboard: 6 espacios disponibles
```

**Estado:** Backend no disponible + Datos locales de demostración

---

## 📊 Datos de Demostración (Mock Data)

### Espacios Disponibles:
1. **Sala Principal** - Capacidad: 1000 m² - Estado: Activo
2. **Sala de Cámara** - Capacidad: 300 m² - Estado: Activo
3. **Estudio de Ensayo A** - Capacidad: 200 m² - Estado: Activo
4. **Estudio de Ensayo B** - Capacidad: 200 m² - Estado: Activo
5. **Sala de Conferencias** - Capacidad: 150 m² - Estado: Inactivo
6. **Almacén Técnico** - Capacidad: 500 m² - Estado: Activo

### Actividades Programadas:
| Nombre | Fecha | Hora | Sala | Estado |
|--------|-------|------|------|--------|
| La Traviata | 05/12/2025 | 19:30 | Sala Principal | Confirmada |
| El Quijote | 06/12/2025 | 20:00 | Sala de Cámara | Confirmada |
| Don Giovanni | 07/12/2025 | 19:00 | Sala Principal | En preparación |
| Carmen | 08/12/2025 | 20:30 | Sala Principal | Confirmada |
| Ensayo General | 09/12/2025 | 18:00 | Estudio A | Programada |

---

## 🔍 Cómo Verificar qué Modo Está Usando

### Opción 1: Abrir la Consola del Navegador (F12)

Busca los mensajes en la consola:

**Si usa Backend Real:**
```
✓ Backend disponible y conectado
Actividades cargadas: Array(5)
```

**Si usa Demo Data:**
```
✓ Datos de demostración cargados exitosamente
Demo Actividades: Array(5)
```

### Opción 2: Variables de Estado

En la consola del navegador, ejecuta:
```javascript
console.log(appState.backendAvailable);  // true o false
console.log(appState.usingDemoData);     // true o false
```

---

## 💡 Ventajas de este Enfoque

### Para Desarrollo:
- ✅ Puedes trabajar en el frontend sin tener el backend corriendo
- ✅ Los datos de demostración son realistas y completos
- ✅ No hay interrupciones por cambios en el backend

### Para Demostración:
- ✅ Presentar la aplicación sin dependencias
- ✅ Mostrar toda la funcionalidad de forma offline
- ✅ Experiencia fluida sin esperas

### Para Producción:
- ✅ El sistema es robusto: si el backend cae, se usa fallback
- ✅ Los usuarios pueden seguir usando la aplicación en modo local
- ✅ Mejor experiencia de usuario

---

## 🔧 Modificaciones Realizadas

### En `app.js`:

**1. Agregados datos de demostración:**
```javascript
const DEMO_DATA = {
  espacios: [...],
  actividades: [...]
};
```

**2. Mejorada la función `loadInitialData()`:**
```javascript
try {
  // Intenta cargar del backend
  const actividades = await APIService.getActividades();
} catch (error) {
  // Si falla, usa datos locales
  appState.usingDemoData = true;
  const demoActividades = DEMO_DATA.actividades;
}
```

**3. Actualizado el estado global:**
```javascript
appState = {
  ...
  backendAvailable: false,
  usingDemoData: false
};
```

---

## 📝 Próximas Mejoras

- [ ] Indicador visual en la UI mostrando si está usando Demo Data
- [ ] Botón para forzar recarga de datos desde el backend
- [ ] Persistencia de datos locales en localStorage
- [ ] Sincronización automática cuando el backend vuelve a estar disponible
- [ ] Alertas al usuario cuando cambia entre modo real y demo

---

## 🎯 Conclusión

El frontend ahora es **completamente independiente** del backend para propósitos de demostración y desarrollo. 

- **Con Backend:** Datos en tiempo real desde la API
- **Sin Backend:** Datos de demostración locales

¡La aplicación siempre está disponible! 🚀

---

**Última actualización:** 04/12/2025 19:16
