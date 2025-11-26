package com.example.ujk.finalproject.controllers;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.ujk.finalproject.services.SpellCheckService;
import com.example.ujk.finalproject.model.SpellCheckRequest;
import com.example.ujk.finalproject.model.SpellCheckResponse;

@RestController
@RequestMapping("/api/spellcheck")
@CrossOrigin(origins = "*")
public class SpellCheckController {

    @Autowired
    private SpellCheckService spellCheckService;

    @PostMapping
    public SpellCheckResponse checkWord( @Valid @RequestBody SpellCheckRequest req) {
        String corrected = spellCheckService.getCorrectedWord(req.getWord());

        boolean correct = corrected.equalsIgnoreCase(req.getWord());

        SpellCheckResponse res = new SpellCheckResponse(corrected, correct);
        res.setStatusCode(200);
        res.setMessage("Success");

        return res;
    }
}