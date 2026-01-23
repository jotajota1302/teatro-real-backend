package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.dto.response.SignageEntryResponse;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SignageService {

    private final EspacioRepository espacioRepository;
    private final ActividadRepository actividadRepository;

    /**
     * Obtiene la cartelería global con todas las salas y sus actividades del día.
     */
    public List<SignageEntryResponse> getCarteleriaGlobal() {
        List<Espacio> espacios = espacioRepository.findAll();
        List<SignageEntryResponse> result = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (Espacio espacio : espacios) {
            List<Actividad> actividadesHoy = actividadRepository.findByEspacio_Id(espacio.getId()).stream()
                    .filter(a -> a.getFecha().equals(hoy))
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

            result.add(SignageEntryResponse.builder()
                    .espacioId(espacio.getId())
                    .espacioNombre(espacio.getNombre())
                    .espacioColor(espacio.getColor())
                    .actividades(actividades)
                    .build());
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
                .filter(a -> a.getFecha().equals(hoy))
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
}
