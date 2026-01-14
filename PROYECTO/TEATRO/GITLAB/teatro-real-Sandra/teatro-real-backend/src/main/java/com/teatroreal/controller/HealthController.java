package com.teatroreal.controller;

import com.teatroreal.dto.ApiResponse;
import com.teatroreal.dto.HealthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Health", description = "Endpoints de estado y salud de la API")
public class HealthController {

    private final DataSource dataSource;

    @Value("${spring.application.name:teatro-real-backend}")
    private String applicationName;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    @Operation(
            summary = "Health check",
            description = "Verifica el estado de la API y la conexión a la base de datos"
    )
    public ResponseEntity<ApiResponse<HealthResponse>> health() {
        HealthResponse.DatabaseStatus dbStatus = checkDatabase();

        HealthResponse response = HealthResponse.builder()
                .status("UP")
                .application(applicationName)
                .version("1.0.0")
                .timestamp(LocalDateTime.now())
                .environment("development")
                .database(dbStatus)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/ping")
    @Operation(
            summary = "Ping",
            description = "Endpoint simple para verificar que la API responde"
    )
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong"));
    }

    private HealthResponse.DatabaseStatus checkDatabase() {
        try (Connection connection = dataSource.getConnection()) {
            String dbType = connection.getMetaData().getDatabaseProductName();
            return HealthResponse.DatabaseStatus.builder()
                    .status("UP")
                    .type(dbType)
                    .build();
        } catch (Exception e) {
            return HealthResponse.DatabaseStatus.builder()
                    .status("DOWN")
                    .type("unknown")
                    .build();
        }
    }
}
