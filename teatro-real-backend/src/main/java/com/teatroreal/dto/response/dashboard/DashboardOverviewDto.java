package com.teatroreal.dto.response.dashboard;

import java.util.List;

public class DashboardOverviewDto {

    private List<StatDto> stats;
    private List<ActivityDto> todayActivities;
    private List<EventDto> upcomingEvents;

    public DashboardOverviewDto() {
    }

    public DashboardOverviewDto(List<StatDto> stats, List<ActivityDto> todayActivities, List<EventDto> upcomingEvents) {
        this.stats = stats;
        this.todayActivities = todayActivities;
        this.upcomingEvents = upcomingEvents;
    }

    public List<StatDto> getStats() {
        return stats;
    }

    public List<ActivityDto> getTodayActivities() {
        return todayActivities;
    }

    public List<EventDto> getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setStats(List<StatDto> stats) {
        this.stats = stats;
    }

    public void setTodayActivities(List<ActivityDto> todayActivities) {
        this.todayActivities = todayActivities;
    }

    public void setUpcomingEvents(List<EventDto> upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }
}
