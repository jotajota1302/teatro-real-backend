package com.teatroreal.controller.dashboard;

import com.teatroreal.dto.response.ApiResponse;
import com.teatroreal.dto.response.dashboard.DashboardOverviewDto;
import com.teatroreal.service.dashboard.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Vista global del Teatro Real")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/api/v1/dashboard/overview")
    @Operation(summary = "Resumen del dashboard", responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resumen recuperado correctamente")
    })
    public ApiResponse<DashboardOverviewDto> getOverview() {
        DashboardOverviewDto overview = dashboardService.getOverview();
        return new ApiResponse<>(true, "Datos del dashboard recuperados", overview);
    }

}
