package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.*;
import com.teatroreal.dto.request.ActividadRequest;
import com.teatroreal.dto.response.ActividadResponse;
import com.teatroreal.repository.tempo.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.mockito.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActividadServiceTest {

    @Mock private ActividadRepository actividadRepository;
    @Mock private TipoActividadRepository tipoActividadRepository;
    @Mock private EspacioRepository espacioRepository;
    @Mock private TemporadaRepository temporadaRepository;
    @Mock private DepartamentoRepository departamentoRepository;

    @InjectMocks
    private ActividadService actividadService;

    private AutoCloseable closeable;

    private final String actividadId = UUID.randomUUID().toString();
    private final String temporadaId = UUID.randomUUID().toString();
    private final String tipoId = UUID.randomUUID().toString();
    private final String espacioId = UUID.randomUUID().toString();

    private Actividad actividadOriginal;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        // Construcción manual sin builder
        Temporada temporada = new Temporada();
        // En la clase real Temporada el id es Long, pero aquí los repositorios usan String, por lo que se setea el nombre y no el id
        temporada.setNombre("2026");

        TipoActividad tipo = new TipoActividad();
        tipo.setId(tipoId);
        tipo.setNombre("Ensayo");
        tipo.setColorHex("#008000");

        Espacio espacio = new Espacio();
        // En la clase real Espacio el id es Long, pero aquí los repositorios usan String, por lo que solo se setea el nombre
        espacio.setNombre("Sala Ensayo");

        // Actividad: debe cambiarse si tampoco tiene builder, pero de momento lo dejo
        actividadOriginal = Actividad.builder()
            .id(actividadId)
            .temporada(temporada)
            .tipoActividad(tipo)
            .descripcion("Ensayo General")
            .estado(Actividad.EstadoActividad.PROGRAMADA)
            .fecha(LocalDate.of(2026, 6, 2))
            .horaInicio(LocalTime.of(10,0))
            .horaFin(LocalTime.of(12,30))
            .espacio(espacio)
            .notas(null)
            .build();

        when(actividadRepository.findById(actividadId)).thenReturn(Optional.of(actividadOriginal));
        when(temporadaRepository.findById(temporadaId)).thenReturn(Optional.of(temporada));
        when(tipoActividadRepository.findById(tipoId)).thenReturn(Optional.of(tipo));
        when(espacioRepository.findById(espacioId)).thenReturn(Optional.of(espacio));
    }

    @Test
    void cloneActividad_createsNewActivityWithDifferentIdAndNewDate() {
        String nuevaFecha = "2026-07-04";
        when(actividadRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ActividadResponse cloned = actividadService.cloneActividad(actividadId, nuevaFecha);
        assertNotNull(cloned);
        assertEquals("Ensayo General", cloned.getDescripcion());
        assertEquals(nuevaFecha, cloned.getFecha());
        assertEquals("PROGRAMADA", cloned.getEstado());
        assertNotEquals(actividadId, cloned.getId()); // Debe tener nuevo ID
    }

    @Test
    void changeStatus_allowsValidTransitions() {
        when(actividadRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // PROGRAMADA -> EN_CURSO
        actividadOriginal.setEstado(Actividad.EstadoActividad.PROGRAMADA);
        ActividadResponse changed = actividadService.changeStatus(actividadId, "EN_CURSO");
        assertEquals("EN_CURSO", changed.getEstado());

        // EN_CURSO -> FINALIZADA
        actividadOriginal.setEstado(Actividad.EstadoActividad.EN_CURSO);
        changed = actividadService.changeStatus(actividadId, "FINALIZADA");
        assertEquals("FINALIZADA", changed.getEstado());

        // PROGRAMADA -> CANCELADA
        actividadOriginal.setEstado(Actividad.EstadoActividad.PROGRAMADA);
        changed = actividadService.changeStatus(actividadId, "CANCELADA");
        assertEquals("CANCELADA", changed.getEstado());
    }

    @Test
    void changeStatus_rejectsInvalidTransitions() {
        // FINALIZADA -> EN_CURSO (no permitido)
        actividadOriginal.setEstado(Actividad.EstadoActividad.FINALIZADA);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
            actividadService.changeStatus(actividadId, "EN_CURSO")
        );
        assertTrue(e.getMessage().contains("Transición de estado no permitida"));

        // CANCELADA -> PROGRAMADA (no permitido)
        actividadOriginal.setEstado(Actividad.EstadoActividad.CANCELADA);

        Exception e2 = assertThrows(IllegalArgumentException.class, () ->
            actividadService.changeStatus(actividadId, "PROGRAMADA")
        );
        assertTrue(e2.getMessage().contains("Transición de estado no permitida"));
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }
}
