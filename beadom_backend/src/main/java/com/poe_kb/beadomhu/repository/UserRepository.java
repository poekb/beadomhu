package com.poe_kb.beadomhu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.poe_kb.beadomhu.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Integer>{
    @Query("FROM User WHERE email = ?1")
    List<User> findByEmail(String email);

    @Query("FROM User WHERE apiToken = ?1")
    List<User> findByApiToken(String apiToken);

    
}
