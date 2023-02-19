package com.poe_kb.beadomhu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Paper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userID;
    private String title;
    private String color;
    @Column(length = 5000)
    private String description;
    private String deadline;
    private Boolean reminder;


    public Paper() {
    }

    public Paper(Integer id, Integer userID, String title, String color, String description, String deadline, Boolean reminder) {
        this.id = id;
        this.userID = userID;
        this.title = title;
        this.color = color;
        this.description = description;
        this.deadline = deadline;
        this.reminder = reminder;
    }

    public Paper(Integer userID, String title, String color, String description, String deadline, Boolean reminder) {
        this.userID = userID;
        this.title = title;
        this.color = color;
        this.description = description;
        this.deadline = deadline;
        this.reminder = reminder;
    }

    public Boolean getReminder() {
        return reminder;
    }

    public void setReminder(Boolean reminder) {
        this.reminder = reminder;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserID() {
        return this.userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeadline() {
        return this.deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

}