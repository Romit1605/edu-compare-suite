package com.example.ujk.finalproject.services;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AutoCompleteService {
    // get these values from db later
    private static final List<String> WORDS = List.of(
            "apple", "application", "apply", "applet",
            "banana", "band", "bank", "banner",
            "cat", "cater", "category", "catch"
    );

    public List<String> getCompletions(String prefix) {
        List<String> results = new ArrayList<>();

        if (prefix == null || prefix.isEmpty()) {
            return results;
        }

        for (String w : WORDS) {
            if (w.startsWith(prefix.toLowerCase())) {
                results.add(w);
            }
        }

        return results;
    }
}
