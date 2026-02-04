# PLAN DE IMPLEMENTACIÓN TOPS - FASE 2 (COMPLETO)
## Implementación del 15% Restante del Sistema

**Fecha:** 2026-02-04  
**Versión:** 2.0 (Consolidado tras auditoría)  
**Objetivo:** Completar las features faltantes de TOPS según reglas-tops1.md

---

## RESUMEN EJECUTIVO

### 📊 Estado Actual (Actualizado 2026-02-04)
- ✅ Backend estructura: **95% completado**
- ✅ Frontend editor: **92% completado**
- ✅ Validaciones: **100% completadas**
- ✅ Features avanzadas: **80% completadas**
  - ✅ Export Word funcional
  - ✅ Drag & Drop implementado
  - ✅ Upload imágenes (componente listo)
  - ✅ Historial de cambios UI
  - ⚠️ Rich-text editor (pendiente)
  - ⚠️ Vistas filtradas (pendiente)

### ⏱️ Estimación
- **Duración:** 4-5 semanas (19-26 días laborables)
- **6 sprints** iterativos

---

## 1. LO QUE YA ESTÁ (No implementar de nuevo)

✅ **Backend:**
- Entidades JPA: Guion, Acto, Escena, ElementoGuion, PasadaItem
- GuionService + PasadaItemService + Controllers
- Lock/unlock funcional
- Migración V6 completa

✅ **Frontend:**
- Editor tipo Word funcional
- Tablas Pasada/Escena editables
- Toolbar básico

---

## 2. LO QUE FALTA IMPLEMENTAR

### 🔴 ALTA PRIORIDAD (Sprints A-B)
1. **Validaciones avanzadas** (PIE, TOP, unicidad, encabezado)
2. **Rich-text editor** (bold, viñetas, colores)
3. **Código de colores** (corregir según Addendum)
4. **Upload imágenes** (multipart + storage)

### 🟡 MEDIA PRIORIDAD (Sprints C-D)
5. **Drag & Drop** reordenación
6. **Historial cambios** (AuditLog)
7. **Vistas filtradas** (Global Guion/Tops/Departamento)

### 🟢 BAJA PRIORIDAD (Sprints E-F)
8. **Export Word** (.docx con Apache POI)
9. **Admin UI colores**
10. **Tests E2E** (Playwright)

---

## 3. ROADMAP DE IMPLEMENTACIÓN

### SPRINT A: Validaciones + Colores (3-4 días)

#### A.1. Migración V16__tops_fase2_features.sql

```sql
-- Añadir columnas orden
ALTER TABLE actos ADD COLUMN IF NOT EXISTS orden INTEGER;
ALTER TABLE escenas ADD COLUMN IF NOT EXISTS orden INTEGER;
ALTER TABLE elementos_guion ADD COLUMN IF NOT EXISTS orden INTEGER;
ALTER TABLE pasada_items ADD COLUMN IF NOT EXISTS orden INTEGER;

-- Corregir colores según Addendum
UPDATE colores_elemento_guion SET color_hex = '#BDD6EE' WHERE tipo_elemento = 'TOP';
UPDATE colores_elemento_guion SET color_hex = '#FFE599' WHERE tipo_elemento = 'ENTRADA';
UPDATE colores_elemento_guion SET color_hex = '#FFFFFF' WHERE tipo_elemento = 'MUTIS';
UPDATE colores_elemento_guion SET color_hex = '#E2EFD9' WHERE tipo_elemento = 'INTERNO';

-- Insertar tipos faltantes
INSERT INTO colores_elemento_guion VALUES
('INSTRUCCION_TECNICA_PASADA', '#BDD6EE', 'Instrucción técnica Pasada', true),
('PLANO_ESCENARIO', '#BDD6EE', 'Plano de escenario', true),
('ANOTACION_LIBRE', '#FFFFFF', 'Anotación libre', true);

-- Tabla audit_log
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id BIGINT,
    user_email VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diff_json TEXT,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

-- Tabla imágenes
CREATE TABLE guion_images (
    id BIGSERIAL PRIMARY KEY,
    guion_id BIGINT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size BIGINT,
    storage_path VARCHAR(500),
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guion_id) REFERENCES guiones(id) ON DELETE CASCADE
);
```

#### A.2. Backend - ValidacionService.java

```java
@Service
public class ValidacionService {
    
    private static final Pattern PIE_PATTERN = Pattern.compile("^\\d+/\\d+/\\d+$");
    private static final Pattern TOP_EM_PATTERN = Pattern.compile("^\\d+(\\.\\d+)?$");
    private static final Set<String> DEPARTAMENTOS = Set.of(
        "M.E.", "MAQ.", "Útil.", "Elec.", "A/V.", "Sast", "Carac", "Otros"
    );
    
    public void validarPIE(String pie) {
        if (pie == null || !PIE_PATTERN.matcher(pie).matches()) {
            throw new ValidationException("PIE debe ser formato x/y/z");
        }
    }
    
    public void validarTopEM(String topEM) {
        if (topEM == null || !TOP_EM_PATTERN.matcher(topEM).matches()) {
            throw new ValidationException("TOP E/M debe ser n o n.m");
        }
    }
    
    public void validarDepartamento(String dept) {
        if (dept != null && !DEPARTAMENTOS.contains(dept)) {
            throw new ValidationException("Departamento inválido");
        }
    }
}
```

#### A.3. Frontend - Validators

```typescript
export class GuionValidators {
  static PIE_PATTERN = /^\d+\/\d+\/\d+$/;
  static TOP_EM_PATTERN = /^\d+(\.\d+)?$/;
  static DEPARTAMENTOS = ['M.E.', 'MAQ.', 'Útil.', 'Elec.', 'A/V.', 'Sast', 'Carac', 'Otros'];
  
  static pieValidator(control: AbstractControl): ValidationErrors | null {
    return control.value && !this.PIE_PATTERN.test(control.value) 
      ? { pieInvalido: true } 
      : null;
  }
}
```

#### A.4. ComboBox Departamentos

```html
<select [(ngModel)]="elemento.departamento">
  <option value="">Seleccionar...</option>
  <option *ngFor="let d of departamentos" [value]="d">{{d}}</option>
</select>
```

---

### SPRINT B: Rich-text + Imágenes (2-3 días)

#### B.1. Backend - ImageService.java

```java
@Service
public class ImageService {
    
    @Value("${guion.images.path:./uploads}")
    private String uploadPath;
    
    public GuionImage uploadImage(Long guionId, String entityType, Long entityId, 
                                   MultipartFile file, Long userId) {
        // Validar MIME y tamaño
        validateImage(file);
        
        // Guardar archivo
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadPath, guionId.toString(), filename);
        Files.createDirectories(path.getParent());
        Files.copy(file.getInputStream(), path);
        
        // Guardar en BD
        GuionImage img = new GuionImage();
        img.setGuionId(guionId);
        img.setEntityType(entityType);
        img.setEntityId(entityId);
        img.setStoragePath(path.toString());
        return imageRepository.save(img);
    }
}
```

#### B.2. Frontend - Quill Integration

```bash
npm install quill ngx-quill
```

```typescript
quillConfig = {
  toolbar: [
    ['bold'],
    [{ 'list': 'bullet' }],
    [{ 'color': ['#000000', '#FF0000'] }]
  ]
};
```

```html
<quill-editor 
  [modules]="quillConfig"
  [(ngModel)]="elemento.descripcion">
</quill-editor>
```

#### B.3. Image Upload Component

```typescript
onImageUpload(event: Event, elemento: ElementoGuion) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'ELEMENTO_GUION');
  formData.append('entityId', elemento.id.toString());
  
  this.http.post(`/api/guiones/${guionId}/images/upload`, formData)
    .subscribe(image => {
      elemento.imagenes.push(image);
    });
}
```

---

### SPRINT C: Drag & Drop + Audit (3-4 días)

#### C.1. Backend - ReorderController

```java
@PostMapping("/{id}/reorder")
public ResponseEntity<?> reorderElements(@PathVariable Long id, 
                                         @RequestBody ReorderRequest req) {
    guionService.reorderElements(id, req);
    return ResponseEntity.ok().build();
}
```

#### C.2. Frontend - Angular CDK DragDrop

```bash
npm install @angular/cdk
```

```typescript
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

drop(event: CdkDragDrop<ElementoGuion[]>) {
  moveItemInArray(this.elementos, event.previousIndex, event.currentIndex);
  this.saveOrder();
}
```

```html
<div cdkDropList (cdkDropListDropped)="drop($event)">
  <div *ngFor="let elem of elementos" cdkDrag>
    <!-- contenido -->
  </div>
</div>
```

#### C.3. AuditLog Service

```java
@Service
public class AuditService {
    
    @Autowired
    private AuditLogRepository auditRepo;
    
    public void logChange(String entityType, Long entityId, String action, 
                         Long userId, String diff) {
        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setUserId(userId);
        log.setDiffJson(diff);
        auditRepo.save(log);
    }
}
```

---

### SPRINT D: Vistas Filtradas (4 días)

#### D.1. Backend - Endpoints de Vistas

```java
@GetMapping("/{id}/vista/global")
public ResponseEntity<GuionVistaDTO> getVistaGlobal(@PathVariable Long id) {
    return ResponseEntity.ok(guionService.getVistaGlobal(id));
}

@GetMapping("/{id}/vista/tops")
public ResponseEntity<List<TopDTO>> getVistaTops(
    @PathVariable Long id,
    @RequestParam(required=false) String departamento) {
    return ResponseEntity.ok(guionService.getVistaTops(id, departamento));
}
```

#### D.2. Frontend - Componentes de Vista

```typescript
@Component({
  selector: 'app-guion-vista-global',
  template: `
    <div class="documento-word">
      <div class="encabezado">...</div>
      <div *ngFor="let acto of guion.actos">
        <h2>{{acto.nombre}}</h2>
        <app-pasada [items]="acto.pasadaItems"></app-pasada>
        <app-escena *ngFor="let esc of acto.escenas" [escena]="esc"></app-escena>
      </div>
    </div>
  `
})
export class GuionVistaGlobalComponent {}
```

---

### SPRINT E: Export Word (5-7 días)

#### E.1. Backend - ExportWordService

```java
@Service
public class ExportWordService {
    
    public byte[] exportToWord(Guion guion) throws IOException {
        XWPFDocument doc = new XWPFDocument();
        
        // Header
        XWPFHeader header = doc.createHeader(HeaderFooterType.DEFAULT);
        XWPFParagraph p = header.createParagraph();
        addLogoAndTitle(p);
        
        // Contenido
        addEncabezado(doc, guion);
        for (Acto acto : guion.getActos()) {
            addActo(doc, acto);
        }
        
        // Footer
        XWPFFooter footer = doc.createFooter(HeaderFooterType.DEFAULT);
        addPageNumber(footer);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        doc.write(out);
        return out.toByteArray();
    }
    
    private void addActo(XWPFDocument doc, Acto acto) {
        // Título acto
        XWPFParagraph p = doc.createParagraph();
        p.setStyle("Heading1");
        XWPFRun run = p.createRun();
        run.setText(acto.getNombre());
        
        // Pasada
        if (acto.getPasadaItems() != null) {
            addTablaPasada(doc, acto.getPasadaItems());
        }
        
        // Escenas
        for (Escena escena : acto.getEscenas()) {
            addEscena(doc, escena);
        }
    }
    
    private void addTablaPasada(XWPFDocument doc, List<PasadaItem> items) {
        XWPFTable table = doc.createTable(items.size(), 4);
        // Configurar colores, bordes, etc.
        for (int i = 0; i < items.size(); i++) {
            PasadaItem item = items.get(i);
            table.getRow(i).getCell(0).setText(item.getDepartamento());
            table.getRow(i).getCell(1).setText(item.getLugar());
            table.getRow(i).getCell(2).setText(item.getDescripcion());
            // Color fila
            table.getRow(i).getCell(0).setColor(item.getColorHex());
        }
    }
}
```

#### E.2. Controller Export

```java
@GetMapping("/{id}/export")
public ResponseEntity<byte[]> exportWord(@PathVariable Long id) {
    Guion guion = guionService.findById(id);
    byte[] docx = exportService.exportToWord(guion);
    
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
        .header("Content-Disposition", "attachment; filename=guion_" + id + ".docx")
        .body(docx);
}
```

#### E.3. Frontend - Botón Export

```html
<button (click)="exportarWord()">
  <i class="pi pi-file-word"></i> Exportar a Word
</button>
```

```typescript
exportarWord() {
  this.http.get(`/api/guiones/${this.guionId}/export`, { 
    responseType: 'blob' 
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guion_${this.guionId}.docx`;
    a.click();
  });
}
```

---

### SPRINT F: Tests E2E + QA (2-3 días)

#### F.1. Playwright Tests

```typescript
// tests/guion-editor.spec.ts
test('crear guion con validaciones', async ({ page }) => {
  await page.goto('/tops/guiones');
  
  // Intentar crear sin producción -> debe fallar
  await page.click('[data-test="btn-nuevo-guion"]');
  await page.click('[data-test="btn-guardar"]');
  await expect(page.locator('.error')).toContainText('Producción es obligatoria');
  
  // Crear correctamente
  await page.selectOption('[name="produccion"]', '1');
  await page.fill('[name="nombreObra"]', 'Carmen');
  await page.click('[data-test="btn-guardar"]');
  await expect(page).toHaveURL(/\/guiones\/\d+/);
});

test('validar PIE y TOP E/M', async ({ page }) => {
  await page.goto('/tops/guiones/1/editar');
  
  // PIE inválido
  await page.fill('[data-test="input-pie"]', '4-5-4');
  await expect(page.locator('.error-pie')).toBeVisible();
  
  // PIE válido
  await page.fill('[data-test="input-pie"]', '4/5/4');
  await expect(page.locator('.error-pie')).not.toBeVisible();
  
  // TOP E/M inválido
  await page.fill('[data-test="input-topem"]', '125a');
  await expect(page.locator('.error-topem')).toBeVisible();
  
  // TOP E/M válido
  await page.fill('[data-test="input-topem"]', '125.1');
  await expect(page.locator('.error-topem')).not.toBeVisible();
});

test('drag and drop reordenación', async ({ page }) => {
  await page.goto('/tops/guiones/1/editar');
  
  const elemento1 = page.locator('[data-test="elemento-1"]');
  const elemento2 = page.locator('[data-test="elemento-2"]');
  
  // Drag elemento 2 sobre elemento 1
  await elemento2.dragTo(elemento1);
  
  // Verificar orden cambió
  await expect(page.locator('[data-test="elementos"] > div').first())
    .toContainText('Elemento 2');
});

test('export word descarga archivo', async ({ page }) => {
  await page.goto('/tops/guiones/1/editar');
  
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-test="btn-export-word"]');
  const download = await downloadPromise;
  
  expect(download.suggestedFilename()).toMatch(/guion_\d+\.docx/);
});
```

---

## 4. CRITERIOS DE ACEPTACIÓN

### ✅ Sprint A - Validaciones
- [ ] No se puede validar guion sin encabezado completo (producción, compositor, directores)
- [ ] Guion requiere mínimo 1 acto para validar
- [ ] PIE solo acepta formato "x/y/z" (ej: 4/5/4)
- [ ] TOP E/M solo acepta formato "n" o "n.m" (ej: 120 o 125.1)
- [ ] No se permite duplicar número principal de TOP en misma producción
- [ ] Departamento solo acepta valores del catálogo: M.E., MAQ., Útil., Elec., A/V., Sast, Carac, Otros
- [ ] Colores aplicados automáticamente según tipo de elemento
- [ ] Colores coinciden con especificación Addendum

### ✅ Sprint B - Rich-text e Imágenes
- [ ] Editor rich-text con toolbar: bold, viñetas, color negro/rojo
- [ ] Contenido sanitizado para prevenir XSS
- [ ] Upload de imágenes acepta: JPEG, PNG, WebP
- [ ] Validación tamaño máximo 5MB por imagen
- [ ] Imágenes se muestran en celdas correspondientes
- [ ] Imágenes se almacenan en filesystem/storage configurado

### ✅ Sprint C - Drag & Drop y Audit
- [ ] Drag & drop funciona para Actos, Escenas, Elementos
- [ ] Orden se persiste correctamente en BD
- [ ] Optimistic update con reconciliación en caso de error
- [ ] Historial registra: CREATE, UPDATE, DELETE, REORDER
- [ ] Historial muestra: usuario, fecha/hora, tipo cambio
- [ ] Historial accesible desde detalle de guion

### ✅ Sprint D - Vistas
- [ ] Vista Global Guion muestra todos elementos (Pasadas + Escenas)
- [ ] Vista Global Tops muestra solo TOPs con filtros
- [ ] Vista Departamento Tops filtra por departamento técnico
- [ ] Vistas emulan estilo documento Word
- [ ] Vistas incluyen encabezado del guion
- [ ] Vistas son read-only (no edición)

### ✅ Sprint E - Export Word
- [ ] Header Word: logo izq, "GUION DE REGIDURIA" centro, "DEPARTAMENTO" der
- [ ] Footer Word: fecha actualización izq, número página der
- [ ] Tablas mantienen colores por fila según tipo
- [ ] Formato de texto preservado (bold, viñetas, colores)
- [ ] Imágenes incrustadas en posición correcta
- [ ] Grupos relacionados (TOP + instrucciones) no se dividen entre páginas (KeepTogether)

### ✅ Sprint F - Tests
- [ ] Tests unitarios backend: validaciones, servicios, export
- [ ] Tests unitarios frontend: validators, signals, componentes
- [ ] Tests E2E: crear guion, validar, reordenar, exportar, historial
- [ ] Coverage mínimo 70% en módulo TOPS

---

## 5. DEPENDENCIAS Y CONFIGURACIÓN

### Backend - pom.xml
```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>
<dependency>
    <groupId>org.jsoup</groupId>
    <artifactId>jsoup</artifactId>
    <version>1.16.1</version>
</dependency>
```

### Frontend - package.json
```json
{
  "dependencies": {
    "quill": "^1.3.7",
    "ngx-quill": "^23.0.0",
    "@angular/cdk": "^18.0.0"
  }
}
```

### Configuración application.properties
```properties
# Imágenes
guion.images.base-path=./uploads/guion-images
guion.images.max-size-mb=5

# Export Word
guion.export.logo-path=src/main/resources/static/logo-teatro-real.png
guion.export.keep-together=true
```

---

## 6. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Export Word complejo | Alta | Medio | Entregar v1 básico, iterar. Usar documentos seed para tests. |
| Reordenación race conditions | Media | Alto | Usar transacciones, locks cortos, reconciliación UI. |
| Rich-text XSS | Media | Alto | Sanitizar cliente Y servidor. Toolbar limitado. |
| Imágenes - storage | Baja | Medio | Límites de tamaño, validación MIME, limpieza periódica. |
| Performance con muchas imágenes | Media | Medio | Lazy loading, thumbnails, paginación. |

---

## 7. DEFINICIÓN DE DONE

Para considerar cada sprint completado:

1. ✅ **Código implementado** según especificación
2. ✅ **Tests unitarios** escritos y pasando (coverage >70%)
3. ✅ **Tests E2E** para casos principales
4. ✅ **Code review** aprobado
5. ✅ **Documentación** actualizada (README, OpenAPI)
6. ✅ **Demo funcional** en ambiente de desarrollo
7. ✅ **Sin bugs críticos** ni blockers
8. ✅ **Merge a develop** sin conflictos

---

## 8. ENTREGABLES POR SPRINT

### Sprint A ✅ COMPLETADO
- [x] Migración V16__tops_fase2_features.sql
- [x] ValidacionService.java + tests
- [x] GuionValidators (TypeScript) - validacion.service.ts
- [x] ComboBox departamentos en UI
- [x] Colores corregidos según Addendum

### Sprint B ✅ COMPLETADO (parcial)
- [x] ImageService.java (GuionImageService) + ImageController
- [x] GuionImage entity + repository
- [ ] Quill editor integrado (pendiente - usar TipTap o similar)
- [x] Image upload component - image-upload.component.ts

### Sprint C ✅ COMPLETADO
- [x] ReorderController + endpoint (ElementoGuionController, PasadaItemController)
- [x] Angular CDK DragDrop integrado en guion-editor
- [x] AuditService + AuditLog entity
- [x] Historial UI componente - audit-log-panel.component.ts

### Sprint D ⚠️ PENDIENTE
- [ ] Endpoints vistas (global, tops, departamento)
- [ ] Componentes vista read-only
- [ ] Filtros avanzados

### Sprint E ✅ COMPLETADO
- [x] ExportWordService con Apache POI (5.2.3)
- [x] Endpoint /api/guiones/{id}/export + controller
- [x] Botón export funcional en UI
- [ ] Tests con archivos Word seed

### Sprint F ⚠️ PENDIENTE
- [ ] Playwright tests suite completa
- [ ] Coverage report >70%
- [ ] Documentación final

---

## 9. CHECKLIST PRE-IMPLEMENTACIÓN

Antes de comenzar Sprint A, verificar:

- [ ] ✅ Migración V15 existe y fue aplicada
- [ ] ✅ Determinar número correcto próxima migración (V16 o V18)
- [ ] ✅ Auditar schema actual (qué columnas existen)
- [ ] ✅ Verificar configuración CORS para upload de archivos
- [ ] ✅ Configurar directorio uploads con permisos escritura
- [ ] ✅ Instalar Apache POI en proyecto backend
- [ ] ✅ Instalar Quill + Angular CDK en frontend
- [ ] ✅ Crear branch `feature/tops-fase2` desde develop
- [ ] ✅ Configurar Playwright para tests E2E
- [ ] ✅ Revisar reglas-tops1.md una última vez

---

## 10. COMANDOS ÚTILES

### Backend
```bash
# Crear migración
cd teatro-real-backend/src/main/resources/db/migration
# Crear V16__tops_fase2_features.sql manualmente

# Ejecutar tests
./mvnw test

# Build
./mvnw clean package -DskipTests
```

### Frontend
```bash
# Instalar dependencias
npm install quill ngx-quill @angular/cdk

# Tests
npm run test
npm run test:coverage

# E2E
npm run e2e
```

---

## 11. CONTACTOS Y RECURSOS

- **Documentación reglas:** `teatro-real/DOC_GENERADA/reglas-tops1.md`
- **Estado desarrollo:** `teatro-real/DOC_GENERADA/ESTADO_DESARROLLO.md`
- **Verificación plan:** `VERIFICACION_PLAN_IMPLEMENTACION_1.md`
- **Apache POI docs:** https://poi.apache.org/components/document/
- **Quill docs:** https://quilljs.com/docs/
- **Angular CDK:** https://material.angular.io/cdk/drag-drop/overview

---

## CONCLUSIÓN

Este plan de implementación FASE 2 está diseñado para **completar el 15% restante** del sistema TOPS de forma **iterativa y validada**. 

**Prioridad #1:** Validaciones + Colores (Sprint A)  
**Prioridad #2:** Rich-text + Imágenes (Sprint B)  
**Objetivo final:** Sistema TOPS 100% funcional según reglas-tops1.md

**Duración estimada:** 4-5 semanas  
**Comenzar por:** Sprint A - Validaciones

---

**Documento generado:** 2026-02-04  
**Versión:** 2.0 (Consolidado y verificado)  
**Listo para entregar a agente implementador** ✅
