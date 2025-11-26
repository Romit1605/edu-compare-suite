package com.example.ujk.finalproject.model;


public class Course {

    private String title;
    private String url;
    private String university;
    private String level;
    private String type;
    private String category;
    private String imageUrl;
    private String scrapedAt;

    // Constructor + Getters + Setters

    public Course(String title, String url, String university, String level, String type, String category, String imageUrl, String scrapedAt) {
        this.title = title;
        this.url = url;
        this.university = university;
        this.level = level;
        this.type = type;
        this.category = category;
        this.imageUrl = imageUrl;
        this.scrapedAt = scrapedAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getScrapedAt() {
        return scrapedAt;
    }

    public void setScrapedAt(String scrapedAt) {
        this.scrapedAt = scrapedAt;
    }
}
