package com.example.ujk.finalproject.model;
import jakarta.validation.constraints.*;
public class SpellCheckRequest {

    @NotBlank(message = "word is required")
    @Pattern(
            regexp = "^[A-Za-z]{1,}$",
            message = "word must contain only letters"
    )
    private String word;

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }
}
