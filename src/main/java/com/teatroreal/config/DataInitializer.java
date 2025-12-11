package com.teatroreal.config;

import com.teatroreal.entity.Espacio;
import com.teatroreal.repository.EspacioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    @Profile("!prod")
    public CommandLineRunner initData(EspacioRepository espacioRepository) {
        return args -> {
            if (espacioRepository.count() == 0) {
                log.info("Inicializando datos de ejemplo...");

                List<Espacio> espacios = List.of(
                        Espacio.builder()
                                .nombre("Escenario Principal")
                                .tipo("Escenario")
                                .descripcion("Escenario principal del Teatro Real")
                                .capacidad(1700)
                                .activo(true)
                                .build(),
                        Espacio.builder()
                                .nombre("Sala Gayarre")
                                .tipo("Sala de ensayos")
                                .descripcion("Sala de ensayos principal")
                                .capacidad(100)
                                .activo(true)
                                .build(),
                        Espacio.builder()
                                .nombre("Sala Barbieri")
                                .tipo("Sala de ensayos")
                                .descripcion("Sala de ensayos secundaria")
                                .capacidad(80)
                                .activo(true)
                                .build(),
                        Espacio.builder()
                                .nombre("Foso de Orquesta")
                                .tipo("Espacio técnico")
                                .descripcion("Foso para la orquesta")
                                .capacidad(120)
                                .activo(true)
                                .build(),
                        Espacio.builder()
                                .nombre("Camerinos Principales")
                                .tipo("Camerinos")
                                .descripcion("Camerinos para artistas principales")
                                .capacidad(20)
                                .activo(true)
                                .build(),
                        Espacio.builder()
                                .nombre("Almacén de Vestuario")
                                .tipo("Almacén")
                                .descripcion("Almacén para vestuario y atrezzo")
                                .capacidad(null)
                                .activo(true)
                                .build()
                );

                espacioRepository.saveAll(espacios);
                log.info("Datos de ejemplo creados: {} espacios", espacios.size());
            }
        };
    }
}
