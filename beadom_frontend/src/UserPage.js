import React from "react"
import NewPaper from "./NewPaper"
import PaperSelect from "./PaperSelect"
import { Buffer } from 'buffer';
import Paper from "./Paper";





class PaperSelectListComponent extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <>
            
            {this.props.papers.map((paper,index)=><button key={index} className="w-full aspect-video rounded-2xl" onClick={()=>{this.props.parent.selectPaper(index)}}>
                <PaperSelect paper={paper}/>
                
                </button>
            )}
            </>
        )
    }
}

class UserPage extends React.Component{
    initPaper = null;
    updatedPaper = null;
    constructor(props){
        super(props)
        this.state = {innerWidth:0,papers:[],username:"",creatingNew: false,selectedPaper: null,editing: false,editing2: false,inMenu:false};
        this.editPaper = this.editPaper.bind(this);
        this.updateSuccess = this.updateSuccess.bind(this);
        this.deletePaper = this.deletePaper.bind(this);
        this.deleteSuccess = this.deleteSuccess.bind(this);
    }

    deferredPrompt = null;
  
    componentWillUnmount() {
      window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    }

    handleBeforeInstallPrompt(event){
        console.log("Before");
        event.preventDefault();

        this.deferredPrompt = event;
    };

    handleInstallClick = () => {
        if (this.deferredPrompt) {

            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            this.deferredPrompt = null;
          });
        }
      };

    updateOrder(){
        this.state.papers.sort((a, b) => {
            if(a.deadline === ""){
                return 1;
            }
            if(b.deadline === ""){
                return -1;
            }
            if(a.deadline>b.deadline){
                return 1;
            }
            if(a.deadline<b.deadline){
                return -1;
            }
            return 0;

        } );
        this.forceUpdate();
    }

    editPaper(value){
        if(value){
            this.setState({editing2: true});
            setTimeout(()=>{this.setState({editing: true})},50)
        }else{
            this.setState({editing: false});
            setTimeout(()=>{this.setState({editing2: false})},300)
        }
        
    }
    deletePaper(paper) {
        this.updatedPaper = paper;
        this.props.app.postToServer("request/post/deletepaper",this.deleteSuccess,(JSON.stringify(paper)));
    }
    deleteSuccess(){
        if(!this.updatedPaper) return;
        for (let i = 0; i < this.state.papers.length; i++) {
            const element = this.state.papers.at(i);
            if(element.id === this.updatedPaper.id){
                this.state.papers.splice(i,1);
                this.setState({selectedPaper: null});
                this.updatedPaper = null;
                break;
            }
        }
        this.editPaper(false)
    }



    updatePaper(paper) {
        this.updatedPaper = paper;
        this.props.app.postToServer("request/post/updatepaper",this.updateSuccess,(JSON.stringify(paper)));
    }
    updateSuccess(){
        if(!this.updatedPaper) return;
        for (let i = 0; i < this.state.papers.length; i++) {
            const element = this.state.papers.at(i);
            
            if(element.id === this.updatedPaper.id){
                this.state.papers[i] = this.updatedPaper;
                
                this.setState({selectedPaper: this.updatedPaper});

                this.updatedPaper = null;
                break;
            }
        }
        this.editPaper(false)
        this.updateOrder();
    }

    newPaper(paper) {
        this.setState({waitingForPaper: false});
        this.state.papers.push(paper);
        this.selectPaper(this.state.papers.length-1);
        this.updateOrder();
    }

    componentDidMount() {
        window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
        this.setState({innerWidth: window.innerWidth});
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        this.props.app.userPage = this;
        this.onRecievingBasicInfo = this.onRecievingBasicInfo.bind(this);
    }

    onConnected(){
        this.props.app.getFromServer("request/get/basicinfo",this.onRecievingBasicInfo);
        
        this.forceUpdate();
    }

    newPaperHandler(settings){
        this.setState({waitingForPaper: true});
        this.props.app.postToServer("request/post/newpaper",(result)=>{this.props.app.paperListener(decodeURIComponent(escape(atob(result))));},(JSON.stringify(settings)));
        this.setState({creatingNew:false});
    }

    onRecievingBasicInfo(payload){
        
        let data = JSON.parse(decodeURIComponent(escape(atob(payload))))
        this.state.papers = [];
        this.setState({username:data.username});
        data.duePapers.forEach(element => {
            console.log(element);
            this.state.papers.push(element);
        });
        this.updateOrder();
        let selID = localStorage.getItem("selectedPaperID");
        if(selID !== "null"){
            let notFound = true;
            for (let i = 0; i < this.state.papers.length; i++) {
                const curPaper = this.state.papers.at(i);
                if(curPaper.id == selID){
                    this.selectPaper(i);

                    notFound = false;
                }
            }
            if(notFound) {localStorage.setItem("selectedPaperID",null)
            console.log(selID);
            }
        }
    }
    unselectPaper(){
        localStorage.setItem("selectedPaperID",null);
        this.setState({selectedPaper: null});
    }
    
    selectPaper(index){
        let newPaper = this.state.papers.at(index);
        if(this.state.selectedPaper === newPaper) return;

        localStorage.setItem("selectedPaperID",newPaper.id);
        this.setState({selectedPaper: newPaper});
        if(this.initPaper && this.state.selectedPaper)this.initPaper();

    }
    
    resize() {
        this.setState({innerWidth: window.innerWidth})
    }

    render(){
        const newPaperStyle = this.state.creatingNew?"opacity-100 transition-all scale-100 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-30 h-5/6 max-w-4xl w-100-1 rounded-3xl shadow-2xl"
        :"opacity-0 absolute top-1/2 right-1/2 translate-x-1/2 z-30 w-full h-5/6 bg-neutral-800 max-w-4xl rounded-3xl shadow-2xl scale-0 transition-all"
        const editPaperStyle = this.state.editing?"opacity-100 transition-all scale-100 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-30 h-5/6 max-w-4xl w-100-1 rounded-3xl shadow-2xl"
        :"opacity-0 absolute top-1/2 right-1/2 translate-x-1/2 z-30 w-full h-5/6 bg-neutral-800 max-w-4xl rounded-3xl shadow-2xl scale-0 transition-all"

        const menuButtonStyle = this.state.inMenu?"menu click"
        :"menu";
        const menuStyle = this.state.inMenu?"absolute w-screen max-w-[30rem] z-10 bg-neutral-800 -top-10 right-0 rounded-3xl transition-all shadow-3xl ease-in-out flex flex-col p-1 pt-11"
        :"absolute shadow-3xl w-screen max-w-[30rem] z-10 bg-neutral-800 -top-10 right-0 rounded-3xl -translate-y-full transition-all ease-in-out flex flex-col p-2";

        const coverStyle = this.state.creatingNew||this.state.editing ?" transition-all duration-300 absolute w-screen h-screen opacity-30 bg-black":"duration-300 transition-all absolute w-screen h-screen z-0 opacity-0 bg-black ";
        const coverZ = this.state.creatingNew||this.state.editing ? " relative z-30":" relative -z-10 delay-300"
        return(<>
        <div className={coverZ}>
            <div className={coverStyle}>

            </div>
        </div>
        <div className=" overflow-hidden flex flex-col items-start  justify-start flex-1 h-screen bg-neutral-700 text-neutral-400 relative ">
            <div className='flex-none w-screen h-16 bg-neutral-900 flex flex-row items-center justify-end z-20 shadow-3xl '>
                    {this.state.waitingForPaper?
                    <div className="small-spinner h-[40px] border-neutral-400 mr-auto ml-4"/>
                    :
                    <button onClick={()=>this.setState({creatingNew: true})} className=" flex-none w-10 min-w-fit mr-auto ml-4 aspect-square rounded-full bg-neutral-900 group transition-all text-center items-center justify-center flex text-9xl relative ease-in-out duration-300">
                        <div className=" w-2/3 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-300 transition-all text-center items-center justify-center flex text-9xl absolute ease-in-out duration-300">
                        
                        </div>
                        <div className=" w-1 h-2/3 rounded-full bg-neutral-400 group-hover:bg-neutral-300 transition-all text-center items-center justify-center flex text-9xl absolute ease-in-out duration-300">
                        
                        </div>
                        <div className=" z-10 shadow-2xl whitespace-nowrap opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 group-hover:w-auto absolute text-lg group-hover:translate-y-14 group-hover:translate-x-20 bg-neutral-900 rounded-3xl p-3 transition-all ease-in-out duration-300">
                            Beadandó hozzáadása
                        </div>
                    </button>
                    }
                <div className="m-4 text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">{this.state.username}</div>
                
                <button className="w-[50px] h-[50px] m-4 ml-0 group"
                onClick={()=>{this.setState({inMenu: !this.state.inMenu})}}
                >
                <div className={menuButtonStyle}></div>
                </button>
                
           
            </div>
                <div className=" relative w-0 h-0 ml-auto">
                    <div className={menuStyle}>
                        <button onClick={this.props.app.logout} 
                        className="m-4 flex-none bg-red-700 p-2 rounded-lg text-neutral-200 hover:bg-red-800 transition font-bold appearance-none opacity-100 flex flex-row gap-3 justify-center items-center">
                            Kijelentkezés
                            <svg className=" fill-neutral-200 stroke-neutral-200 stroke-2" height="16px" width="16px" version="1.1" id="Capa_1"  
                            viewBox="0 0 384.971 384.971">

                            <g id="Sign_Out">
                                <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
                                    C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
                                    C192.485,366.299,187.095,360.91,180.455,360.91z"/>
                                <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
                                    c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
                                    c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"/>
                            </g></svg>
                        </button>
                    </div>
                </div>
                <div className={newPaperStyle}>
                    <NewPaper parent={this}/>
                </div>
                {
                this.state.editing2?
                <div className={editPaperStyle}>
                    <NewPaper parent={this} editing = {true}/>
                </div>:<></>}
                
            
            {this.state.innerWidth>1000?<div className=" flex flex-row w-screen flex-none h-full pb-[4.5rem] items-start mt-0">
                <div className="w-96 m-2 mt-2 pr-2 overflow-auto scrollbar grid grid-cols-1 max-h-full gap-5 rounded-2xl flex-none">
                    <PaperSelectListComponent parent={this} papers={this.state.papers}/>
                </div>
                <div className="m-2 ml-0 mt-2 w-[calc(100%-26rem)] h-[calc(100%-0.75rem)] flex-1">
                    {this.state.selectedPaper?
                        <Paper paper={this.state.selectedPaper} parent={this}/>:<></>
                    }
                    
                </div>
            </div>:<>{
            this.state.selectedPaper?
            <div className=" flex flex-row w-screen flex-none h-full pb-[4.5rem] items-start">
                
                <div className="m-auto mt-2 w-[calc(100%-1rem)] h-[calc(100%-0.75rem)] flex">
                    {this.state.selectedPaper?
                        <Paper paper={this.state.selectedPaper} parent={this}/>:<></>
                    }
                </div>
                </div>
            :<>
            {this.state.innerWidth>600?
            <div className="w-100-1 m-2 p-2 pl-0 overflow-auto scrollbar grid grid-cols-2 gap-5 rounded-2xl">
                <PaperSelectListComponent parent={this} papers={this.state.papers}/>
            </div>:
            <div className="w-100-1 m-2 p-2 pl-0 overflow-auto scrollbar grid grid-cols-1 gap-5 rounded-2xl">
                <PaperSelectListComponent parent={this} papers={this.state.papers}/>
            </div>
            }</>
            }</>
            }            
        </div>
        </>)
    }
}
export default UserPage