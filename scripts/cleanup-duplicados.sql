-- ============================================
-- LIMPIEZA DE DUPLICADOS - Carmen
-- Ejecutar ANTES de volver a cargar datos
-- ============================================

-- 1. Eliminar elementos_guion duplicados (mantener solo el primero por escena+descripcion+orden)
DELETE FROM teatro_real.elementos_guion
WHERE id NOT IN (
  SELECT DISTINCT ON (escena_id, descripcion, orden) id
  FROM teatro_real.elementos_guion
  ORDER BY escena_id, descripcion, orden, created_at ASC
);

-- 2. Eliminar escenas duplicadas (mantener solo la primera por acto+nombre)
DELETE FROM teatro_real.escenas
WHERE id NOT IN (
  SELECT DISTINCT ON (acto_id, nombre) id
  FROM teatro_real.escenas
  ORDER BY acto_id, nombre, created_at ASC
);

-- 3. Eliminar pasada_items duplicadas (mantener solo la primera por acto+departamento+lugar)
DELETE FROM teatro_real.pasada_items
WHERE id NOT IN (
  SELECT DISTINCT ON (acto_id, departamento, lugar) id
  FROM teatro_real.pasada_items
  ORDER BY acto_id, departamento, lugar, created_at ASC
);

-- 3. Verificar conteo después de limpieza
SELECT 'escenas' as tabla, COUNT(*) as total FROM teatro_real.escenas
WHERE acto_id IN (
  SELECT a.id FROM teatro_real.actos a
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
)
UNION ALL
SELECT 'elementos_guion', COUNT(*) FROM teatro_real.elementos_guion
WHERE escena_id IN (
  SELECT e.id FROM teatro_real.escenas e
  JOIN teatro_real.actos a ON e.acto_id = a.id
  JOIN teatro_real.guiones g ON a.guion_id = g.id
  JOIN teatro_real.producciones p ON g.produccion_id = p.id
  WHERE p.nombre ILIKE '%carmen%'
);
