package service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.EstadoActividad;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.service.tempo.ActividadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class ActividadServiceTest {

    private ActividadRepository repository;
    private ActividadService actividadService;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ActividadRepository.class);
        actividadService = new ActividadService(repository);
    }

    @Test
    void testClonarActividad() {
        Actividad original = new Actividad();
        original.setId("abc-123");
        original.setTitulo("Función especial");
        original.setTemporada("2025-2026");
        original.setFecha(LocalDate.of(2026, 2, 20));
        original.setHoraInicio(LocalTime.of(19, 0));
        original.setHoraFin(LocalTime.of(21, 0));
        original.setEstado(EstadoActividad.PENDIENTE);

        Mockito.when(repository.findById("abc-123")).thenReturn(Optional.of(original));
        Mockito.when(repository.save(any(Actividad.class))).thenAnswer(i -> i.getArguments()[0]);

        LocalDate nuevaFecha = LocalDate.of(2026, 3, 1);
        Actividad clonada = actividadService.clonarActividad("abc-123", nuevaFecha);

        assertNotNull(clonada);
        assertEquals("Función especial", clonada.getTitulo());
        assertEquals(nuevaFecha, clonada.getFecha());
        assertEquals(original.getHoraInicio(), clonada.getHoraInicio());
        assertEquals(original.getEstado(), clonada.getEstado());
    }

    @Test
    void testActualizarEstado() {
        Actividad original = new Actividad();
        original.setId("abc-124");
        original.setEstado(EstadoActividad.PENDIENTE);

        Mockito.when(repository.findById("abc-124")).thenReturn(Optional.of(original));
        Mockito.when(repository.save(any(Actividad.class))).thenAnswer(i -> i.getArguments()[0]);

        Actividad actualizada = actividadService.actualizarEstado("abc-124", EstadoActividad.EN_TRANSITO);

        assertEquals(EstadoActividad.EN_TRANSITO, actualizada.getEstado());
    }
}
