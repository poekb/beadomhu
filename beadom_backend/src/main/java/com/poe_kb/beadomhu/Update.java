package com.poe_kb.beadomhu;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.poe_kb.beadomhu.manager.LoginManager;
import com.poe_kb.beadomhu.manager.NotificationManager;
import com.poe_kb.beadomhu.manager.RegistManager;

@Component
public class Update extends Thread {

    @Scheduled(cron = "0 30 7 ? * MON-FRI")
    public void weekdayTasks() {
        NotificationManager.sendNotifications();
    }

    @Scheduled(cron = "0 0 9 ? * SAT-SUN")
    public void weekendTasks() {
        NotificationManager.sendNotifications();
    }
    
    
    public void run(){

        while(true){
            try {
                Thread.sleep(1000);
                RegistManager.checkTimeout();
                LoginManager.updateSessions();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
