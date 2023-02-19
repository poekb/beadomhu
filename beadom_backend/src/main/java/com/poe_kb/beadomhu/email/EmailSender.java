package com.poe_kb.beadomhu.email;

public interface EmailSender {
    void send(String to,String title, String text, Boolean html);
}
