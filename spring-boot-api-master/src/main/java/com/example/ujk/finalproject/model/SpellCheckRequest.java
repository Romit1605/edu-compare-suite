package com.example.ujk.finalproject.model;
import jakarta.validation.constraints.*;
public class SpellCheckRequest {

        @NotBlank(message = "word is required")
        @Pattern(
            // allow typical words (letters, numbers, dashes) and short phrases
            regexp = "^[A-Za-z0-9\\s\\-]{1,}$",
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
