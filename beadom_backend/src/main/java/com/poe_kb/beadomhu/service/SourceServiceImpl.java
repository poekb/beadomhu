package com.poe_kb.beadomhu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poe_kb.beadomhu.model.Source;
import com.poe_kb.beadomhu.repository.SourceRepository;

@Service
public class SourceServiceImpl implements SourceService{

    @Autowired
    SourceRepository sourceRepository;

    @Autowired
    GetTitleService getTitleService;

    @Override
    public Source addSource(Integer paperID, String url, String viewDate) {
        String title = getTitleService.getTitleFromURL(url);
        Source source = new Source(paperID, title, url, viewDate);
        sourceRepository.save(source);

        return source;
    }

    @Override
    public List<Source> getAllSourcesFromPaperID(Integer paperID) {
        
        return sourceRepository.getAllSourcesFromPaperID(paperID);
    }

    @Override
    public Void reomoveAllSources(Integer paperID) {

        sourceRepository.removeAllSources(paperID);

        return null;
    }

    @Override
    public Source getSourceByID(Integer sourceID) {
        return sourceRepository.getReferenceById(sourceID);
    }

    @Override
    public Void removeSourceByID(Integer sourceID) {
        sourceRepository.deleteById(sourceID);
        return null;
    }

    @Override
    public Void saveSource(Source source) {
        sourceRepository.save(source);
        return null;
    }
    
}
