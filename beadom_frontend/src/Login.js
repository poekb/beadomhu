import React, { useRef } from "react"




class Login extends React.Component{
    constructor(props){

        super(props)
        this.inputRefs = Array(4)
        .fill()
        .map(() => React.createRef());
        this.state = {
            rememberme: false,
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            signup: false

        }
    }

    handleKeyDown(event,index){
        if(event.key !== 'Enter') return;
        event.preventDefault();
        if(index<3){
            this.inputRefs[index+1].current.focus();
        }else{
            this.inputRefs[index].current.blur();
            this.state.signup?
            this.props.handleRegist(this.state):
            this.props.handleLogin(this.state);
        }
    }
   

    render(){
        return(<>
        
        <div className="flex flex-col items-center flex-1 min-h-screen justify-center bg-neutral-700 text-white">
            <div className='w-screen h-20 bg-neutral-900 flex flex-row items-center justify-end border-b-4 border-black shadow-2xl'>
                <button className="m-4 bg-neutral-600 p-2 rounded-lg text-black hover:bg-neutral-500 transition font-bold appearance-none"
                onClick={()=> this.setState({signup:false})}
                >
                    Bejelentkezés
                </button>
                <button className="m-4 bg-neutral-600 p-2 rounded-lg text-black hover:bg-neutral-500 transition font-bold appearance-none"
                onClick={()=> this.setState({signup:true})}
                >
                    Regisztráció
                </button>
            </div>
            <div className=" flex flex-col items-center justify-center flex-1 h-full m-auto">
                <div className="formratio h-5/5 maxw90 m-4 bg-neutral-800 rounded-2xl  shadow-2xl">
                {this.state.signup?
                <div className=" flex flex-col justify-center p-4">
                    <div className="font-bold text-5xl m-4 mb-10 text-center"> Regisztráció</div>

                    <input
                    ref={this.inputRefs[0]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,0)}}
                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="email"
                    type="email"
                    placeholder="Email cím"
                    name="email"
                    maxLength="64"
                    value={this.state.email}
                    onChange={(e) => this.setState({email: e.target.value})}
                    margin="normal"
                    />

                    <input
                    ref={this.inputRefs[1]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,1)}}

                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="user-name"
                    type="username"
                    placeholder="Név"
                    name="userName"
                    maxLength="64"
                    value={this.state.username}
                    onChange={(e) => this.setState({username: e.target.value})}
                    margin="normal"
                    />

                    <input
                    ref={this.inputRefs[2]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,2)}}

                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="password"
                    type="password"
                    placeholder="Jelszó"
                    name="password"
                    maxLength="64"
                    value={this.state.password}
                    onChange={(e) => this.setState({password: e.target.value})}
                    margin="normal"
                    />
                    <input
                    ref={this.inputRefs[3]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,3)}}

                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="confirm_password"
                    type="password"
                    placeholder="Jelszó megerősítése"
                    name="password"
                    maxLength="64"
                    value={this.state.confirmPassword}
                    onChange={(e) => this.setState({confirmPassword: e.target.value})}
                    margin="normal"
                    />
                    <div className=" flex felx-row align-middle text-2xl justify-center text-center tex pr-4 pl-4">
                        <div className="flex flex-grow align-middle justify-start"><div className=" drop-shadow-2xl">Emékezz rám </div></div>
                        <div className="flex flex-grow align-middle justify-end">
                        <div className="checkbox-wrapper ml-5">
                        <input type="checkbox"  className="checkslider"
                        onChange={(e) => this.setState({rememberme: !this.state.rememberme})}
                        checked={this.state.rememberme}
                        />
                        </div>
                        </div>
                    </div>
                    <button type="submit" 
                            onClick={()=>{this.props.handleRegist(this.state)}} 
                            className=" text-neutral-800 m-4 p-3 text-center text-2xl rounded-2xl font-bold bg-lime-500 transition hover:bg-lime-600">
                        Regisztrálok
                    </button>
                </div>
                :
                <div className=" flex flex-col justify-center p-4">
                    <div className="font-bold text-4xl m-4 mb-10 text-center drop-shadow-2xl"> Bejelentkezés</div>

                    <input
                    ref={this.inputRefs[2]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,2)}}

                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="email"
                    type="email"
                    placeholder="E-mail cím"
                    name="email"
                    maxLength="64"
                    value={this.state.email}
                    onChange={(e) => {
                        this.setState({email: e.target.value});
                    }}
                    
                    margin="normal"
                    />

                    <input
                    ref={this.inputRefs[3]}
                    onKeyDown={(e)=>{this.handleKeyDown(e,3)}}

                    className="m-4 p-3 text-center text-2xl rounded-2xl bg-neutral-500"
                    id="password"
                    type="password"
                    placeholder="Jelszó"
                    name="userName"
                    maxLength="64"
                    value={this.state.password}
                    onChange={(e) => this.setState({password: e.target.value})}
                    margin="normal"
                    />
                    <div className=" flex felx-row align-middle text-2xl justify-center text-center tex pr-4 pl-4">
                        <div className="flex flex-grow align-middle justify-start"><div className=" drop-shadow-2xl">Emékezz rám </div></div>
                        <div className="flex flex-grow align-middle justify-end">
                        <div className="checkbox-wrapper ml-5">
                        <input type="checkbox"  className="checkslider"
                        onChange={(e) => this.setState({rememberme: !this.state.rememberme})}
                        checked={this.state.rememberme}
                        />
                        </div>
                        </div>
                    </div>
                    <button type="submit" 
                            className=" text-neutral-800 m-4 mt-2 p-3 text-center text-2xl rounded-2xl font-bold bg-lime-500 transition hover:bg-lime-600"
                            onClick={()=>{this.props.handleLogin(this.state)}} 
                    >
                        Bejelentkezés
                    </button>
                </div>
                }
                </div>
                
            </div>
        </div>
        
    </>)
    }
}
export default Login