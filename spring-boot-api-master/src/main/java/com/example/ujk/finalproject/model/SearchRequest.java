package com.example.ujk.finalproject.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SearchRequest {

        @NotBlank(message = "search is required")
        @Pattern(
            // allow letters, numbers, spaces, dashes and basic punctuation
            regexp = "^[A-Za-z0-9\\\\s\\\\-_,.]{1,}$",
            message = "search must contain valid characters"
        )
        private String search;

    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
}
