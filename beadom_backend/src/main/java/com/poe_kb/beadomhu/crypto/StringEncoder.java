package com.poe_kb.beadomhu.crypto;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class StringEncoder {
    public static String encodeString(String string){
        byte[] encodedBytes = Base64.getEncoder().encode(string.getBytes(StandardCharsets.UTF_8));
		String encoded = new String(encodedBytes, StandardCharsets.UTF_8);
        return encoded;
    }
    public static String decodeString(String encoded){
        String decoded = new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8);
        return decoded;
    }
}
