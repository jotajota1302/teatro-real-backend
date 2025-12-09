# 🚀 Cómo Ejecutar el Backend - Guía Rápida

## Método 1: Script Automático (LA MÁS FÁCIL)

### Paso 1: Abre PowerShell
Presiona `Win + R`, escribe `powershell` y presiona Enter.

### Paso 2: Navega a la carpeta del backend
```powershell
cd "C:\Users\shurtadp\OneDrive - NTT DATA EMEAL\PROYECTOS\TEATRO REAL\teatro_real_proyecto\backend"
```

### Paso 3: Ejecuta el script
```powershell
.\RUN_BACKEND.ps1
```

**¡LISTO!** El backend se iniciará automáticamente.

---

## Método 2: Desde VSCode Terminal Integrada

### Paso 1: Abre VSCode
Desde la carpeta `teatro_real_proyecto\backend`

### Paso 2: Abre Terminal en VSCode
Presiona `Ctrl + ñ` (o `Ctrl + backtick`)

### Paso 3: Asegúrate de que estés en la carpeta backend
Deberías ver algo como:
```
PS C:\Users\shurtadp\...\teatro_real_proyecto\backend>
```

### Paso 4: Ejecuta el script
```powershell
.\RUN_BACKEND.ps1
```

---

## Método 3: Comando Manual (Sin Script)

Si prefieres hacerlo manualmente:

```powershell
$env:PATH += ";C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.11\bin"
cd "C:\Users\shurtadp\OneDrive - NTT DATA EMEAL\PROYECTOS\TEATRO REAL\teatro_real_proyecto\backend"
mvn spring-boot:run -DskipTests
```

---

## ✅ ¿Cómo sé que funciona?

Verás mensajes como estos:

```
✓ Verificando Java...
  ✓ Java detectado correctamente
✓ Verificando Maven...
  ✓ Maven 3.9.11 detectado correctamente

📦 Descargando dependencias e inicializando...

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 /\  ___/| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.3.4)

2025-12-04 18:35:15.123  INFO 12345 --- [  main] c.t.TeatroRealApplication : Starting TeatroRealApplication
...
2025-12-04 18:35:20.456  INFO 12345 --- [  main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080
```

**¡Perfecto!** El backend ya está corriendo.

---

## 🌐 Acceder al Backend

Una vez que veas "Tomcat started on port(s): 8080":

- **API REST**: http://localhost:8080/tempo/espacios
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

---

## ⚠️ Troubleshooting

### "Script execution is disabled on this system"
Ejecuta esto primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "mvn command not found"
El script intenta agregar Maven al PATH. Si aun así falla, usa el Método 3.

### "Java not found"
Asegúrate de tener Java 24 instalado:
```powershell
java -version
```

---

## 🛑 Detener el Backend

Presiona `Ctrl + C` en el terminal donde está corriendo.
