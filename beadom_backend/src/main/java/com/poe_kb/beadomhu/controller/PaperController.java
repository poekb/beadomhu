package com.poe_kb.beadomhu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.crypto.StringEncoder;
import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.model.Paper;
import com.poe_kb.beadomhu.model.SessionInfo;
import com.poe_kb.beadomhu.model.UserAndToken;
import com.poe_kb.beadomhu.service.PaperService;
import com.poe_kb.beadomhu.service.SourceService;

@RestController
@Controller
public class PaperController {
    @Autowired
    private SourceService sourceService;

    @Autowired
    private PaperService paperService;

    @CrossOrigin
    @PostMapping("/request/post/newpaper")
    public ResponseEntity<String> addNewPaper(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken, @RequestBody String requsetBody) throws JsonMappingException, JsonProcessingException{
        HttpHeaders responseHeaders = new HttpHeaders();

        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );;
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return new ResponseEntity<String>("!token",responseHeaders, HttpStatus.OK );

        String request = BeadomhuApplication.AES.decryptMessage((requsetBody), session.Token);

        
        ObjectMapper mapper = new ObjectMapper();

        JsonNode requestData = mapper.readTree(request);
        
        Paper newPaper = new Paper(userAndToken.user.getId(), 
        requestData.get("title").asText(), 
        requestData.get("color").asText(), 
        requestData.get("description").asText(), 
        requestData.get("deadline").asText(),
        requestData.get("reminder").asBoolean()
        );

        paperService.addPaper(newPaper);
        //simpMessagingTemplate.convertAndSendToUser(sessionID,"/paperlistener", BeadomhuApplication.AES.encryptMessage(StringEncoder.encodeString(mapper.writeValueAsString(newPaper)), LoginManager.getSessionInfo(sessionID).Token));

        return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token+"::"+StringEncoder.encodeString(mapper.writeValueAsString(newPaper)), session.Token),responseHeaders, HttpStatus.OK );
    }


    @CrossOrigin
    @PostMapping("/request/post/updatepaper")
    public ResponseEntity<String> updatePaper(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken, @RequestBody String requsetBody) throws JsonMappingException, JsonProcessingException{
        HttpHeaders responseHeaders = new HttpHeaders();

        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return new ResponseEntity<String>("!token",responseHeaders, HttpStatus.OK );

        String request = BeadomhuApplication.AES.decryptMessage((requsetBody), session.Token);

        
        ObjectMapper mapper = new ObjectMapper();

        JsonNode requestData = mapper.readTree(request);

        Paper oldPaper = paperService.getPaperByID(requestData.get("id").asInt());

        if(oldPaper == null || oldPaper.getUserID() != userAndToken.user.getId()) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );

        
        Paper newPaper = new Paper(oldPaper.getId(),userAndToken.user.getId(), 
        requestData.get("title").asText(), 
        requestData.get("color").asText(), 
        requestData.get("description").asText(), 
        requestData.get("deadline").asText(),
        requestData.get("reminder").asBoolean()
        );

        paperService.addPaper(newPaper);
        
        return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token, session.Token),responseHeaders, HttpStatus.OK );
    }


    @CrossOrigin
    @PostMapping("/request/post/deletepaper")
    public ResponseEntity<String> deletePaper(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken, @RequestBody String requsetBody) throws JsonMappingException, JsonProcessingException{
        HttpHeaders responseHeaders = new HttpHeaders();

        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return new ResponseEntity<String>("!token",responseHeaders, HttpStatus.OK );

        String request = BeadomhuApplication.AES.decryptMessage(requsetBody, session.Token);

        
        ObjectMapper mapper = new ObjectMapper();

        JsonNode requestData = mapper.readTree(request);

        Paper oldPaper = paperService.getPaperByID(requestData.get("id").asInt());

        if(oldPaper == null || oldPaper.getUserID() != userAndToken.user.getId()) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );

        sourceService.reomoveAllSources(oldPaper.getId());
        
        paperService.removePaperByID(oldPaper.getId());

        
        return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token, session.Token),responseHeaders, HttpStatus.OK );
    }
}
