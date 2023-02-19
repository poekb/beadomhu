package com.poe_kb.beadomhu.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Source {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer paperID;
    private String title;
    private String url;
    private String viewDate;


    public Source() {
    }

    public Source(Integer paperID, String title, String url, String viewDate) {
        this.paperID = paperID;
        this.title = title;
        this.url = url;
        this.viewDate = viewDate;
    }
    
    public Integer getPaperID() {
        return paperID;
    }

    public void setPaperID(Integer paperID) {
        this.paperID = paperID;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getViewDate() {
        return this.viewDate;
    }

    public void setViewDate(String viewDate) {
        this.viewDate = viewDate;
    }    
}
