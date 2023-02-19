package com.poe_kb.beadomhu.manager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.model.SessionInfo;
import com.poe_kb.beadomhu.model.UserAndToken;
import com.poe_kb.beadomhu.service.UserService;


@Component
public class LoginManager {

    private static final Integer UPDATE_ITERATIONS = 10000;
    private static final Integer TIMEOUT_SECONDS = 30;

    static UserService userService;
    static SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public LoginManager(UserService userService,SimpMessagingTemplate simpMessagingTemplate){
        LoginManager.userService = userService;
        LoginManager.simpMessagingTemplate = simpMessagingTemplate;
    }

    public static Map<String,SessionInfo> sessionIDtoInfo = new HashMap<String,SessionInfo>();
    public static Queue<String> sessionIDsUpdateQueue = new LinkedList<String>();

    public static Set<String> initTokenSet = new HashSet<String>();
    public static Queue<String> initTokens = new LinkedList<String>();

    public static Map<Integer,List<String>> userIDtoSessionIDs = new HashMap<Integer,List<String>>();

    public static SessionInfo getSessionInfo(String sessionID){
        if(sessionIDtoInfo.containsKey(sessionID)) return sessionIDtoInfo.get(sessionID);
        return null;
    }

    public static void pingSession(String sessionID){
        if(!sessionIDtoInfo.containsKey(sessionID))return;

        sessionIDtoInfo.get(sessionID).updateTime = LocalDateTime.now();
        sessionIDtoInfo.get(sessionID).timeoutWarning = false;
    }

    public static void updateSessions(){
        
        Integer iterations = Math.min(UPDATE_ITERATIONS,sessionIDtoInfo.size());
        for (int i = 0; i < iterations; i++) {
            String current = sessionIDsUpdateQueue.poll();
            //TODO: Change to minutes
            if(sessionIDtoInfo.get(current).updateTime.plusSeconds(TIMEOUT_SECONDS).isBefore(LocalDateTime.now())){
                if(sessionIDtoInfo.get(current).timeoutWarning){
                    removeUser(current);
                }else{
                    sessionIDtoInfo.get(current).timeoutWarning = true;
                    sessionIDtoInfo.get(current).updateTime = LocalDateTime.now();
                    simpMessagingTemplate.convertAndSendToUser(current,"/timeout", "timeout");
                    sessionIDsUpdateQueue.add(current);
                }
            }else sessionIDsUpdateQueue.add(current);
        }
    }
    public static Boolean isIDexpired(String sessionID){
        return !sessionIDtoInfo.containsKey(sessionID);
    }

    public static String startInit(){
        String token = getFreeInitToken();
        initTokens.add(token);
        initTokenSet.add(token);

        if(initTokens.size()>1000){
            initTokenSet.remove(initTokens.poll());
        }
        return token;
    }

    public static boolean validateInitToken(String token,String email){
        if(!initTokenSet.contains(token)) return false;
        
        initTokenSet.remove(token);
        initTokens.remove(token);
        return true;
    } 

    public static void removeUser(String sessionID){
        if(!sessionIDtoInfo.containsKey(sessionID)) return;
        
        sessionIDsUpdateQueue.remove(sessionID);

        userIDtoSessionIDs.get(sessionIDtoInfo.get(sessionID).userID).remove(sessionID);

        sessionIDtoInfo.remove(sessionID);


    }

    public static UserAndToken getUser(String sessionID,String changingToken){
        //System.out.println(changingToken);
        //System.out.println(sessionIDtoInfo.get(sessionID).changingToken);
        if(!(sessionIDtoInfo.containsKey(sessionID)&&sessionIDtoInfo.get(sessionID).changingToken.equals(changingToken))) return null;

        String newToken = getToken();

        //tokenSet.remove(loginToken);
        //tokenSet.add(newToken);

        sessionIDtoInfo.get(sessionID).changingToken = newToken;
        //System.out.println(newToken);
        return new UserAndToken(newToken, userService.getUSerByID(sessionIDtoInfo.get(sessionID).userID));

    }

    public static SessionInfo addUser(Integer userID){
        String loginID = getFreeID();
        String loginToken = getToken();
        String changingToken = getToken();
        
        SessionInfo newSession = new SessionInfo(loginID, loginToken,changingToken, userID);

        if(!userIDtoSessionIDs.containsKey(userID)) userIDtoSessionIDs.put(userID, new ArrayList<String>());

        userIDtoSessionIDs.get(userID).add(loginID);
        sessionIDsUpdateQueue.add(loginID);

        sessionIDtoInfo.put(loginID, newSession);

        return newSession;
    }

    public static String getFreeApiToken(){
        String token = BeadomhuApplication.AES.wordArray(48);
        while(userService.containsEApiToken(token)){
            token = BeadomhuApplication.AES.wordArray(48);
        }
        return token;
    }

    static String getFreeInitToken(){
        String token = BeadomhuApplication.AES.wordArray(8);
        while(initTokenSet.contains(token)){
            token = BeadomhuApplication.AES.wordArray(8);
        }
        return token;
    }

    static String getFreeID(){
        String newID = BeadomhuApplication.AES.wordArray(16);
        while(sessionIDtoInfo.containsKey(newID)){
            newID = BeadomhuApplication.AES.wordArray(16);
        }
        return newID;
    }
    
    static String getToken(){

        return BeadomhuApplication.AES.wordArray(32);
    }

}
