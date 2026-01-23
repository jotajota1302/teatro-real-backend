package com.teatroreal.service.dashboard;

import com.teatroreal.dto.response.dashboard.ActivityDto;
import com.teatroreal.dto.response.dashboard.DashboardOverviewDto;
import com.teatroreal.dto.response.dashboard.EventDto;
import com.teatroreal.dto.response.dashboard.StatDto;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DashboardService {

    public DashboardOverviewDto getOverview() {
        List<StatDto> stats = Arrays.asList(
                new StatDto("Actividades Hoy", "12", "event", "#CF102D"),
                new StatDto("Espacios Ocupados", "8/15", "location_city", "#1E3A5F"),
                new StatDto("Producciones Activas", "4", "music_note", "#2E7D32"),
                new StatDto("Notificaciones", "3", "notifications", "#EF6C00")
        );

        List<ActivityDto> todayActivities = Arrays.asList(
                new ActivityDto("Ensayo - La Traviata", "Escenario Principal · 10:00-14:00", "10:00 - 14:00", "Ensayo", "#2E7D32"),
                new ActivityDto("Función - Carmen", "Sala Principal · 20:00-23:00", "20:00 - 23:00", "Función", "#1E3A5F"),
                new ActivityDto("Montaje - El Barbero de Sevilla", "Sala Gayarre · 09:00-18:00", "09:00 - 18:00", "Montaje", "#E57373"),
                new ActivityDto("Visita Guiada", "Recorrido General · 11:00-12:30", "11:00 - 12:30", "Visita", "#7B1FA2")
        );

        List<EventDto> upcomingEvents = Arrays.asList(
                new EventDto("Estreno - Tosca", "15 Dic 2024"),
                new EventDto("Concierto de Navidad", "22 Dic 2024"),
                new EventDto("Gala de Fin de Año", "31 Dic 2024")
        );

        return new DashboardOverviewDto(stats, todayActivities, upcomingEvents);
    }

}
