package com.education.platformanalyzer.controller;

import com.education.platformanalyzer.model.Course;
import com.education.platformanalyzer.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    /**
     * SEARCH COURSES
     * GET /api/courses/search?keyword=python
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchCourses(
            @RequestParam String keyword) {
        List<Course> results = courseService.searchCourses(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("keyword", keyword);
        response.put("count", results.size());
        response.put("courses", results);

        return ResponseEntity.ok(response);
    }

    /**
     * WORD COMPLETION / AUTOCOMPLETE
     * GET /api/courses/autocomplete?prefix=pyt
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<Map<String, Object>> autocomplete(
            @RequestParam String prefix) {
        List<String> suggestions = courseService.getWordCompletions(prefix);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("prefix", prefix);
        response.put("suggestions", suggestions);

        return ResponseEntity.ok(response);
    }

    /**
     * SPELL CHECKER
     * GET /api/courses/spellcheck?word=pythn
     */
    @GetMapping("/spellcheck")
    public ResponseEntity<Map<String, Object>> spellCheck(
            @RequestParam String word) {
        List<String> suggestions = courseService.getSpellingSuggestions(word);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("word", word);
        response.put("suggestions", suggestions);
        response.put("hasSuggestions", !suggestions.isEmpty());

        return ResponseEntity.ok(response);
    }

    /**
     * SEARCH FREQUENCY
     * GET /api/courses/search-frequency
     */
    @GetMapping("/search-frequency")
    public ResponseEntity<Map<String, Object>> getSearchFrequency() {
        List<Map<String, Object>> history = courseService.getSearchFrequency();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("topSearches", history);

        return ResponseEntity.ok(response);
    }

    /**
     * PAGE RANKING
     * GET /api/courses/ranking?keyword=python
     */
    @GetMapping("/ranking")
    public ResponseEntity<Map<String, Object>> getPageRanking(
            @RequestParam String keyword) {
        List<Map<String, Object>> rankings = courseService.getPageRankings(keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("keyword", keyword);
        response.put("rankings", rankings);

        return ResponseEntity.ok(response);
    }

    /**
     * WORD FREQUENCY IN COURSE
     * GET /api/courses/1/frequency?word=python
     */
    @GetMapping("/{courseId}/frequency")
    public ResponseEntity<Map<String, Object>> getWordFrequency(
            @PathVariable Long courseId,
            @RequestParam String word) {
        Map<String, Object> frequency = courseService.getWordFrequencyInCourse(courseId, word);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", frequency);

        return ResponseEntity.ok(response);
    }

    /**
     * COMPARE PLATFORMS
     * GET /api/courses/compare?platforms=Coursera,Udemy,Harvard
     */
    @GetMapping("/compare")
    public ResponseEntity<Map<String, Object>> comparePlatforms(
            @RequestParam List<String> platforms) {
        Map<String, Object> comparison = courseService.comparePlatforms(platforms);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("comparison", comparison);

        return ResponseEntity.ok(response);
    }
}
