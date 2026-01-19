/**
 * Script para extraer el contenido del guion Word y generar SQL
 *
 * Uso: node import-guion-word.js
 *
 * Requiere: npm install mammoth
 *
 * Genera: update-guion.sql - archivo SQL para ejecutar en Supabase
 */

const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Ruta al documento Word
const WORD_FILE = path.join(__dirname, '..', 'DOC_INICIAL', 'Copia de Guion Regiduria CARMEN.docx');

// Archivo de salida SQL
const SQL_OUTPUT = path.join(__dirname, 'update-guion.sql');

async function main() {
  console.log('='.repeat(60));
  console.log('GENERADOR DE SQL DESDE GUION WORD');
  console.log('='.repeat(60));

  // 1. Verificar que existe el archivo Word
  if (!fs.existsSync(WORD_FILE)) {
    console.error('ERROR: No se encuentra el archivo:', WORD_FILE);
    process.exit(1);
  }
  console.log('✓ Archivo Word encontrado:', WORD_FILE);

  // 2. Leer y parsear el documento Word
  console.log('\nLeyendo documento Word...');
  const wordContent = await parseWordDocument(WORD_FILE);

  // 3. Mostrar resumen del contenido parseado
  console.log('\n--- RESUMEN DEL CONTENIDO PARSEADO ---');
  for (const [actoKey, actoData] of Object.entries(wordContent.actos)) {
    console.log(`\n${actoKey}:`);
    console.log(`  Pasadas: ${actoData.pasadas.length}`);
    console.log(`  Escenas: ${actoData.escenas.length}`);
    for (const escena of actoData.escenas) {
      console.log(`    - ${escena.nombre}: ${escena.elementos.length} elementos`);
    }
  }

  // 4. Generar archivo SQL
  console.log('\n--- GENERANDO SQL ---');
  generateSQL(wordContent);

  console.log('\n' + '='.repeat(60));
  console.log('SQL GENERADO: ' + SQL_OUTPUT);
  console.log('Ejecuta este SQL en el editor SQL de Supabase');
  console.log('='.repeat(60));
}

/**
 * Parsea el documento Word y extrae la información estructurada
 */
async function parseWordDocument(filePath) {
  // Obtener el texto plano
  const textResult = await mammoth.extractRawText({ path: filePath });
  const text = textResult.value;

  // Guardar para debug
  fs.writeFileSync(path.join(__dirname, 'word-debug.txt'), text);
  console.log('✓ Archivo de debug guardado (word-debug.txt)');

  const content = {
    titulo: 'CARMEN',
    actos: {}
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  let currentActo = null;
  let currentSection = null; // 'pasada' o 'escena'
  let currentEscena = null;
  let currentPasada = null;
  let currentDepartamento = null;
  let descripcionLines = [];
  let currentElemento = null;

  // Patrones
  const actoPattern = /^ACTO\s+([IVX]+)/i;
  const pasadaPattern = /^PASADA\s*(PRIMERA|SEGUNDA|TERCERA|CUARTA)?/i;
  const escenaPattern = /^N°\s*(\d+)[:\s]*(.+)/i;
  const departamentoPattern = /^(M\.?E\.?|MAQ\.?|UTIL\.?|ELEC\.?|AV|A\/V\.?|SAST\.?|CARAC\.?|PLATAF\.?|FOSOS?|ESCENA)\.?$/i;
  const memPattern = /^MEM\.?\s*(\d+(?:\.\d+)?)\s*\(([^)]+)\)/i;
  const giroPattern = /^GIRO\s+(\d+)/i;

  let inPasadaSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar "PASADA" que precede a un acto
    if (pasadaPattern.test(line) && !line.includes('POSICIÓN PASADA')) {
      inPasadaSection = true;
      continue;
    }

    // Detectar nuevo acto (puede venir después de PASADA)
    const actoMatch = line.match(actoPattern);
    if (actoMatch) {
      // Guardar datos anteriores
      savePendingData();

      const actoNum = actoMatch[1];
      currentActo = `ACTO_${actoNum}`;
      if (!content.actos[currentActo]) {
        content.actos[currentActo] = { pasadas: [], escenas: [] };
      }

      // Si venimos de PASADA, entramos en sección pasada
      if (inPasadaSection) {
        currentSection = 'pasada';
        inPasadaSection = false;
      } else {
        currentSection = null;
      }
      continue;
    }

    // Detectar inicio de escena (N°1, N°2, etc.)
    const escenaMatch = line.match(escenaPattern);
    if (escenaMatch && currentActo) {
      // Guardar pasada pendiente antes de cambiar a escena
      if (currentPasada && descripcionLines.length > 0) {
        currentPasada.descripcion = descripcionLines.join('\n');
        content.actos[currentActo].pasadas.push({ ...currentPasada });
        currentPasada = null;
        descripcionLines = [];
      }
      saveCurrentElemento();

      const numEscena = escenaMatch[1];
      const nombreEscena = escenaMatch[2].trim();

      currentSection = 'escena';
      currentEscena = {
        numero: parseInt(numEscena),
        nombre: `N°${numEscena}: ${nombreEscena}`,
        elementos: []
      };
      content.actos[currentActo].escenas.push(currentEscena);
      continue;
    }

    // En sección PASADA
    if (currentSection === 'pasada' && currentActo) {
      // Detectar departamento
      if (departamentoPattern.test(line)) {
        // Guardar pasada anterior
        if (currentPasada && descripcionLines.length > 0) {
          currentPasada.descripcion = descripcionLines.join('\n');
          content.actos[currentActo].pasadas.push({ ...currentPasada });
        }

        currentDepartamento = normalizeDepartamento(line);
        descripcionLines = [];
        currentPasada = {
          departamento: currentDepartamento,
          lugar: '',
          descripcion: ''
        };
        continue;
      }

      // Si tenemos pasada activa
      if (currentPasada) {
        // Primera línea después de departamento puede ser lugar
        if (!currentPasada.lugar && line.length < 40 && !line.includes('TELÓN') && !line.includes('ROSAS')) {
          currentPasada.lugar = line;
        } else {
          descripcionLines.push(line);
        }
      }
    }

    // En sección ESCENA
    if (currentSection === 'escena' && currentEscena) {
      // Detectar MEM (memoria de iluminación)
      const memMatch = line.match(memPattern);
      if (memMatch) {
        saveCurrentElemento();

        const memNum = memMatch[1];
        const memTime = memMatch[2];
        currentElemento = {
          tipo: 'TOP',
          pie: `MEM. ${memNum} (${memTime})`,
          descripcion: '',
          departamentos: ['ELEC']
        };
        continue;
      }

      // Detectar GIRO (movimiento escénico)
      const giroMatch = line.match(giroPattern);
      if (giroMatch) {
        saveCurrentElemento();

        currentElemento = {
          tipo: 'TOP',
          pie: line,
          descripcion: '',
          departamentos: ['ME']
        };
        continue;
      }

      // Detectar cambio de departamento dentro de escena
      if (departamentoPattern.test(line)) {
        if (currentElemento) {
          currentElemento.departamentos = [normalizeDepartamento(line)];
        }
        continue;
      }

      // Acumular descripción del elemento actual
      if (currentElemento && line.length > 0) {
        if (currentElemento.descripcion) {
          currentElemento.descripcion += '\n' + line;
        } else {
          currentElemento.descripcion = line;
        }
      }
    }
  }

  // Guardar datos finales
  savePendingData();

  return content;

  function savePendingData() {
    // Guardar pasada pendiente
    if (currentPasada && descripcionLines.length > 0) {
      currentPasada.descripcion = descripcionLines.join('\n');
      if (currentActo && content.actos[currentActo]) {
        content.actos[currentActo].pasadas.push({ ...currentPasada });
      }
    }
    currentPasada = null;
    descripcionLines = [];

    // Guardar elemento pendiente
    saveCurrentElemento();
    currentEscena = null;
  }

  function saveCurrentElemento() {
    if (currentElemento && currentEscena) {
      if (currentElemento.descripcion || currentElemento.pie) {
        currentEscena.elementos.push({ ...currentElemento });
      }
    }
    currentElemento = null;
  }

  function normalizeDepartamento(dept) {
    const d = dept.toUpperCase().replace(/\./g, '').trim();
    const mapping = {
      'ME': 'ME',
      'MAQ': 'MAQ',
      'UTIL': 'UTIL',
      'ELEC': 'ELEC',
      'AV': 'AV',
      'A/V': 'AV',
      'SAST': 'SAST',
      'CARAC': 'CARAC',
      'PLATAF': 'PLATAF',
      'FOSO': 'FOSOS',
      'FOSOS': 'FOSOS',
      'ESCENA': 'ESCENA'
    };
    return mapping[d] || d;
  }
}

/**
 * Genera el archivo SQL con los comandos de actualización
 */
function generateSQL(wordContent) {
  let sql = `-- ============================================
-- SQL GENERADO AUTOMÁTICAMENTE DESDE WORD
-- Fecha: ${new Date().toISOString()}
-- ============================================

-- INSTRUCCIONES:
-- 1. Copia este SQL completo
-- 2. Ve a Supabase > SQL Editor
-- 3. Pega y ejecuta
-- 4. Verifica los resultados

-- Primero obtenemos IDs necesarios
DO $$
DECLARE
  v_produccion_id UUID;
  v_guion_id UUID;
  v_acto_id UUID;
  v_escena_id UUID;
BEGIN
  -- Obtener producción Carmen
  SELECT id INTO v_produccion_id FROM producciones WHERE nombre ILIKE '%carmen%' LIMIT 1;
  IF v_produccion_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró la producción Carmen';
  END IF;

  -- Obtener guion
  SELECT id INTO v_guion_id FROM guiones WHERE produccion_id = v_produccion_id LIMIT 1;
  IF v_guion_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró guion para Carmen';
  END IF;

  RAISE NOTICE 'Producción: %, Guion: %', v_produccion_id, v_guion_id;
END $$;

`;

  // Mapeo de actos del Word a nombres en BD
  const actoMapping = {
    'ACTO_I': 'Acto I',
    'ACTO_II': 'Acto II',
    'ACTO_III': 'Acto III',
    'ACTO_IV': 'Acto IV'
  };

  let totalPasadas = 0;
  let totalEscenas = 0;
  let totalElementos = 0;

  for (const [actoKey, actoData] of Object.entries(wordContent.actos)) {
    const actoNombre = actoMapping[actoKey] || actoKey;

    sql += `
-- ============================================
-- ${actoKey}
-- Pasadas: ${actoData.pasadas.length}
-- Escenas: ${actoData.escenas.length}
-- ============================================
`;

    // Generar UPDATEs para PASADAS
    if (actoData.pasadas.length > 0) {
      sql += `\n-- PASADAS ${actoKey}\n`;

      for (let i = 0; i < actoData.pasadas.length; i++) {
        const pasada = actoData.pasadas[i];
        const descripcionEscapada = escapeSql(pasada.descripcion);
        const lugarEscapado = escapeSql(pasada.lugar || '');
        const departamentoEscapado = escapeSql(pasada.departamento || '');

        sql += `
-- Pasada: ${pasada.departamento} - ${pasada.lugar || 'Sin lugar'}
UPDATE pasada_items
SET descripcion = '${descripcionEscapada}',
    lugar = '${lugarEscapado}'
WHERE acto_id IN (
  SELECT a.id FROM actos a
  JOIN guiones g ON a.guion_id = g.id
  JOIN producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
  AND a.nombre ILIKE '%${actoNombre}%'
)
AND UPPER(REPLACE(departamento, '.', '')) = '${departamentoEscapado.toUpperCase()}';

`;
        totalPasadas++;
      }
    }

    // Generar INSERTs/UPDATEs para ESCENAS y ELEMENTOS
    if (actoData.escenas.length > 0) {
      sql += `\n-- ESCENAS ${actoKey}\n`;

      for (let i = 0; i < actoData.escenas.length; i++) {
        const escena = actoData.escenas[i];
        const nombreEscapado = escapeSql(escena.nombre);

        sql += `
-- Escena: ${escena.nombre}
INSERT INTO escenas (acto_id, nombre, orden)
SELECT a.id, '${nombreEscapado}', ${escena.numero}
FROM actos a
JOIN guiones g ON a.guion_id = g.id
JOIN producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%${actoNombre}%'
ON CONFLICT DO NOTHING;

`;
        totalEscenas++;

        // Elementos de la escena
        for (let j = 0; j < escena.elementos.length; j++) {
          const elem = escena.elementos[j];
          const pieEscapado = escapeSql(elem.pie || '');
          const descEscapada = escapeSql(elem.descripcion || '');

          sql += `-- Elemento: ${elem.pie}
INSERT INTO elementos_guion (escena_id, tipo, pie, descripcion, orden)
SELECT e.id, '${elem.tipo}', '${pieEscapado}', '${descEscapada}', ${j + 1}
FROM escenas e
JOIN actos a ON e.acto_id = a.id
JOIN guiones g ON a.guion_id = g.id
JOIN producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
AND a.nombre ILIKE '%${actoNombre}%'
AND e.nombre = '${nombreEscapado}'
ON CONFLICT DO NOTHING;

`;
          totalElementos++;
        }
      }
    }
  }

  // Agregar consulta de verificación
  sql += `
-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar pasadas
SELECT
  a.nombre as acto,
  COUNT(*) as total_pasadas,
  SUM(LENGTH(pi.descripcion)) as total_chars
FROM pasada_items pi
JOIN actos a ON pi.acto_id = a.id
JOIN guiones g ON a.guion_id = g.id
JOIN producciones p ON g.produccion_id = p.id
WHERE p.nombre ILIKE '%carmen%'
GROUP BY a.nombre
ORDER BY a.nombre;

-- Verificar escenas
SELECT
  a.nombre as acto,
  COUNT(DISTINCT e.id) as total_escenas,
  COUNT(eg.id) as total_elementos
FROM actos a
JOIN guiones g ON a.guion_id = g.id
JOIN producciones p ON g.produccion_id = p.id
LEFT JOIN escenas e ON e.acto_id = a.id
LEFT JOIN elementos_guion eg ON eg.escena_id = e.id
WHERE p.nombre ILIKE '%carmen%'
GROUP BY a.nombre
ORDER BY a.nombre;
`;

  // Escribir archivo
  fs.writeFileSync(SQL_OUTPUT, sql);
  console.log(`✓ Archivo SQL generado: ${SQL_OUTPUT}`);
  console.log(`  - UPDATEs de pasadas: ${totalPasadas}`);
  console.log(`  - INSERTs de escenas: ${totalEscenas}`);
  console.log(`  - INSERTs de elementos: ${totalElementos}`);
}

function escapeSql(str) {
  if (!str) return '';
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\');
}

// Ejecutar
main().catch(err => {
  console.error('ERROR FATAL:', err);
  process.exit(1);
});
