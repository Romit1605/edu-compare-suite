package com.example.ujk.finalproject.model;

public class FrequencyCountResponse {
    private String word;
    private int frequency;
    private String message;
    private  int statusCode;

    public FrequencyCountResponse(String word, int frequency, String message) {
        this.word = word;
    }

    public FrequencyCountResponse(String word, int frequency, String message, int statusCode) {
        this.word = word;
        this.frequency = frequency;
        this.message = message;
        this.statusCode = statusCode;
    }

    public FrequencyCountResponse(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
    }

    public String getWord() {
        return word;
    }
    public int getFrequency() {
        return frequency;
    }

    public String getMessage() {
        return message;
    }
    public int getStatusCode() {
        return statusCode;
    }
    public void setWord(String word) {
        this.word = word;
    }
    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }
}
