package com.teatroreal.service.tops;

import com.teatroreal.domain.tops.ElementoGuion;
import com.teatroreal.domain.tops.Escena;
import com.teatroreal.dto.request.ElementoGuionRequest;
import com.teatroreal.dto.response.ElementoGuionResponse;
import com.teatroreal.exception.ValidationException;
import com.teatroreal.repository.tops.ElementoGuionRepository;
import com.teatroreal.repository.tops.EscenaRepository;
import com.teatroreal.repository.tops.GuionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para ElementoGuionService - insertInOrder
 */
@ExtendWith(MockitoExtension.class)
class ElementoGuionServiceTest {

    @Mock
    private ElementoGuionRepository elementoGuionRepository;

    @Mock
    private EscenaRepository escenaRepository;

    @Mock
    private GuionRepository guionRepository;

    @Mock
    private ValidacionService validacionService;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private ElementoGuionService elementoGuionService;

    private Escena escena;

    @BeforeEach
    void setUp() {
        escena = new Escena();
        escena.setId("esc-1");
    }

    @Test
    void insertInOrder_insertsInMiddle_and_shiftsExistingOrders() {
        // Arrange
        String escenaId = escena.getId();
        String guionId = "g-1";
        Integer insertOrden = 1;

        // Existing elements with orden 0,1,2
        ElementoGuion e0 = new ElementoGuion();
        e0.setId("e0");
        e0.setOrden(0);
        e0.setEscena(escena);

        ElementoGuion e1 = new ElementoGuion();
        e1.setId("e1");
        e1.setOrden(1);
        e1.setEscena(escena);

        ElementoGuion e2 = new ElementoGuion();
        e2.setId("e2");
        e2.setOrden(2);
        e2.setEscena(escena);

        List<ElementoGuion> existentes = new ArrayList<>();
        existentes.add(e0);
        existentes.add(e1);
        existentes.add(e2);

        when(escenaRepository.findById(escenaId)).thenReturn(Optional.of(escena));
        when(elementoGuionRepository.findByEscenaIdOrderByOrden(escenaId)).thenReturn(existentes);

        // Make save return the same instance (simulate DB save/flush)
        when(elementoGuionRepository.save(any(ElementoGuion.class))).thenAnswer(invocation -> {
            ElementoGuion arg = invocation.getArgument(0);
            if (arg.getId() == null) {
                // simulate id assignment for new element
                arg.setId("new-" + System.identityHashCode(arg));
            }
            return arg;
        });

        ElementoGuionRequest request = ElementoGuionRequest.builder()
                .tipoElemento(ElementoGuion.TipoElemento.ANOTACION_LIBRE)
                .encabezado("nuevo")
                .contenido("contenido")
                .orden(insertOrden)
                .build();

        // Act
        ElementoGuionResponse resp = elementoGuionService.insertInOrder(request, escenaId, guionId, insertOrden, "u1", "u1@example.com");

        // Assert returned element has the requested orden
        assertNotNull(resp);
        assertEquals(insertOrden.intValue(), resp.getOrden().intValue(), "El elemento creado debe tener el orden solicitado");

        // Verify that existing elements with orden >= insertOrden were saved with incremented orden
        // e1 and e2 should have been updated to orden 2 and 3 respectively.
        ArgumentCaptor<ElementoGuion> captor = ArgumentCaptor.forClass(ElementoGuion.class);
        verify(elementoGuionRepository, atLeast(1)).save(captor.capture());

        List<ElementoGuion> saved = captor.getAllValues();

        // find saved instances corresponding to e1 and e2 updates
        boolean foundE1Updated = saved.stream().anyMatch(s -> "e1".equals(s.getId()) && s.getOrden() == 2);
        boolean foundE2Updated = saved.stream().anyMatch(s -> "e2".equals(s.getId()) && s.getOrden() == 3);

        assertTrue(foundE1Updated, "El elemento e1 debe haberse actualizado a orden 2");
        assertTrue(foundE2Updated, "El elemento e2 debe haberse actualizado a orden 3");

        // Verify audit log was attempted (we don't assert on behavior, only that registrarAccion was invoked)
        verify(auditLogService).registrarAccion(eq("ELEMENTO_GUION"), anyString(), eq("CREATE"), eq("u1"), eq("u1@example.com"), contains("insertInOrder"));
    }

    @Test
    void insertInOrder_whenOrdenNull_appendsAtEnd() {
        // Arrange
        String escenaId = escena.getId();
        String guionId = "g-1";

        // Existing elements with orden 0,1
        ElementoGuion e0 = new ElementoGuion();
        e0.setId("e0");
        e0.setOrden(0);
        e0.setEscena(escena);

        ElementoGuion e1 = new ElementoGuion();
        e1.setId("e1");
        e1.setOrden(1);
        e1.setEscena(escena);

        List<ElementoGuion> existentes = new ArrayList<>();
        existentes.add(e0);
        existentes.add(e1);

        when(escenaRepository.findById(escenaId)).thenReturn(Optional.of(escena));
        when(elementoGuionRepository.findByEscenaIdOrderByOrden(escenaId)).thenReturn(existentes);
        when(elementoGuionRepository.save(any(ElementoGuion.class))).thenAnswer(invocation -> {
            ElementoGuion arg = invocation.getArgument(0);
            if (arg.getId() == null) arg.setId("new-" + System.identityHashCode(arg));
            return arg;
        });

        ElementoGuionRequest request = ElementoGuionRequest.builder()
                .tipoElemento(ElementoGuion.TipoElemento.ANOTACION_LIBRE)
                .encabezado("nuevo final")
                .contenido("contenido")
                .orden(null)
                .build();

        // Act
        ElementoGuionResponse resp = elementoGuionService.insertInOrder(request, escenaId, guionId, null, "u1", "u1@example.com");

        // Assert new element gets orden = existentes.size() (append)
        assertNotNull(resp);
        assertEquals(2, resp.getOrden().intValue());
        verify(auditLogService).registrarAccion(eq("ELEMENTO_GUION"), anyString(), eq("CREATE"), eq("u1"), eq("u1@example.com"), contains("insertInOrder"));
    }

    @Test
    void insertInOrder_whenEscenaNotFound_throws() {
        // Arrange
        String escenaId = "missing";
        when(escenaRepository.findById(escenaId)).thenReturn(Optional.empty());

        ElementoGuionRequest request = ElementoGuionRequest.builder()
                .tipoElemento(ElementoGuion.TipoElemento.ANOTACION_LIBRE)
                .build();

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                elementoGuionService.insertInOrder(request, escenaId, "g1", 0, null, null));
        assertTrue(ex.getMessage().toLowerCase().contains("escena no encontrada"));
    }
}
