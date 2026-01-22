package com.teatroreal.service.tempo;

import com.teatroreal.dto.response.tempo.EspacioDto;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class EspacioService {

    public List<EspacioDto> listarEspacios() {
        return Arrays.asList(
                new EspacioDto("Escenario Principal", "Escenario", "theater_comedy", false),
                new EspacioDto("Sala Gayarre", "Sala de ensayos", "meeting_room", true),
                new EspacioDto("Sala Barbieri", "Sala de ensayos", "meeting_room", true),
                new EspacioDto("Foso de Orquesta", "Espacio técnico", "music_note", false),
                new EspacioDto("Camerinos Principales", "Camerinos", "person", true),
                new EspacioDto("Almacén de Vestuario", "Almacén", "inventory_2", true)
        );
    }
}
