package com.example.ujk.finalproject.exceptions;

import com.example.ujk.finalproject.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(assignableTypes = com.example.ujk.finalproject.controllers.FrequencyCountController.class)
public class FreqExceptionHandler {
    @Autowired
    private SearchService searchService;

    public ResponseEntity<Map<String, Object>> handleSpellCheckValidationError(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", 400);
        body.put("message", errorMessage);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

}
