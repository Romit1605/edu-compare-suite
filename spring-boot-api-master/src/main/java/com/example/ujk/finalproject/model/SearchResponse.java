package com.example.ujk.finalproject.model;

import java.util.List;

public class SearchResponse {


    private List<Course> courses_found;
    private int statusCode;
    private String message;

    public SearchResponse(List<Course> courses_found) {
        this.courses_found = courses_found;
    }

    public SearchResponse(List<Course> courses_found, int statusCode, String message) {
        this.courses_found = courses_found;
        this.statusCode = statusCode;
        this.message = message;
    }

    public List<Course> getCourses_found() {
        return courses_found;
    }

    public void setCourses_found(List<Course> courses_found) {
        this.courses_found = courses_found;
    }
    public int getStatusCode() {
        return statusCode;
    }
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
