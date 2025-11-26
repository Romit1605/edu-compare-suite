package com.education.platformanalyzer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String keyword;

    @Column(name = "search_count")
    private Integer searchCount = 1;

    @Column(name = "last_searched")
    private LocalDateTime lastSearched = LocalDateTime.now();

    // Constructors
    public SearchHistory() {
    }

    public SearchHistory(String keyword) {
        this.keyword = keyword;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Integer getSearchCount() {
        return searchCount;
    }

    public void setSearchCount(Integer searchCount) {
        this.searchCount = searchCount;
    }

    public LocalDateTime getLastSearched() {
        return lastSearched;
    }

    public void setLastSearched(LocalDateTime lastSearched) {
        this.lastSearched = lastSearched;
    }

    public void incrementSearchCount() {
        this.searchCount++;
        this.lastSearched = LocalDateTime.now();
    }
}
