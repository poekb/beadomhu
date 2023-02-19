package com.poe_kb.beadomhu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poe_kb.beadomhu.model.Paper;


@Repository
public interface PaperRepository extends JpaRepository<Paper,Integer>{

    @Query("SELECT p.title FROM Paper p WHERE userID = ?1")
    List<Object[]> findAllPaperInfos(Integer userID);

    @Query("FROM Paper WHERE userID = ?1")
    List<Paper> findAllPapersFromUserID(Integer userID);

    @Query(value =  
    "SELECT paper.id, userid, title, color, description, deadline, reminder FROM user, paper "+
    "WHERE paper.userid = user.id AND NOT(paper.deadline IS NUll OR paper.deadline = \"\") AND paper.reminder AND DATE_ADD(paper.deadline,INTERVAL -1 DAY) = (:dateFilter)"
    ,nativeQuery = true)
    List<Object[]> findAllDuePapers(@Param(value = "dateFilter") String date);

}
