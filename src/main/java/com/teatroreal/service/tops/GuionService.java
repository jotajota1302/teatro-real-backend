package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.*;
import com.teatroreal.domain.user.Usuario;
import com.teatroreal.dto.request.GuionRequest;
import com.teatroreal.dto.response.GuionResponse;
import com.teatroreal.dto.response.GuionCompletoResponse;
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

    // ==================== CRUD Básico ====================

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

    public GuionResponse findById(String id) {
        Guion guion = guionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));
        Long totalTops = guionRepository.countTopsByGuionId(id);
        return GuionResponse.fromEntity(guion, totalTops);
    }

    /**
     * Obtiene el guion completo con todo el árbol para el editor
     */
    public GuionCompletoResponse findByIdCompleto(String id) {
        Guion guion = guionRepository.findByIdCompleto(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));
        return GuionCompletoResponse.fromEntity(guion);
    }

    public GuionResponse create(GuionRequest request, String createdById) {
        Guion guion = new Guion();
        mapRequestToEntity(request, guion);
        guion.setEstado(Guion.EstadoGuion.BORRADOR);

        if (createdById != null) {
            Usuario createdBy = usuarioRepository.findById(createdById).orElse(null);
            guion.setCreatedBy(createdBy);
        }

        Guion saved = guionRepository.save(guion);
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

    public GuionResponse update(String id, GuionRequest request) {
        Guion guion = guionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + id));

        mapRequestToEntity(request, guion);
        Guion saved = guionRepository.save(guion);
        Long totalTops = guionRepository.countTopsByGuionId(id);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    public void delete(String id) {
        if (!guionRepository.existsById(id)) {
            throw new RuntimeException("Guion no encontrado: " + id);
        }
        guionRepository.deleteById(id);
    }

    // ==================== Bloqueo de Edición ====================

    /**
     * Bloquea el guion para edición exclusiva
     */
    public GuionResponse lockGuion(String guionId, String userId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Verificar si ya está bloqueado por otro usuario
        if (guion.isLocked() && guion.isLockedByOther(userId)) {
            throw new RuntimeException("El guion está siendo editado por " + guion.getLockedBy().getNombre());
        }

        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + userId));

        guion.setLockedBy(user);
        guion.setLockedAt(LocalDateTime.now());
        guion.setEstado(Guion.EstadoGuion.EN_EDICION);

        Guion saved = guionRepository.save(guion);
        Long totalTops = guionRepository.countTopsByGuionId(guionId);
        return GuionResponse.fromEntity(saved, totalTops);
    }

    /**
     * Desbloquea el guion
     */
    public GuionResponse unlockGuion(String guionId, String userId) {
        Guion guion = guionRepository.findById(guionId)
                .orElseThrow(() -> new RuntimeException("Guion no encontrado: " + guionId));

        // Solo el usuario que bloqueó puede desbloquear (o admin)
        if (guion.isLocked() && guion.isLockedByOther(userId)) {
            throw new RuntimeException("Solo el usuario que bloqueó puede desbloquear el guion");
        }

        guion.setLockedBy(null);
        guion.setLockedAt(null);

        // Volver a BORRADOR si estaba EN_EDICION
        if (guion.getEstado() == Guion.EstadoGuion.EN_EDICION) {
            guion.setEstado(Guion.EstadoGuion.BORRADOR);
        }

        Guion saved = guionRepository.save(guion);
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

    // ==================== Gestión de Estado ====================

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
        // Reglas de transición de estados
        switch (actual) {
            case BORRADOR:
                if (nuevo != Guion.EstadoGuion.EN_EDICION && nuevo != Guion.EstadoGuion.VALIDADO) {
                    throw new RuntimeException("Transición de estado no válida");
                }
                break;
            case EN_EDICION:
                if (nuevo != Guion.EstadoGuion.BORRADOR && nuevo != Guion.EstadoGuion.VALIDADO) {
                    throw new RuntimeException("Transición de estado no válida");
                }
                break;
            case VALIDADO:
                if (nuevo != Guion.EstadoGuion.EN_EDICION && nuevo != Guion.EstadoGuion.PUBLICADO) {
                    throw new RuntimeException("Transición de estado no válida");
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

    // ==================== Estadísticas ====================

    public long countTops(String guionId) {
        return guionRepository.countTopsByGuionId(guionId);
    }
}
