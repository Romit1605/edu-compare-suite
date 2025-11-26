package com.example.ujk.finalproject.services;


import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class FrequencyCountService {
    private final ConcurrentHashMap<String, Integer> frequencyMap = new ConcurrentHashMap<>();

    public int incrementAndGetFrequency(String word) {
        return frequencyMap.merge(word.toLowerCase(), 1, Integer::sum);
    }
}
