package com.education.platformanalyzer.repository;

import com.education.platformanalyzer.model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    Optional<SearchHistory> findByKeyword(String keyword);

    List<SearchHistory> findTop10ByOrderBySearchCountDesc();
}
