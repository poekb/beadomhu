package com.poe_kb.beadomhu.model;

import java.time.LocalDateTime;

public class Register {
    public final String email;
    public final String username;
    public final String password;
    public final LocalDateTime creationDate;
    public final String listeningChannel;

    public Register(String email, String username, String password, LocalDateTime creationDate, String listeningChannel) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.creationDate = creationDate;
        this.listeningChannel = listeningChannel;
    }

}
