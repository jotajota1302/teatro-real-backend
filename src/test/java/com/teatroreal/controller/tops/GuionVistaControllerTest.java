package com.teatroreal.controller.tops;

import com.teatroreal.dto.response.GuionVistaResponse;
import com.teatroreal.service.tops.ExportWordService;
import com.teatroreal.service.tops.GuionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GuionController.class)
@WithMockUser // provide a mock authenticated user so endpoints secured by Spring Security return 200
public class GuionVistaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GuionService guionService;

    // Mock the ExportWordService because GuionController autowires it
    @MockBean
    private ExportWordService exportWordService;

    @Test
    public void getVistaGlobal_returnsOkAndJson() throws Exception {
        GuionVistaResponse response = new GuionVistaResponse();
        response.setId("g1");
        response.setTemporada("2025");
        response.setProduccionNombre("CARMEN");

        GuionVistaResponse.TopDto t = new GuionVistaResponse.TopDto();
        t.setId("top1");
        t.setActoNombre("ACTO I");
        t.setEscenaNombre("Escena 1");
        t.setNumero("1");
        t.setDepartamento("ILUMINACION");
        t.setDescripcion("Descripción");
        t.setObservaciones("Obs");
        t.setPagina("1/1/00:00");
        t.setColorHex("#000000");
        t.setOrden(1);
        t.setImagen(null);

        response.setTops(List.of(t));

        when(guionService.getVistaGlobal("g1")).thenReturn(response);

        mockMvc.perform(get("/api/guiones/g1/vista/global"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("g1"))
                .andExpect(jsonPath("$.produccionNombre").value("CARMEN"))
                .andExpect(jsonPath("$.tops[0].id").value("top1"))
                .andExpect(jsonPath("$.tops[0].departamento").value("ILUMINACION"));
    }

    @Test
    public void getVistaTops_withDepartamento_filters() throws Exception {
        GuionVistaResponse filtered = new GuionVistaResponse();
        filtered.setId("g1");
        filtered.setTemporada("2025");
        filtered.setProduccionNombre("CARMEN");

        GuionVistaResponse.TopDto t = new GuionVistaResponse.TopDto();
        t.setId("top2");
        t.setDepartamento("SONIDO");
        filtered.setTops(List.of(t));

        when(guionService.getVistaTops("g1", "SONIDO")).thenReturn(filtered);

        mockMvc.perform(get("/api/guiones/g1/vista/tops").param("departamento", "SONIDO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tops[0].departamento").value("SONIDO"));
    }
}
