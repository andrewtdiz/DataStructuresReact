import React, { useEffect, useLayoutEffect, useRef } from 'react'
import {useLocation} from 'react-router-dom';
import Slider from '../Slider';
import DropSelect from '../DropSelect'
import * as Tone from 'tone'

export default function Sorting(props:any) {
    const [elements, setElements] = React.useState<Array<number>>([])
    const [coloredElements, setColoredElements] = React.useState<Array<number>>([])
    // const [canvas, setCanvas] = React.useState<HTMLElement | null>(null)
    const [nOfElem, setNOfElem] = React.useState<number>(100)
    const [DELAY, setDELAY] = React.useState<number>(40);
    const [loc, setLoc] = React.useState<number>(0);
    const [commands, setCommands] = React.useState<Array<Array<number>>>([])
    const [playing, setPlaying] = React.useState<boolean>(false)
    const [osc, setOsc] = React.useState<Tone.Oscillator>();
    let path = useLocation().pathname

    const resetElements = () => {
        let arr:Array<number>
        arr = []
        for(let i=0;i<nOfElem;i++) {
            arr.push(Math.floor(Math.random() *nOfElem))
        }
        setElements(prev => arr.slice(0))
        setLoc(prev => 0)
        setPlaying(false)
        setTimeout(() => {
            setColoredElements(prev => [-1,-1])
            setCommands(prev => [])
        }, 100)
    }

    const skipHandler = () => {
        setPlaying(false)
        for(let i=loc; i<commands.length;i++) {
            commandHandler(i)
        }
        setCommands(prev => [])
        setTimeout(() => {
            setColoredElements([-1,-1])
        }, 100)
    }

    const algorithmHandler = () => {
        if(playing) return
        switch(path) {
            case "/Insertionsort":
                insertionSort();
                break;
            case "/Bubblesort":
                bubbleSort();
                break;
            case "/Quicksort":
                quickSort();
                break;
            case "/Mergesort":
                mergeSort();
                break;
            case "/Selectionsort":
                selectionSort();
                break;
            case "/Cocktailsort":
                cocktailSort();
                break;
            default:
                return
        }
        setPlaying(true)

    }

    let insertionSort = () => {
        let arr = elements.slice(0);
        let j = 0;
        let hold;
        for(let i=1; i<arr.length;i++) {
            j = i-1
            while(j>=0 && arr[j]>arr[j+1]) {
                hold = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = hold
                markColoredElems(j, j+1)
                swapElems(j, j+1)
                j--
            }
        }
    }

    useEffect(() => {
        if(commands.length===0) return 
        setTimeout(() => {
            commandHandler(loc)
        }, DELAY);
        if(osc?.volume.value===-15) return
        let holdOsc = osc
        if(holdOsc===undefined) return
        holdOsc.volume.value = -15;
        setOsc(holdOsc)
    }, [loc])

    useEffect(() => {
        setOsc(new Tone.Oscillator(440, "sine").toDestination())
    }, [])

    useEffect(() => {
        if(playing) {
            stepLoc(1)
            if(osc===undefined) return
            osc.start()
        } else {
            if(osc===null || osc===undefined) return
            osc.stop()
        }
    }, [playing])
    
    let freqs = [
        'C4','D4','E4','F4','G4','A4','B4',
        'C5','D5','E5','F5','G5','A5','B5',
    ]

    let commandHandler = (i:number) => {
        let freq = undefined
        if(i>=commands.length) {
            setPlaying(false)
            setColoredElements([-1,-1])
            return
        }
        let [method, first, second] = commands[i]
        if(method===0) {
            setColoredElements(prevState => [first, second])
        } else if(method===1) {
            setElements(prevState => {
                if(osc!==undefined) {
                    freq = freqs[Math.abs(Math.floor((((prevState[first]-prevState[second])/prevState.length)*freqs.length)))]
                    osc.set({
                        frequency: freq,
                    });
                }
                let hold = prevState[first]
                prevState[first] = prevState[second]
                prevState[second] = hold
                return prevState
            })
        } else {
            setElements(prevState => {
                if(osc!==undefined) {
                    osc.set({
                        frequency: freqs[Math.abs(Math.floor(((second/prevState.length)*freqs.length)))],
                    });
                }
                prevState[first] = second
                return prevState
            })
        }
        if(playing) stepLoc(1)
    }

    let bubbleSort = () => {
        let hold;
        let count = 0
        let arr = elements.slice(0)
        for(let i=arr.length-1;i>=1;i--) {
            count = 0
            for(let j=0;j<i;j++) {
                count++
                setCommands(oldState => [...oldState, [0,j,j+1]])
                if(arr[j]>arr[j+1]) {
                    hold = arr[j]
                    arr[j] = arr[j+1]
                    arr[j+1] = hold
                    setCommands(oldstate => [...oldstate, [1,j,j+1]])
                }
            }
            if(count===0) return
        }
    }

    let quickSortPartition = (arr:Array<number>, start:number, end:number) => {
        let hold;
        let x = arr[end]
        let i = start-1
        for(let j=start; j<end; j++) {
            markColoredElems(j, j+1)
            if(arr[j] <= x) {
                i++
                hold = arr[i]
                arr[i] = arr[j]
                arr[j] = hold
                swapElems(i,j)
            }
        }
        hold = arr[i+1]
        arr[i+1] = arr[end]
        arr[end] = hold
        swapElems(i+1,end)
        return i+1
    }

    let quickSortRecurse = (elem:Array<number>, start = 0, end = elem.length-1) => {
        if(end<=start) return 
        let pivot;
        pivot = quickSortPartition(elem, start, end)
        quickSortRecurse(elem, start, pivot-1)
        quickSortRecurse(elem, pivot+1, end)
        return 
    }

    let quickSort = () => {
        quickSortRecurse(elements.slice(0))
    }

    let insertElement = (i:number, j:number) => {
        setCommands(oldState => [...oldState, [2, i, j]])
    }

    let merge = (arr:Array<number>, start:number, middle:number, end:number) => {
        let left = []
        let right = []
        let i =0
        let j =0
        let hold;
        for(let i=start;i<=middle;i++) {
            left.push(arr[i])
        }
        for(let i=middle+1;i<=end;i++) {
            right.push(arr[i])
        }
        while(left.length!==0 && right.length!==0) {
            markColoredElems(start+i, middle+1+j)
            if(left[0] < right[0]) {
                hold = left.splice(0,1)[0]
                arr[start+i+j] = hold
                insertElement(start+i+j, hold)
                i++
            } else {
                hold = right.splice(0,1)[0]
                arr[start+i+j] = hold
                insertElement(start+i+j, hold)
                j++
            }
        }
        while(left.length!==0) {
            hold = left.splice(0,1)[0]
            arr[start+i+j] = hold
            insertElement(start+i+j, hold)
            i++
        }
        while(right.length!==0) {
            hold = right.splice(0,1)[0]
            arr[start+i+j] = hold
            insertElement(start+i+j, hold)
            j++
        }
    }
    
    let mergeSortRecurse = (arr:Array<number>,start=0,end=elements.length-1) => {
        if(start>=end) return 
        let middle = Math.floor((end+start)/2);
        mergeSortRecurse(arr, start, middle)
        mergeSortRecurse(arr, middle+1, end)
        merge(arr,start, middle, end)
    }

    let mergeSort = () => {
        mergeSortRecurse(elements.slice(0))
    }

    let markColoredElems = (i:number,j:number) => {
        setCommands(oldState => [...oldState, [0, i, j]])
    }

    let swapElems = (i:number,j:number) => {
        setCommands(oldState => [...oldState, [1, i, j]])
    }

    let selectionSort = () => {
        let least;
        let leastInd = 0;
        let arr = elements.slice(0)
        let hold;
        for(let i=0; i<arr.length;i++) {
            least = Infinity
            for(let j=i;j<arr.length;j++) {
                if(arr[j]<least) {
                    least = arr[j]
                    leastInd = j
                }
                markColoredElems(leastInd,j)

            }
            hold = arr[i]
            arr[i] = arr[leastInd]
            arr[leastInd] = hold
            swapElems(i, leastInd)
        }
    }

    let cocktailSort = () => {
        let arr = elements.slice(0)
        let hold;
        let passes=0
        let count=0
        let i=0
        let j=arr.length-1
        while (i<=j) {
            count = 0
            if(passes%2===0) {
                for(let k=i;k<j;k++) {
                    markColoredElems(k, j)
                    if(arr[k]>arr[k+1]) {
                        count++
                        hold = arr[k]
                        arr[k] = arr[k+1]
                        arr[k+1] = hold
                        swapElems(k,k+1)
                    }
                }
                if(count===0) return
                j--
            } else {
                for(let k=j;k>i;k--) {
                    markColoredElems(k,i)
                    if(arr[k]<arr[k-1]) {
                        count++
                        hold = arr[k]
                        arr[k] = arr[k-1]
                        arr[k-1] = hold
                        swapElems(k,k-1)
                    }
                }
                if(count===0) return
                i++
            }
            passes++
        }
    }

    // let maxHeap = () => {
    //     let arr = elements
    //     let hold;
    //     let j
    //     for(let i=1; i<arr.length; i++) {
    //         j=i
    //         while(j!==0) {
    //             console.log('comparing', j, Math.floor(j/2))
    //             if(arr[j]>arr[Math.floor(j/2)]) {
    //                 hold = arr[j]
    //                 arr[j] = arr[Math.floor(j/2)]
    //                 arr[Math.floor(j/2)] = hold
    //                 console.log(arr)
    //             }
    //             j = Math.floor(j/2)
    //         }
    //     }
    //     setElements(arr.slice(0))
    // }

    // let heapify = (i=0) => {
    //     let a = elements
    //     let n = a.length-1
    //     let left = 2*i;              //Left child index
    //     let right = 2*i+1;           //Right child index
    //     let maximum;
    //     let hold;
    //     if(i===0) {
    //         left = 1
    //         right = 2
    //     }
    //     if(right<n){                 //Checks if right child exist
    //         if(a[left]>=a[right]){    //Compares children to find maximum
    //             maximum = left;
    //         }
    //         else{
    //             maximum = right;
    //         }
    //     }
    //     else if(left<n){                //Checks if left child exists
    //         maximum = left;
    //     }
    //     else return;                    //In case of no children return
    //     if(a[i]<a[maximum]){            //Checks if the largest child is greater than parent
    //         hold = a[i]
    //         a[i] = a[maximum]
    //         a[maximum] = hold          //If it is then swap both
    //         setElements(a.slice(0))
    //         heapify(maximum);       //max-heapify again
    //     }
    //     return;
    // }

    // let heapSort = () => {
    //     maxHeap()
    //     heapify()
    // }
    
    useEffect(()=> {
        resetElements()
    }, [path, nOfElem])

    const stepLoc = (dir:number) => {
        setLoc(prevLoc => prevLoc+dir)
    }

    let MAXDELAY = 40

    let delayChange = (newVal:number) => {
        setDELAY(Math.floor((newVal)*(MAXDELAY-1))+1)
    }

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useLayoutEffect(() => {
        if(canvasRef===null) return 
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d")
        if(context===null) return
        if(canvas===null) return
        context?.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0;i<elements.length;i++) {
            context.fillStyle = (coloredElements.includes(i) ? "#FF0000" : "#6b7280")
            context?.fillRect((i/nOfElem)*canvas.width, canvas.height, -(1/elements.length)*canvas.width, -(elements[i]/elements.length)*(canvas.height));
        }
    })

    

    return (
        <div className="flex-1 w-full bg-gray-200 items-center flex flex-col h-full py-12 ">
            <div className="container flex flex-col bg-white shadow-md rounded">
                <div className="flex w-full justify-between items-center mb-6 p-5">
                    <h1 className="text-4xl font-medium text-left">{props.title}</h1>
                    <div className="flex items-center">
                        {playing && 
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
                        }  
                        <button onClick={() => playing ? skipHandler() : ''} className={"bg-green-500 focus:outline-none animation-fast text-white px-3 mr-7 py-2 text-lg rounded " + (!playing ? "bg-opacity-25 cursor-none" : "hover:bg-green-600")}>
                        <svg className="h-7 w-7 fill-current" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 493.796 493.796">
                            <g>
                                <g>
                                    <path d="M355.938,200.956L81.414,12.128c-11.28-7.776-23.012-11.88-33.056-11.88c-22.052,0-36.672,18.496-36.672,48.26v397.036    c0,14.54,4.228,26.688,10.496,35.144c6.364,8.572,16.32,13.108,27.076,13.108c10.04,0,21.308-4.112,32.584-11.876l274.276-188.828    c17.632-12.152,27.3-28.508,27.296-46.076C383.414,229.456,373.594,213.1,355.938,200.956z"/>
                                </g>
                            </g>
                            <g>
                                <g>
                                    <g>
                                        <path d="M456.446,493.672l-0.293-0.004c-0.048,0-0.095,0.004-0.143,0.004H456.446z"/>
                                        <path d="M455.638,0L444.29,0.032c-14.86,0-27.724,12.112-27.724,26.992v439.368c0,14.896,12.652,27.124,27.532,27.124     l12.055,0.152c14.805-0.079,25.957-12.412,25.957-27.252V26.996C482.11,12.116,470.51,0,455.638,0z"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        </button>
                        <button onClick={() => !playing ? resetElements() : ''} className={"bg-gray-500 focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded "  + (!playing ? "hover:bg-gray-600" : "bg-opacity-25 cursor-none")}>
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
                    <DropSelect label="Elements" value={nOfElem} onChange={(event:number) => setNOfElem(event)}/>
                    <Slider className="mx-auto" label="Speed" value={loc} onChange={(event:number) => delayChange(event)}/>
                </div>
                <div className="w-full flex-1 flex items-end rounded-md h-64 px-1">
                    <canvas className="mx-auto" width="1240" height="260" ref={canvasRef} id="mycanvas"></canvas>
                </div>
            </div>
        </div>
    )
}
