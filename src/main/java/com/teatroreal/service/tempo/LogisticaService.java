package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.*;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.dto.response.LogisticaSummaryResponse;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LogisticaService {

    private final ActividadRepository actividadRepository;
    private final EspacioRepository espacioRepository;

    /**
     * Obtiene estadísticas de logística para el dashboard
     */
    public LogisticaSummaryResponse getSummary() {
        long programados = actividadRepository.countByEspacioTipoAlmacenAndEstado(Actividad.EstadoActividad.PENDIENTE);
        long enTransito = actividadRepository.countByEspacioTipoAlmacenAndEstado(Actividad.EstadoActividad.EN_TRANSITO);
        long completados = actividadRepository.countByEspacioTipoAlmacenAndEstado(Actividad.EstadoActividad.COMPLETADO);
        int camionesHoy = actividadRepository.countCamionesHoy(LocalDate.now());

        return LogisticaSummaryResponse.builder()
                .programados((int) programados)
                .enTransito((int) enTransito)
                .completados((int) completados)
                .camionesHoy(camionesHoy)
                .build();
    }

    /**
     * Lista todas las operaciones de almacén
     */
    public List<ActividadResponse> getOperaciones() {
        return actividadRepository.findOperacionesAlmacen()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lista operaciones de almacén por rango de fechas (para calendario)
     */
    public List<ActividadResponse> getOperacionesByFechas(LocalDate inicio, LocalDate fin) {
        return actividadRepository.findOperacionesAlmacenByFechaBetween(inicio, fin)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lista operaciones de almacén por temporada
     */
    public List<ActividadResponse> getOperacionesByTemporada(Long temporadaId) {
        return actividadRepository.findOperacionesAlmacenByTemporada(temporadaId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una operación por ID
     */
    public ActividadResponse getOperacionById(String id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Operación no encontrada"));

        // Verificar que es una operación de almacén
        if (actividad.getEspacio() == null || !"ALMACEN".equals(actividad.getEspacio().getTipo())) {
            throw new IllegalArgumentException("La actividad no es una operación de almacén");
        }

        return toResponse(actividad);
    }

    /**
     * Inicia tránsito de una operación: PENDIENTE → EN_TRANSITO
     */
    public ActividadResponse iniciarTransito(String id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Operación no encontrada"));

        validateEsOperacionAlmacen(actividad);

        if (actividad.getEstado() != Actividad.EstadoActividad.PENDIENTE) {
            throw new IllegalStateException("Solo se puede iniciar tránsito desde estado PENDIENTE");
        }

        actividad.setEstado(Actividad.EstadoActividad.EN_TRANSITO);
        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    /**
     * Completa una operación: EN_TRANSITO → COMPLETADO
     */
    public ActividadResponse completar(String id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Operación no encontrada"));

        validateEsOperacionAlmacen(actividad);

        if (actividad.getEstado() != Actividad.EstadoActividad.EN_TRANSITO) {
            throw new IllegalStateException("Solo se puede completar desde estado EN_TRANSITO");
        }

        actividad.setEstado(Actividad.EstadoActividad.COMPLETADO);
        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    /**
     * Reinicia una operación a PENDIENTE (por si hay errores)
     */
    public ActividadResponse reiniciar(String id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Operación no encontrada"));

        validateEsOperacionAlmacen(actividad);

        actividad.setEstado(Actividad.EstadoActividad.PENDIENTE);
        actividad = actividadRepository.save(actividad);
        return toResponse(actividad);
    }

    /**
     * Obtiene los almacenes disponibles
     */
    public List<Map<String, Object>> getAlmacenes() {
        return espacioRepository.findByTipo("ALMACEN")
                .stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", e.getId());
                    map.put("nombre", e.getNombre());
                    map.put("ubicacion", e.getUbicacion());
                    return map;
                })
                .collect(Collectors.toList());
    }

    private void validateEsOperacionAlmacen(Actividad actividad) {
        if (actividad.getEspacio() == null || !"ALMACEN".equals(actividad.getEspacio().getTipo())) {
            throw new IllegalArgumentException("La actividad no es una operación de almacén");
        }
    }

    private ActividadResponse toResponse(Actividad a) {
        // Determinar color según tipo de movimiento (v1.3: verde=recogida, rosa=salida)
        String colorHex = "#6B7280"; // gris por defecto
        if (a.getTipoMovimiento() != null) {
            switch (a.getTipoMovimiento()) {
                case ENTRADA: colorHex = "#34D399"; break; // Verde - Recogida
                case SALIDA: colorHex = "#F87171"; break;  // Rosa - Salida
                case INTERNO: colorHex = "#FBBF24"; break; // Amarillo - Interno
            }
        }

        return ActividadResponse.builder()
                .id(a.getId())
                .titulo(a.getTitulo())
                .temporada(a.getTemporada() != null ? a.getTemporada().getId().toString() : null)
                .descripcion(a.getDescripcion())
                .estado(a.getEstado() != null ? a.getEstado().name() : null)
                .fecha(a.getFecha() != null ? a.getFecha().toString() : null)
                .horaInicio(a.getHoraInicio() != null ? a.getHoraInicio().toString() : null)
                .horaFin(a.getHoraFin() != null ? a.getHoraFin().toString() : null)
                .notas(a.getNotas())
                .tipoActividad(a.getTipoActividad() != null
                        ? ActividadResponse.TipoActividadInfo.builder()
                        .id(a.getTipoActividad().getId())
                        .nombre(a.getTipoActividad().getNombre())
                        .colorHex(colorHex) // Color según tipo movimiento para logística
                        .build() : null)
                .espacio(a.getEspacio() != null
                        ? ActividadResponse.EspacioInfo.builder()
                        .id(String.valueOf(a.getEspacio().getId()))
                        .nombre(a.getEspacio().getNombre())
                        .build() : null)
                .departamento(a.getDepartamento() != null
                        ? ActividadResponse.DepartamentoInfo.builder()
                        .id(String.valueOf(a.getDepartamento().getId()))
                        .nombre(a.getDepartamento().getNombre())
                        .build()
                        : null)
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .updatedAt(a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : null)
                .tipoMovimiento(a.getTipoMovimiento() != null ? a.getTipoMovimiento().name() : null)
                .numCamiones(a.getNumCamiones())
                .lugarOrigen(a.getLugarOrigen())
                .lugarDestino(a.getLugarDestino())
                .produccionNombre(a.getProduccionNombre())
                .googleEventId(a.getGoogleEventId())
                .ultimaSincronizacion(a.getUltimaSincronizacion() != null ? a.getUltimaSincronizacion().toString() : null)
                .build();
    }
}
