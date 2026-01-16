package com.teatroreal.service.tempo;

import com.teatroreal.domain.tempo.Actividad;
import com.teatroreal.domain.tempo.Espacio;
import com.teatroreal.domain.tempo.TipoActividad;
import com.teatroreal.domain.tempo.Departamento;
import com.teatroreal.domain.tempo.EstadoActividad;
import com.teatroreal.repository.tempo.ActividadRepository;
import com.teatroreal.repository.tempo.EspacioRepository;
import com.teatroreal.repository.tempo.TipoActividadRepository;
import com.teatroreal.repository.tempo.DepartamentoRepository;
import com.teatroreal.service.tempo.ActividadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class ActividadServiceTest {

    @Mock
    private ActividadRepository actividadRepository;
    @Mock
    private EspacioRepository espacioRepository;
    @Mock
    private TipoActividadRepository tipoActividadRepository;
    @Mock
    private DepartamentoRepository departamentoRepository;
    @InjectMocks
    private ActividadService actividadService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void cloneDeberiaCopiarActividadConNuevaFechaYUuid() {
        // Arrange
        Actividad original = new Actividad();
        original.setId("original-uuid");
        original.setTitulo("Título original");
        original.setTemporada("2025-2026");
        original.setDescripcion("Desc test");
        original.setFecha(LocalDate.of(2026, 2, 1));
        original.setHoraInicio(LocalTime.of(10, 0));
        original.setHoraFin(LocalTime.of(14, 0));

        Mockito.when(actividadRepository.findById("original-uuid")).thenReturn(Optional.of(original));
        Mockito.when(actividadRepository.save(ArgumentMatchers.any(Actividad.class)))
            .thenAnswer(i -> i.getArgument(0));

        // Act
        Actividad clonada = actividadService.clone("original-uuid", LocalDate.of(2026, 3, 10));

        // Assert
        assertThat(clonada)
            .isNotNull()
            .extracting(Actividad::getTitulo, Actividad::getTemporada, Actividad::getDescripcion)
            .containsExactly("Título original", "2025-2026", "Desc test");
        assertThat(clonada.getFecha()).isEqualTo(LocalDate.of(2026, 3, 10));
        assertThat(clonada.getId()).isNotEqualTo(original.getId());
    }

    @Test
    void cambiarEstadoDeberiaActualizarEstadoCuandoEsAlmacen() {
        // Arrange
        Espacio almacen = new Espacio();
        almacen.setId(20L);
        almacen.setTipo(com.teatroreal.domain.tempo.TipoEspacio.ALMACEN);

        Actividad actividad = new Actividad();
        actividad.setId("uuid-act-23");
        actividad.setEspacio(almacen);
        actividad.setEstado(EstadoActividad.PENDIENTE);

        Mockito.when(actividadRepository.findById("uuid-act-23")).thenReturn(Optional.of(actividad));
        Mockito.when(actividadRepository.save(ArgumentMatchers.any(Actividad.class)))
            .thenAnswer(i -> i.getArgument(0));

        // Act
        Actividad cambiada = actividadService.cambiarEstado("uuid-act-23", EstadoActividad.COMPLETADO);

        // Assert
        assertThat(cambiada.getEstado()).isEqualTo(EstadoActividad.COMPLETADO);
    }

    @Test
    void cambiarEstadoLanzaExcepcionSiNoEsAlmacen() {
        // Arrange
        Espacio sala = new Espacio();
        sala.setId(22L);
        sala.setTipo(com.teatroreal.domain.tempo.TipoEspacio.SALA);

        Actividad actividad = new Actividad();
        actividad.setId("uuid-act-24");
        actividad.setEspacio(sala);
        actividad.setEstado(EstadoActividad.PENDIENTE);

        Mockito.when(actividadRepository.findById("uuid-act-24")).thenReturn(Optional.of(actividad));

        // Act + Assert
        assertThatThrownBy(() ->
            actividadService.cambiarEstado("uuid-act-24", EstadoActividad.COMPLETADO)
        ).isInstanceOf(RuntimeException.class)
         .hasMessageContaining("Solo actividades de almacén tienen estado");
    }
}
