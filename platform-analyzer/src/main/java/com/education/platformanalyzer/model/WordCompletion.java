package com.education.platformanalyzer.model;

import jakarta.persistence.*;

@Entity
@Table(name = "word_completion")
public class WordCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String prefix;

    @Column(name = "complete_word")
    private String completeWord;

    @Column(name = "usage_count")
    private Integer usageCount = 1;

    public WordCompletion() {
    }

    public WordCompletion(String prefix, String completeWord) {
        this.prefix = prefix;
        this.completeWord = completeWord;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getCompleteWord() {
        return completeWord;
    }

    public void setCompleteWord(String completeWord) {
        this.completeWord = completeWord;
    }

    public Integer getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }
}
