package com.education.platformanalyzer.service;

import com.education.platformanalyzer.model.*;
import com.education.platformanalyzer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private WordCompletionRepository wordCompletionRepository;

    @Autowired
    private PageRankingRepository pageRankingRepository;

    /**
     * FEATURE 1: SEARCH COURSES with all enhancements
     */
    @Transactional
    public List<Course> searchCourses(String keyword) {
        // Record search history (Feature 6)
        recordSearchHistory(keyword);

        // Build word completion data (Feature 4)
        buildWordCompletion(keyword);

        // Search courses (Feature 8: Inverted Indexing - built into JPA)
        List<Course> results = courseRepository
                .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(keyword, keyword);

        // Calculate page rankings (Feature 7)
        if (!results.isEmpty()) {
            calculatePageRankings(keyword, results);
        }

        return results;
    }

    /**
     * FEATURE 4: WORD COMPLETION (Autocomplete)
     */
    public List<String> getWordCompletions(String prefix) {
        if (prefix == null || prefix.length() < 1) {
            return Collections.emptyList();
        }

        List<WordCompletion> completions = wordCompletionRepository
                .findTop10ByPrefixStartingWithOrderByUsageCountDesc(prefix.toLowerCase());

        return completions.stream()
                .map(WordCompletion::getCompleteWord)
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * FEATURE 3: SPELL CHECKER
     */
    public List<String> getSpellingSuggestions(String word) {
        // Get vocabulary from all courses
        List<Course> allCourses = courseRepository.findAll();
        Set<String> vocabulary = new HashSet<>();

        for (Course course : allCourses) {
            String text = (course.getTitle() + " " +
                    (course.getDescription() != null ? course.getDescription() : "") + " " +
                    (course.getCategory() != null ? course.getCategory() : ""))
                    .toLowerCase();
            String[] words = text.split("[\\s\\p{Punct}]+");
            for (String w : words) {
                if (w.length() > 2) {
                    vocabulary.add(w);
                }
            }
        }

        // Calculate edit distance and suggest closest words
        String searchWord = word.toLowerCase();
        List<String> suggestions = vocabulary.stream()
                .filter(w -> w.length() > 2)
                .map(w -> new AbstractMap.SimpleEntry<>(w, calculateEditDistance(searchWord, w)))
                .filter(entry -> entry.getValue() <= 2) // Edit distance <= 2
                .sorted(Map.Entry.comparingByValue())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return suggestions;
    }

    /**
     * FEATURE 5: FREQUENCY COUNT
     */
    public Map<String, Object> getWordFrequencyInCourse(Long courseId, String word) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        Map<String, Object> result = new HashMap<>();

        if (courseOpt.isEmpty()) {
            result.put("error", "Course not found");
            result.put("frequency", 0);
            return result;
        }

        Course course = courseOpt.get();
        String content = (course.getTitle() + " " +
                (course.getDescription() != null ? course.getDescription() : "") + " " +
                (course.getCategory() != null ? course.getCategory() : ""))
                .toLowerCase();

        int count = countOccurrences(content, word.toLowerCase());

        result.put("courseId", courseId);
        result.put("courseTitle", course.getTitle());
        result.put("word", word);
        result.put("frequency", count);

        return result;
    }

    /**
     * FEATURE 6: SEARCH FREQUENCY
     */
    public List<Map<String, Object>> getSearchFrequency() {
        List<SearchHistory> history = searchHistoryRepository.findTop10ByOrderBySearchCountDesc();

        return history.stream()
                .map(h -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("keyword", h.getKeyword());
                    map.put("searchCount", h.getSearchCount());
                    map.put("lastSearched", h.getLastSearched().toString());
                    return map;
                })
                .collect(Collectors.toList());
    }

    /**
     * FEATURE 7: PAGE RANKING
     */
    public List<Map<String, Object>> getPageRankings(String keyword) {
        List<PageRanking> rankings = pageRankingRepository
                .findTop10ByKeywordOrderByRankScoreDesc(keyword);

        return rankings.stream()
                .map(ranking -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("courseId", ranking.getCourse().getId());
                    map.put("title", ranking.getCourse().getTitle());
                    map.put("platform", ranking.getCourse().getPlatform());
                    map.put("rankScore", ranking.getRankScore());
                    map.put("occurrences", ranking.getOccurrences());
                    return map;
                })
                .collect(Collectors.toList());
    }

    /**
     * PLATFORM COMPARISON
     */
    public Map<String, Object> comparePlatforms(List<String> platforms) {
        Map<String, Object> comparison = new HashMap<>();

        for (String platform : platforms) {
            List<Course> courses = courseRepository.findByPlatform(platform);

            Map<String, Object> platformData = new HashMap<>();
            platformData.put("totalCourses", courses.size());
            platformData.put("categories", courses.stream()
                    .map(Course::getCategory)
                    .filter(Objects::nonNull)
                    .distinct()
                    .count());
            platformData.put("averageRating", calculateAverageRating(courses));
            platformData.put("priceRange", getPriceRange(courses));

            comparison.put(platform, platformData);
        }

        return comparison;
    }

    // ===== HELPER METHODS =====

    private void recordSearchHistory(String keyword) {
        String normalizedKeyword = keyword.toLowerCase().trim();
        Optional<SearchHistory> existing = searchHistoryRepository.findByKeyword(normalizedKeyword);

        if (existing.isPresent()) {
            SearchHistory history = existing.get();
            history.incrementSearchCount();
            searchHistoryRepository.save(history);
        } else {
            SearchHistory newHistory = new SearchHistory(normalizedKeyword);
            searchHistoryRepository.save(newHistory);
        }
    }

    private void buildWordCompletion(String keyword) {
        String[] words = keyword.toLowerCase().split("\\s+");

        for (String word : words) {
            if (word.length() < 2)
                continue;

            for (int i = 1; i <= word.length(); i++) {
                String prefix = word.substring(0, i);

                List<WordCompletion> existing = wordCompletionRepository
                        .findTop10ByPrefixStartingWithOrderByUsageCountDesc(prefix);

                boolean found = false;
                for (WordCompletion wc : existing) {
                    if (wc.getCompleteWord().equals(word)) {
                        wc.setUsageCount(wc.getUsageCount() + 1);
                        wordCompletionRepository.save(wc);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    WordCompletion newCompletion = new WordCompletion(prefix, word);
                    wordCompletionRepository.save(newCompletion);
                }
            }
        }
    }

    private void calculatePageRankings(String keyword, List<Course> courses) {
        String searchKeyword = keyword.toLowerCase();

        for (Course course : courses) {
            String content = (course.getTitle() + " " +
                    (course.getDescription() != null ? course.getDescription() : "") + " " +
                    (course.getCategory() != null ? course.getCategory() : ""))
                    .toLowerCase();

            int occurrences = countOccurrences(content, searchKeyword);

            if (occurrences > 0) {
                String[] words = content.split("\\s+");
                double score = words.length > 0 ? ((double) occurrences / words.length) * 100 : 0;

                PageRanking ranking = new PageRanking();
                ranking.setCourse(course);
                ranking.setKeyword(searchKeyword);
                ranking.setOccurrences(occurrences);
                ranking.setRankScore(score);

                pageRankingRepository.save(ranking);
            }
        }
    }

    private int countOccurrences(String text, String word) {
        if (text == null || word == null)
            return 0;

        String[] words = text.split("[\\s\\p{Punct}]+");
        int count = 0;
        for (String w : words) {
            if (w.equalsIgnoreCase(word)) {
                count++;
            }
        }
        return count;
    }

    private int calculateEditDistance(String word1, String word2) {
        int[][] dp = new int[word1.length() + 1][word2.length() + 1];

        for (int i = 0; i <= word1.length(); i++)
            dp[i][0] = i;
        for (int j = 0; j <= word2.length(); j++)
            dp[0][j] = j;

        for (int i = 1; i <= word1.length(); i++) {
            for (int j = 1; j <= word2.length(); j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }

        return dp[word1.length()][word2.length()];
    }

    private double calculateAverageRating(List<Course> courses) {
        return courses.stream()
                .map(Course::getRating)
                .filter(r -> r != null && !r.isEmpty())
                .mapToDouble(r -> {
                    try {
                        return Double.parseDouble(r.replaceAll("[^0-9.]", ""));
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .average()
                .orElse(0.0);
    }

    private String getPriceRange(List<Course> courses) {
        List<Double> prices = courses.stream()
                .map(Course::getPrice)
                .filter(p -> p != null && !p.isEmpty())
                .map(p -> {
                    try {
                        return Double.parseDouble(p.replaceAll("[^0-9.]", ""));
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .filter(p -> p > 0)
                .collect(Collectors.toList());

        if (prices.isEmpty())
            return "Free - Varies";

        double min = Collections.min(prices);
        double max = Collections.max(prices);

        return String.format("$%.2f - $%.2f", min, max);
    }
}
