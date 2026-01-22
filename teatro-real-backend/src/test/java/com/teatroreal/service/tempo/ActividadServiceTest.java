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
    private final Long temporadaId = 1L;
    private final String tipoId = UUID.randomUUID().toString();
    private final Long espacioId = 1L;

    private Actividad actividadOriginal;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        // Construcción manual de la Actividad sin builder
        TipoActividad tipo = new TipoActividad();
        tipo.setId(tipoId);
        tipo.setNombre("Ensayo");
        tipo.setColorHex("#008000");

        Espacio espacio = new Espacio();
        espacio.setNombre("Sala Ensayo");

        actividadOriginal = new Actividad();
        actividadOriginal.setId(actividadId);

        Temporada temporada = new Temporada();
        temporada.setId(1L);
        temporada.setNombre("2026");
        actividadOriginal.setTemporada(temporada);

        actividadOriginal.setTipoActividad(tipo);
        actividadOriginal.setDescripcion("Ensayo General");
        actividadOriginal.setEstado(Actividad.EstadoActividad.PENDIENTE);
        actividadOriginal.setFecha(LocalDate.of(2026, 6, 2));
        actividadOriginal.setHoraInicio(LocalTime.of(10,0));
        actividadOriginal.setHoraFin(LocalTime.of(12,30));
        actividadOriginal.setEspacio(espacio);
        actividadOriginal.setNotas(null);

        when(actividadRepository.findById(actividadId)).thenReturn(Optional.of(actividadOriginal));
        when(temporadaRepository.findById(temporadaId)).thenReturn(Optional.empty());
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
        assertEquals("PENDIENTE", cloned.getEstado());
        assertNotEquals(actividadId, cloned.getId()); // Debe tener nuevo ID
    }

    @Test
    void changeStatus_allowsValidTransitions() {
        when(actividadRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // PENDIENTE -> EN_TRANSITO
        actividadOriginal.setEstado(Actividad.EstadoActividad.PENDIENTE);
        ActividadResponse changed = actividadService.changeStatus(actividadId, "EN_TRANSITO");
        assertEquals("EN_TRANSITO", changed.getEstado());

        // EN_TRANSITO -> COMPLETADO
        actividadOriginal.setEstado(Actividad.EstadoActividad.EN_TRANSITO);
        changed = actividadService.changeStatus(actividadId, "COMPLETADO");
        assertEquals("COMPLETADO", changed.getEstado());
    }

    @Test
    void changeStatus_rejectsInvalidTransitions() {
        // COMPLETADO -> EN_TRANSITO (no permitido)
        actividadOriginal.setEstado(Actividad.EstadoActividad.COMPLETADO);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
            actividadService.changeStatus(actividadId, "EN_TRANSITO")
        );
        assertTrue(e.getMessage().contains("Transición de estado no permitida"));

        // EN_TRANSITO -> PENDIENTE (no permitido)
        actividadOriginal.setEstado(Actividad.EstadoActividad.EN_TRANSITO);

        Exception e2 = assertThrows(IllegalArgumentException.class, () ->
            actividadService.changeStatus(actividadId, "PENDIENTE")
        );
        assertTrue(e2.getMessage().contains("Transición de estado no permitida"));
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }
}
