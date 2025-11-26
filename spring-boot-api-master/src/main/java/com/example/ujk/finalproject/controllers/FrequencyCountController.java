package com.example.ujk.finalproject.controllers;

import com.example.ujk.finalproject.model.SpellCheckResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ujk.finalproject.model.FrequencyCountRequest;
import com.example.ujk.finalproject.model.FrequencyCountResponse;
import com.example.ujk.finalproject.services.FrequencyCountService;
import com.example.ujk.finalproject.services.SpellCheckService;

@RestController
@RequestMapping("/api/freq")
@CrossOrigin(origins = "*")
public class FrequencyCountController {
    @Autowired
    private FrequencyCountService service;
    @Autowired
    private SpellCheckService spellCheckService;

    @PostMapping
    public ResponseEntity<FrequencyCountResponse> getFrequency(@RequestBody FrequencyCountRequest request) {

        String word = request.getWord();

        // 1️⃣ Check correctness before updating frequency
        boolean isCorrect = spellCheckService.isCorrectlySpelt(word);

        if (!isCorrect) {
            FrequencyCountResponse resp = new FrequencyCountResponse(word, 0, "Incorrect spelling", 404);
            return ResponseEntity
                    .status(400)
                    .body(resp);
        }
        int updatedFrequency = service.incrementAndGetFrequency(word);

        FrequencyCountResponse success =
                new FrequencyCountResponse(word, updatedFrequency, "Success", 200);

        return ResponseEntity.ok(success);
    }
}
