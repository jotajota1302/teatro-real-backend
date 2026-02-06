package com.teatroreal;

import com.teatroreal.service.user.UsuarioService;
import com.teatroreal.domain.user.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

@SpringBootTest
public class UsuarioServiceTest {
    @Autowired
    private UsuarioService usuarioService;

    @Test
    void testFindAll() {
        List<Usuario> usuarios = usuarioService.findAll();
        assertNotNull(usuarios);
    }
}
