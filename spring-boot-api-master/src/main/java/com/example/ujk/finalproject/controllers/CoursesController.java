package com.example.ujk.finalproject.controllers;

import com.example.ujk.finalproject.model.FrequencyCountResponse;
import com.example.ujk.finalproject.model.Course;
import com.example.ujk.finalproject.services.FrequencyCountService;
import com.example.ujk.finalproject.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CoursesController {

    @Autowired
    private FrequencyCountService frequencyService;

    @Autowired
    private SearchService searchService;

    // Return trending searches based on frequency counts
    @GetMapping("/search-frequency")
    public Map<String, Object> getTrending() {
        Map<String, Integer> snapshot = frequencyService.getFrequencySnapshot();

        // Build a list of trending keywords sorted by count desc
        List<Map<String, Object>> trending = new ArrayList<>();
        snapshot.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .limit(20)
                .forEach(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("keyword", e.getKey());
                    item.put("searchCount", e.getValue());
                    item.put("lastSearched", "just now");
                    trending.add(item);
                });

        Map<String, Object> out = new HashMap<>();
        out.put("trendingSearches", trending);
        return out;
    }

    // Basic pattern finder: scans available course titles/urls for simple patterns.
    // For now this returns lightweight results from in-memory mock data.
    @GetMapping("/patterns")
    public Map<String, Object> findPatterns(@RequestParam String type) {
        // get all available courses
        List<Course> courses = searchService.searchAll();

        List<Map<String, Object>> results = new ArrayList<>();
        Map<String, Integer> stats = new HashMap<>();

        Pattern emailRe = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Pattern urlRe = Pattern.compile("https?://[\\w\\-._~:/?#[\\]@!$&'()*+,;=%]+", Pattern.CASE_INSENSITIVE);
        Pattern phoneRe = Pattern.compile("\\+?[0-9][0-9()\\-\\s]{6,}");

        for (Course c : courses) {
            List<String> matches = new ArrayList<>();
            String combined = (c.getTitle() + " " + c.getUrl() + " " + (c.getUniversity()==null?"":c.getUniversity())).toLowerCase();

            if ("email".equalsIgnoreCase(type)) {
                Matcher m = emailRe.matcher(combined);
                while (m.find()) matches.add(m.group());
            } else if ("url".equalsIgnoreCase(type)) {
                Matcher m = urlRe.matcher(combined);
                while (m.find()) matches.add(m.group());
            } else if ("phone".equalsIgnoreCase(type)) {
                Matcher m = phoneRe.matcher(combined);
                while (m.find()) matches.add(m.group());
            } else if ("price".equalsIgnoreCase(type) || "date".equalsIgnoreCase(type)) {
                // Not implemented in mock data — return empty
            }

            if (!matches.isEmpty()) {
                Map<String, Object> row = new HashMap<>();
                row.put("courseId", UUID.randomUUID().toString());
                row.put("title", c.getTitle());
                row.put("platform", c.getUniversity() == null ? c.getType() : c.getUniversity());
                row.put("matches", matches);
                results.add(row);
                stats.put(type, stats.getOrDefault(type, 0) + matches.size());
            }
        }

        Map<String, Object> out = new HashMap<>();
        out.put("results", results);
        out.put("totalCount", results.size());
        out.put("stats", stats);
        return out;
    }

    // Data validation stats endpoint used by frontend DataValidation page
    @GetMapping("/validation/stats")
    public Map<String, Object> getValidationStats() {
        List<Course> courses = searchService.searchAll();

        int validUrls = 0, invalidUrls = 0;
        int validEmails = 0, invalidEmails = 0;
        int validPrices = 0, invalidPrices = 0;

        List<Map<String, String>> invalidEntries = new ArrayList<>();

        Pattern urlRe = Pattern.compile("^https?://[^\\s]+$");
        Pattern emailRe = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        Pattern priceRe = Pattern.compile("^\\$?\\d+(\\.\\d{2})?$");

        for (int i = 0; i < courses.size(); i++) {
            Course c = courses.get(i);
            String url = c.getUrl() == null ? "" : c.getUrl();
            String title = c.getTitle() == null ? "" : c.getTitle();

            // URL
            if (urlRe.matcher(url).matches()) validUrls++; else { invalidUrls++; Map<String,String> e = new HashMap<>(); e.put("id", String.valueOf(i)); e.put("type","URL"); e.put("value", url); e.put("reason","Invalid URL"); invalidEntries.add(e);} 

            // Email check: scan title/url for emails
            Matcher m = emailRe.matcher((title + " " + url));
            boolean foundEmail = m.find();
            if (foundEmail) validEmails++; else { invalidEmails++; Map<String,String> e = new HashMap<>(); e.put("id", String.valueOf(i)); e.put("type","Email"); e.put("value", title); e.put("reason","No email found"); invalidEntries.add(e);} 

            // Price: not available in mock data, mark all as validPrice for now
            // Attempt to detect $ in title
            if (title.contains("$")) validPrices++; else { invalidPrices++; Map<String,String> e = new HashMap<>(); e.put("id", String.valueOf(i)); e.put("type","Price"); e.put("value", title); e.put("reason","No price found"); invalidEntries.add(e);} 
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("validUrls", validUrls);
        stats.put("invalidUrls", invalidUrls);
        stats.put("validEmails", validEmails);
        stats.put("invalidEmails", invalidEmails);
        stats.put("validPrices", validPrices);
        stats.put("invalidPrices", invalidPrices);
        stats.put("totalRecords", courses.size());

        Map<String, Object> out = new HashMap<>();
        out.put("stats", stats);
        out.put("invalidEntries", invalidEntries);
        return out;
    }
}
