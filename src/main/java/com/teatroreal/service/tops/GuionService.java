package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.*;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.request.GuionRequest;
import com.teatroreal.dto.response.GuionResponse;
import com.teatroreal.dto.response.GuionCompletoResponse;
import com.teatroreal.exception.ValidationException;
import com.teatroreal.repository.tops.*;
import com.teatroreal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GuionService {

    @Autowired
    private GuionRepository guionRepository;

    @Autowired
    private ActoRepository actoRepository;

    @Autowired
    private EscenaRepository escenaRepository;

    @Autowired
    private ElementoGuionRepository elementoGuionRepository;

    @Autowired
    private PasadaItemRepository pasadaItemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private GuionImageService guionImageService;

    // ==================== CRUD Bรกsico ====================

    public List<GuionResponse> findAll() {
        return guionRepository.findAll().stream()
                .map(g -> {
                    Long totalTops = guionRepository.countTopsByGuionId(g.getId());
                    return GuionResponse.fromEntity(g, totalTops);
                })
                .collect(Collectors.toList());
    }

    public List<GuionResponse> findByTemporada(String temporada) {
        return guionRepository.findByTemporadaOrderByProduccionNombreAsc(temporada).stream()
                .map(g -> {
                    Long totalTops = guionRepository.countTopsByGuionId(g.getId());
                    return GuionResponse.fromEntity(g, totalTops);
                })
                .collect(Collectors.toList());
    }

    public List<GuionResponse> findByFilters(String temporada, String titulo) {
        final String tituloSafe = (titulo != null) ? titulo.trim() : "";
        final boolean hasTemporada = temporada != null && !temporada.trim().isEmpty();
        final boolean hasTitulo = !tituloSafe.isEmpty();

        List<Guion> guiones;
        if (hasTemporada && hasTitulo) {
            guiones = guionRepository.findByTemporadaAndProduccionNombreContainingIgnoreCaseOrderByProduccionNombreAsc(
                    temporada.trim(), tituloSafe
            );
        } else if (hasTemporada) {
            guiones = guionRepository.findByTemporadaOrderByProduccionNombreAsc(temporada.trim());
        } else if (hasTitulo) {
            guiones = guionRepository.findByProduccionNombreContainingIgnoreCaseOrderByProduccionNombreAsc(tituloSafe);
        } else {
            guiones = guionRepository.findAll();
        }

        return guiones.stream()
                .map(g -> {
                    Long totalTops = guionRepository.countTopsByGuionId(g.getId());
                    return GuionResponse.fromEntity(g, totalTops);
                })
                .collect(Collectors.toList());
    }

    public GuionResponse findById(String id) {
        Guion guion = guionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));
        Long totalTops = guionRepository.countTopsByGuionId(id);
        return GuionResponse.fromEntity(guion, totalTops);
    }

    /**
     * Obtiene el guion completo con todo el รกrbol para el editor
     * Carga los datos en mรบltiples queries para evitar problemas con Hibernate
     */
    @Transactional(readOnly = true)
    public GuionCompletoResponse findByIdCompleto(String id) {
        // Primero cargar guion con actos
        Guion guion = guionRepository.findByIdWithActos(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));

        // Cargar cada acto con sus pasada items y escenas
        for (Acto acto : guion.getActos()) {
            // Forzar inicializaciรณn de colecciones lazy
            acto.getPasadaItems().size();
            for (Escena escena : acto.getEscenas()) {
                // Forzar inicializaciรณn de elementos
                escena.getElementos().size();
            }
        }

        GuionCompletoResponse response = GuionCompletoResponse.fromEntity(guion);

        // Cargar todas las imรกgenes del guion y poblarlas en el response
        List<GuionImage> allImages = guionImageService.obtenerImagenesPorGuion(id);

        // Crear mapa de imรกgenes por entityType:entityId
        java.util.Map<String, List<String>> imagesByEntity = new java.util.HashMap<>();
        for (GuionImage img : allImages) {
            String key = img.getEntityType() + ":" + img.getEntityId();
            imagesByEntity.computeIfAbsent(key, k -> new java.util.ArrayList<>())
                    .add("/api/tops/images/" + img.getId());
        }

        // Poblar imรกgenes en pasada items y elementos
        for (GuionCompletoResponse.ActoDto acto : response.getActos()) {
            for (GuionCompletoResponse.PasadaItemDto pasada : acto.getPasada()) {
                String key = "PASADA_ITEM:" + pasada.getId();
                if (imagesByEntity.containsKey(key)) {
                    pasada.setImagenes(imagesByEntity.get(key));
                }
            }
            for (GuionCompletoResponse.EscenaDto escena : acto.getEscenas()) {
                for (GuionCompletoResponse.ElementoDto elem : escena.getElementos()) {
                    String key = "TOP:" + elem.getId();
                    if (imagesByEntity.containsKey(key)) {
                        elem.setImagenes(imagesByEntity.get(key));
                    }
                }
            }
        }

        return response;
    }

    public GuionResponse create(GuionRequest request, String createdById) {
        Guion guion = new Guion();
        mapRequestToEntity(request, guion);
        guion.setEstado(Guion.EstadoGuion.BORRADOR);

        Usuario createdBy = null;
        if (createdById != null) {
            createdBy = usuarioRepository.findById(createdById).orElse(null);
            guion.setCreatedBy(createdBy);
        }

        Guion saved = guionRepository.save(guion);

        // Auditar creaciรณn
        if (createdBy != null) {
            auditLogService.registrarAccion(
                "GUION",
                saved.getId(),
                "CREATE",
                createdBy.getId(),
                createdBy.getEmail()
            );
        }

        return GuionResponse.fromEntity(saved, 0L);
    }

    /**
     * Crea un guion con actos iniciales
     */
    public GuionResponse createWithActos(GuionRequest request, int numActos, String createdById) {
        Guion guion = new Guion();
        mapRequestToEntity(request, guion);
        guion.setEstado(Guion.EstadoGuion.BORRADOR);

        if (createdById != null) {
            Usuario createdBy = usuarioRepository.findById(createdById).orElse(null);
            guion.setCreatedBy(createdBy);
        }

        // Crear actos iniciales
        for (int i = 1; i <= numActos; i++) {
            Acto acto = new Acto();
            acto.setNombre("ACTO " + toRoman(i));
            acto.setOrden(i);
            guion.addActo(acto);
        }

        Guion saved = guionRepository.save(guion);
        return GuionResponse.fromEntity(saved, 0L);
    }

    public GuionResponse update(String id, GuionRequest request, String userId) {
        Guion guion = guionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));

        mapRequestToEntity(request, guion);
        Guion saved = guionRepository.save(guion);

        // Auditar actualizaciรณn
        if (userId != null) {
            Usuario user = usuarioRepository.findById(userId).orElse(null);
            if (user != null) {
                auditLogService.registrarAccion(
                    "GUION",
                    saved.getId(),
                    "UPDATE",
                    user.getId(),
                    user.getEmail()
                );
            }
        }

        Long totalTops = guionRepository.countTopsByGuionId(id);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    public void delete(String id) {
        if (!guionRepository.existsById(id)) {
            throw new RuntimeException("Guion no encontrado: " + id);
        }
        guionRepository.deleteById(id);
    }

    // ==================== Bloqueo de Ediciรณn ====================

    /**
     * Bloquea el guion para ediciรณn exclusiva
     */
    public GuionResponse lockGuion(String guionId, String userId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Verificar si ya estรก bloqueado por otro usuario
        if (guion.isLocked() && guion.isLockedByOther(userId)) {
            throw new RuntimeException("El guion estรก siendo editado por " + guion.getLockedBy().getNombre());
        }

        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + userId));

        guion.setLockedBy(user);
        guion.setLockedAt(LocalDateTime.now());
        guion.setEstado(Guion.EstadoGuion.EN_EDICION);

        Guion saved = guionRepository.save(guion);

        // Auditar bloqueo
        auditLogService.registrarAccion(
            "GUION",
            guionId,
            "LOCK",
            user.getId(),
            user.getEmail()
        );

        Long totalTops = guionRepository.countTopsByGuionId(guionId);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    /**
     * Desbloquea el guion
     */
    public GuionResponse unlockGuion(String guionId, String userId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Solo el usuario que bloqueรณ puede desbloquear (o admin)
        if (guion.isLocked() && guion.isLockedByOther(userId)) {
            throw new RuntimeException("Solo el usuario que bloqueรณ puede desbloquear el guion");
        }

        guion.setLockedBy(null);
        guion.setLockedAt(null);

        // Volver a BORRADOR si estaba EN_EDICION
        if (guion.getEstado() == Guion.EstadoGuion.EN_EDICION) {
            guion.setEstado(Guion.EstadoGuion.BORRADOR);
        }

        Guion saved = guionRepository.save(guion);

        // Auditar desbloqueo
        Usuario user = usuarioRepository.findById(userId).orElse(null);
        if (user != null) {
            auditLogService.registrarAccion(
                "GUION",
                guionId,
                "UNLOCK",
                user.getId(),
                user.getEmail()
            );
        }

        Long totalTops = guionRepository.countTopsByGuionId(guionId);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    /**
     * Fuerza el desbloqueo (solo admin)
     */
    public GuionResponse forceUnlock(String guionId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        guion.setLockedBy(null);
        guion.setLockedAt(null);

        Guion saved = guionRepository.save(guion);
        Long totalTops = guionRepository.countTopsByGuionId(guionId);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    // ==================== Gestiรณn de Estado ====================

    public GuionResponse cambiarEstado(String guionId, Guion.EstadoGuion nuevoEstado) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Validar transiciones de estado
        validateEstadoTransition(guion.getEstado(), nuevoEstado);

        guion.setEstado(nuevoEstado);
        Guion saved = guionRepository.save(guion);
        Long totalTops = guionRepository.countTopsByGuionId(guionId);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    private void validateEstadoTransition(Guion.EstadoGuion actual, Guion.EstadoGuion nuevo) {
        // Reglas de transiciรณn de estados
        switch (actual) {
            case BORRADOR:
                if (nuevo != Guion.EstadoGuion.EN_EDICION && nuevo != Guion.EstadoGuion.VALIDADO) {
                    throw new RuntimeException("Transiciรณn de estado no vรกlida");
                }
                break;
            case EN_EDICION:
                if (nuevo != Guion.EstadoGuion.BORRADOR && nuevo != Guion.EstadoGuion.VALIDADO) {
                    throw new RuntimeException("Transiciรณn de estado no vรกlida");
                }
                break;
            case VALIDADO:
                if (nuevo != Guion.EstadoGuion.EN_EDICION && nuevo != Guion.EstadoGuion.PUBLICADO) {
                    throw new RuntimeException("Transiciรณn de estado no vรกlida");
                }
                break;
            case PUBLICADO:
                throw new RuntimeException("Un guion publicado no puede cambiar de estado");
        }
    }

    // ==================== Helpers ====================

    private void mapRequestToEntity(GuionRequest request, Guion guion) {
        guion.setTemporada(request.getTemporada());
        guion.setProduccionNombre(request.getProduccionNombre());
        guion.setCompania(request.getCompania());
        guion.setProductor(request.getProductor());
        guion.setResponsableEdicion(request.getResponsableEdicion());
        guion.setDirectorEscena(request.getDirectorEscena());
        guion.setDirectorMusical(request.getDirectorMusical());
        guion.setSubtitulo(request.getSubtitulo());
        guion.setCompositor(request.getCompositor());
        guion.setVersionNombre(request.getVersionNombre());
    }

    private String toRoman(int number) {
        String[] romans = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"};
        if (number >= 1 && number <= 10) {
            return romans[number];
        }
        return String.valueOf(number);
    }

    // ==================== Estadรญsticas ====================

    public long countTops(String guionId) {
        return guionRepository.countTopsByGuionId(guionId);
    }

    // ==================== Vistas read-only (Sprint D) ====================

    /**
     * Vista global ligera del guion: lista todos los TOPs optimizados para render read-only.
     */
    @Transactional(readOnly = true)
    public com.teatroreal.dto.response.GuionVistaResponse getVistaGlobal(String guionId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        com.teatroreal.dto.response.GuionVistaResponse response = new com.teatroreal.dto.response.GuionVistaResponse();
        response.setId(guion.getId());
        response.setTemporada(guion.getTemporada());
        response.setProduccionNombre(guion.getProduccionNombre());

        // Obtener todos los elementos del guion ordenados
        List<ElementoGuion> elementos = elementoGuionRepository.findByGuionIdOrderByOrden(guionId);

        List<com.teatroreal.dto.response.GuionVistaResponse.TopDto> tops = new java.util.ArrayList<>();
        for (ElementoGuion e : elementos) {
            if (e.getTipoElemento() != ElementoGuion.TipoElemento.TOP) continue;
            com.teatroreal.dto.response.GuionVistaResponse.TopDto t = new com.teatroreal.dto.response.GuionVistaResponse.TopDto();
            t.setId(e.getId());
            // acceder a acto/escena (lazy) dentro de la transacción
            if (e.getEscena() != null) {
                Escena escena = e.getEscena();
                t.setEscenaNombre(escena.getNombre());
                if (escena.getActo() != null) {
                    t.setActoNombre(escena.getActo().getNombre());
                }
            }
            t.setNumero(e.getNumeroTop());
            t.setDepartamento(e.getDepartamento());
            t.setDescripcion(e.getEncabezado());
            t.setObservaciones(e.getContenido());
            t.setPagina(e.getPieFormateado());
            t.setColorHex(e.getColorHex());
            t.setOrden(e.getOrden());
            // Preferir campo imagen directo si existe (simple y rápido)
            t.setImagen(e.getImagen());
            tops.add(t);
        }

        response.setTops(tops);
        return response;
    }

    /**
     * Vista TOPs filtrada por departamento (si departamento == null devuelve todos)
     */
    @Transactional(readOnly = true)
    public com.teatroreal.dto.response.GuionVistaResponse getVistaTops(String guionId, String departamento) {
        com.teatroreal.dto.response.GuionVistaResponse full = getVistaGlobal(guionId);
        if (departamento == null || departamento.isBlank()) {
            return full;
        }
        com.teatroreal.dto.response.GuionVistaResponse filtered = new com.teatroreal.dto.response.GuionVistaResponse();
        filtered.setId(full.getId());
        filtered.setTemporada(full.getTemporada());
        filtered.setProduccionNombre(full.getProduccionNombre());

        List<com.teatroreal.dto.response.GuionVistaResponse.TopDto> tops = full.getTops().stream()
                .filter(t -> departamento.equalsIgnoreCase(t.getDepartamento()))
                .collect(Collectors.toList());

        filtered.setTops(tops);
        return filtered;
    }
}
