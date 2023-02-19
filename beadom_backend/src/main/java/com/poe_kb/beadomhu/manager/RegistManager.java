package com.poe_kb.beadomhu.manager;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.poe_kb.beadomhu.BeadomhuApplication;
import com.poe_kb.beadomhu.model.Register;
import com.poe_kb.beadomhu.service.UserService;

@Component
public class RegistManager {
    static UserService userService;

    @Autowired
    public RegistManager(UserService userService){
        RegistManager.userService = userService;
    }
    public static Queue<String> registerIDsInOrder = new LinkedList<String>();
    public static Map<String,Register> occupiedRegisterIDs = new HashMap<String,Register>();

    public static Set<String> occupiedListeningChannels = new HashSet<String>();

    public static Set<String> registingEmails = new HashSet<String>();

    public static boolean containsEmail(String email){
        return registingEmails.contains(email)||userService.containsEmail(email);
    }
    public static String addRegister(String email,String username,String password){


        String registListenerID = "";
        while(true){
            
            registListenerID = BeadomhuApplication.AES.wordArray(16);
            if(!RegistManager.occupiedRegisterIDs.containsKey(registListenerID)) break;
            
        }
        String ListeningChannel = "";
        while(true){
            
            ListeningChannel = BeadomhuApplication.AES.wordArray(16);
            if(!RegistManager.occupiedListeningChannels.contains(ListeningChannel)) break;

            
        }

        LocalDateTime time = LocalDateTime.now();
        
        registerIDsInOrder.add(registListenerID);
        registingEmails.add(email);
        occupiedRegisterIDs.put(registListenerID, new Register(email,username,password,time,ListeningChannel));

        return ListeningChannel+"::"+registListenerID;
    }
    public static void checkTimeout(){
        try {
            while(!registerIDsInOrder.isEmpty()){
                Register oldestRegister = occupiedRegisterIDs.get(registerIDsInOrder.peek());
                if(oldestRegister.creationDate.plusMinutes(10).isAfter(LocalDateTime.now())){
                    break;
                }
                removeRegister(registerIDsInOrder.peek());
            }
            
        } catch (Exception e) {
            System.out.println("Problem in timeout check: "+e);
        }
        
    }
    public static Register getRegisterByID(String ID){

        if(!occupiedRegisterIDs.containsKey(ID)) return null;
        
        return occupiedRegisterIDs.get(ID);
    }

    public static void removeRegister(String ID){
        Register currentRegister = occupiedRegisterIDs.get(ID);

        registerIDsInOrder.remove(ID);
        registingEmails.remove(currentRegister.email);

        occupiedListeningChannels.remove(currentRegister.listeningChannel);
        occupiedRegisterIDs.remove(ID, currentRegister);
    }
}
