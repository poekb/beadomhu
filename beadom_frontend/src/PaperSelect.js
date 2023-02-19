import React from "react"
import Bell from "./Bell"

class PaperSelect extends React.Component{
    constructor(props){
        super(props)
    }


    render(){
        
        return(<>
        
        <div className=" bg-neutral-600 w-full aspect-video rounded-2xl shadow-2xl">
            <div className=" rounded-2xl overflow-hidden w-full aspect-video fade2">
                <div className="text-center bg-neutral-800 p-2 text-neutral-400 border-solid border-b-8 text-xl font-bold"
                    style={{borderBottomColor:this.props.paper.color}}>
                    {this.props.paper.title}
                </div>
                {this.props.paper.deadline!=""?
                    <div className="text-center m-2 text-neutral-300 drop-shadow-lg text-l font-bold flex flex-row gap-2 items-center justify-center">
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

                    </div>:<></>
                }
                <div className="text-center m-2 text-neutral-300 text-l overflow-hidden break-words h-[60%]">
                    {this.props.paper.description}

                </div>
            </div>

        </div>
        
    </>)
    }
}
export default PaperSelect