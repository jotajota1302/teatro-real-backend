package com.teatroreal.dto.response.dashboard;

public class ActivityDto {

    private String title;
    private String location;
    private String time;
    private String type;
    private String color;

    public ActivityDto() {
    }

    public ActivityDto(String title, String location, String time, String type, String color) {
        this.title = title;
        this.location = location;
        this.time = time;
        this.type = type;
        this.color = color;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public String getTime() {
        return time;
    }

    public String getType() {
        return type;
    }

    public String getColor() {
        return color;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
