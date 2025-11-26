package com.example.ujk.finalproject.services;

import com.example.ujk.finalproject.model.Course;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SearchService {
    private final List<Course> courses = new ArrayList<>();
    private final Map<String, Set<Integer>> invertedIndex = new ConcurrentHashMap<>();

    public SearchService() {
        // Mock Data (replace later with DB fetch)
        Course c1 = new Course(
                "Python for Data Science, AI & Development",
                "https://www.coursera.org/learn/python-for-applied-data-science-ai",
                "IBM",
                "Beginner",
                "Course",
                "web-development",
                "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/fc/c1b8dfbac740999b6256aca490de43/Python-Image.jpg?auto=format%2C%20compress%2C%20enhance&dpr=1&w=320&h=180&fit=crop&q=50",
                "10/4/2025 8:09:00 PM"
        );

        courses.add(c1);
        buildIndex();
    }

    private void buildIndex() {
        for (int i = 0; i < courses.size(); i++) {
            Course c = courses.get(i);

            String content = (
                    c.getTitle() + " " +
                            c.getCategory() + " " +
                            c.getLevel() + " " +
                            c.getUniversity()
            ).toLowerCase();

            for (String word : content.split("\\W+")) {
                invertedIndex
                        .computeIfAbsent(word, k -> new HashSet<>())
                        .add(i);
            }
        }
    }

    public List<Course> search(String keyword) {
        keyword = keyword.toLowerCase();

        Set<Integer> indexes = invertedIndex.get(keyword);
        if (indexes == null) return Collections.emptyList();

        List<Course> results = new ArrayList<>();
        for (Integer index : indexes) {
            results.add(courses.get(index));
        }

        return results;
    }
}
