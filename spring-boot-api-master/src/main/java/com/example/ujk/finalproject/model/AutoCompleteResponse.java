package com.example.ujk.finalproject.model;

import java.util.List;

public class AutoCompleteResponse {
    private List<String> completions;
    private int statusCode;
    private String message;

    public AutoCompleteResponse(List<String> completions, int statusCode) {
        this.completions = completions;
        this.statusCode = statusCode;
    }

    public AutoCompleteResponse(List<String> completions, int statusCode, String message) {
        this.completions = completions;
        this.statusCode = statusCode;
        this.message = message;
    }

    public AutoCompleteResponse(List<String> completions) {
        this.completions = completions;
    }

    public List<String> getCompletions() {
        return completions;
    }

    public void setCompletions(List<String> completions) {
        this.completions = completions;
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