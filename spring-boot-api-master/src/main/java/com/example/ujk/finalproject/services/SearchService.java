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
        // Add a sample Java course so searches for "java" return results during development
        Course c2 = new Course(
            "Java Programming: From Beginner to Professional",
            "https://www.udemy.com/course/java-programming-beginner-to-advanced/",
            "Udemy",
            "Beginner",
            "Course",
            "programming",
            "https://udemy-images.udemy.com/course/200_H/1234567890_abcdef.jpg",
            "01/15/2024 9:00:00 AM"
        );
        courses.add(c2);
        // Add one more sample course to broaden demo data
        Course c3 = new Course(
            "Full-Stack Web Development with React and Node",
            "https://www.coursera.org/learn/full-stack-react-node",
            "Coursera",
            "Intermediate",
            "Course",
            "web-development",
            "https://example.com/images/fullstack.jpg",
            "06/20/2024 10:00:00 AM"
        );
        courses.add(c3);
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

    // Return all courses (used by reporting endpoints)
    public List<Course> searchAll() {
        return new ArrayList<>(courses);
    }
}
