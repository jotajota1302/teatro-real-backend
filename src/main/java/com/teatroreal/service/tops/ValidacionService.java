package com.teatroreal.service.tops;

import com.teatroreal.repository.tops.ElementoGuionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.regex.Pattern;
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;

/**
 * Servicio de validaciones para TOPS
 * Implementa reglas-tops1.md:
 * - Validación PIE formato "x/y/z"
 * - Validación TOP E/M regex
 * - Validación unicidad de TOPs
 * - Validación encabezado obligatorio
 *
 * Añade sanitizeDepartamento para tolerancia frente a valores no reconocidos.
 */
@Service
@Slf4j
public class ValidacionService {

    private final ElementoGuionRepository elementoGuionRepository;

    // Patrón PIE: "número/número/número" (ej: "4/5/4")
    private static final Pattern PIE_PATTERN = Pattern.compile("^\\d+/\\d+/\\d+$");

    // Patrón TOP E/M: número simple o con decimales (ej: "120" o "125.1")
    private static final Pattern TOP_EM_PATTERN = Pattern.compile("^\\d+(\\.\\d+)?$");
    private static final Pattern NON_ALNUM_PATTERN = Pattern.compile("[^\\p{IsAlphabetic}\\p{IsDigit}]");

    // Departamentos válidos según reglas-tops1.md
    private static final Set<String> DEPARTAMENTOS_VALIDOS = new HashSet<>(
            Arrays.asList("M.E.", "MAQ.", "Útil.", "Elec.", "A/V.", "Sast", "Carac", "Otros")
    );

    public ValidacionService(ElementoGuionRepository elementoGuionRepository) {
        this.elementoGuionRepository = elementoGuionRepository;
    }

    /**
     * Sanitiza un valor de departamento:
     * - Si es null/empty devuelve null/empty.
     * - Si coincide (incluyendo case-insensitive) con un valor válido, devuelve la variante oficial del catálogo.
     * - Si no coincide, registra una advertencia y devuelve "Otros" (fallback seguro).
     *
     * Esto permite tolerancia cuando el frontend envía valores libres y evita errores 400/500.
     *
     * @param departamento valor recibido
     * @return valor sanitizado (uno de DEPARTAMENTOS_VALIDOS) o el valor original si es vacío/null
     */
    public String sanitizeDepartamento(String departamento) {
        if (departamento == null) return null;
        String trimmed = departamento.trim();
        if (trimmed.isEmpty()) return trimmed;

        // Comparación directa
        if (DEPARTAMENTOS_VALIDOS.contains(trimmed)) {
            return trimmed;
        }

        // Comparación case-insensitive y normalizada (evita diferencias de acentos/case)
        String normalized = normalize(trimmed);
        for (String d : DEPARTAMENTOS_VALIDOS) {
            if (normalize(d).equalsIgnoreCase(normalized)) {
                return d; // devolver la variante oficial del catálogo
            }
        }

        // Variantes frecuentes: con/sin puntos, abreviaturas y nombres completos
        String key = canonicalDepartamentoKey(trimmed);
        switch (key) {
            case "me":
            case "maquinaria":
                return "M.E.";
            case "maq":
            case "maquillaje":
                return "MAQ.";
            case "util":
            case "utileria":
                return "Útil.";
            case "elec":
            case "electrica":
                return "Elec.";
            case "av":
            case "audiovideo":
            case "audioyvideo":
                return "A/V.";
            case "sast":
            case "sastreria":
                return "Sast";
            case "carac":
            case "caracterizacion":
                return "Carac";
            case "otros":
                return "Otros";
            default:
                break;
        }

        // No reconocido -> fallback a "Otros" y log de advertencia para auditoría
        log.warn("[ValidacionService] Departamento no reconocido recibido='{}'. Se mapea a 'Otros'.", departamento);
        return "Otros";
    }

    private String normalize(String s) {
        if (s == null) return null;
        String n = Normalizer.normalize(s, Normalizer.Form.NFKD);
        return n.replaceAll("\\p{M}", ""); // eliminar marcas diacríticas
    }

    private String canonicalDepartamentoKey(String value) {
        String normalized = normalize(value);
        if (normalized == null) return "";
        String lower = normalized.toLowerCase();
        return NON_ALNUM_PATTERN.matcher(lower).replaceAll("");
    }

    /**
     * Valida que el PIE tenga formato correcto "x/y/z"
     *
     * @param pie String en formato "x/y/z"
     * @throws IllegalArgumentException si el formato es inválido
     */
    public void validarPIE(String pie) {
        if (pie == null || pie.trim().isEmpty()) {
            throw new IllegalArgumentException("PIE es obligatorio");
        }

        String pieTrimmed = pie.trim();
        if (!PIE_PATTERN.matcher(pieTrimmed).matches()) {
            throw new IllegalArgumentException(
                    "PIE debe tener formato x/y/z donde x, y, z son números (ej: 4/5/4). Recibido: " + pie
            );
        }
    }

    /**
     * Valida que el TOP E/M tenga formato correcto
     *
     * @param topEM String con formato "número" o "número.decimal"
     * @throws IllegalArgumentException si el formato es inválido
     */
    public void validarTopEM(String topEM) {
        if (topEM == null || topEM.trim().isEmpty()) {
            throw new IllegalArgumentException("TOP E/M es obligatorio");
        }

        String topEMTrimmed = topEM.trim();
        if (!TOP_EM_PATTERN.matcher(topEMTrimmed).matches()) {
            throw new IllegalArgumentException(
                    "TOP E/M debe ser número o número.decimal (ej: 120 o 125.1). Recibido: " + topEM
            );
        }
    }

    /**
     * Valida que el departamento sea uno de los catálogo permitidos
     *
     * @param departamento String con nombre del departamento
     * @throws IllegalArgumentException si no es válido
     */
    public void validarDepartamento(String departamento) {
        if (departamento == null || departamento.trim().isEmpty()) {
            return; // Departamento es opcional
        }

        String depTrimmed = departamento.trim();
        if (!DEPARTAMENTOS_VALIDOS.contains(depTrimmed)) {
            throw new IllegalArgumentException(
                    "Departamento inválido. Opciones permitidas: " +
                            String.join(", ", DEPARTAMENTOS_VALIDOS) +
                            ". Recibido: " + departamento
            );
        }
    }

    /**
     * Valida que el encabezado sea obligatorio para ciertos tipos de elemento
     *
     * @param tipoElemento Tipo de elemento
     * @param encabezado Contenido del encabezado
     * @throws IllegalArgumentException si el encabezado es obligatorio pero vacío
     */
    public void validarEncabezadoObligatorio(String tipoElemento, String encabezado) {
        // Tipos que requieren encabezado obligatorio
        Set<String> tiposConEncabezadoObligatorio = new HashSet<>(Arrays.asList(
                "TOP",
                "ENTRADA",
                "MUTIS",
                "INTERNO",
                "INSTRUCCION_TECNICA_PASADA",
                "PLANO_ESCENARIO"
        ));

        if (tiposConEncabezadoObligatorio.contains(tipoElemento)) {
            if (encabezado == null || encabezado.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Encabezado es obligatorio para tipo " + tipoElemento
                );
            }
        }
    }

    /**
     * Valida la unicidad del número TOP dentro de una producción
     * (evita duplicados)
     *
     * @param numeroTop Número del TOP
     * @param guionId ID del guion/producción (UUID string)
     * @param excludeElementoId ID del elemento a excluir (para updates)
     * @throws IllegalArgumentException si ya existe un TOP con ese número
     */
    public void validarUnicidadTop(String numeroTop, String guionId, String excludeElementoId) {
        if (numeroTop == null || numeroTop.trim().isEmpty()) {
            return; // No es obligatorio
        }

        long count = elementoGuionRepository.countByNumeroTopAndGuionIdExcluding(
                numeroTop,
                guionId,
                excludeElementoId != null ? excludeElementoId : ""
        );

        if (count > 0) {
            throw new IllegalArgumentException(
                    "Ya existe un TOP con número " + numeroTop + " en esta producción"
            );
        }
    }

    /**
     * Valida tipos de elemento permitidos
     *
     * @param tipoElemento String con el tipo
     * @throws IllegalArgumentException si el tipo no es válido
     */
    public void validarTipoElemento(String tipoElemento) {
        if (tipoElemento == null || tipoElemento.trim().isEmpty()) {
            throw new IllegalArgumentException("Tipo de elemento es obligatorio");
        }

        Set<String> tiposValidos = new HashSet<>(Arrays.asList(
                "TOP",
                "ENTRADA",
                "MUTIS",
                "INTERNO",
                "AVISO",
                "PASADA_ITEM",
                "INSTRUCCION_TECNICA_PASADA",
                "PLANO_ESCENARIO",
                "ANOTACION_LIBRE"
        ));

        String tipoUpper = tipoElemento.trim().toUpperCase();
        if (!tiposValidos.contains(tipoUpper)) {
            throw new IllegalArgumentException(
                    "Tipo de elemento inválido. Opciones: " +
                            String.join(", ", tiposValidos) +
                            ". Recibido: " + tipoElemento
            );
        }
    }

    /**
     * Valida el número TOP según su tipo
     *
     * @param numeroTop Número del TOP
     * @param tipoElemento Tipo de elemento
     * @throws IllegalArgumentException si el número es inválido para el tipo
     */
    public void validarNumeroTopSegunTipo(String numeroTop, String tipoElemento) {
        // Solo TOP, ENTRADA, MUTIS, INTERNO requieren número TOP
        Set<String> tiposConNumeroTop = new HashSet<>(Arrays.asList(
                "TOP", "ENTRADA", "MUTIS", "INTERNO"
        ));

        if (tiposConNumeroTop.contains(tipoElemento)) {
            if (numeroTop == null || numeroTop.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Número TOP es obligatorio para tipo " + tipoElemento
                );
            }
            validarTopEM(numeroTop);
        }
    }
}
