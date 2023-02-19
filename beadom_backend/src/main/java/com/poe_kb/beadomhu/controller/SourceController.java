package com.poe_kb.beadomhu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.crypto.StringEncoder;
import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.model.Paper;
import com.poe_kb.beadomhu.model.SessionInfo;
import com.poe_kb.beadomhu.model.Source;
import com.poe_kb.beadomhu.model.UserAndToken;
import com.poe_kb.beadomhu.service.PaperService;
import com.poe_kb.beadomhu.service.SourceService;

@RestController
@Controller
public class SourceController {
    
    @Autowired
    private PaperService paperService;

    @Autowired
    private SourceService sourceService;
    @CrossOrigin
    @GetMapping("/request/get/getallsources")
    public String getAllSources(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken,@RequestHeader("paperid") String encryptedPaperID){
        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return "!";
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return "!token";

        Integer paperID = Integer.parseInt(BeadomhuApplication.AES.decryptMessage(encryptedPaperID,session.Token));

        Paper paper = paperService.getPaperByID(paperID);
        if(paper.getUserID()!=userAndToken.user.getId()) return "!";
        List<Source> sources = sourceService.getAllSourcesFromPaperID(paperID);

        ObjectMapper mapper = new ObjectMapper();

        ObjectNode sourcesObj = mapper.createObjectNode();
       
        ArrayNode arrayNode = mapper.valueToTree(sources);
        sourcesObj.putArray("sources").addAll(arrayNode);
        return BeadomhuApplication.AES.encryptMessage(userAndToken.token+"::"+StringEncoder.encodeString(sourcesObj.toString()), session.Token);
        
    }

    @CrossOrigin
    @GetMapping("/request/get/deleteSource")
    public String deleteSourceByID(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken,@RequestHeader("paperid") String encryptedSourceID){
        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return "!";
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return "!token";

        Integer sourceID = Integer.parseInt(BeadomhuApplication.AES.decryptMessage(encryptedSourceID,session.Token));

        Source source = sourceService.getSourceByID(sourceID);
        if(source==null) return "!";

        Paper paper = paperService.getPaperByID(source.getPaperID());
        if(paper.getUserID()!=userAndToken.user.getId()) return "!";

        sourceService.removeSourceByID(sourceID);
        
        return BeadomhuApplication.AES.encryptMessage(userAndToken.token, session.Token);
        
    }
    @CrossOrigin
    @PostMapping("/request/post/saveSource")
    public ResponseEntity<String> saveSource(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken, @RequestBody String requsetBody) 
    throws JsonMappingException, JsonProcessingException{

        HttpHeaders responseHeaders = new HttpHeaders();
        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return new ResponseEntity<String>("!token",responseHeaders, HttpStatus.OK );

        String request = BeadomhuApplication.AES.decryptMessage(requsetBody, session.Token);

        ObjectMapper mapper = new ObjectMapper();

        Source newSource = mapper.readValue(request,Source.class);

        Source oldSource = sourceService.getSourceByID(newSource.getId());


        if(!newSource.getPaperID().equals(oldSource.getPaperID())) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );

        Paper paper = paperService.getPaperByID(oldSource.getPaperID());

        if(paper == null || paper.getUserID()!=userAndToken.user.getId()) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );
                
        sourceService.saveSource(newSource);

        return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token, session.Token),responseHeaders, HttpStatus.OK );
    }

    @CrossOrigin
    @PostMapping("/request/post/addsource")
    public ResponseEntity<String> addSource(@RequestHeader("sessionid") String sessionID,@RequestHeader("changingtoken") String changingtoken, @RequestBody String requsetBody) 
    throws JsonMappingException, JsonProcessingException{

        HttpHeaders responseHeaders = new HttpHeaders();

        if(!LoginManager.sessionIDtoInfo.containsKey(sessionID)) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );
        SessionInfo session = LoginManager.getSessionInfo(sessionID);
        UserAndToken userAndToken = LoginManager.getUser(sessionID, changingtoken);
        if(userAndToken == null) return new ResponseEntity<String>("!token",responseHeaders, HttpStatus.OK );

        String request = BeadomhuApplication.AES.decryptMessage(requsetBody, session.Token);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode requestData = mapper.readTree(request);

        try{
            Integer paperID = requestData.get("paperid").asInt();

            Paper paper = paperService.getPaperByID(paperID);

            if(paper == null || paper.getUserID() != userAndToken.user.getId()) return new ResponseEntity<String>("!",responseHeaders, HttpStatus.OK );


            Source newSource = sourceService.addSource(paperID, requestData.get("url").asText(), requestData.get("viewdate").asText());

            return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token+"::"+StringEncoder.encodeString(mapper.writeValueAsString(newSource)), session.Token),responseHeaders, HttpStatus.OK );
        }catch(Exception e){
            return new ResponseEntity<String>(BeadomhuApplication.AES.encryptMessage(userAndToken.token, session.Token),responseHeaders, HttpStatus.OK );

        }
       

    }
}
