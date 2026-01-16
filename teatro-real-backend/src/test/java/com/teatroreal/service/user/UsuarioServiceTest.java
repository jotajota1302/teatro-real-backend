package com.teatroreal.service.user;

<<<<<<< HEAD
import com.teatroreal.service.UsuarioService;
=======
import com.teatroreal.service.user.UsuarioService;
>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
import com.teatroreal.domain.user.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

<<<<<<< HEAD
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

=======
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

>>>>>>> 5f5ad938ebc041f2e716139a5623612b8f844e98
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
