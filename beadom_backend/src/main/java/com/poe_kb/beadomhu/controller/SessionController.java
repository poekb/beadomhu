package com.poe_kb.beadomhu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.crypto.StringEncoder;
import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.model.Paper;
import com.poe_kb.beadomhu.model.SessionInfo;
import com.poe_kb.beadomhu.model.UserAndToken;
import com.poe_kb.beadomhu.service.PaperService;




@RestController
@Controller
public class SessionController {

    @Autowired
    private PaperService paperService;

    @CrossOrigin
    @PostMapping("/request/post/ping")
    public void pingSession(@RequestHeader("sessionid") String sessionID){
        LoginManager.pingSession(sessionID);
    }

    @CrossOrigin
    @GetMapping("/request/get/changingtoken")
    public String getChangingToken(@RequestHeader("sessionid") String sessionID){
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        return BeadomhuApplication.AES.encryptMessage(session.changingToken, session.Token);
    }

    @CrossOrigin
    @GetMapping("/request/get/basicinfo")
    public String getBasicInfo(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken) throws JsonProcessingException{
        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return "!";
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return "!token";

        ObjectMapper mapper = new ObjectMapper();

        BasicInfo basicInfo = new BasicInfo(userAndToken.user.getUsername(), paperService.findAllPapersFromUserID(userAndToken.user.getId()));


        String basicInfoString = mapper.writeValueAsString(basicInfo);
        
        return BeadomhuApplication.AES.encryptMessage(userAndToken.token+"::"+StringEncoder.encodeString(basicInfoString), session.Token);
    }

    @CrossOrigin
    @GetMapping("/request/get/isalive")
    public String testSession(@RequestHeader("sessionid") String sessionID){
        LoginManager.pingSession(sessionID);
        return LoginManager.isIDexpired(sessionID)?"e":"v";
    }
}
class BasicInfo{
    String username;
    //user settings

    List<Paper> duePapers;

    public BasicInfo(String username, List<Paper> duePapers) {
        this.username = username;
        this.duePapers = duePapers;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Paper> getDuePapers() {
        return this.duePapers;
    }

    public void setDuePapers(List<Paper> duePapers) {
        this.duePapers = duePapers;
    }

}