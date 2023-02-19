import React from "react"
import Bell from "./Bell";
import Source from "./Source";

class Paper extends React.Component{
    _ismounted = false;
    scrollheight = 0
    constructor(props)
    {
        super(props);
        this.addSourceRef = React.createRef();
        this.state = {fadeDescription: true, needFading: false,url: "",sources: [], selectedSource:null, isAdding: false}
        this.props.parent.initPaper = this.initPaper.bind(this);
        this.selectSource = this.selectSource.bind(this);
        this.generateAllSourcesString = this.generateAllSourcesString.bind(this);
        this.initPaper();
    }
    generateSourceString(source){
        try {
            return source.title+". Hozzáférés: "+source.url.split("/")[2]+". Elérhető: "+source.url+" (Letöltés időpontja: "+ new Date(source.viewDate).toLocaleString()+").";

        } catch (error) {
            console.log(error);
            return "";
        }
    }

    generateAllSourcesString(){
        let orderedSources = [...this.state.sources].sort((a, b) => {
            if(a.title === ""){
                return 1;
            }
            if(b.title === ""){
                return -1;
            }
            if(a.title>b.title){
                return 1;
            }
            if(a.title<b.title){
                return -1;
            }
            return 0;

        } );
        let finalString = "";
        orderedSources.forEach((source)=>{
            finalString+=this.generateSourceString(source)+"\n";
        })
        //navigator.clipboard.writeText(finalString);
        let clipboard = document.createElement("textarea");
        clipboard.value =  finalString;
        document.body.appendChild(clipboard);
        clipboard.select();
        document.execCommand("copy");
        document.body.removeChild(clipboard);
        
    }

    updateHeight(sheight,pheight){
        this.scrollheight = sheight;
        let n = sheight/pheight;
        let b = n>0.151
        if(b!=this.state.needFading) this.setState({needFading: b});
    }

    removeSource(sourceID){
        for (let index = 0; index < this.state.sources.length; index++) {
            const source = this.state.sources[index];
            if(source.id==sourceID){
                this.state.sources.splice(index,1);
                break;
            }
            
        }
        this.forceUpdate();
    }

    saveSource(source){
        this.props.parent.props.app.postToServer("request/post/saveSource"
        ,()=>
        {
            for (let index = 0; index < this.state.sources.length; index++) {
                const sourceI = this.state.sources[index];
                if(sourceI.id==source.id){
                    this.state.sources[index] = source;
                    break;
                }
                
            }
            this.selectSource(null);
            this.forceUpdate();
        },
        JSON.stringify(source))
    }

    deleteSource(sourceID){
        this.props.parent.props.app.getFromServer("request/get/deleteSource",()=>{this.removeSource(sourceID)},
            {paperid: sourceID.toString()})
    }

    componentDidMount() { 
        this._ismounted = true;
    }
      
    componentWillUnmount() {
        this._ismounted = false;
    }

    handleSources(sources){
        //console.log(sources);
        let sourcesObj = JSON.parse(sources);
        //console.log(sourcesObj.sources);
        sourcesObj.sources.forEach(source => {
            this.addSource(source);
        });
        this.state.isAdding = false;
        this.updateOrder();

    }

    selectSource(id){
        this.setState({selectedSource:id});
    }

    initPaper(){
        this.state.sources = [];
        this.state.isAdding = true;
        if(this._ismounted)this.forceUpdate();
        setTimeout(()=>{        
            this.props.parent.props.app.getFromServer("request/get/getallsources",(result)=>{this.handleSources(decodeURIComponent(escape(atob(result))));},
            {paperid: this.props.paper.id.toString()})
        },30);
    }

    updateOrder(){
        this.state.sources.sort((a, b) => {
            if(a.viewDate === ""){
                return 1;
            }
            if(b.viewDate === ""){
                return -1;
            }
            if(a.viewDate<b.viewDate){
                return 1;
            }
            if(a.viewDate>b.viewDate){
                return -1;
            }
            return 0;

        } );
        this.forceUpdate();
    }

    addSource(newSource){
        if(newSource.paperID !== this.props.paper.id) return;
        this.state.sources.push(newSource);
        this.updateOrder();
    }

    handleAddSourceButton(){
        if(this.state.url===""||this.state.isAdding) return;
        this.setState({url:"",isAdding:true})
        this.props.parent.props.app.postToServer("request/post/addsource"
        ,(source)=>
        {
            if(source)
                this.addSource(JSON.parse(decodeURIComponent(escape(atob(source)))));
            this.setState({isAdding: false})
        },
        "{\"paperid\":\""
        +this.props.paper.id
        +"\",\"url\":\""
        +this.state.url+"\",\"viewdate\":\""
        +new Date().toISOString().split(".")[0]
        +"\"}")
    }
    
    render(){
        const fadeStyle = (this.state.fadeDescription && this.state.needFading)?
            "transition-all duration-300 w-[99%] m-auto text-center text-neutral-300 overflow-hidden text-l text break-words whitespace-pre-line fade mb-1":
            "transition-all duration-300 w-[99%] m-auto text-center text-neutral-300 overflow-hidden text-l text break-words whitespace-pre-line nfade mb-1"
        return(
            <div className=" w-full h-full bg-neutral-700 shadow-2xl rounded-3xl">
                
                <div className=" rounded-3xl bg-neutral-700 overflow-hidden w-full h-[100%] pb-10 block">
                <div className="text-center max-w-full bg-neutral-800 p-2 text-neutral-400 border-solid border-b-8 text-xl flex flex-row font-bold justify-center items-center"    
                    style={{borderBottomColor:this.props.paper.color}}>
                    <button className=" ml-4 mr-2" onClick={()=>{this.props.parent.editPaper(true)}}>
                        <svg className="fill-neutral-400 hover:fill-neutral-300 transition-all" height="20px" id="Layer_1" version="1.1" viewBox="0 0 19 19" width="19px"><g><path d="M8.44,7.25C8.348,7.342,8.277,7.447,8.215,7.557L8.174,7.516L8.149,7.69   C8.049,7.925,8.014,8.183,8.042,8.442l-0.399,2.796l2.797-0.399c0.259,0.028,0.517-0.007,0.752-0.107l0.174-0.024l-0.041-0.041   c0.109-0.062,0.215-0.133,0.307-0.225l5.053-5.053l-3.191-3.191L8.44,7.25z"/><path d="M18.183,1.568l-0.87-0.87c-0.641-0.641-1.637-0.684-2.225-0.097l-0.797,0.797l3.191,3.191l0.797-0.798   C18.867,3.205,18.824,2.209,18.183,1.568z"/><path d="M15,9.696V17H2V2h8.953l1.523-1.42c0.162-0.161,0.353-0.221,0.555-0.293   c0.043-0.119,0.104-0.18,0.176-0.287H0v19h17V7.928L15,9.696z"/></g></svg>
                    </button>
                    <div className=" m-auto overflow-hidden text-ellipsis">
                        {this.props.paper.title}
                    </div>
                    <button onClick={()=>this.props.parent.unselectPaper()} className=" mr-4 ml-2">
                        <svg className=" stroke-neutral-400 hover:stroke-neutral-300 transition-all" style={{
                            fill: "none", strokeLinecap:"round",strokeLinejoin: "round", strokeWidth:"100px"
                        }} width="20px" height="20px" viewBox="0 0 512 512"><polyline points="328 112 184 256 328 400" /></svg>
                    </button>
                </div> 
                <div className="text-center h-full p-2 pb-4">
                    <div className="text-center h-full text-l overflow-auto scrollbar pl-2 pr-2 transition-all ">
                        {this.props.paper.deadline!=""?
                        <div className="text-center  m-2 mt-0 text-neutral-300 drop-shadow-lg font-bold flex flex-row gap-2 items-center justify-center">
                            <span>
                                <svg height="16px" width="16px" version="1.1" id="Layer_1" className=" m-1 fill-neutral-300" 
                                viewBox="0 0 485 485">
                                    <g>
                                        <path d="M443.089,106.198c-15.556-22.846-34.675-42.665-56.555-58.825h49.553v-30H314.538v122.244h30V56.048
                                            C412.319,93.057,455,163.972,455,242.5C455,359.673,359.673,455,242.5,455S30,359.673,30,242.5S125.327,30,242.5,30
                                            c5.257,0,10.617,0.2,15.93,0.593l2.215-29.918C254.598,0.227,248.493,0,242.5,0C177.726,0,116.829,25.225,71.027,71.026
                                            C25.225,116.829,0,177.726,0,242.5c0,64.774,25.225,125.671,71.027,171.473S177.726,485,242.5,485
                                            c64.774,0,125.671-25.225,171.474-71.027C459.775,368.171,485,307.274,485,242.5C485,193.601,470.507,146.468,443.089,106.198z"/>
                                        <polygon points="227.5,227.5 85.003,227.5 85.003,257.5 257.5,257.5 257.5,85.256 227.5,85.256 	"/>
                                    </g>
                                </svg>
                            </span>
                            <span>
                                {new Date(this.props.paper.deadline).toLocaleDateString()}
                            </span>
                            <span>
                                <Bell callback={null} on={this.props.paper.reminder}/>
                            </span>

                        </div>:<></>}
                        <div  ref={ (divElement) => {if(divElement) this.updateHeight(divElement.scrollHeight,divElement.parentElement.clientHeight) } } 
                        className={fadeStyle} style={{maxHeight: !(this.state.fadeDescription)?this.scrollheight:"15%", transition: "all 300ms ease-in-out"}}>
                            {this.props.paper.description}

                        </div>
                        <div className="h-0.5 ml-auto mt-2 mr-auto w-[99%] rounded-full bg-neutral-300"/>
                        {this.state.needFading?
                        <button onClick={()=>this.setState({fadeDescription: !this.state.fadeDescription})} className=" m-auto w-[90%] flex items-center justify-center">
                            <svg className=" stroke-neutral-300 hover:stroke-neutral-200 transition-all " style={{
                                rotate: this.state.fadeDescription?"-90deg":"90deg",
                                fill: "none", strokeLinecap:"round",strokeLinejoin: "round", strokeWidth:"100px"
                            }} width="50px" height="20px" viewBox="0 0 512 512"><polyline points="328 112 184 256 328 400" /></svg>
                        </button>:<></>
                        }
                        <div className=" flex items-center justify-center mt-5 gap-2">
                            <div className=" text-neutral-300 font-bold text-xl">Források</div>
                            <button onClick={this.generateAllSourcesString} className="w-7 h-7 fill-neutral-300 hover:fill-neutral-200 transition-all group relative">
                                <svg viewBox="0 0 16 16"><g id="SVGRepo_bgCarrier" ></g><g></g><g> <path d="M13,8 C13.5523,8 14,8.44772 14,9 L14,15 C14,15.5523 13.5523,16 13,16 L8,16 C7.44772,16 7,15.5523 7,15 L7,9 C7,8.44772 7.44772,8 8,8 L13,8 Z M7,0 C7.55228,0 8,0.447715 8,1 L9,1 C9.55228,1 10,1.44772 10,2 L11,2 C11.5523,2 12,2.44772 12,3 L12,7 L10,7 L10,5 L4,5 L4,12 L6,12 L6,14 L3,14 C2.44772,14 2,13.5523 2,13 L2,3 C2,2.44772 2.44772,2 3,2 L4,2 C4,1.44772 4.44772,1 5,1 L6,1 C6,0.447715 6.44772,0 7,0 Z M12,10 L9,10 L9,14 L12,14 L12,10 Z M7,2 C6.44772,2 6,2.44772 6,3 C6,3.55228 6.44772,4 7,4 C7.55228,4 8,3.55228 8,3 C8,2.44772 7.55228,2 7,2 Z"></path> </g></svg>
                                <div className=" z-10 shadow-2xl whitespace-nowrap opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 group-hover:w-auto absolute text-lg translate-y-2 -translate-x-[45%] bg-neutral-900 rounded-3xl p-3 transition-all ease-in-out duration-300">
                                    Források másolása a vágólapra
                                </div>
                            </button>
                        </div>
                        <div className="w-[99%] max-w-[99%] flex justify-end items-center m-auto flex-wrap">
                            <input onChange={(e)=>{this.setState({url:decodeURIComponent(e.target.value)})}} maxLength="255" className=" max-w-full mt-2 p-2 pt-1 pb-1 flex-1 flex-grow text-center text-xl rounded-3xl bg-neutral-800 text-neutral-200  border-none outline-none"
                            id="url"
                            type="url"
                            placeholder="Forrás URL"
                            name="url"
                            value={this.state.url}
                            onKeyUp={(e)=>{
                                if(e.key !== "Enter") return;
                                this.handleAddSourceButton();
                            }}
                            />
                            <button 
                                onClick={()=>{
                                    this.handleAddSourceButton();
                                }}
                                className="mt-2 p-2 pt-1 pb-1 text-neutral-900 ml-3 flex-none text-center items-center text-xl font-bold rounded-3xl bg-lime-500 transition hover:bg-lime-600 flex-row flex">
                                {this.state.isAdding?
                                <div className="flex-none w-8 mr-2 small-spinner border-neutral-900"/>
                                :
                                <div className="flex-none w-8 mr-2 aspect-square rounded-full bg-transparent text-center items-center justify-center flex relative ">
                                    <div className=" w-2/3 h-1 rounded-full bg-neutral-900 absolute">
                                    
                                    </div>
                                    <div className=" w-1 h-2/3 rounded-full bg-neutral-900 absolute">
                                    
                                    </div>
                                </div>
                                }
                                Hozzáadás
                                
                            </button>
                        </div>
                        {this.state.sources.map((source,index)=>
                            <Source key={index} source={source} isSelected={this.state.selectedSource===source.id} paper={this}/>
                            
                        )}
                        <br/>
                        
                    </div>
                </div>
            </div>
            </div>
        );
    }
}
export default Paper;