package com.teatroreal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI teatroRealOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Servidor de desarrollo");

        Contact contact = new Contact();
        contact.setName("NTT DATA");
        contact.setEmail("soporte@teatroreal.es");

        License license = new License()
                .name("Privada")
                .url("https://www.teatroreal.es");

        Info info = new Info()
                .title("Teatro Real API")
                .version("1.0.0")
                .contact(contact)
                .description("API REST para el Sistema de Gestión Interna del Teatro Real. " +
                        "Integra los módulos TEMPO (espacios y calendario) y TOPS (producciones y guiones).")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(Collections.singletonList(devServer));
    }
}
