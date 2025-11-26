package com.example.ujk.finalproject.services;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpellCheckService {
    // this should be fetched from db
    private static final List<String> WORDS = List.of(
            "apple", "application", "apply", "applet",
            "banana", "band", "bank", "banner",
            "cat", "cater", "category", "catch", "python","java","javascript"
    );

    public String getCorrectedWord(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        String bestMatch = null;
        int minDistance = Integer.MAX_VALUE;

        for (String word : WORDS) {
            int distance = levenshteinDistance(input.toLowerCase(), word.toLowerCase());
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = word;
            }
        }

        return bestMatch;
    }

    public boolean isCorrectlySpelt(String word) {
        return WORDS.contains(word.toLowerCase());
    }
    // Simple Levenshtein distance
    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                            dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1])
                    );
                }
            }
        }
        return dp[a.length()][b.length()];
    }
}