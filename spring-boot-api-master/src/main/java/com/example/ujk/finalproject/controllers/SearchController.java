package com.example.ujk.finalproject.controllers;


import com.example.ujk.finalproject.model.Course;
import com.example.ujk.finalproject.model.SearchRequest;
import com.example.ujk.finalproject.model.SearchResponse;
import com.example.ujk.finalproject.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService service;

    @PostMapping
    public SearchResponse search(@RequestBody SearchRequest req) {
        List<Course> searched_courses =service.search(req.getSearch());
        SearchResponse searchResponse = new SearchResponse(searched_courses, 200,"Success");
        return searchResponse;
    }
}
