package com.poe_kb.beadomhu.manager;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.poe_kb.beadomhu.email.EmailSender;
import com.poe_kb.beadomhu.model.Paper;
import com.poe_kb.beadomhu.model.User;
import com.poe_kb.beadomhu.service.PaperService;
import com.poe_kb.beadomhu.service.UserService;

@Component
public class NotificationManager {
    
    public static PaperService paperService;
    public static UserService userService;
    public static EmailSender emailSender;

    @Autowired
    public NotificationManager(PaperService paperService, UserService userService, EmailSender emailService) {
        NotificationManager.paperService = paperService;
        NotificationManager.userService = userService;
        NotificationManager.emailSender = emailService;
    }

    public static void sendNotifications(){
        System.out.println("[INFO] Sending notifications");
        List<Paper> duePapers = paperService.getAllDuePapers();
        for (Paper paper : duePapers) {
            User user = userService.getUSerByID(paper.getUserID());;
            System.out.println(" - to: "+user.getEmail());

            String title = "Emlékeztető: "+paper.getTitle();

            String message = "Kedves "+user.getUsername()+"!\nHolnap jár le a határideje a \""+paper.getTitle()+"\" című beadandójának!";

            emailSender.send(user.getEmail(),title,message,false);
            
        } 
    }
    
}
