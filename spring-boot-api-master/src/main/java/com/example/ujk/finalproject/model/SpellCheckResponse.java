package com.example.ujk.finalproject.model;

public class SpellCheckResponse {
    private String correctedWord;
    private boolean speltCorrectly;
    private int statusCode;
    private String message;

    public SpellCheckResponse(String correctedWord) {
        this.correctedWord = correctedWord;
    }

    public SpellCheckResponse(String correctedWord, boolean speltCorrectly) {
        this.correctedWord = correctedWord;
        this.speltCorrectly = speltCorrectly;
        this.statusCode = speltCorrectly ? 200 : 404;
        this.message = speltCorrectly ? "Correct spelling" : "Incorrect spelling";
    }


    public String getCorrectedWord() {
        return correctedWord;
    }

    public void setCorrectedWord(String correctedWord) {
        this.correctedWord = correctedWord;
    }

    public boolean isSpeltCorrectly() {
        return speltCorrectly;
    }
    public void setSpeltCorrectly(boolean speltCorrectly) {
        this.speltCorrectly = speltCorrectly;
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