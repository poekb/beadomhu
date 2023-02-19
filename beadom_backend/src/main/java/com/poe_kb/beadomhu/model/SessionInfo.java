package com.poe_kb.beadomhu.model;

import java.time.LocalDateTime;

public class SessionInfo
{
    public String ID;
    public String Token;
    public String changingToken;
    public Integer userID;
    public LocalDateTime updateTime;
    public Boolean timeoutWarning = false;

    public SessionInfo(String ID,String Token,String changingToken,Integer userID){
        this.ID = ID;
        this.Token = Token;
        this.userID = userID;
        this.changingToken = changingToken;
        this.updateTime = LocalDateTime.now();
        
    }
    
}