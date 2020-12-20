import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { inflate } from 'zlib';
import DropSelect from '../DropSelect';
import * as Tone from 'tone'

export default function Searching(props: any) {
    const [graph, setGraph] = React.useState<Array<Array<number>>>([]);
    const [canvWidth, setCanvWidth] = React.useState<number>(0);
    const [canvHeight, setCanvHeight] = React.useState<number>(0);
    const [numElements, setNumElements] = React.useState<number>(50);
    const [startTime, setStartTime] = React.useState<Date | null>(null);
    const [updateTime, setUpdateTime] = React.useState<Date | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const parent = React.useRef<HTMLDivElement | null>(null);
    const [grabbing, setGrabbing] = React.useState<number>(-1);
    const [startEnd, setStartEnd] = React.useState<Array<number>>([0, 1]);
    const [change, setChange] = React.useState<number>(0);
    const [commands, setCommands] = React.useState<Array<Array<number>>>([]);
    const [ind, setInd] = React.useState<number>(-1);
    const [positionChanges, setPositionChanges] = React.useState<number>(0);
    const [showDistance, setShowDistance] = React.useState<boolean>(false);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [osc, setOsc] = React.useState<Tone.Oscillator>();
    const radius = 8;
    const distanceScale = 40;
    let path = useLocation().pathname;

    const addToGraph = (x: number, y: number) => {
        setGraph((prev) => [...prev, [x, y]]);
    };

    const getHypot = (i: Array<number>, j: Array<number>) => {
        return Math.hypot(Math.abs(i[0] - j[0]), Math.abs(i[1] - j[1]));
    };

    useEffect(() => {
        setOsc(new Tone.Oscillator(440, "sine").toDestination())
    }, [])

    let freqs = [
        'C4','D4','E4','F4','G4','A4','B4',
        'C5','D5','E5','F5','G5','A5','B5',
    ]
    
    useEffect(() => {
        if(isPlaying) {
            if(osc===undefined) return
            osc.start()
        } else {
            if(osc===null || osc===undefined) return
            osc.stop()
        }
    }, [isPlaying])

    const breadthFirstCheck = (graphHold: Array<Array<number>>) => {
        let i = 0;
        let unique = [0];
        let hold;
        let a;
        while (i !== unique.length) {
            a = (uniqueHold: Array<number>, j: number) =>
                graphHold[j].slice(2).filter((val) => !uniqueHold.includes(val));
            hold = a(unique.slice(0), unique[i]);
            unique = [...unique, ...hold];
            i++;
        }
        return unique.length === graphHold.length;
    };

    const addSelectedCommand = (selected: Array<number>) => {
        setCommands((prev) => [...prev, selected]);
    };

    const breadthFirstSearch = (graphHold: Array<Array<number>>, start=0, end=graphHold.length-1) => {
        let unique = [start];
        let hold;
        let a;
        for (let i=0; i<unique.length;i++) {
            a = (uniqueHold: Array<number>, j: number) =>
                graphHold[j].slice(2).filter((val) => !uniqueHold.includes(val));
            hold = a(unique.slice(0), unique[i]);
            for(let j=0;j<hold.length;j++) {
                unique.push(hold[j])
                addSelectedCommand(unique.slice(0))
                if(hold[j]===end) return
            }
        }
        return 
    };

    const depthFirstSearch = (graphHold: Array<Array<number>>, start:number, end:number) => {
        if (graphHold.length === 0) return;
        let stack = [start];
        addSelectedCommand(stack.slice(0));
        let unique = [start];
        let hold;
        while (stack.length !== graphHold.length) {
            if (graphHold[stack[stack.length - 1]].length > 2) {
                hold = graphHold[stack[stack.length - 1]].splice(2, 1)[0];
                if (!unique.includes(hold)) {
                    stack.push(hold);
                    unique.push(hold);
                    addSelectedCommand(stack.slice(0));
                }
                if (hold === end) {
                    break;
                }
            } else {
                stack.pop();
                addSelectedCommand(stack.slice(0));
            }
        }
    };

    const dijkstrasAlgorithm = (graphHold: Array<Array<number>>, start:number, end:number) => {
        console.log(start, end, ' is start end')
        let visited: Array<number>
        visited = [start]
        let table: Array<Array<number>>
        table = []
        for(let i=0;i<graphHold.length;i++) {
            if(i===start) table[i] = [0]
            else table[i] = [Infinity]
        }
        let i = 0;
        let hold: Array<number>
        let dist: number
        let leastDist = Infinity
        while(i !== graphHold.length) {
            console.log(table.slice(0), visited.slice(0))
            hold = graphHold[visited[i]].slice(2)
            for(let j=0;j<hold.length;j++) {
                if(visited.slice(0,i).includes(hold[j])) continue
                visited.push(hold[j])
                console.log('getting dist from ', visited[i], ' to ', hold[j])
                dist = Math.floor(getHypot(graph[hold[j]], graph[visited[i]]) / distanceScale) + table[i][0]
                console.log('comparing ', dist, ' and ', table[hold[j]][0], ' from ', i, ' to ', hold[j])
                if(dist < table[hold[j]][0]) {
                    table[hold[j]] = [dist, i]
                }
            }
            i++
        }
    }

    const makeGraph = () => {
        let x2 = 0;
        let y2 = 0;
        let closest;
        let closestInd;
        let graphHold;
        let farthest;
        let farthestInds: Array<number>;
        while (graphHold === undefined || !breadthFirstCheck(graphHold)) {
            graphHold = [[canvWidth / 2, canvHeight / 2]];
            let foundVal = 0;
            for (let i = 1; i < numElements; i++) {
                while (foundVal < graphHold.length) {
                    foundVal = 0;
                    x2 = Math.round(Math.random() * (canvWidth - radius * 2)) + radius;
                    y2 = Math.round(Math.random() * (canvHeight - radius * 2)) + radius;
                    for (let j = 0; j < graphHold.length; j++) {
                        if (j === i || getHypot([x2, y2], graphHold[j]) > 2) foundVal++;
                    }
                }
                graphHold.push([x2, y2]);
            }
            for (let i = 0; i < graphHold.length; i++) {
                for (let j = i; j < graphHold.length; j++) {
                    if (
                        getHypot(graphHold[i], graphHold[j]) < 125 &&
                        i !== j &&
                        graphHold[i].length < 6 &&
                        graphHold[j].length < 6
                    ) {
                        graphHold[i].push(j);
                        graphHold[j].push(i);
                    }
                }
            }
            for (let i = 0; i < graphHold.length; i++) {
                if (graphHold[i].length < 3) {
                    closest = Infinity;
                    closestInd = -1;
                    for (let j = 0; j < graphHold.length; j++) {
                        if ((getHypot(graphHold[i], graphHold[j]) < closest) && (j !== i)) {
                            closestInd = j;
                            closest = getHypot(graphHold[i], graphHold[j]);
                        }
                    }
                    graphHold[i][2] = closestInd;
                    graphHold[closestInd].push(i);
                }
            }
            farthest = -Infinity;
            farthestInds = [];
            for (let i = 0; i < graphHold.length; i++) {
                for (let j = 0; j < graphHold.length; j++) {
                    if (getHypot(graphHold[i], graphHold[j]) > farthest) {
                        farthest = getHypot(graphHold[i], graphHold[j]);
                        farthestInds = [i, j];
                    }
                }
            }
            setStartEnd(farthestInds);
        }
        return graphHold;
    };

    const calcMidPoint = (i: number, j: number) => {
        return (i + j) / 2;
    };
    
    useEffect(() => {
        if(isPlaying && ind>=commands.length-1) setInd(0)
        else if(isPlaying) setInd(prev => ++prev)
    }, [isPlaying])

    useEffect(() => {
        if (graph.length !== numElements) return;
        setCommands([]);
        setInd(-1)
        let hold = [];
        for (let i = 0; i < graph.length; i++) {
            hold.push(graph[i].slice(0));
        }
        switch(path) {
            case '/DepthFirstSearch':
                depthFirstSearch(hold, startEnd[0], startEnd[1]);
                break;
            case '/BreadthFirst':
                breadthFirstSearch(hold, startEnd[0], startEnd[1])
                break;
            case '/DijkstrasAlgorithm':
                dijkstrasAlgorithm(hold, startEnd[0], startEnd[1])
                break;
            default:
                return
        }
    }, [startEnd]);

    useEffect(() => {
        if (ind <= -1 || !isPlaying) return;
        if(ind>=commands.length-1) {
            setIsPlaying(false)
            return
        }
        if(osc!==undefined) {
            let freq = freqs[Math.floor(Math.random()*freqs.length)]
            osc.set({
                frequency: freq,
            });
        }
        setTimeout(() => {
            setInd((prev) => ++prev);
        }, 80);
    }, [ind]);

    useEffect(() => {
        if (startTime === null || updateTime === null) {
            setStartTime(new Date());
            setUpdateTime(new Date());
            return;
        }
        setTimeout(() => {
            setUpdateTime(new Date());
        }, 10);
        let curr = new Date();
        let diff = (curr.getTime() - startTime.getTime()) / 600;
        let scale = 2;
        let angle = 0;
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d');
        if (context === null || canvasRef === null || canvas === null) return;
        if (canvHeight === 0) setCanvHeight(canvas.height);
        if (canvWidth === 0) setCanvWidth(canvas.width);
        context?.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < graph.length; i++) {
            for (let j = 0; j < graph[i].slice(2).length; j++) {
                if (graph[i][j + 2] < i) continue;
                context.beginPath();
                context.moveTo(
                    graph[i][0] + scale * Math.cos(diff + (i * 2) / Math.PI),
                    graph[i][1] + scale * Math.sin(diff + i / Math.PI),
                );
                context.lineTo(
                    graph[graph[i][j + 2]][0] + scale * Math.cos(diff + (i * 2) / Math.PI),
                    graph[graph[i][j + 2]][1] + scale * Math.sin(diff + i / Math.PI),
                );
                context.lineWidth = 2;
                if (ind >= 0 && ind < commands.length) {
                    if(path==='/DepthFirstSearch') context.strokeStyle = (commands[ind].includes(i) && commands[ind].includes(graph[i][j+2]) && Math.abs(commands[ind].indexOf(i)-commands[ind].indexOf(graph[i][j+2]))===1) ? '#FF0000' : '#6b7280';
                    else if (path==='/BreadthFirst') context.strokeStyle = (commands[ind].includes(i) && commands[ind].includes(graph[i][j+2])) ? '#FF0000' : '#6b7280';
                }
                else context.strokeStyle = '#6b7280';
                context.stroke();
                if (!showDistance) continue;
                context.font = '24px Arial';
                context.fillStyle = '#000000';
                angle = Math.atan(
                    (graph[i][1] - graph[graph[i][j + 2]][1]) / (graph[i][0] - graph[graph[i][j + 2]][0]),
                );
                if (
                    (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) ||
                    (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4)
                ) {
                    context.fillText(
                        '' + Math.floor(getHypot(graph[i], graph[graph[i][j + 2]]) / distanceScale),
                        calcMidPoint(graph[i][0], graph[graph[i][j + 2]][0]) +
                            scale * Math.sin(diff + i / Math.PI) +
                            15,
                        calcMidPoint(graph[i][1], graph[graph[i][j + 2]][1]) + scale * Math.sin(diff + i / Math.PI),
                    );
                } else {
                    context.fillText(
                        '' + Math.floor(getHypot(graph[i], graph[graph[i][j + 2]]) / distanceScale),
                        calcMidPoint(graph[i][0], graph[graph[i][j + 2]][0]) + scale * Math.sin(diff + i / Math.PI),
                        calcMidPoint(graph[i][1], graph[graph[i][j + 2]][1]) +
                            35 +
                            scale * Math.sin(diff + i / Math.PI),
                    );
                }
            }
            context.beginPath();
            context.arc(
                graph[i][0] + scale * Math.cos(diff + (i * 2) / Math.PI),
                graph[i][1] + scale * Math.sin(diff + i / Math.PI),
                radius,
                0,
                2 * Math.PI,
            );
            if (ind >= 0 && ind < commands.length)
                context.fillStyle = commands[ind].includes(i)
                    ? '#FF0000'
                    : startEnd[1] === i
                    ? '#3b82f6'
                    : startEnd[0] === i
                    ? '#10b981'
                    : '#6b7280';
            else context.fillStyle = startEnd[1] === i ? '#3b82f6' : startEnd[0] === i ? '#10b981' : '#6b7280';
            context.strokeStyle = '#FFFFFF';
            context.stroke();
            context.fill();
            if (startEnd[1] === i) {
                context.font = '24px Arial';
                context.fillStyle = '#3b82f6';
                context.fillText(
                    'End',
                    graph[i][0] + scale * Math.cos(diff + (i * 2) / Math.PI) - 25,
                    graph[i][1] + scale * Math.sin(diff + i / Math.PI) - 17,
                );
            } else if (startEnd[0] === i) {
                context.font = '24px Arial';
                context.fillStyle = '#10b981';
                context.fillText(
                    'Start',
                    graph[i][0] + scale * Math.cos(diff + (i * 2) / Math.PI) - 25,
                    graph[i][1] + scale * Math.sin(diff + i / Math.PI) - 17,
                );
            }
        }
    }, [updateTime]);

    const startGrab = (e: any) => {
        setIsPlaying(false)
        if (canvasRef === null) return;
        var rect = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        let xPos = e.clientX - rect.left;
        let yPos = e.clientY - rect.top;
        for (let i = 0; i < graph.length; i++) {
            if (getHypot([xPos, yPos], graph[i]) < 15) setGrabbing(i);
        }
    };

    const handleGrab = (e: any) => {
        if (grabbing === -1) return;
        if (canvasRef === null) return;
        var rect = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        let xPos = e.clientX - rect.left;
        let yPos = e.clientY - rect.top;
        graph[grabbing][0] = xPos;
        graph[grabbing][1] = yPos;
    };

    const stopGrab = () => {
        setGrabbing(-1);
        setIsPlaying(false);
        setInd(-1)
    }

    useEffect(() => {
        if (canvHeight < 50) return;
        let holdGraph = makeGraph();
        setGraph(holdGraph);
    }, [canvHeight, numElements, path]);

    const resetGraph = () => {
        setInd(-1)
        let holdGraph = makeGraph();
        setGraph(holdGraph);
    };

    const rightClick = (e: any) => {
        e.preventDefault();
        if (canvasRef === null) return;
        var rect = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        let xPos = e.clientX - rect.left;
        let yPos = e.clientY - rect.top;
        for (let i = 0; i < graph.length; i++) {
            if (getHypot([xPos, yPos], graph[i]) < 15 && !startEnd.includes(i)) {
                let sE = startEnd;
                if (change === 0) {
                    sE[0] = i;
                } else {
                    sE[1] = i;
                }
                setStartEnd(sE.slice(0));
            }
        }
    };

    return (
        <div className="w-full flex-1 bg-gray-200 items-center flex flex-col pt-12 ">
            <div ref={parent} className="container flex flex-col bg-white p-5 rounded-md px-1">
                <div className="flex w-full justify-between items-center mb-6 p-5">
                    <h1 className="text-4xl font-medium text-left">{props.title}</h1>
                    {isPlaying && 
                        <button onClick={() => isPlaying ? setIsPlaying(false) : ''} className={"bg-green-500 hover:bg-green-600 focus:outline-none mr-7 animation-fast text-white px-3 py-2 text-lg rounded "}>
                            
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
                        {!isPlaying && 
                        <button onClick={() => setIsPlaying(true) } className={"bg-green-500 hover:bg-green-600 focus:outline-none mr-7 animation-fast text-white px-3 py-2 text-lg rounded "}>
                            <svg className="h-7 w-7 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                                <g>
                                    <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275   c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                                </g>
                            </svg>
                        </button>
                        }

                    <button
                        onClick={resetGraph}
                        className={
                            'bg-gray-500 hover:bg-gray-600 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded '
                        }
                    >
                        <svg
                            className="h-7 w-7 fill-current"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            width="438.529px"
                            height="438.528px"
                            viewBox="0 0 438.529 438.528"
                        >
                            <g>
                                <g>
                                    <path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835    c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536    C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814    c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106    c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397    c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906    c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z" />
                                    <path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4    c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273    c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847    c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907    c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833    c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534    c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427    C426.874,256.72,424.731,255.813,422.253,255.813z" />
                                </g>
                            </g>
                        </svg>
                    </button>
                    <div className="flex items-center">
                        <div className="flex flex-col items-start">
                            <h1 className="mr-4 text-lg mb-0">Edit:</h1>
                            <p className="mr-4 text-xs mb-0">
                                Right click node <br /> to change
                            </p>
                        </div>
                        <button
                            onClick={() => setChange(0)}
                            className={
                                'bg-green-500 mr-4 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded ' +
                                (change === 1 ? 'opacity-50 hover:opacity-100' : 'hover:bg-green-600')
                            }
                        >
                            Start
                        </button>
                        <button
                            onClick={() => setChange(1)}
                            className={
                                'bg-blue-500 mr-4 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded ' +
                                (change === 0 ? 'opacity-50 hover:opacity-100' : 'hover:bg-blue-600')
                            }
                        >
                            End
                        </button>
                        <button
                            onClick={() => setShowDistance((prev) => !prev)}
                            className={
                                'bg-gray-500 ml-4 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded ' +
                                (!showDistance ? 'opacity-50 hover:opacity-100' : 'hover:bg-gray-600')
                            }
                        >
                            Distances
                        </button>
                    </div>
                    <div className="flex items-center">
                        {/* {!playing && 
                        <button onClick={() => playing ? '' : commands.length===0 ? algorithmHandler() : !playing ? setPlaying(true) : ''} className={"bg-green-500 hover:bg-green-600 focus:outline-none mr-7 animation-fast text-white px-3 py-2 text-lg rounded "}>
                            <svg className="h-7 w-7 fill-current" version="1.1" id="Capa_1" x="0px" y="0px" width="163.861px" height="163.861px" viewBox="0 0 163.861 163.861">
                                <g>
                                    <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275   c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                                </g>
                            </svg>
                        </button>
                        }   */}
                        <DropSelect
                            label="Elements"
                            options={'graph'}
                            value={numElements}
                            onChange={(event: number) => setNumElements(event)}
                        />
                    </div>
                </div>
                <canvas
                    onMouseDown={startGrab}
                    onContextMenu={rightClick}
                    onMouseMove={handleGrab}
                    onMouseUp={stopGrab}
                    className="mx-auto bg-white"
                    width="1240"
                    height="480"
                    ref={canvasRef}
                    id="mycanvas"
                ></canvas>
            </div>
        </div>
    );
}
