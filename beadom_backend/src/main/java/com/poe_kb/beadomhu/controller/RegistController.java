package com.poe_kb.beadomhu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.crypto.RSACrypto;
import com.poe_kb.beadomhu.crypto.StringEncoder;
import com.poe_kb.beadomhu.email.EmailSender;
import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.manager.RegistManager;
import com.poe_kb.beadomhu.model.Register;
import com.poe_kb.beadomhu.model.User;
import com.poe_kb.beadomhu.service.UserService;

@RestController
@Controller
public class RegistController {

    final String confirmLetter[] = new String[]{"<div style=\"height: 80px;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif;\"><div style=\"margin: 10px; color: black;\">Az alábbi gombra kattintva befejezheti a regisztrációt:</div><a href=\"","\" style=\"padding: 5px 10px; margin: 10px; border-radius: 10px; background: #84CC16; color: black; text-decoration: none; font:bold;\">E-mail cím megerősítése</a><br/></div>"};
    final String frontendUrl = "https://dev.beadom.hu/";
    @Autowired
    private EmailSender emailSender;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    
    @CrossOrigin
    @GetMapping("/request/get/confirmemail")
    public String confirmEmail(@RequestHeader("registid") String registID) throws InterruptedException{
        Register registingUser = RegistManager.getRegisterByID(registID);

        if(registingUser == null) return "not-valid-link";
        
        //System.out.println("/regist/"+registingUser.listeningChannel);

        

        userService.addUser(new User(registingUser.email,registingUser.username,registingUser.password,"{}",LoginManager.getFreeApiToken()));
        try {
            simpMessagingTemplate.convertAndSendToUser(registingUser.listeningChannel,"/regist", "registered");

        } catch (Exception e) {
            //System.out.println(e);
        }
        RegistManager.removeRegister(registID);
        return "success";


    }

    @CrossOrigin
    @GetMapping("/request/get/regist")
    public String registUser(@RequestHeader("email") String encryptedEmail,
    @RequestHeader("username") String encryptedUsername,
    @RequestHeader("password") String encryptedPassword){ 

        String email = RSACrypto.decrypt(encryptedEmail, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey());
        email = StringEncoder.decodeString(email);
        String username = RSACrypto.decrypt(encryptedUsername, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey());
        username = StringEncoder.decodeString(username);
        //System.out.println(username);
        String password = RSACrypto.decrypt(encryptedPassword, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey());
        password = StringEncoder.decodeString(password);



        if(RegistManager.containsEmail(email)) return "!Ezzel az e-mail címmel már regisztráltak";

        String[] registInfo = RegistManager.addRegister(email, username, password).split("::");
        String registListenerChannel = registInfo[0];
        String registerID = registInfo[1];

        

        //System.out.println(frontendUrl+"regist?registerID="+registerID);
        try {
            emailSender.send(email, "E-mail cím megerősítése", confirmLetter[0]+frontendUrl+"regist?registerID="+registerID+confirmLetter[1],true);
            return BeadomhuApplication.AES.encryptMessage(registListenerChannel, password);


        } catch (Exception e) {
            System.out.println(e);
            RegistManager.removeRegister(registerID);
            return "!Nem létezik ilyen e-mail cím";
        }
    }
}
