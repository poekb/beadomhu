package com.poe_kb.beadomhu.model;

public class UserAndToken {
    public String token;
    public User user;

    public UserAndToken(String token, User user) {
        this.token = token;
        this.user = user;
    }
}
