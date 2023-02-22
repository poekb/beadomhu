import React from "react";
class Docs extends React.Component{
    render(){
        return(
        <>
            <div className=" overflow-hidden flex flex-col items-start  justify-start flex-1 h-screen bg-neutral-700 text-neutral-400 relative ">
                <div className='flex-none w-screen h-16 bg-neutral-900 flex flex-row items-center justify-center z-20 shadow-3xl '>

                    <div className="m-4 text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">Dokumentáció</div>
                    
                </div>
                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Szöveges dokumentáció:</div>
                <a 
                href="/docfiles/beadom.hu.docx" 
                className=" bg-neutral-800 p-2 pt-1 pb-1 rounded-2xl text-lg text-neutral-400 mt-1 m-4 mb-0 font-bold hover:text-neutral-300 transition-all">
                    Letöltés (.docx)
                </a>

                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Forráskód:</div>
                <a 
                href="https://github.com/poekb/beadomhu" 
                className="group bg-neutral-800 p-2 pt-1 pb-1 rounded-2xl text-lg text-neutral-400 mt-0 m-4 mb-0 font-bold hover:text-neutral-300 transition-all flex flex-row items-center">
                    Megnyitás githubon
                    <div 
                    className=" text-neutral-300 p-1 m-1 mr-0 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-600 transition group-hover:bg-blue-500 flex justify-center items-center"
                    >   
                        
                        <svg height="16" width="16" version="1.1" viewBox="0 0 194.818 194.818" className="fill-neutral-200 p-[1.5px]"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" ></g><g id="SVGRepo_iconCarrier"> <g> <path d="M185.818,2.161h-57.04c-4.971,0-9,4.029-9,9s4.029,9,9,9h35.312l-86.3,86.3c-3.515,3.515-3.515,9.213,0,12.728 c1.758,1.757,4.061,2.636,6.364,2.636s4.606-0.879,6.364-2.636l86.3-86.3v35.313c0,4.971,4.029,9,9,9s9-4.029,9-9v-57.04 C194.818,6.19,190.789,2.161,185.818,2.161z"></path> <path d="M149,77.201c-4.971,0-9,4.029-9,9v88.456H18v-122h93.778c4.971,0,9-4.029,9-9s-4.029-9-9-9H9c-4.971,0-9,4.029-9,9v140 c0,4.971,4.029,9,9,9h140c4.971,0,9-4.029,9-9V86.201C158,81.23,153.971,77.201,149,77.201z"></path> </g> </g></svg>
                    </div>
                </a>

                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Videós dokumentáció:</div>
                <video src="/docfiles/video.mp4" itemType="video/mp4" controls className="w-[calc(100%-32px)] max-w-5xl m-4 rounded-3xl"></video>
            </div>
        </>
        );
    }
}
export default Docs;