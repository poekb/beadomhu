package com.poe_kb.beadomhu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.crypto.RSACrypto;
import com.poe_kb.beadomhu.crypto.StringEncoder;
import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.model.SessionInfo;
import com.poe_kb.beadomhu.model.User;
import com.poe_kb.beadomhu.service.UserService;

@RestController
@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @GetMapping("/request/get/initlogin")
    public String initlogin(){

        return LoginManager.startInit();
    }

    @CrossOrigin
    @GetMapping("/request/get/loginapitoken")
    public String getLoginApiToken(@RequestHeader("email") String encryptedEmail,@RequestHeader("password") String encryptedPassword){
        String email = RSACrypto.decrypt(encryptedEmail, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey());
        email = StringEncoder.decodeString(email);

        String password = RSACrypto.decrypt(encryptedPassword, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey());
        password = StringEncoder.decodeString(password);

        User user = userService.getUserByEmail(email);
        if(user==null) return "!Rossz email cím vagy jelszó";
        if(!user.getPassword().equals(password)) return "!Rossz email cím vagy jelszó";

        return BeadomhuApplication.AES.encryptMessage(user.getApiToken(), password);
    }

    @CrossOrigin
    @GetMapping("/request/get/loginwithtoken")
    public String loginWithAPIToken(@RequestHeader("token") String encryptedAPIAndInitToken){
        String[] APIandInitToken = RSACrypto.decrypt(encryptedAPIAndInitToken, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey()).split("::");
        String APIToken = APIandInitToken[0];
        String initToken = APIandInitToken[1];
        User user = userService.getUserByAPIToken(APIToken);

        if(user == null) return "!a";

        //System.out.println(user.getEmail());


        if(!LoginManager.validateInitToken(initToken, user.getEmail())) return "!b";

        SessionInfo sessionInfo = LoginManager.addUser(user.getId());
        String sessionInfoStr = sessionInfo.ID+"::"+sessionInfo.Token+"::"+sessionInfo.changingToken;

        return BeadomhuApplication.AES.encryptMessage(sessionInfoStr, APIToken);
    }

    @CrossOrigin
    @GetMapping("/request/get/loginuser")
    public String login(@RequestHeader("email") String encryptedEmail,@RequestHeader("password") String encryptedPassword){

        String[] emailAndInitToken = RSACrypto.decrypt(encryptedEmail, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey()).split("::");
        String email = emailAndInitToken[0];
        email = StringEncoder.decodeString(email);

        String initToken = emailAndInitToken[2];
        if(!LoginManager.validateInitToken(initToken, email)) return "!";

        
        String[] passwordAndToken = RSACrypto.decrypt(encryptedPassword, BeadomhuApplication.rsaKeyPairGenerator.getPrivateKey()).split("::");
        String password = passwordAndToken[0];
        password = StringEncoder.decodeString(password);

        if(!initToken.equals(passwordAndToken[1])) return "!";


        User user = userService.getUserByEmail(email);
        if(user==null) return "!Rossz email cím vagy jelszó";
        if(!user.getPassword().equals(password)) return "!Rossz email cím vagy jelszó";



        SessionInfo sessionInfo = LoginManager.addUser(user.getId());
        String sessionInfoStr = sessionInfo.ID+"::"+sessionInfo.Token;

        return BeadomhuApplication.AES.encryptMessage(sessionInfoStr, password);
    }

}
