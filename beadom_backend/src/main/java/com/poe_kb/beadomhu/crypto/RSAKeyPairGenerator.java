package com.poe_kb.beadomhu.crypto;

import java.security.*;
import java.util.Base64;

public class RSAKeyPairGenerator {

    private PrivateKey privateKey;
    private PublicKey publicKey;

    public RSAKeyPairGenerator(String privateKeyString,String publicKeyString) {
        privateKey = RSACrypto.getPrivateKey(privateKeyString);
        publicKey = RSACrypto.getPublicKey(publicKeyString);
        
    }
    public void GenerateNew(){
        KeyPairGenerator keyGen;
        try {
            keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(1024);
            KeyPair pair = keyGen.generateKeyPair();
            this.privateKey = pair.getPrivate();
            this.publicKey = pair.getPublic();
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Generating key failed");
        }
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }
    public String getPrivateKeyString(){
        return Base64.getEncoder().encodeToString(getPrivateKey().getEncoded());
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
    public String getPublicKeyString(){
        return Base64.getEncoder().encodeToString(getPublicKey().getEncoded());
    }

    
}
