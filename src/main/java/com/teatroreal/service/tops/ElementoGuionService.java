package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.ElementoGuion;
import com.teatroreal.domain.tops.Escena;
import com.teatroreal.domain.tops.Guion;
import com.teatroreal.dto.request.ElementoGuionRequest;
import com.teatroreal.dto.response.ElementoGuionResponse;
import com.teatroreal.exception.ValidationException;
import com.teatroreal.repository.tops.ElementoGuionRepository;
import com.teatroreal.repository.tops.EscenaRepository;
import com.teatroreal.repository.tops.GuionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Servicio para operaciones CRUD en ElementoGuion
 * Implementa validaciones y persistencia
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ElementoGuionService {

    private final ElementoGuionRepository elementoGuionRepository;
    private final EscenaRepository escenaRepository;
    private final GuionRepository guionRepository;
    private final ValidacionService validacionService;
    private final AuditLogService auditLogService;

    /**
     * Obtiene un elemento por ID
     */
    public ElementoGuionResponse findById(String id) {
        ElementoGuion elemento = elementoGuionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + id));
        return ElementoGuionResponse.fromEntity(elemento);
    }

    /**
     * Obtiene todos los elementos de una escena, ordenados
     */
    public List<ElementoGuionResponse> findByEscenaId(String escenaId) {
        return elementoGuionRepository.findByEscenaIdOrderByOrden(escenaId).stream()
                .map(ElementoGuionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los elementos de un guion, ordenados
     */
    public List<ElementoGuionResponse> findByGuionId(String guionId) {
        return elementoGuionRepository.findByGuionIdOrderByOrden(guionId).stream()
                .map(ElementoGuionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo elemento con validaciones
     *
     * @param request DTO con datos del elemento
     * @param escenaId ID de la escena donde se crea
     * @param guionId ID del guion (para validar unicidad)
     * @param userId ID del usuario que crea (para audit)
     * @param userEmail Email del usuario (para audit)
     * @return ElementoGuionResponse creado
     */
    public ElementoGuionResponse create(ElementoGuionRequest request, String escenaId, String guionId, String userId, String userEmail) {
        log.debug("ElementoGuionService.create - tipoElemento={}, escenaId={}, guionId={}, userId={}",
                request != null ? request.getTipoElemento() : null, escenaId, guionId, userId);
        // Validaciones de negocio según reglas-tops1.md

        // 1. Validar tipo de elemento
        validacionService.validarTipoElemento(request.getTipoElemento().name());

        // 2. Validar PIE si está presente
        if (request.getRefPagina() != null && request.getRefCompas() != null && request.getRefTimecode() != null) {
            String pie = String.format("%s/%s/%s",
                request.getRefPagina(), request.getRefCompas(), request.getRefTimecode());
            validacionService.validarPIE(pie);
        }

        // 3. Validar número TOP según tipo
        validacionService.validarNumeroTopSegunTipo(
            request.getNumeroTop(),
            request.getTipoElemento().name()
        );

        // 4. Validar unicidad del número TOP (si aplica)
        if (request.getTipoElemento() == ElementoGuion.TipoElemento.TOP
                && request.getNumeroTop() != null
                && !request.getNumeroTop().trim().isEmpty()
                && guionId != null
                && !guionId.trim().isEmpty()) {
            validacionService.validarUnicidadTop(
                request.getNumeroTop(),
                guionId,
                null
            );
        }

        // 5. Sanitizar departamento: si viene un valor libre se mapeará a uno válido (p.ej. "Otros")
        if (request.getDepartamento() != null) {
            request.setDepartamento(validacionService.sanitizeDepartamento(request.getDepartamento()));
        }

        // 6. Validar encabezado obligatorio
        validacionService.validarEncabezadoObligatorio(
            request.getTipoElemento().name(),
            request.getEncabezado()
        );

        // Buscar escena
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new RuntimeException("Escena no encontrada: " + escenaId));

        // Si no se especifica orden, añadir al final de la escena
        Integer targetOrden = request.getOrden();
        if (targetOrden == null) {
            List<ElementoGuion> existentes = elementoGuionRepository.findByEscenaIdOrderByOrden(escenaId);
            if (existentes.isEmpty()) {
                targetOrden = 0;
            } else {
                Integer maxOrden = existentes.get(existentes.size() - 1).getOrden();
                targetOrden = (maxOrden != null ? maxOrden : existentes.size() - 1) + 1;
            }
        }

        // Crear elemento
        ElementoGuion elemento = new ElementoGuion();
        elemento.setEscena(escena);
        elemento.setTipoElemento(request.getTipoElemento());
        elemento.setNumeroTop(request.getNumeroTop());
        elemento.setRefPagina(request.getRefPagina());
        elemento.setRefCompas(request.getRefCompas());
        elemento.setRefTimecode(request.getRefTimecode());
        elemento.setEncabezado(request.getEncabezado());
        elemento.setContenido(request.getContenido());
        elemento.setDepartamento(request.getDepartamento());
        elemento.setOrden(targetOrden);
        elemento.setImagen(request.getImagen());

        // Asignar color según tipo de elemento
        String colorHex = getColorForType(request.getTipoElemento());
        elemento.setColorHex(colorHex);

        ElementoGuion saved = elementoGuionRepository.save(elemento);

        // Registrar en audit log
        auditLogService.registrarAccion(
            "ELEMENTO_GUION",
            String.valueOf(saved.getId()),
            "CREATE",
            userId,
            userEmail,
            String.format("Creado elemento tipo %s", request.getTipoElemento())
        );

        return ElementoGuionResponse.fromEntity(saved);
    }

    /**
     * Inserta un nuevo elemento en una posición (orden) dentro de una escena de forma transaccional.
     * Ajusta los ordenes existentes (>= orden) incrementándolos y crea el nuevo elemento con el orden indicado.
     *
     * @param request DTO con datos del elemento
     * @param escenaId ID de la escena donde se crea
     * @param guionId ID del guion (para validar unicidad)
     * @param orden Posición a insertar (si null, se añade al final)
     * @param userId ID del usuario que crea (para audit)
     * @param userEmail Email del usuario (para audit)
     * @return ElementoGuionResponse creado
     */
    public ElementoGuionResponse insertInOrder(ElementoGuionRequest request, String escenaId, String guionId, Integer orden, String userId, String userEmail) {
        log.debug("ElementoGuionService.insertInOrder - tipoElemento={}, escenaId={}, guionId={}, orden={}, userId={}",
                request != null ? request.getTipoElemento() : null, escenaId, guionId, orden, userId);

        // Buscar escena y elementos actuales primero para detectar inserts de instrucción técnica asociada a TOP.
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new RuntimeException("Escena no encontrada: " + escenaId));
        List<ElementoGuion> existentes = elementoGuionRepository.findByEscenaIdOrderByOrden(escenaId);

        // Salvaguarda: si llega como TOP pero se inserta adyacente a un TOP/PIE idéntico,
        // tratarlo como instrucción técnica asociada para evitar choque de unicidad.
        if (request.getTipoElemento() == ElementoGuion.TipoElemento.TOP
                && isLikelyTopInstructionInsert(request, existentes, orden)) {
            request.setTipoElemento(ElementoGuion.TipoElemento.INSTRUCCION_TECNICA_PASADA);
        }

        // Reutilizar las mismas validaciones que en create
        validacionService.validarTipoElemento(request.getTipoElemento().name());
        if (request.getRefPagina() != null && request.getRefCompas() != null && request.getRefTimecode() != null) {
            String pie = String.format("%s/%s/%s",
                    request.getRefPagina(), request.getRefCompas(), request.getRefTimecode());
            validacionService.validarPIE(pie);
        }
        validacionService.validarNumeroTopSegunTipo(
            request.getNumeroTop(),
            request.getTipoElemento().name()
        );
        if (request.getTipoElemento() == ElementoGuion.TipoElemento.TOP
                && request.getNumeroTop() != null
                && !request.getNumeroTop().trim().isEmpty()
                && guionId != null
                && !guionId.trim().isEmpty()) {
            validacionService.validarUnicidadTop(
                request.getNumeroTop(),
                guionId,
                null
            );
        }

        // Sanitizar departamento antes de persistir
        if (request.getDepartamento() != null) {
            request.setDepartamento(validacionService.sanitizeDepartamento(request.getDepartamento()));
        }

        validacionService.validarEncabezadoObligatorio(
            request.getTipoElemento().name(),
            request.getEncabezado()
        );

        // Calcular posición objetivo por índice de inserción (robusto frente a órdenes no normalizados)
        int insertPos = (orden != null) ? orden : existentes.size();
        if (insertPos < 0) insertPos = 0;
        if (insertPos > existentes.size()) insertPos = existentes.size();

        int targetOrden;
        if (existentes.isEmpty()) {
            targetOrden = 0;
        } else if (insertPos == existentes.size()) {
            Integer lastOrden = existentes.get(existentes.size() - 1).getOrden();
            targetOrden = (lastOrden != null ? lastOrden : existentes.size() - 1) + 1;
        } else {
            Integer ordenAtPos = existentes.get(insertPos).getOrden();
            targetOrden = ordenAtPos != null ? ordenAtPos : insertPos;
        }

        // Incrementar ordenes existentes >= targetOrden
        for (ElementoGuion e : existentes) {
            int currentOrden = e.getOrden() != null ? e.getOrden() : 0;
            if (currentOrden >= targetOrden) {
                e.setOrden(currentOrden + 1);
                elementoGuionRepository.save(e);
            }
        }

        // Crear el nuevo elemento con el orden objetivo
        ElementoGuion elemento = new ElementoGuion();
        elemento.setEscena(escena);
        elemento.setTipoElemento(request.getTipoElemento());
        elemento.setNumeroTop(request.getNumeroTop());
        elemento.setRefPagina(request.getRefPagina());
        elemento.setRefCompas(request.getRefCompas());
        elemento.setRefTimecode(request.getRefTimecode());
        elemento.setEncabezado(request.getEncabezado());
        elemento.setContenido(request.getContenido());
        elemento.setDepartamento(request.getDepartamento());
        elemento.setOrden(targetOrden);
        elemento.setImagen(request.getImagen());

        String colorHex = getColorForType(request.getTipoElemento());
        elemento.setColorHex(colorHex);

        ElementoGuion saved = elementoGuionRepository.save(elemento);

        // Registrar en audit log
        auditLogService.registrarAccion(
            "ELEMENTO_GUION",
            String.valueOf(saved.getId()),
            "CREATE",
            userId,
            userEmail,
            String.format("Creado elemento tipo %s (insertInOrder)", request.getTipoElemento())
        );

        return ElementoGuionResponse.fromEntity(saved);
    }

    private boolean isLikelyTopInstructionInsert(ElementoGuionRequest request, List<ElementoGuion> existentes, Integer orden) {
        if (orden == null || existentes == null || existentes.isEmpty()) return false;
        String numero = safe(request.getNumeroTop());
        if (numero.isEmpty()) return false;

        int pos = Math.max(0, Math.min(orden, existentes.size()));
        String pieReq = buildPie(request.getRefPagina(), request.getRefCompas(), request.getRefTimecode());

        ElementoGuion prev = pos > 0 ? existentes.get(pos - 1) : null;
        ElementoGuion next = pos < existentes.size() ? existentes.get(pos) : null;

        return matchesTopAnchor(prev, numero, pieReq) || matchesTopAnchor(next, numero, pieReq);
    }

    private boolean matchesTopAnchor(ElementoGuion elem, String numero, String pieReq) {
        if (elem == null) return false;
        if (elem.getTipoElemento() != ElementoGuion.TipoElemento.TOP
                && elem.getTipoElemento() != ElementoGuion.TipoElemento.INSTRUCCION_TECNICA_PASADA) {
            return false;
        }

        if (!Objects.equals(safe(elem.getNumeroTop()), numero)) return false;

        if (pieReq.isEmpty()) return true;
        String pieElem = buildPie(elem.getRefPagina(), elem.getRefCompas(), elem.getRefTimecode());
        return Objects.equals(pieElem, pieReq);
    }

    private String buildPie(String pagina, String compas, String timecode) {
        String p = safe(pagina);
        String c = safe(compas);
        String t = safe(timecode);
        if (p.isEmpty() || c.isEmpty() || t.isEmpty()) return "";
        return p + "/" + c + "/" + t;
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    /**
     * Actualiza un elemento existente (update parcial - solo campos no nulos)
     *
     * @param id ID del elemento
     * @param request DTO con datos actualizados
     * @return ElementoGuionResponse actualizado
     */
    public ElementoGuionResponse update(String id, ElementoGuionRequest request) {
        ElementoGuion elemento = elementoGuionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + id));

        // Update parcial: solo actualizar campos que vienen en el request
        if (request.getTipoElemento() != null) {
            elemento.setTipoElemento(request.getTipoElemento());
            // Actualizar color si cambió el tipo
            String colorHex = getColorForType(request.getTipoElemento());
            elemento.setColorHex(colorHex);
        }
        if (request.getNumeroTop() != null) {
            elemento.setNumeroTop(request.getNumeroTop());
        }
        if (request.getRefPagina() != null) {
            elemento.setRefPagina(request.getRefPagina());
        }
        if (request.getRefCompas() != null) {
            elemento.setRefCompas(request.getRefCompas());
        }
        if (request.getRefTimecode() != null) {
            elemento.setRefTimecode(request.getRefTimecode());
        }
        if (request.getEncabezado() != null) {
            elemento.setEncabezado(request.getEncabezado());
        }
        if (request.getContenido() != null) {
            elemento.setContenido(request.getContenido());
        }
        if (request.getDepartamento() != null) {
            elemento.setDepartamento(request.getDepartamento());
        }
        if (request.getOrden() != null) {
            elemento.setOrden(request.getOrden());
        }
        // Imagen: solo actualizar si viene explícitamente en el request
        // String vacío = borrar imagen, String con valor = nueva URL
        if (request.getImagen() != null) {
            elemento.setImagen(request.getImagen().isEmpty() ? null : request.getImagen());
        }

        try {
            // Log before saving to capture problematic values (e.g. departamento)
            log.debug("ElementoGuionService.update - intentando save id={}, departamentoRequest={}, departamentoActual={}",
                    id, request.getDepartamento(), elemento.getDepartamento());
            ElementoGuion saved = elementoGuionRepository.save(elemento);
            log.info("ElementoGuionService.update - save OK id={}, departamento={}", saved.getId(), saved.getDepartamento());
            return ElementoGuionResponse.fromEntity(saved);
        } catch (Exception ex) {
            // Log full context to help debugging the 500 error from frontend
            log.error("ElementoGuionService.update - error guardando elemento id={}, departamentoRequest={}, elementoState={}",
                    id, request.getDepartamento(), elemento, ex);
            throw ex;
        }
    }

    /**
     * Elimina un elemento
     *
     * @param id ID del elemento
     */
    public void delete(String id) {
        if (!elementoGuionRepository.existsById(id)) {
            throw new RuntimeException("Elemento no encontrado: " + id);
        }
        elementoGuionRepository.deleteById(id);
    }

    /**
     * Reordena elementos dentro de una escena
     *
     * @param escenaId ID de la escena
     * @param elementIds Lista ordenada de IDs
     */
    public void reorderElements(String escenaId, List<String> elementIds) {
        Escena escena = escenaRepository.findById(escenaId)
                .orElseThrow(() -> new RuntimeException("Escena no encontrada: " + escenaId));

        for (int i = 0; i < elementIds.size(); i++) {
            String elementId = elementIds.get(i);
            ElementoGuion elemento = elementoGuionRepository.findById(elementId)
                    .orElseThrow(() -> new RuntimeException("Elemento no encontrado: " + elementId));

            // Verificar que el elemento pertenece a la escena
            if (!elemento.getEscena().getId().equals(escenaId)) {
                throw new ValidationException("Elemento " + elementId + " no pertenece a la escena " + escenaId);
            }

            elemento.setOrden(i);
            elementoGuionRepository.save(elemento);
        }
    }

    /**
     * Obtiene el color hex para un tipo de elemento
     * Basado en colores definidos en reglas-tops1.md
     *
     * @param tipoElemento Tipo de elemento
     * @return Color hex (ej: #BDD6EE)
     */
    private String getColorForType(ElementoGuion.TipoElemento tipoElemento) {
        return switch (tipoElemento) {
            case TOP -> "#BDD6EE";                    // Azul claro - Instrucciones técnicas
            case ENTRADA -> "#FFE599";                 // Amarillo - Indicación Entrada
            case MUTIS -> "#FFFFFF";                   // Blanco - Indicación Mutis
            case INTERNO -> "#E2EFD9";                 // Verde claro - Indicación Interna
            case INSTRUCCION_TECNICA_PASADA -> "#BDD6EE";  // Azul claro
            case PLANO_ESCENARIO -> "#BDD6EE";         // Azul claro
            case ANOTACION_LIBRE -> "#FFFFFF";         // Blanco
            case AVISO -> "#FFC7CE";                    // Rosa claro - Avisos
            case PASADA_ITEM -> "#FFFFFF";             // Blanco
        };
    }
}
