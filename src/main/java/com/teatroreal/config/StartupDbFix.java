package com.teatroreal.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Ejecuta correcciones mínimas en la base de datos al arrancar para entornos de desarrollo.
 * - Añade columnas faltantes en audit_log si no existen, para evitar errores SQL durante
 *   operaciones que intentan insertar en esa tabla.
 *
 * Nota: Es una solución temporal para entornos dev; en producción las migraciones deben
 * aplicarse correctamente con Flyway.
 */
@Component
public class StartupDbFix implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StartupDbFix.class);

    private final DataSource dataSource;

    public StartupDbFix(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("StartupDbFix: comprobando y corrigiendo esquema mínimo en dev si es necesario...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // Añadir columna ACTION si falta
            try {
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS action VARCHAR(20)");
                log.debug("StartupDbFix: ensured column 'action' exists on audit_log");
            } catch (Exception ex) {
                log.warn("StartupDbFix: no se pudo añadir columna 'action' (puede que no exista la tabla). Error: {}", ex.getMessage());
            }

            // Añadir columnas auxiliares que el código espera (incluye entity_type/entity_id)
            try {
                // columnas relacionadas con usuario/metadata
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_id VARCHAR(36)");
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)");
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS diff_json TEXT");
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

                // columnas necesarias para registrar entidad y tipo (evitar error 'ENTITY_ID no encontrada')
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50)");
                stmt.execute("ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_id VARCHAR(36)");

                log.debug("StartupDbFix: ensured auxiliary columns (user_id,user_email,diff_json,timestamp,entity_type,entity_id) exist on audit_log");
            } catch (Exception ex) {
                log.warn("StartupDbFix: no se pudieron añadir columnas auxiliares en audit_log: {}", ex.getMessage());
            }

            // Asegurar columna tipo_seccion en escenas (Flyway está desactivado en dev)
            try {
                stmt.execute("ALTER TABLE escenas ADD COLUMN IF NOT EXISTS tipo_seccion VARCHAR(20) DEFAULT 'ESCENA'");
                stmt.execute("UPDATE escenas SET tipo_seccion='ESCENA' WHERE tipo_seccion IS NULL OR TRIM(tipo_seccion)=''");
                stmt.execute("ALTER TABLE escenas ALTER COLUMN tipo_seccion SET NOT NULL");
                log.debug("StartupDbFix: ensured column 'tipo_seccion' exists on escenas");
            } catch (Exception ex) {
                log.warn("StartupDbFix: no se pudo asegurar columna 'tipo_seccion' en escenas: {}", ex.getMessage());
            }

            // Asegurar columnas de tipos de pasada (plano escenario) en dev
            try {
                stmt.execute("ALTER TABLE pasada_items ADD COLUMN IF NOT EXISTS tipo_item VARCHAR(30) DEFAULT 'INSTRUCCION_TECNICA'");
                stmt.execute("ALTER TABLE pasada_items ADD COLUMN IF NOT EXISTS titulo_plano VARCHAR(255)");
                stmt.execute("UPDATE pasada_items SET tipo_item='INSTRUCCION_TECNICA' WHERE tipo_item IS NULL OR TRIM(tipo_item)=''");
                stmt.execute("ALTER TABLE pasada_items ALTER COLUMN tipo_item SET NOT NULL");
                log.debug("StartupDbFix: ensured columns 'tipo_item'/'titulo_plano' exist on pasada_items");
            } catch (Exception ex) {
                log.warn("StartupDbFix: no se pudo asegurar columnas de plano en pasada_items: {}", ex.getMessage());
            }

            // Asegurar longitud de tipo_elemento en elementos_guion para enums largos
            try {
                stmt.execute("ALTER TABLE elementos_guion ALTER COLUMN tipo_elemento TYPE VARCHAR(50)");
                log.debug("StartupDbFix: ensured elementos_guion.tipo_elemento has length 50");
            } catch (Exception ex) {
                log.warn("StartupDbFix: no se pudo ampliar elementos_guion.tipo_elemento a VARCHAR(50): {}", ex.getMessage());
            }

            log.info("StartupDbFix: comprobación terminada.");
        } catch (Exception e) {
            log.error("StartupDbFix: error al conectarse a la BD para comprobar audit_log: {}", e.getMessage(), e);
        }
    }
}
