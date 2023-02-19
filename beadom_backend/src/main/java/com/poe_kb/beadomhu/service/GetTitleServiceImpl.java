package com.poe_kb.beadomhu.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GetTitleServiceImpl implements GetTitleService{

    @Override
    public String getTitleFromURL(String url) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String html = restTemplate.getForObject(url, String.class);
            
            
            Pattern pattern = Pattern.compile("<meta.*?title.*?content=.?(.*?)\".*?>");
            Matcher matcher = pattern.matcher(html);

            while (matcher.find()) {
                String title = matcher.group(1);
                if(!title.strip().equals("")) return title.strip();

            }

            pattern = Pattern.compile("<title>(.*?)</title>");
            matcher = pattern.matcher(html);

            if (matcher.find()) {
                String title = matcher.group(1);
                if(!title.strip().equals("")) return title.strip();
            }
        } catch (Exception e) {
            return "Nem található az oldal";
        }
        


        return "Nincs cím";
    }
    
}
