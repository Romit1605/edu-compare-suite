package com.example.ujk.finalproject.controllers;

import java.util.List;

import com.example.ujk.finalproject.services.AutoCompleteService;
import com.example.ujk.finalproject.model.AutoCompleteRequest;
import com.example.ujk.finalproject.model.AutoCompleteResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/autocomplete")
@CrossOrigin(origins = "*")   // If frontend uses React/Vite
public class AutoCompleteController {
    @Autowired
    private AutoCompleteService autocompleteService;

    @PostMapping
    public AutoCompleteResponse getCompletions( @Valid @RequestBody AutoCompleteRequest req) {
        List<String> results = autocompleteService.getCompletions(req.getWord());
        AutoCompleteResponse res = new AutoCompleteResponse(results);
        res.setStatusCode(200);
        res.setMessage("Success");
        return res;
    }
}
