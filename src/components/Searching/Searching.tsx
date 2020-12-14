import React, {useRef, useLayoutEffect, useEffect} from 'react'

export default function Searching(props:any) {
    const [graph, setGraph] = React.useState<Array<Array<number>>>([])
    const [canvWidth, setCanvWidth] = React.useState<number>(0)
    const [canvHeight, setCanvHeight] = React.useState<number>(0)
    const [numElements, setNumElements] = React.useState<number>(10)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const parent = useRef<HTMLDivElement | null>(null)

    const addToGraph = (x:number, y:number) => {
        setGraph(prev => [...prev, [x, y]])
    }

    const addEdges = () => {
        let isValid: boolean;
        let ind:number;
        let graphVal:Array<Array<number>>
        for(let i=0;i<graph.length;i++) {
            isValid = false
            while(!isValid) {
                ind = Math.floor(Math.random()*graph.length)
                if(ind!==i){
                    isValid = true
                }
            }
            graphVal = graph.slice(0)
            setGraph(graphVal.slice(0))
        }
    }
    
    const addNewPoint = () => {
        let prev:Array<number>;
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

    useEffect(() => {
        if(graph.length>=numElements || graph.length===0) return
        addNewPoint()
    }, [graph])

    const getHypot = (i:number,j:number) => {
        return Math.hypot(Math.abs(graph[i][0]-graph[j][0]), Math.abs(graph[i][1] - graph[j][1]))
    }

    useEffect(() => {
        if(canvasRef===null) return 
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d")
        if(context===null) return
        if(canvas===null) return
        setCanvHeight(canvas.height)
        setCanvWidth(canvas.width)
        context?.clearRect(0, 0, canvas.width, canvas.height);
        const radius = 4; 
        if(graph.length===0) addToGraph(0,0)
        if(graph.length<numElements && graph.length!==0) addNewPoint()
        if(graph.length===numElements) console.log(graph.length)
        for(let i=0; i<graph.length;i++) {
            context.beginPath()
            context.arc((canvas.width/2)+graph[i][0], (canvas.height/2)+graph[i][1], radius, 0, 2 * Math.PI);
            context.fillStyle = "#6b7280";
            context.stroke();
            context.fill();
        }
    })

    return (
        <div className="w-full flex-1 bg-gray-200 items-center flex flex-col pt-12 ">
            <div ref={parent} className="container flex flex-col bg-white p-5 rounded-md px-1">
                <div className="flex w-full justify-between items-center mb-6 p-5">
                    <h1 className="text-4xl font-medium text-left">{props.title}</h1>
                    <button onClick={() => setNumElements(prev=>prev+1)}>Inc</button>
                </div>
                <canvas className="mx-auto" width="1240" height="480" ref={canvasRef} id="mycanvas"></canvas>
            </div>
        </div>
    )
}
