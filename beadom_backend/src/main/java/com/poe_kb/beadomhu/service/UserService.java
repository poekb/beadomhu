package com.poe_kb.beadomhu.service;

import com.poe_kb.beadomhu.model.User;

public interface UserService{

    public Boolean containsEmail(String email);
    public Boolean containsEApiToken(String apiToken);
    public void addUser(User user);
    public User getUserByEmail(String email);
    public User getUSerByID(Integer userID);
    public User getUserByAPIToken(String APIToken);
}
