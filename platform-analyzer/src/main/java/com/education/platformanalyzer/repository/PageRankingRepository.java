package com.education.platformanalyzer.repository;

import com.education.platformanalyzer.model.PageRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PageRankingRepository extends JpaRepository<PageRanking, Long> {
    List<PageRanking> findTop10ByKeywordOrderByRankScoreDesc(String keyword);
}
