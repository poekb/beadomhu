package com.poe_kb.beadomhu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poe_kb.beadomhu.model.Source;

import jakarta.transaction.Transactional;

@Repository
public interface SourceRepository extends JpaRepository<Source,Integer> {
    @Query("FROM Source WHERE paperID = ?1")
    public List<Source> getAllSourcesFromPaperID(Integer paperID);

    @Modifying
    @Transactional
    @Query("DELETE FROM Source WHERE paperID = ?1")
    int removeAllSources(Integer paperID);
        
        
}
