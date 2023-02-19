import React from "react"
import Bell from "./Bell";

class ColorSelect extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div onClick={()=>this.props.parent.setColor(this.props.color)} style={{backgroundColor: this.props.color}} className="aspect-square rounded-full w-10"/>
        );
    }
}


class NewPaper extends React.Component{
    colors = [
        "#87CEFA",
        "#7EC0EE",
        "#00BFFF",
        "#00B2EE",
        "#009ACD",
        "#00688B",
        "#ADD8E6",
        "#87CEEB",
        "#40E0D0",
        "#00FF7F",
        "#00EE76",
        "#00CD66",
        "#008B45",
        "#32CD32",
        "#7FFF00",
        "#7CFC00",
        "#FFFF00",
        "#FFA500",
        "#FFB347",
        "#FFC0CB",
        "#FFB6C1",
        "#FF69B4",
        "#FF1493",
        "#DC143C",
        "#FF00FF",
        "#EE82EE",
        "#DA70D6",
        "#000000",
        "#888888",
        "#FFFFFF"
      ];
    constructor(props){
        super(props)
        
        this.state = {title: "",description: "",deadline: "",color:"#ffffff",selectingColor: false,reminder: false};

        this.setColor = this.setColor.bind(this)
        this.setReminder = this.setReminder.bind(this)
        //this.updateEditing = this.updateEditing.bind(this)
    }
    
    componentDidMount(){
        if(this.props.editing) this.setState({...this.props.parent.state.selectedPaper,saving: false,deleting: false}) ;
        else this.setState({title: "",description: "",deadline: "",color:"#ffffff",selectingColor: false,reminder: false});
    }

    setReminder(value){
        this.setState({reminder: value})
    }
    setColor(color){
        this.setState({color: color})
    }
    render(){
        
        const curPaper = this.state;
        const colorEditStyle = curPaper.selectingColor?"transition-all opacity-100 scale-100 absolute bg-neutral-800 rounded-3xl translate-y-16 w-72 grid grid-cols-5 grid-rows-6 h-80 items-start justify-start gap-3 p-3 grid-flow-row aspect-video "
        :"transition-all opacity-0 scale-0 absolute bg-neutral-800 rounded-3xl w-72 translate-y-16 grid grid-cols-5 grid-rows-6 h-80 items-start justify-start gap-3 p-3 grid-flow-row aspect-video ";
        return(
                <div className="w-full h-full bg-neutral-700 rounded-3xl overflow-hidden flex flex-col items-center justify-start">
                    <div style={{borderColor: curPaper.color}} className=" duration-300 transition-all w-full h-20 bg-neutral-800 relative flex items-center justify-center text-neutral-900 font-bold text-3xl border-b-8 border-solid">
                        <input onChange={(e)=>this.setState({title: e.target.value})} maxLength="50" className="z-10 m-4 p-3 w-2/3 text-center text-2xl rounded-2xl bg-transparent text-neutral-400  border-none outline-none"
                            id="title"
                            type="title"
                            placeholder="Cím"
                            name="title"
                            value={curPaper.title}
                            />
                                
                        <div className="absolute w-full flex items-start justify-start">
                            <button onClick={()=>{
                                    if(this.props.editing) this.props.parent.editPaper(false)
                                    else this.props.parent.setState({creatingNew: false})
                                }} className=" z-10 w-10 ml-auto mr-4 aspect-square rounded-full bg-neutral-700 group hover:bg-neutral-400 transition-all text-center items-center justify-center flex text-9xl relative ease-in-out duration-300">
                                <div className=" rotate-45 w-2/3 h-1 rounded-full bg-neutral-400 group-hover:bg-neutral-700 transition-all text-center items-center justify-center flex text-9xl absolute ease-in-out duration-300">
                            
                                </div>
                                <div className=" rotate-45 w-1 h-2/3 rounded-full bg-neutral-400 group-hover:bg-neutral-700 transition-all text-center items-center justify-center flex text-9xl absolute ease-in-out duration-300">
                                    
                                </div>
                            </button>
                        </div>
                        
                        <div className="absolute w-full flex items-end justify-end">
                            <button 
                            onClick={()=>{this.setState({selectingColor: !curPaper.selectingColor})}} 
                            style={{backgroundColor: curPaper.color}}
                            className=" border-solid shadow-2xl z-10 w-10 mr-auto ml-4 aspect-square rounded-full transition-all text-center items-center justify-center flex text-9xl relative ease-in-out duration-300">
                            <div className="relative">
                                <div className={colorEditStyle}>
                                    {this.colors.map((color)=><ColorSelect key={color} color={color} parent={this}/>)}
                                            
                                </div>
                            </div>
                                
                            </button>
                            
                        </div>
                        
                    </div>
                    <div className="mt-4 text-2xl text-neutral-300 font-bold flex flex-row justify-center gap-4">Határidő<Bell on={curPaper.reminder} callback={this.setReminder}/></div>
                    <input value={curPaper.deadline} onChange={(e)=>this.setState({deadline: e.target.value})} type="date" id="start" name="trip-start" 
                    className="fill-neutral-300 stroke-neutral-300 m-4 w-2/3 min-w-fit rounded-3xl p-2 text-xl text-neutral-400 bg-neutral-800 outline-none hover:bg-neutral-900  transition-all"
                        
                    ></input>

                    <textarea type="text" placeholder="Leírás" id="start" name="trip-start" maxLength="5000" style={{width: "calc(80%)"}} 
                        value={curPaper.description} onChange={(e)=>{this.setState({description: e.target.value})}}
                        className="scrollbar text-neutral-300 font-bold resize-none flex-1 text-center bg-transparent rounded-3xl p-3 text-xl outline-none "/>
                    <div className="flex flex-row w-full flex-wrap justify-end">
                    {this.props.editing?
                    <>
                    <button type="submit" 
                            className=" text-neutral-200 m-6 p-2 pl-3 text-center shadow-2xl text-xl font-bold rounded-2xl bg-red-700 transition hover:bg-red-800 flex flex-row justify-center items-center"
                            onClick={()=>{
                                this.setState({deleting: true})
                                this.props.parent.deletePaper({id: curPaper.id})
                            }} 
                    >
                        Törlés
                        {this.state.deleting?<div className="small-spinner h-[26px] ml-1 border-neutral-200"></div>
                        :
                        <svg height="26px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="26px" className=" fill-neutral-200 ml-1"><path d="M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z"/></svg>
                        }
                    </button>
                    <button type="submit" 
                            className=" text-neutral-900 m-6 ml-auto p-2 pr-3 shadow-2xl text-center text-xl font-bold rounded-2xl bg-lime-500 transition hover:bg-lime-600 flex flex-row justify-center items-center"
                            onClick={()=>{
                                this.setState({saving: true})
                                this.props.parent.updatePaper(curPaper)
                                
                            }} 
                    >   
                        {this.state.saving?<div className="small-spinner h-[26px] border-neutral-900 mr-1"></div>
                        :
                        <svg height="26" viewBox="0 0 24 24" width="26" className="fill-neutral-900 mr-1"><path d="M4,2 L18.4222294,2 L22,5.67676491 L22,20 C22,21.1045695 21.1045695,22 20,22 L4,22 C2.8954305,22 2,21.1045695 2,20 L2,4 C2,2.8954305 2.8954305,2 4,2 Z M17,4 L17,10 L7,10 L7,4 L4,4 L4,20 L6,20 L6,12 L18,12 L18,20 L20,20 L20,6.48925072 L17.5777706,4 L17,4 Z M9,4 L9,8 L15,8 L15,4 L9,4 Z M8,14 L8,20 L16,20 L16,14 L8,14 Z M12,5 L14,5 L14,7 L12,7 L12,5 Z" fillRule="evenodd"/></svg>
                        }
                        Mentés
                    </button>
                    </>
                    :
                    <button type="submit" 
                            className=" text-neutral-900 m-6 ml-auto p-2 text-center text-2xl font-bold rounded-2xl bg-lime-500 transition hover:bg-lime-600"
                            onClick={()=>{
                                this.props.parent.newPaperHandler(curPaper)
                                this.setState({title: "",description: "",deadline: "",color:"#ffffff",selectingColor: false})
                            }} 
                    >
                        Létrehozás
                    </button>
                    }
                    </div>
                </div>
        );
    }

}
export default NewPaper