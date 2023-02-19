package com.poe_kb.beadomhu.service;

import java.util.List;

import com.poe_kb.beadomhu.model.Source;

public interface SourceService {
    public Source addSource(Integer paperID,String url,String viewDate);
    public Source getSourceByID(Integer sourceID);
    public Void removeSourceByID(Integer sourceID);
    public List<Source> getAllSourcesFromPaperID(Integer paperID);
    public Void reomoveAllSources(Integer paperID);
    public Void saveSource(Source source);
}
