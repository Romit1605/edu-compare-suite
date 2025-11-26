package com.example.ujk.finalproject.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SearchRequest {

    @NotBlank(message = "word is required")
    @Pattern(
            regexp = "^[A-Za-z]{1,}$",
            message = "word must contain only letters"
    )
    private String search;

    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
}
