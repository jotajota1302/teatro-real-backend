package com.teatroreal.dto.response.dashboard;

public class EventDto {

    private String title;
    private String date;

    public EventDto() {
    }

    public EventDto(String title, String date) {
        this.title = title;
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
