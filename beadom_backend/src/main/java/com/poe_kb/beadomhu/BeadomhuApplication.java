package com.poe_kb.beadomhu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import com.poe_kb.beadomhu.crypto.AESCrypto;
import com.poe_kb.beadomhu.crypto.RSAKeyPairGenerator;
import com.poe_kb.beadomhu.email.EmailSender;
import com.poe_kb.beadomhu.service.GetTitleService;

import jakarta.annotation.PostConstruct;

@Component
@SpringBootApplication
@EnableScheduling
public class BeadomhuApplication {

	@Value("${rsa.privatekey}")
	private String rsaPrivateKeyString;

	@Value("${rsa.publickey}")
	private String rsaPublicKeyString;

	static EmailSender emailSender;
	static GetTitleService getTitleService;

	@Autowired
	public BeadomhuApplication(EmailSender emailSender, RestTemplateBuilder restTemplateBuilder, GetTitleService getTitleService){
		BeadomhuApplication.emailSender = emailSender;
		BeadomhuApplication.getTitleService = getTitleService;
	}
	
	public static AESCrypto AES = new AESCrypto(128, 1000);
	public static RSAKeyPairGenerator rsaKeyPairGenerator;
	
	public void update(){

	}
	@PostConstruct
	public void postConstruct(){
		rsaKeyPairGenerator = new RSAKeyPairGenerator(rsaPrivateKeyString,rsaPublicKeyString);
	}

	public static void main(String[] args){


		SpringApplication.run(BeadomhuApplication.class, args);

		Update updateThread = new Update();
		updateThread.start();
	}
	

}
