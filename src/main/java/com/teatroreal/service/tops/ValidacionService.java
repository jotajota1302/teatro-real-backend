package com.teatroreal.service.tops;

import com.teatroreal.repository.tops.ElementoGuionRepository;
import org.springframework.stereotype.Service;

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
 */
@Service
public class ValidacionService {

    private final ElementoGuionRepository elementoGuionRepository;

    // Patrón PIE: "número/número/número" (ej: "4/5/4")
    private static final Pattern PIE_PATTERN = Pattern.compile("^\\d+/\\d+/\\d+$");

    // Patrón TOP E/M: número simple o con decimales (ej: "120" o "125.1")
    private static final Pattern TOP_EM_PATTERN = Pattern.compile("^\\d+(\\.\\d+)?$");

    // Departamentos válidos según reglas-tops1.md
    private static final Set<String> DEPARTAMENTOS_VALIDOS = new HashSet<>(
            Arrays.asList("M.E.", "MAQ.", "Útil.", "Elec.", "A/V.", "Sast", "Carac", "Otros")
    );

    public ValidacionService(ElementoGuionRepository elementoGuionRepository) {
        this.elementoGuionRepository = elementoGuionRepository;
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
