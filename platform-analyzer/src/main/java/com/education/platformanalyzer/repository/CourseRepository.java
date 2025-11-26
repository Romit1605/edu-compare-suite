package com.education.platformanalyzer.repository;

import com.education.platformanalyzer.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category);

    List<Course> findByPlatform(String platform);
}
