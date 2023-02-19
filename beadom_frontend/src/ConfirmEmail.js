import React from 'react';

var SERVERURL;

class ConfirmEmail extends React.Component {
    constructor(){
        super()
        this.state = {
            loading: true,
            success: false
        }
        fetch("config.json").then(result=>{result.json().then(jsonData=>{
            SERVERURL=jsonData.SERVERURL;
            this.confirm()
        })});
    }

    confirm(){
        let params = (new URL(document.location)).searchParams;
        let options = {
            method: 'GET',
            headers: {
              "registid":params.get('registerID'),

            },
            mode: 'cors'
        };
        console.log(SERVERURL);
        fetch(SERVERURL+"/request/get/confirmemail", options).then((result)=>{
            result.text().then((txt)=>{
                this.setState({
                    loading: false,
                    success:txt==="success"
                })
                console.log(txt);
            })
        })
    }


    exitTab(){
        window.opener = null;
        window.open("", "_self");
        window.close();
    }

    render(){
        return (
            <div className="w-screen h-screen bg-neutral-700 ">
                <div className=" flex items-center justify-center flex-1 h-full">
                    <div className="formratio h-5/5 max-w-full m-4 bg-neutral-800 text-neutral-300 rounded-3xl shadow-3xl">
                        <div className=" flex flex-col justify-center p-4">
                            <div className="font-bold text-5xl m-4 mb-10 text-center">Email-cím megerősítése</div>
                            {this.state.loading?
                            <div className="loading-spinner m-auto"/>
                            :
                            <>
                                {this.state.success?<div className="text-3xl m-4 mb-10 text-center">Sikeres megerősítés<br/><br/>Visszatérhet az eredeti ablakhoz</div>:
                                <div className="text-3xl m-4 mb-10 text-center">Sikertelen megerősítés: lejárt token</div>}
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ConfirmEmail