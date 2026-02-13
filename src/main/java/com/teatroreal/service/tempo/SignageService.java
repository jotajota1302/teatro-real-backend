package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.dto.response.SignageEntryResponse;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SignageService {

    private static final String TIPO_SALA = "SALA";
    private static final String TIPO_ESCENARIO = "ESCENARIO";
    private static final String TIPO_ALMACEN = "ALMACEN";
    private static final String TIPO_TALLER = "TALLER";
    private static final String TIPO_CAMERINO = "CAMERINO";

    private final EspacioRepository espacioRepository;
    private final ActividadRepository actividadRepository;

    /**
     * Obtiene la cartelería global con todas las salas y sus actividades del día.
     */
    public List<SignageEntryResponse> getCarteleriaGlobal() {
        List<Espacio> espacios;
        try {
            espacios = espacioRepository.findAll().stream()
                    .filter(this::isEspacioCarteleria)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            log.error("Error cargando espacios para cartelería global", ex);
            return List.of();
        }

        List<SignageEntryResponse> result = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (Espacio espacio : espacios) {
            try {
                List<Actividad> actividadesHoy = actividadRepository.findByEspacio_Id(espacio.getId()).stream()
                        .filter(a -> a != null && a.getFecha() != null && a.getFecha().equals(hoy))
                        .sorted((a1, a2) -> {
                            if (a1.getHoraInicio() != null && a2.getHoraInicio() != null) {
                                return a1.getHoraInicio().compareTo(a2.getHoraInicio());
                            }
                            return 0;
                        })
                        .collect(Collectors.toList());

                List<SignageEntryResponse.ActividadSignage> actividades = actividadesHoy.stream()
                        .map(this::mapToActividadSignageSafe)
                        .filter(java.util.Objects::nonNull)
                        .collect(Collectors.toList());

                result.add(SignageEntryResponse.builder()
                        .espacioId(espacio.getId())
                        .espacioNombre(espacio.getNombre())
                        .espacioTipo(espacio.getTipo())
                        .espacioColor(espacio.getColor())
                        .actividades(actividades)
                        .build());
            } catch (Exception ex) {
                log.error("Error procesando cartelería para espacioId={}", espacio != null ? espacio.getId() : null, ex);
            }
        }
        return result;
    }

    /**
     * Obtiene la cartelería para una sala específica.
     */
    public SignageEntryResponse getCarteleriaSala(Long espacioId) {
        Espacio espacio = espacioRepository.findById(espacioId)
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado: " + espacioId));

        LocalDate hoy = LocalDate.now();

        List<Actividad> actividadesHoy = actividadRepository.findByEspacio_Id(espacioId).stream()
                .filter(a -> a.getFecha() != null && a.getFecha().equals(hoy))
                .sorted((a1, a2) -> {
                    if (a1.getHoraInicio() != null && a2.getHoraInicio() != null) {
                        return a1.getHoraInicio().compareTo(a2.getHoraInicio());
                    }
                    return 0;
                })
                .collect(Collectors.toList());

        List<SignageEntryResponse.ActividadSignage> actividades = actividadesHoy.stream()
                .map(this::mapToActividadSignage)
                .collect(Collectors.toList());

        return SignageEntryResponse.builder()
                .espacioId(espacio.getId())
                .espacioNombre(espacio.getNombre())
                .espacioTipo(espacio.getTipo())
                .espacioColor(espacio.getColor())
                .actividades(actividades)
                .build();
    }

    private SignageEntryResponse.ActividadSignage mapToActividadSignage(Actividad a) {
        return SignageEntryResponse.ActividadSignage.builder()
                .id(a.getId())
                .titulo(a.getTitulo())
                .descripcion(a.getDescripcion())
                .fecha(a.getFecha().toString())
                .horaInicio(a.getHoraInicio() != null ? a.getHoraInicio().format(DateTimeFormatter.ofPattern("HH:mm")) : null)
                .horaFin(a.getHoraFin() != null ? a.getHoraFin().format(DateTimeFormatter.ofPattern("HH:mm")) : null)
                .tipoActividadNombre(a.getTipoActividad() != null ? a.getTipoActividad().getNombre() : null)
                .tipoActividadColor(a.getTipoActividad() != null ? a.getTipoActividad().getColorHex() : null)
                .departamentoNombre(a.getDepartamento() != null ? a.getDepartamento().getNombre() : null)
                .estado(a.getEstado() != null ? a.getEstado().name() : null)
                .build();
    }

    private SignageEntryResponse.ActividadSignage mapToActividadSignageSafe(Actividad a) {
        try {
            return mapToActividadSignage(a);
        } catch (Exception ex) {
            log.error("Error mapeando actividad para cartelería. actividadId={}", a != null ? a.getId() : null, ex);
            return null;
        }
    }

    private boolean isEspacioCarteleria(Espacio espacio) {
        String tipo = espacio.getTipo() != null
                ? espacio.getTipo().trim().toUpperCase(Locale.ROOT)
                : "";

        if (tipo.contains(TIPO_ALMACEN) || tipo.contains(TIPO_TALLER) || tipo.contains(TIPO_CAMERINO)) {
            return false;
        }
        if (tipo.contains(TIPO_SALA) || tipo.contains(TIPO_ESCENARIO)) {
            return true;
        }

        String nombre = espacio.getNombre() != null
                ? espacio.getNombre().trim().toUpperCase(Locale.ROOT)
                : "";

        // Fallback por nombre cuando el tipo no viene bien informado.
        if (nombre.contains("ALMACEN") || nombre.contains("ALMACÉN")
                || nombre.contains("TALLER") || nombre.contains("CAMERINO")) {
            return false;
        }
        if (nombre.contains("ARGANDA-CAMPA") || nombre.contains("ARGANDA CAMPA")
                || nombre.contains("ARGANDA-NAVE") || nombre.contains("ARGANDA NAVE")) {
            return false;
        }

        return nombre.contains("SALA") || nombre.contains("ESCENARIO");
    }
}
