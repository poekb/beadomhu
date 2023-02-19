import React from "react";
class Bell extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const bellOFF = !this.props.on? "opacity-100 transition-all duration-300":"opacity-0 transition-all duration-300"
        const bellON = this.props.on? "absolute opacity-100 transition-all duration-300":"absolute opacity-0 transition-all duration-300"
        return(
            <>{this.props.callback?
                <button className="relative fill-neutral-300  hover:fill-neutral-400 group" onClick={()=>{this.props.callback(!this.props.on)}}>
                    <svg className={bellON} height="30" viewBox="0 0 24 24" width="30"><path d="m5.705 3.71-1.41-1.42C1 5.563 1 7.935 1 11h1l1-.063C3 8.009 3 6.396 5.705 3.71zm13.999-1.42-1.408 1.42C21 6.396 21 8.009 21 11l2-.063c0-3.002 0-5.374-3.296-8.647zM12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.184 4.073 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z"/></svg>
                    <svg className={bellOFF} height="30" viewBox="0 0 24 24" width="30"><path d="M20.345 18.931A.993.993 0 0 0 21 18v-1a.996.996 0 0 0-.293-.707L19 14.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258c-1.323.364-2.463 1.128-3.346 2.127L3.707 2.293 2.293 3.707l18 18 1.414-1.414-1.362-1.362zM12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zM5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h10.879L5.068 9.189C5.037 9.457 5 9.724 5 10z"/></svg>
                    <div className=" z-10 shadow-2xl whitespace-nowrap opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 group-hover:w-auto absolute text-lg translate-y-2 -translate-x-1/3 bg-neutral-900 rounded-3xl p-3 transition-all ease-in-out duration-300">
                            E-mail-es értesítés
                    </div>
                </button> :
                <div className="relative fill-neutral-300">
                    <svg className={bellON} height="20" viewBox="0 0 24 24" width="20"><path d="m5.705 3.71-1.41-1.42C1 5.563 1 7.935 1 11h1l1-.063C3 8.009 3 6.396 5.705 3.71zm13.999-1.42-1.408 1.42C21 6.396 21 8.009 21 11l2-.063c0-3.002 0-5.374-3.296-8.647zM12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.184 4.073 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z"/></svg>
                    <svg className={bellOFF} height="20" viewBox="0 0 24 24" width="20"><path d="M20.345 18.931A.993.993 0 0 0 21 18v-1a.996.996 0 0 0-.293-.707L19 14.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258c-1.323.364-2.463 1.128-3.346 2.127L3.707 2.293 2.293 3.707l18 18 1.414-1.414-1.362-1.362zM12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zM5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h10.879L5.068 9.189C5.037 9.457 5 9.724 5 10z"/></svg>
                </div>
            }
            </>
        );
    }
}
export default Bell;