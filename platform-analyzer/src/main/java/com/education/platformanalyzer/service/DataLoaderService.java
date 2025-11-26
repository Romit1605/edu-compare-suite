package com.education.platformanalyzer.service;

import com.education.platformanalyzer.model.Course;
import com.education.platformanalyzer.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Arrays;

@Component
public class DataLoaderService implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            Course c1 = new Course("Complete Python Bootcamp",
                    "Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games",
                    "Development", "Udemy", "4.6", "$19.99");
            Course c2 = new Course("Java Programming Masterclass",
                    "Learn Java In This Comprehensive Course. Master the core Java skills needed to apply for Java Developer positions",
                    "Development", "Udemy", "4.5", "$24.99");
            Course c3 = new Course("Machine Learning A-Z",
                    "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
                    "Data Science", "Coursera", "4.7", "Free");
            Course c4 = new Course("The Web Developer Bootcamp",
                    "The only course you need to learn web development - HTML, CSS, JS, Node, and More!", "Development",
                    "Udemy", "4.8", "$14.99");
            Course c5 = new Course("CS50's Introduction to Computer Science",
                    "An introduction to the intellectual enterprises of computer science and the art of programming.",
                    "Computer Science", "Harvard", "4.9", "Free");

            courseRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));
            System.out.println("Sample courses loaded!");
        }
    }
}
