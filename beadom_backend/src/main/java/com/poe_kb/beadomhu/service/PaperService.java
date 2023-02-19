package com.poe_kb.beadomhu.service;

import java.util.List;

import com.poe_kb.beadomhu.model.Paper;

public interface PaperService {

    public List<Paper> findAllPapersFromUserID(Integer userID);

    public Paper getPaperByID(Integer paperID);

    public void removePaperByID(Integer paperID);

    public void addPaper(Paper paper);

    public List<Paper> getAllDuePapers();
}
