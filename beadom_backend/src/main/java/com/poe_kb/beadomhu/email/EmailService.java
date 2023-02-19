package com.poe_kb.beadomhu.email;

import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService implements EmailSender{

    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }



    @Override
    @Async
    public void send(String to,String title, String text, Boolean html) {
        try{
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,"utf-8");
            helper.setText(text,html);
            helper.setTo(to);
            helper.setSubject(title);
            helper.setFrom("noreply@beadom.hu");
            mailSender.send(mimeMessage);
        }catch(MessagingException e){
            System.out.println("Failed to send email: "+e);
            throw new IllegalStateException("Failed to send email");
        }
    }
    
}
