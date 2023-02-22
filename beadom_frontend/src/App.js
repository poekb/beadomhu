import React from 'react';
import './App.css';
import Login from './Login.js';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import AESCrypto from './AESCrypto'
import JSEncrypt from 'jsencrypt';
import UserPage from './UserPage';
import { SHA256, enc } from 'crypto-js';


const AESfunction = new AESCrypto(128, 1000);
var SERVERURL;
const PUBLICKEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCA0ekyxBTdyjsB35nFhGTHGIsXtHleA8yjqx7DeJlmCezEChvJXF3RZ+6ngTP4zPCpCWPeXAIW7edrdbZoyBWGk0Ey9hKA7BfZn/wUlvjCaWE8LYIgbJAZgNhbY2PwY/p/a32eB22Bu2RW5sBCeBeheExKdszIeZi/oRVX+2eTIQIDAQAB";

var stompClient = null;
var RSAEncrypter = new JSEncrypt();
var rememberme = false;

const MAXRETRYS = 3;

var retrys = 0;

var APIToken = "";

var email;
var password;

var sessionID;
var sessionToken;
var sessionChangingToken;

const getChangingToken = (callback,mapping,callback2,preset) => {
  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "sessionid":sessionID,
      
    },
    mode: 'cors'
  };
  fetch(SERVERURL+"/request/get/changingtoken", options).then(result => {result.text().then(txt =>{
    sessionChangingToken=AESfunction.decryptServerMessage(txt,sessionToken);
    callback(mapping,callback2,preset);
  })})
}

const handleSessionInfo = (sessionInfo,callbackIfFailed) => {
  if(sessionInfo == null) {
    callbackIfFailed();
    return;
  }
  
  localStorage.setItem("session",sessionInfo);
  let splitSessionInfo = sessionInfo.split("::");
  sessionID = splitSessionInfo[0];
  sessionToken = splitSessionInfo[1];

  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "sessionid":sessionID,
      
    },
    mode: 'cors'
  };
  fetch(SERVERURL+"/request/get/isalive", options).then(result => {result.text().then(txt =>{
    if(txt==="e"){
      callbackIfFailed();
      return;
    }
    stompClient.subscribe("/user/"+sessionID+"/timeout",pingServer,{id:"timeout"})

    application.logged(true)
    application.onMessage({on:false})

    console.log("session connected");
    
    getChangingToken(onLoggedIn);
    
  })})
  
}

const pingServer = () => {
  let options = {
    method: 'POST',
    headers: {
      "sessionid":sessionID
    },
    mode: 'cors'
  };
  fetch(SERVERURL+"/request/post/ping", options)
}

const initLogin = (callback) => {
  if(!stompClient) connect();
  RSAEncrypter.setPublicKey(PUBLICKEY);
  let encodedEmail = RSAEncrypter.encrypt(email);
  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "email":encodedEmail,
      
    },
    mode: 'cors'
  };
  application.onMessage({on:true,error:false,txt:""})
  fetch(SERVERURL+"/request/get/initlogin", options).then(result=>{result.text().then(token=>{
    callback(token)
  })})
}

const loginWithAPIToken = (initToken) => {

  RSAEncrypter.setPublicKey(PUBLICKEY);
  let encodedToken = RSAEncrypter.encrypt(APIToken+"::"+initToken);


  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "token":encodedToken
    },
    mode: 'cors'
  };
  fetch(SERVERURL+"/request/get/loginwithtoken", options).then(result=>{result.text().then(txt=>{
    if(txt.startsWith("!")){
      console.log(txt);
      application.onMessage({on:false,error:false,txt:""});
      application.logged(false)
      return;
    }
    let sessionInfo = AESfunction.decryptServerMessage(txt,APIToken);
    handleSessionInfo(sessionInfo);
    
  })})
}

const getAPIToken = (initToken) => {
  RSAEncrypter.setPublicKey(PUBLICKEY);
  let encodedEmail = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(email))));
  let encodedPassword = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(password))));

  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "email":encodedEmail,
      "password":encodedPassword,
    },
    mode: 'cors'
  };
  application.onMessage({on:true,error:false,txt:""})
  fetch(SERVERURL+"/request/get/loginapitoken", options).then(result=>{result.text().then(txt=>{
    if(txt.startsWith("!")){
      application.onMessage({on:true,error:true,txt:txt.substring(1),okAble: true})
      return
    }
    APIToken = AESfunction.decryptServerMessage(txt,password)
    localStorage.setItem("APItoken",APIToken);
    loginWithAPIToken(initToken);

  })})
}

const onLoggedIn = () =>{
  application.userPage.onConnected();
}

const loginUser = (token) => {
  if(rememberme){
    getAPIToken(token);
    return;
  }
  RSAEncrypter.setPublicKey(PUBLICKEY);
  let encodedEmail = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(email)))+"::"+rememberme+"::"+token);
  let encodedPassword = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(password)))+"::"+token);

  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "email":encodedEmail,
      "password":encodedPassword,
    },
    mode: 'cors'
  };
  application.onMessage({on:true,error:false,txt:""})
  fetch(SERVERURL+"/request/get/loginuser", options).then(result=>{result.text().then(txt=>{
    if(txt.startsWith("!")){
      application.onMessage({on:true,error:true,txt:txt.substring(1), okAble: true});
      return;
    }
    let sessionInfo = AESfunction.decryptServerMessage(txt,password);
    handleSessionInfo(sessionInfo);
    
  })})
} 

const onError = (err) => {
  console.log("Error!!!!!!");
  if(retrys<MAXRETRYS){
    retrys++;
    connect();
  }else{
    application.onMessage({on:true,error:true,txt:"A szerver átmenetileg nem elérhető. Frissítse az oldalt vagy próbálkozzon újra egy kicsivel később!"})
  }
}

const tryAPIlogin = () => {
  let newApiToken = localStorage.getItem("APItoken");
  if(newApiToken==null) application.logged(false);
  else {
    APIToken = newApiToken
    initLogin(loginWithAPIToken);
  }
}

const onConnected = ()=>{
  retrys = 0;
  application.onMessage({on:false,error:false,txt:""})
  RSAEncrypter.setPublicKey(PUBLICKEY);
  if(application.state.loggedIN){
    handleSessionInfo(localStorage.getItem("session"),tryAPIlogin);
  }
}

const connect = ()=>{
  application.onMessage({on:true,error:false,txt:""})

  let Sock = new SockJS(SERVERURL+'/ws');
  stompClient = over(Sock);

  stompClient.connect({},onConnected, onError);
}

const onRegistered = ()=>{
  stompClient.unsubscribe("register")
  application.setState({
    waitingForEmail:false
  })
  console.log("registered")
  initLogin(loginUser)
}

const registUser = (user)=>{
  email = user.email
  password = SHA256(user.password).toString(enc.Hex);
  if(!stompClient) connect();
  let encodedEmail = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(email))));
  //console.log(btoa(unescape(encodeURIComponent(user.username))));
  let encodedName = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(user.username))));
  let encodedPassword = RSAEncrypter.encrypt(btoa(unescape(encodeURIComponent(password))));
  let options = {
    method: 'GET',
    headers: {
      Accept: "*",
      "email":encodedEmail,
      "password":encodedPassword,
      "username":encodedName
    },
    mode: 'cors'
  };
  application.onMessage({on:true,error:false,txt:""})
  fetch(SERVERURL+"/request/get/regist", options).then(result=>{result.text().then(txt=>{
    console.log(txt); 
    if(txt.startsWith("!")){
      application.onMessage({on:true,error:true,txt:txt.substring(1), okAble: true})
      return
    }
    application.onMessage({on:false,error:false,txt:""})
    application.setState({
      waitingForEmail:true
    })


    let registListenerID = AESfunction.decryptServerMessage(txt,password)
    stompClient.subscribe("/user/"+registListenerID+"/regist",onRegistered,{id:"register"})
    console.log(registListenerID); 
    
  
  })});

}

const getFromServer = (mapping,callback,header)=>{
  header={...header}
  Object.entries(header).forEach(([key, val]) => header[key]=AESfunction.encryptServerMessage(val,sessionToken));


  let options = {
    method: 'GET',
    headers: {
      ...header,
      "sessionid":sessionID,
      "changingtoken":sessionChangingToken
      
    },
    mode: 'cors'
  };

  fetch(SERVERURL+"/"+mapping, options).then(result => {result.text().then(txt =>{
    if(txt.startsWith("!")){
      console.log("oops")
      if(txt==="!token") getChangingToken(getFromServer,mapping,callback,header);
      return
    }
    let raw = AESfunction.decryptServerMessage(txt,sessionToken).split("::");
    
    
    sessionChangingToken = raw[0]
    //console.log(raw[1]);
    callback(raw[1])
  })})
}

const postToServer = (mapping,callback,payload)=>{
  let options = {
    body: AESfunction.encryptServerMessage(payload,sessionToken),
    method: 'POST',
    headers: {
      
      "Accept":"*",
      "sessionid":sessionID,
      "changingtoken":sessionChangingToken
      
    },
    mode: 'cors'
  };
  fetch(SERVERURL+"/"+mapping, options).then(result => {result.text().then((txt)=>{
    if(txt.startsWith("!")){
      if(txt==="!token") getChangingToken(postToServer,mapping,callback,payload);
      return
    }
    let raw = AESfunction.decryptServerMessage(txt,sessionToken).split("::");
    
    
    sessionChangingToken = raw[0];
    if(callback) callback(raw[1]);
  })})
}

const paperListener = (paper)=>{
  //let paper = JSON.parse(decodeURIComponent(escape(atob(AESfunction.decryptServerMessage(payload.body,sessionToken)))));
  console.log(paper);
  application.userPage.newPaper(paper);
}

var application;

class App extends React.Component {
  userPage;
  constructor(){      
    super()
    this.state = {loggedIN: localStorage.getItem("loggedIn")==="true",
    username:"",
    waitingForEmail:false,
    message:{on:false,error:false,txt:""}
    }
    fetch("config.json").then(result=>{result.json().then(jsonData=>{
      SERVERURL=jsonData.SERVERURL;
      console.log(SERVERURL);

      application = this
      this.registHandle = this.registHandle.bind(this)
      this.logged = this.logged.bind(this)
      this.onMessage = this.onMessage.bind(this)
      this.logout = this.logout.bind(this)
      if(!stompClient){
        connect()
        
      }
    })})
  }
  paperListener(paperJSON){
    paperListener(JSON.parse(paperJSON));
  }
  getFromServer(mapping,callback,options){
    getFromServer(mapping,callback,options);
  }
  postToServer(mapping,callback,options){
    postToServer(mapping,callback,options);
  }

  logout(){
    
    stompClient.unsubscribe("timeout")
    localStorage.setItem("session","")
    localStorage.setItem("APItoken","")
    this.logged(false)
    
  }

  logged(isLoggedIn){
    localStorage.setItem("loggedIn",isLoggedIn)
    this.setState({
      loggedIN: isLoggedIn
    })
  }
  onMessage(message){
    this.setState({
      message: message
    })
  }
  
  loginHandle(user){
    rememberme = user.rememberme
    email = user.email
    password = SHA256(user.password).toString(enc.Hex);
    initLogin(loginUser)
  }

  registHandle(user){
    rememberme = user.rememberme
    if(user.password!==user.confirmPassword) {
      this.onMessage({on:true,error:true,txt:"A jelszó megerősítésének egyeznie kell a jelszóval", okAble: true});
      return;
    }
    if(user.password.length<5) {
      this.onMessage({on:true,error:true,txt:"A jelszónak legalább 5 karakterből kell állnia", okAble: true});
      return;
    }
    registUser(user)
    
  }

  render (){
    const messageClass = this.state.message.on ? 'absolute opacity-100  transition-all' : ' absolute opacity-0  -z-10 transition-all'
    const messageLayer = this.state.message.on ? 'z-10 transition-none':'-z-10 transition-none'

    return(
      <div>
       <div className=' absolute z-0'>
        {this.state.loggedIN?<><UserPage app={this}/></>:
        <>
          {this.state.waitingForEmail?        
            <div className="w-screen h-screen bg-neutral-700 text-neutral-300 font-bold ">
              <div className=" flex items-center justify-center flex-1 h-full">
                <div className="  h-fit maxw80 m-4 bg-neutral-800 rounded-3xl shadow-3xl w-1/2 minw50 p-5 flex-col">
                    <div className="font-bold text-5xl m-4 mb-10 text-center ">Megerősítő E-mail elküldve a megadott címre</div>
                    <hr className="m-auto w-1/2 h-1 rounded-full"></hr>
                    <div className="font-bold text-3xl mt-10 m-4 text-center">Ne felejtse el ellenőrizni a Spam mappáját ha nem találja</div>

                </div>
              </div>
            </div>
            :
            <div className=' min-h-screen flex flex-col justify-center'>
              <Login handleRegist={this.registHandle} handleLogin={this.loginHandle}/>
            </div>
          }
        </>
        }
        </div>
        <div className={messageClass}>
        <div className={messageLayer}>
          <div className="w-screen min-h-screen fixed TransparentBackground">
            <div className=" flex items-center justify-center flex-1 h-full">
              <div className="formratio h-5/5 max-w-full m-4 bg-neutral-800 text-neutral-400 rounded-3xl shadow-2xl">
                <div className=" flex flex-col justify-center p-4">
                  
                  {!this.state.message.error?
                    <div className="loading-spinner m-auto"/>:
                    <>
                    <div className="font-bold text-5xl mb-10 text-center flex items-center justify-center">
                      Hiba
                    </div>
                    <div className="text-lg">{this.state.message.txt}</div>
                    {this.state.message.okAble?<>
                      <br></br>
                      <button type="submit" 
                      onClick={()=>{this.onMessage({on:false})}} 
                      className="mt-10 p-3 pl-10 pr-10 text-center text-neutral-800 font-bold text-3xl rounded-2xl bg-lime-500 transition hover:bg-lime-600">
                      OK
                      </button>
                      </>
                      :
                      <button className="m-auto fill-neutral-400 mt-10 hover:fill-neutral-300 transition-all" onClick={()=>{window.location.reload()}}>
                        <svg height="40" width="40" version="1.1" id="Layer_1" viewBox="0 0 329.028 329.028"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_13_" d="M241.852,72.459l10.847-54.533c1.184-5.95-1.334-12.028-6.378-15.398c-5.045-3.37-11.623-3.37-16.667,0 L156.182,51.62c-0.004,0.003-0.008,0.006-0.012,0.009c-0.415,0.278-0.817,0.576-1.201,0.893c-0.219,0.181-0.418,0.377-0.625,0.568 c-0.148,0.137-0.304,0.265-0.447,0.408c-0.249,0.25-0.478,0.514-0.707,0.778c-0.088,0.101-0.183,0.196-0.268,0.299 c-0.208,0.253-0.396,0.519-0.586,0.783c-0.095,0.132-0.197,0.259-0.288,0.394c-0.155,0.232-0.292,0.473-0.433,0.712 c-0.109,0.185-0.225,0.365-0.327,0.554c-0.104,0.195-0.192,0.397-0.288,0.597c-0.118,0.245-0.24,0.487-0.344,0.739 c-0.064,0.156-0.115,0.317-0.174,0.475c-0.112,0.299-0.227,0.598-0.32,0.906c-0.042,0.137-0.069,0.276-0.106,0.414 c-0.09,0.329-0.181,0.658-0.248,0.996c-0.045,0.223-0.068,0.45-0.103,0.675c-0.038,0.252-0.088,0.501-0.113,0.758 c-0.051,0.498-0.075,0.998-0.076,1.5c0,0.004-0.001,0.009-0.001,0.013c0,0.058,0.008,0.113,0.009,0.17 c0.004,0.437,0.023,0.874,0.066,1.311c0.016,0.156,0.045,0.307,0.065,0.461c0.043,0.332,0.086,0.664,0.151,0.994 c0.042,0.212,0.102,0.418,0.152,0.627c0.064,0.264,0.124,0.529,0.204,0.791c0.077,0.256,0.173,0.503,0.264,0.753 c0.076,0.208,0.143,0.418,0.229,0.624c0.126,0.305,0.272,0.598,0.418,0.892c0.072,0.146,0.134,0.295,0.211,0.438 c0.203,0.379,0.426,0.745,0.66,1.104c0.036,0.055,0.064,0.113,0.1,0.167l0.019,0.028c0.01,0.015,0.02,0.03,0.03,0.045l49.044,73.401 c2.817,4.217,7.525,6.667,12.47,6.667c0.971,0,1.952-0.094,2.928-0.288c5.951-1.184,10.602-5.835,11.786-11.786l7.052-35.455 c23.901,20.188,39.11,50.36,39.11,84.023c0,60.636-49.331,109.968-109.967,109.968c-60.637,0-109.969-49.332-109.969-109.968 c0-40.179,21.91-77.153,57.179-96.494c7.264-3.983,9.923-13.101,5.94-20.365c-3.983-7.264-13.101-9.924-20.365-5.94 C52.424,90.871,24.546,137.924,24.546,189.06c0,77.178,62.79,139.968,139.969,139.968c77.178,0,139.967-62.79,139.967-139.968 C304.482,140.453,279.571,97.56,241.852,72.459z"></path> </g></svg>
                      </button>
                    }
                    </>
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>:<></>
        </div>
      </div>
    );
  }
}

export default App;