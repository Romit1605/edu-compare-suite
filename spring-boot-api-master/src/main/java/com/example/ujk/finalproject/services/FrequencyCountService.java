package com.example.ujk.finalproject.services;


import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.Map;

@Service
public class FrequencyCountService {
    private final ConcurrentHashMap<String, Integer> frequencyMap = new ConcurrentHashMap<>();

    public int incrementAndGetFrequency(String word) {
        return frequencyMap.merge(word.toLowerCase(), 1, Integer::sum);
    }

    // Return a snapshot of the current frequencies for reporting/trending
    public Map<String, Integer> getFrequencySnapshot() {
        return new HashMap<>(frequencyMap);
    }
}
