package com.teatroreal.dto.response.dashboard;

public class StatDto {

    private String title;
    private String value;
    private String icon;
    private String color;

    public StatDto() {
    }

    public StatDto(String title, String value, String icon, String color) {
        this.title = title;
        this.value = value;
        this.icon = icon;
        this.color = color;
    }

    public String getTitle() {
        return title;
    }

    public String getValue() {
        return value;
    }

    public String getIcon() {
        return icon;
    }

    public String getColor() {
        return color;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
