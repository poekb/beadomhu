package com.poe_kb.beadomhu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poe_kb.beadomhu.model.User;
import com.poe_kb.beadomhu.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Boolean containsEmail(String email) {
        List<User> users = userRepository.findByEmail(email);
        return users.size()>0;
    }

    @Override
    public void addUser(User user) {
        userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        List<User> users = userRepository.findByEmail(email);
        if(users.size()==0) return null;

        return users.get(0);
    }

    @Override
    public User getUSerByID(Integer userID) {
        Optional<User> user = userRepository.findById(userID);
        if(user.isEmpty()) return null;
        return user.get();
    }

    @Override
    public Boolean containsEApiToken(String apiToken) {
        List<User> users = userRepository.findByApiToken(apiToken);
        return users.size()>0;
    }

    @Override
    public User getUserByAPIToken(String APIToken) {
        List<User> users = userRepository.findByApiToken(APIToken);
        if(users.size()==0) return null;
        return users.get(0);
    }
}
