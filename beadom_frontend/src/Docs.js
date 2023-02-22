import React from "react";
class Docs extends React.Component{
    render(){
        return(
        <>
            <div className=" overflow-y-auto overflow-x-hidden scrollbar w-screen flex flex-col items-center justify-start flex-none h-screen bg-neutral-700 text-neutral-400 relative ">
                <div className='flex-none w-screen h-16 bg-neutral-900 flex flex-row items-center justify-center z-20 shadow-3xl '>

                    <div className="m-4 text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">Beadom.hu</div>
                    
                </div>
                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Webalkalmazás elérése:</div>
                <a 
                href="https://dev.beadom.hu"
                target="_blank" 
                className="group bg-neutral-800 p-2 pt-1 pb-1 rounded-2xl text-lg text-neutral-400 mt-1 m-4 mb-0 font-bold hover:text-neutral-300 transition-all flex flex-row items-center">
                    dev.beadom.hu
                    <div 
                    className=" text-neutral-300 p-1 m-1 mr-0 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-600 transition group-hover:bg-blue-500 flex justify-center items-center"
                    >   
                        <svg width="16" height="16" className=" fill-neutral-200 p-[0.75px]" shapeRendering="geometricPrecision"textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 509 511.54"><path fillRule="nonzero" d="M447.19 347.03c0-17.06 13.85-30.91 30.91-30.91 17.05 0 30.9 13.85 30.9 30.91v87.82c0 21.08-8.63 40.29-22.51 54.18-13.88 13.88-33.09 22.51-54.18 22.51H76.69c-21.09 0-40.3-8.63-54.18-22.51C8.63 475.14 0 455.93 0 434.85V76.69c0-21.09 8.63-40.3 22.51-54.18C36.39 8.63 55.6 0 76.69 0h86.98c17.06 0 30.9 13.85 30.9 30.9 0 17.06-13.84 30.91-30.9 30.91H76.69c-4.07 0-7.82 1.69-10.51 4.37-2.68 2.69-4.37 6.44-4.37 10.51v358.16c0 4.06 1.69 7.82 4.37 10.5 2.69 2.68 6.44 4.38 10.51 4.38h355.62c4.07 0 7.82-1.7 10.51-4.38 2.68-2.68 4.37-6.44 4.37-10.5v-87.82zm0-243.56L308.15 244.28c-11.91 12.12-31.45 12.28-43.56.37-12.11-11.91-12.28-31.45-.37-43.56L401.77 61.81H309.7c-17.06 0-30.9-13.85-30.9-30.91 0-17.05 13.84-30.9 30.9-30.9h168.4C495.15 0 509 13.85 509 30.9v165.04c0 17.06-13.85 30.9-30.9 30.9-17.06 0-30.91-13.84-30.91-30.9v-92.47z"/></svg>
                    </div>
                </a>

                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Leírás és kezelési útmutató:</div>
                <a 
                href="/docfiles/beadom-hu.docx" 
                className="group bg-neutral-800 p-2 pt-1 pb-1 rounded-2xl text-lg text-neutral-400 mt-1 m-4 mb-0 font-bold hover:text-neutral-300 transition-all flex flex-row items-center">
                    Letöltés (.docx)
                    <div 
                    className=" text-neutral-300 p-1 m-1 mr-0 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-600 transition group-hover:bg-blue-500 flex justify-center items-center"
                    >   
                        <svg width="16" height="16" className=" fill-neutral-200"viewBox="0 0 122.88 120.89">
                            <path d="M84.58,47a7.71,7.71,0,1,1,10.8,11L66.09,86.88a7.72,7.72,0,0,1-10.82,0L26.4,58.37a7.71,7.71,0,1,1,10.81-11L53.1,63.12l.16-55.47a7.72,7.72,0,0,1,15.43.13l-.15,55L84.58,47ZM0,113.48.1,83.3a7.72,7.72,0,1,1,15.43.14l-.07,22q46,.09,91.91,0l.07-22.12a7.72,7.72,0,1,1,15.44.14l-.1,30h-.09a7.71,7.71,0,0,1-7.64,7.36q-53.73.1-107.38,0A7.7,7.7,0,0,1,0,113.48Z"/></svg>
                    </div>
                </a>
                <a 
                href="/docfiles/beadom-hu.pdf"
                target="_blank" 
                className="group bg-neutral-800 p-2 pt-1 pb-1 mt-1 rounded-2xl text-lg text-neutral-400 m-4 mb-0 font-bold hover:text-neutral-300 transition-all flex flex-row items-center">
                    Megnyitás (.pdf)
                    <div 
                    className=" text-neutral-300 p-1 m-1 mr-0 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-600 transition group-hover:bg-blue-500 flex justify-center items-center"
                    >   
                        <svg width="16" height="16" className=" fill-neutral-200 p-[0.75px]" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 509 511.54"><path fillRule="nonzero" d="M447.19 347.03c0-17.06 13.85-30.91 30.91-30.91 17.05 0 30.9 13.85 30.9 30.91v87.82c0 21.08-8.63 40.29-22.51 54.18-13.88 13.88-33.09 22.51-54.18 22.51H76.69c-21.09 0-40.3-8.63-54.18-22.51C8.63 475.14 0 455.93 0 434.85V76.69c0-21.09 8.63-40.3 22.51-54.18C36.39 8.63 55.6 0 76.69 0h86.98c17.06 0 30.9 13.85 30.9 30.9 0 17.06-13.84 30.91-30.9 30.91H76.69c-4.07 0-7.82 1.69-10.51 4.37-2.68 2.69-4.37 6.44-4.37 10.51v358.16c0 4.06 1.69 7.82 4.37 10.5 2.69 2.68 6.44 4.38 10.51 4.38h355.62c4.07 0 7.82-1.7 10.51-4.38 2.68-2.68 4.37-6.44 4.37-10.5v-87.82zm0-243.56L308.15 244.28c-11.91 12.12-31.45 12.28-43.56.37-12.11-11.91-12.28-31.45-.37-43.56L401.77 61.81H309.7c-17.06 0-30.9-13.85-30.9-30.91 0-17.05 13.84-30.9 30.9-30.9h168.4C495.15 0 509 13.85 509 30.9v165.04c0 17.06-13.85 30.9-30.9 30.9-17.06 0-30.91-13.84-30.91-30.9v-92.47z"/></svg>
                    </div>
                </a>

                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Forráskód:</div>
                <a 
                href="https://github.com/poekb/beadomhu"
                target="_blank" 
                className="group bg-neutral-800 p-2 pt-1 pb-1 rounded-2xl text-lg text-neutral-400 mt-1 m-4 mb-0 font-bold hover:text-neutral-300 transition-all flex flex-row items-center">
                    Megnyitás GitHubon
                    <div 
                    className=" text-neutral-300 p-1 m-1 mr-0 ml-2 shadow-2xl text-center text-xl font-bold rounded-lg bg-blue-600 transition group-hover:bg-blue-500 flex justify-center items-center"
                    >   
                        <svg width="16" height="16" className=" fill-neutral-200 p-[0.75px]" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 509 511.54"><path fillRule="nonzero" d="M447.19 347.03c0-17.06 13.85-30.91 30.91-30.91 17.05 0 30.9 13.85 30.9 30.91v87.82c0 21.08-8.63 40.29-22.51 54.18-13.88 13.88-33.09 22.51-54.18 22.51H76.69c-21.09 0-40.3-8.63-54.18-22.51C8.63 475.14 0 455.93 0 434.85V76.69c0-21.09 8.63-40.3 22.51-54.18C36.39 8.63 55.6 0 76.69 0h86.98c17.06 0 30.9 13.85 30.9 30.9 0 17.06-13.84 30.91-30.9 30.91H76.69c-4.07 0-7.82 1.69-10.51 4.37-2.68 2.69-4.37 6.44-4.37 10.51v358.16c0 4.06 1.69 7.82 4.37 10.5 2.69 2.68 6.44 4.38 10.51 4.38h355.62c4.07 0 7.82-1.7 10.51-4.38 2.68-2.68 4.37-6.44 4.37-10.5v-87.82zm0-243.56L308.15 244.28c-11.91 12.12-31.45 12.28-43.56.37-12.11-11.91-12.28-31.45-.37-43.56L401.77 61.81H309.7c-17.06 0-30.9-13.85-30.9-30.91 0-17.05 13.84-30.9 30.9-30.9h168.4C495.15 0 509 13.85 509 30.9v165.04c0 17.06-13.85 30.9-30.9 30.9-17.06 0-30.91-13.84-30.91-30.9v-92.47z"/></svg>
                    </div>
                </a>

                <div className="text-xl text-neutral-300 m-4 mb-0 font-bold">Bemutató videó:</div>
                <video src="/docfiles/video.mp4" poster="/docfiles/thumbnail.png" itemType="video/mp4" controls className="w-[calc(100%-32px)] max-w-5xl m-4 rounded-3xl transition-all"></video>
            </div>
        </>
        );
    }
}
export default Docs;