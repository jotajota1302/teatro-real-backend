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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SignageService {

    private final EspacioRepository espacioRepository;
    private final ActividadRepository actividadRepository;

    public List<SignageEntryResponse> getCarteleriaGlobal() {
        List<Espacio> espacios = espacioRepository.findAll();
        List<SignageEntryResponse> result = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

        for (Espacio espacio : espacios) {
            List<Actividad> proximas = actividadRepository.findByEspacioId(String.valueOf(espacio.getId())).stream()
                    .filter(a -> !a.getFecha().isBefore(hoy))
                    .sorted((a1, a2) -> a1.getFecha().compareTo(a2.getFecha()))
                    .collect(Collectors.toList());

            List<SignageEntryResponse.ActividadSignage> actividades = proximas.stream().map(a ->
                SignageEntryResponse.ActividadSignage.builder()
                        .id(a.getId())
                        .descripcion(a.getDescripcion())
                        .fecha(a.getFecha().toString())
                        .estado(a.getEstado().name())
                        .build()
            ).collect(Collectors.toList());

            result.add(SignageEntryResponse.builder()
                    .espacioId(espacio.getId())
                    .espacioNombre(espacio.getNombre())
                    .actividades(actividades)
                    .build());
        }
        return result;
    }
}
