package com.education.platformanalyzer.repository;

import com.education.platformanalyzer.model.WordCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WordCompletionRepository extends JpaRepository<WordCompletion, Long> {
    List<WordCompletion> findTop10ByPrefixStartingWithOrderByUsageCountDesc(String prefix);
}
