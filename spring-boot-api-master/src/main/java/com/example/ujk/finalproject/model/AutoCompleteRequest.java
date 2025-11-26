package com.example.ujk.finalproject.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AutoCompleteRequest {

        @NotBlank(message = "word is required")
        @Pattern(
            // allow letters, numbers and spaces for autocomplete queries
            regexp = "^[A-Za-z0-9\\s\\-_,.]{1,}$",
            message = "word must contain valid characters"
        )
        private String word;
    public String getWord() {
        return word;
    }
    public void setWord(String word) {
        this.word = word;
    }
}