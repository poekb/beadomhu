import React from "react";
import validator from 'validator'

class Source extends React.Component{


    wasSelected = false;
    constructor(props){
        super(props);
        this.state = {source: {...this.props.source}};
    }
    componentDidUpdate(){
        if(!this.props.isSelected){
            this.state.source={...this.props.source};
            this.state.saving=false;
            this.state.deleting=false;

        }
    }
    
    render(){
        return(<>{this.props.isSelected?
        <div className="w-[99%] bg-neutral-800 rounded-3xl m-auto mt-3 p-1 pt-2">
            <div className="flex flex-row justify-end flex-wrap text-neutral-300 font-bold w-full">
             <input className=" grow pl-2 ml-2 text-start text-ellipsis whitespace-nowrap overflow-hidden mr-2 bg-inherit outline-none bg-neutral-800 hover:bg-neutral-700 transition-all rounded-3xl p-1" value={this.state.source.title} onChange={(e)=>{this.state.source.title=e.target.value; this.forceUpdate()}}/>
             <input className=" flex-none fill-neutral-300 p-1 pr-2 pl-2 mr-2 rounded-3xl text-neutral-300 bg-neutral-800 outline-none hover:bg-neutral-700 transition-all"
             type="datetime-local" id="start" name="trip-start" 
             step={1}
             value={this.state.source.viewDate} onChange={(e)=>{console.log(this.state.source.viewDate);this.state.source.viewDate=e.target.value; this.forceUpdate();}}/>

            </div>
            <div className="flex mb-1 pl-2 pr-2 items-center justify-end mt-2">
                <input className=" flex-grow p-1 pl-2 pr-2 outline-none bg-inherit overflow-hidden text-ellipsis whitespace-nowrap text-start bg-neutral-800 hover:bg-neutral-700 transition-all rounded-3xl" value={this.state.source.url} onChange={(e)=>{this.state.source.url=decodeURIComponent(e.target.value); this.forceUpdate()}}/>
                <button type="submit" 
                            className="  text-neutral-300 p-1 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-500 transition hover:bg-blue-600 flex flex-row justify-center items-center"
                            onClick={()=>{
                                if(validator.isURL(this.state.source.url)&&(this.state.source.url.startsWith("http://")||this.state.source.url.startsWith("https://")))
                                    window.open(this.state.source.url,"_blank");
                            }} 
                    >   
                        
                        <svg height="20" width="20" version="1.1" viewBox="0 0 194.818 194.818" className="fill-neutral-200 p-[1.5px]"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" ></g><g id="SVGRepo_iconCarrier"> <g> <path d="M185.818,2.161h-57.04c-4.971,0-9,4.029-9,9s4.029,9,9,9h35.312l-86.3,86.3c-3.515,3.515-3.515,9.213,0,12.728 c1.758,1.757,4.061,2.636,6.364,2.636s4.606-0.879,6.364-2.636l86.3-86.3v35.313c0,4.971,4.029,9,9,9s9-4.029,9-9v-57.04 C194.818,6.19,190.789,2.161,185.818,2.161z"></path> <path d="M149,77.201c-4.971,0-9,4.029-9,9v88.456H18v-122h93.778c4.971,0,9-4.029,9-9s-4.029-9-9-9H9c-4.971,0-9,4.029-9,9v140 c0,4.971,4.029,9,9,9h140c4.971,0,9-4.029,9-9V86.201C158,81.23,153.971,77.201,149,77.201z"></path> </g> </g></svg>
                </button>
                <button type="submit" 
                            className="  text-neutral-900 p-1 ml-3 shadow-2xl text-center text-xl font-bold rounded-lg bg-lime-500 transition hover:bg-lime-600 flex flex-row justify-center items-center"
                            onClick={()=>{
                                if(this.state.saving) return;
                                this.setState({saving:true});
                                this.props.paper.saveSource(this.state.source)
                            }} 
                    >   
                        {this.state.saving?<div className="small-spinner h-[20px] border-neutral-900"></div>
                        :
                        <svg height="20" viewBox="0 0 24 24" width="20" className="fill-neutral-900"><path d="M4,2 L18.4222294,2 L22,5.67676491 L22,20 C22,21.1045695 21.1045695,22 20,22 L4,22 C2.8954305,22 2,21.1045695 2,20 L2,4 C2,2.8954305 2.8954305,2 4,2 Z M17,4 L17,10 L7,10 L7,4 L4,4 L4,20 L6,20 L6,12 L18,12 L18,20 L20,20 L20,6.48925072 L17.5777706,4 L17,4 Z M9,4 L9,8 L15,8 L15,4 L9,4 Z M8,14 L8,20 L16,20 L16,14 L8,14 Z M12,5 L14,5 L14,7 L12,7 L12,5 Z" fillRule="evenodd"/></svg>
                        }
                </button>
                <button type="submit" 
                            className=" text-neutral-200 p-1 ml-3 text-center shadow-2xl text-xl font-bold rounded-lg bg-red-700 transition hover:bg-red-800 flex flex-row justify-center items-center"
                            onClick={()=>{
                                if(this.state.deleting) return;
                                this.setState({deleting:true});
                                this.props.paper.deleteSource(this.props.source.id);
                            }} 
                    >
                        {this.state.deleting?<div className="small-spinner h-[20px] border-neutral-200"></div>
                        :
                        <svg height="20" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="20" className=" fill-neutral-200"><path d="M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z"/></svg>
                        }
                </button>
                    
            </div>

            
        </div>
        :
        <button className="w-[99%] bg-neutral-800 rounded-3xl m-auto mt-3 p-1 pt-2" onClick={()=>{this.props.paper.selectSource(this.props.source.id)}}>
            <div className="flex flex-row justify-end flex-wrap text-neutral-300 font-bold w-full">
             <div className=" grow ml-4 text-start text-ellipsis whitespace-nowrap overflow-hidden mr-4">{this.props.source.title}</div>
             <div className=" flex-none mr-4">{new Date(this.props.source.viewDate).toLocaleString()}</div>

            </div>
            <div className="w-[calc(100%-2rem)] ml-4 mr-4 overflow-hidden text-ellipsis inline-block whitespace-nowrap text-start transition-all">{this.props.source.url}</div>

            
        </button>
        }</>)
    }
}
export default Source;