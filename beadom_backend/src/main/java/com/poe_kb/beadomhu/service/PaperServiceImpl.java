package com.poe_kb.beadomhu.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poe_kb.beadomhu.model.Paper;
import com.poe_kb.beadomhu.repository.PaperRepository;
@Service
public class PaperServiceImpl implements PaperService {

    @Autowired
    private PaperRepository paperRepository;

    @Override
    public List<Paper> findAllPapersFromUserID(Integer userID) {
        return paperRepository.findAllPapersFromUserID(userID);
    }
    @Override
    public void addPaper(Paper paper) {
        paperRepository.save(paper);
    }
    @Override
    public Paper getPaperByID(Integer paperID) {
        return paperRepository.getReferenceById(paperID);
    }
    @Override
    public void removePaperByID(Integer paperID) {
        paperRepository.deleteById(paperID);
    }
    @Override
    public List<Paper> getAllDuePapers() {

        List<Object[]> papers = paperRepository.findAllDuePapers(LocalDate.now().toString());
        List<Paper> result = new ArrayList<Paper>();
        
        for (Object[] paper : papers) {
            result.add(new Paper((Integer)paper[0],
            (Integer) paper[1],
            (String)paper[2],
            (String)paper[3],
            (String)paper[4],
            (String)paper[5],
            (Boolean)paper[6]));
        }
        new Paper(null, null, null, null, null, null, null);
     
        return result;
    }
    
}
