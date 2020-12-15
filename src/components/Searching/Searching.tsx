import React, {useRef, useLayoutEffect, useEffect} from 'react'

export default function Searching(props:any) {
    const [graph, setGraph] = React.useState<Array<Array<number>>>([])
    const [canvWidth, setCanvWidth] = React.useState<number>(0)
    const [canvHeight, setCanvHeight] = React.useState<number>(0)
    const [numElements, setNumElements] = React.useState<number>(15)
    const [startTime, setStartTime] = React.useState<Date | null>(null)
    const [updateTime, setUpdateTime] = React.useState<Date | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const parent = React.useRef<HTMLDivElement | null>(null)
    const [grabbing, setGrabbing] = React.useState<number>(-1)
    const [startEnd,setStartEnd] = React.useState<Array<number>>([0,1])
    const radius = 15; 


    const addToGraph = (x:number, y:number) => {
        setGraph(prev => [...prev, [x, y]])
    }

    const getHypot = (i:Array<number>,j:Array<number>) => {
        return Math.hypot(Math.abs(i[0]-j[0]), Math.abs(i[1]-j[1]))
    }

    const makeGraph = () => {
        let x2=0;
        let y2=0;
        let closest;
        let closestInd;
        let graphHold;
        let farthest;
        let farthestInds:Array<number>;
        graphHold = [[canvWidth/2, canvHeight/2]]
        let foundVal = 0
        for(let i=1;i<numElements;i++) {
            while(foundVal<graphHold.length) {
                foundVal = 0
                x2 = Math.round(Math.random()*(canvWidth-radius*2))+radius
                y2 = Math.round(Math.random()*(canvHeight-radius*2))+radius
                for(let j=0;j<graphHold.length;j++) {
                    if(j===i || (getHypot([x2,y2], graphHold[j])>100)) foundVal++
                }
            }
            graphHold.push([x2,y2])
        }
        for(let i=0;i<graphHold.length;i++) {
            for(let j=i;j<graphHold.length;j++) {
                if(getHypot(graphHold[i], graphHold[j])<250 && i!==j && graphHold[i].length<5 && graphHold[j].length<5) {
                    graphHold[i].push(j)
                    graphHold[j].push(i)
                }
            }
        }
        for(let i=0;i<graphHold.length;i++) {
            if(graphHold[i].length<3) {
                closest = Infinity
                closestInd = -1
                for(let j=0;j<graphHold.length;j++) {
                    if(getHypot(graphHold[i], graphHold[j])<closest && j!==i) {
                        closestInd = j
                        closest = graphHold[j]
                    }
                }
                graphHold[i][2] = closestInd
                graphHold[closestInd].push(i)
            }
        }
        farthest = -Infinity
        farthestInds = []
        for(let i=0;i<graphHold.length;i++) {
            for(let j=0;j<graphHold.length;j++) {
                if(getHypot(graphHold[i], graphHold[j])>farthest) {
                    farthest = getHypot(graphHold[i], graphHold[j])
                    farthestInds = [i,j]
                }
            }
        }
        setStartEnd(farthestInds)
        return graphHold
    }
    
    const addNewPoint = () => {
        let dist: number;
        let isValid: boolean;
        let deg:number;
        let x2 = 0;
        let y2 = 0;
        isValid = false
        dist = Math.floor(Math.random()*canvHeight)+1
        while(!isValid) {
            deg = Math.random()*2*Math.PI
            x2 = dist*Math.cos(deg)
            y2 = dist*Math.sin(deg)
            if((x2>(-1*canvWidth/2) && (x2<canvWidth/2) && (y2>(-1*canvHeight/2) && (y2<canvHeight/2)))){
                isValid = true
            }
        }
        addToGraph(x2, y2)
    }

    const calcMidPoint = (i:number,j:number) => {
        return ((i+j)/2)
    }

    useEffect(() => {
        if(startTime===null || updateTime===null)  {
            setStartTime(new Date())
            setUpdateTime(new Date())
            return
        }
        setTimeout(() => {
            setUpdateTime(new Date())
        }, 10)
        let curr = new Date() 
        let diff = (curr.getTime()-startTime.getTime())/1000
        let scale = 5
        let angle = 0
        if(canvasRef===null) return 
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d")
        if(context===null) return
        if(canvas===null) return
        if(canvHeight===0) setCanvHeight(canvas.height)
        if(canvWidth===0) setCanvWidth(canvas.width)
        context?.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i<graph.length;i++) {
            for(let j=0;j<graph[i].slice(2).length;j++) {
                if(graph[i][j+2]<i) continue
                context.beginPath();
                context.moveTo(graph[i][0] + scale*Math.sin(diff+i/Math.PI), graph[i][1] + scale*Math.sin(diff+i/Math.PI)); 
                context.lineTo(graph[graph[i][j+2]][0] + scale*Math.sin(diff+i/Math.PI), graph[graph[i][j+2]][1] + scale*Math.sin(diff+i/Math.PI));
                context.lineWidth = 3;  
                context.strokeStyle = "#6b7280"
                context.stroke();   
                context.font = '24px Arial';
                context.fillStyle = '#000000'
                angle = Math.atan((graph[i][1]-graph[graph[i][j+2]][1])/(graph[i][0]-graph[graph[i][j+2]][0]))
                if ((angle>Math.PI/4)&&(angle<(3*Math.PI/4)) || (angle>(5*Math.PI/4))&&(angle<(7*Math.PI/4))) {
                    context.fillText(''+Math.floor(getHypot(graph[i], graph[graph[i][j+2]])/40), calcMidPoint(graph[i][0], graph[graph[i][j+2]][0])+ scale*Math.sin(diff+i/Math.PI)+15, calcMidPoint(graph[i][1], graph[graph[i][j+2]][1])+ scale*Math.sin(diff+i/Math.PI));
                } else {
                    context.fillText(''+Math.floor(getHypot(graph[i], graph[graph[i][j+2]])/40), calcMidPoint(graph[i][0], graph[graph[i][j+2]][0])+ scale*Math.sin(diff+i/Math.PI), calcMidPoint(graph[i][1], graph[graph[i][j+2]][1])+35+ scale*Math.sin(diff+i/Math.PI));
                }
            }
            context.beginPath()
            context.arc(graph[i][0] + scale*Math.sin(diff+i/Math.PI), graph[i][1] + scale*Math.sin(diff+i/Math.PI), radius, 0, 2 * Math.PI);
            context.fillStyle = startEnd[1]===i ? "#3b82f6" : startEnd[0]===i ? "#10b981" : "#6b7280";
            context.strokeStyle = "#FFFFFF"
            context.stroke()
            context.fill();
            if(startEnd[1]===i) {
                context.font = '24px Arial';
                context.fillStyle = '#3b82f6'
                context.fillText('End', graph[i][0] + scale*Math.sin(diff+i/Math.PI)-25, graph[i][1] + scale*Math.sin(diff+i/Math.PI)-17);
            } else if(startEnd[0]===i) {
                context.font = '24px Arial';
                context.fillStyle = '#10b981'
                context.fillText('Start', graph[i][0] + scale*Math.sin(diff+i/Math.PI)-25, graph[i][1] + scale*Math.sin(diff+i/Math.PI)-17);

            }
            //Draw line
        }
    })

    const startGrab = (e:any) => {
        if(canvasRef===null) return
        var rect = canvasRef.current?.getBoundingClientRect() || {left:0, top:0};
        let xPos = e.clientX - rect.left
        let yPos = e.clientY - rect.top
        for(let i=0;i<graph.length;i++) {
            if(getHypot([xPos,yPos], graph[i])<15) setGrabbing(i)
        }
    }

    const handleGrab = (e:any) => {
        if(grabbing===-1) return
        if(canvasRef===null) return
        var rect = canvasRef.current?.getBoundingClientRect() || {left:0, top:0};
        let xPos = e.clientX - rect.left
        let yPos = e.clientY - rect.top
        graph[grabbing][0] = xPos
        graph[grabbing][1] = yPos
    }

    useEffect(() => {
        if(canvHeight <50) return
        let holdGraph = makeGraph()
        setGraph(holdGraph)
    }, [canvHeight, numElements])

    const resetGraph = () => {
        console.log('here ia m')
        let holdGraph = makeGraph()
        setGraph(holdGraph)
    }

    const rightClick = (e:any) => {
        e.preventDefault();
        if(canvasRef===null) return
        var rect = canvasRef.current?.getBoundingClientRect() || {left:0, top:0};
        let xPos = e.clientX - rect.left
        let yPos = e.clientY - rect.top
        for(let i=0;i<graph.length;i++) {
            if(getHypot([xPos,yPos], graph[i])<15 && !startEnd.includes(i)) {
                let sE = startEnd
                sE.pop()
                sE.unshift(i)
                setStartEnd(sE)
            }
        }
    }

    return (
        <div className="w-full flex-1 bg-gray-200 items-center flex flex-col pt-12 ">
            <div ref={parent} className="container flex flex-col bg-white p-5 rounded-md px-1">
            <div className="flex w-full justify-between items-center mb-6 p-5">
                    <h1 className="text-4xl font-medium text-left">{props.title}</h1>
                    <div className="flex items-center">
                        {/* {playing && 
                        <button onClick={() => playing ? setPlaying(false) : ''} className={"bg-green-500 hover:bg-green-600 focus:outline-none mr-7 animation-fast text-white px-3 py-2 text-lg rounded "}>
                            
                            <svg className="h-7 w-7 fill-current"  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512">
                                <g>
                                    <g>
                                        <path d="M181.333,0H74.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32    C213.333,14.357,198.976,0,181.333,0z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M437.333,0H330.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32    C469.333,14.357,454.976,0,437.333,0z"/>
                                    </g>
                                </g>
                            </svg>
                        </button>
                        }
                        {!playing && 
                        <button onClick={() => playing ? '' : commands.length===0 ? algorithmHandler() : !playing ? setPlaying(true) : ''} className={"bg-green-500 hover:bg-green-600 focus:outline-none mr-7 animation-fast text-white px-3 py-2 text-lg rounded "}>
                            <svg className="h-7 w-7 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                                <g>
                                    <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275   c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                                </g>
                            </svg>
                        </button>
                        }   */}
                        <button onClick={() => setNumElements(prev => prev>4 ? --prev : prev)} className={"bg-gray-500 mr-4 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded "}>
                            less
                        </button>
                        <button onClick={() => setNumElements(prev => prev<15 ? ++prev : prev)} className={"bg-gray-500 mr-4 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded "}>
                            more
                        </button>
                        <button onClick={resetGraph} className={"bg-gray-500 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded "}>
                            <svg className="h-7 w-7 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" width="438.529px" height="438.528px" viewBox="0 0 438.529 438.528">
                                <g>
                                    <g>
                                        <path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835    c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536    C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814    c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106    c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397    c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906    c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z"/>
                                        <path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4    c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273    c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847    c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907    c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833    c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534    c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427    C426.874,256.72,424.731,255.813,422.253,255.813z"/>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <canvas onMouseDown={startGrab} onContextMenu={rightClick} onMouseMove={handleGrab} onMouseUp={() => setGrabbing(-1)} className="mx-auto bg-white" width="1240" height="480" ref={canvasRef} id="mycanvas"></canvas>
            </div>
        </div>
    )
}
