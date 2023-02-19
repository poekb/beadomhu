import CryptoJS from 'crypto-js'
var AESCrypto = function(keySize, iterationCount) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
  };
  AESCrypto.prototype.generateCharString = function(length) {
    
    return Array.from({length: length*2}, () => Math.floor(Math.random() * 16).toString(16)).join("");
  }

  AESCrypto.prototype.encryptServerMessage = function(message, passPhrase){
    let salt = this.generateCharString(128/8);
    let iv = this.generateCharString(128/8);

    return salt+"::"+iv+"::"+this.encrypt(salt,iv,passPhrase,message);
  }

  AESCrypto.prototype.decryptServerMessage = function(message, passPhrase){
    let data = message.split("::");
    let salt = data[0];
    let iv = data[1];
    let cipher = data[2];

    return this.decrypt(salt,iv,passPhrase,cipher);
  }

  AESCrypto.prototype.generateKey = function(salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
        passPhrase, 
        CryptoJS.enc.Hex.parse(salt),
        { keySize: this.keySize, iterations: this.iterationCount });
    return key;
  }
  
  AESCrypto.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key,
        { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }
  
  AESCrypto.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } 
  export default AESCrypto