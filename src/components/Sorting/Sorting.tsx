import React, { useEffect, useRef } from 'react'
import {useLocation} from 'react-router-dom';
import Slider from '../Slider';


export default function Sorting() {
    const [elements, setElements] = React.useState<Array<number>>([])
    const [coloredElements, setColoredElements] = React.useState<Array<number>>([])
    // const [canvas, setCanvas] = React.useState<HTMLElement | null>(null)
    const [nOfElem, setNOfElem] = React.useState<number>(10)
    const [DELAY, setDELAY] = React.useState<number>(500);
    const [loc, setLoc] = React.useState<number>(0);
    const [commands, setCommands] = React.useState<Array<Array<number>>>([])
    const [playing, setPlaying] = React.useState<boolean>(false)
    let path = useLocation().pathname


    const resetElements = () => {
        let arr = []
        for(let i=0;i<nOfElem;i++) {
            arr.push(Math.floor(Math.random() *nOfElem))
        }
        setElements(arr)
        setCommands([])
    }

    const algorithmHandler = (dir:number) => {
        switch(path) {
            case "/Insertionsort":
                insertionSort();
                break;
            case "/Bubblesort":
                bubbleSort();
                setPlaying(true)
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
    }

    let insertionSort = () => {
        let arr = elements;
        let j = 0;
        let hold;
        let t = 0;
        for(let i=1; i<elements.length;i++) {
            j = i-1
            while(j>=0 && arr[j]>arr[j+1]) {
                hold = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = hold
                j--
                setTimeout((j) => {
                    setColoredElements([j,j+1])
                }, t, j)
                t+=DELAY
                setTimeout((j, arr) => {
                    setElements(arr)
                }, t, j, arr.slice(0))
                t+=DELAY
            }
        }
        setColoredElements([-1,-1])
    }

    useEffect(() => {
        if(commands.length===0) return 
        setTimeout(() => {
            commandHandler(loc)
        }, DELAY);
    }, [loc])

    useEffect(() => {
        if(playing) setLoc(prev => prev+1)
    }, [playing])

    
    let commandHandler = (i:number) => {
        let method = commands[i][0]
        let first = commands[i][1]
        let second = commands[i][2]
        console.log(first, second, method)
        if(method===0) {
            setColoredElements([first, second])
        } else {
            let arr = elements
            let hold = arr[first]
            arr[first] = arr[second]
            arr[second] = hold
            console.log(arr)
            setElements(arr.slice(0))
        }
        if(playing) setLoc(prev=> prev+1)
    }

    let bubbleSort = () => {
        let arr = elements
        for(let i=arr.length-1;i>=1;i--) {
            for(let j=0;j<i;j++) {
                setCommands(oldState => [...oldState, [0,j,j+1]])
                if(arr[j]>arr[j+1]) {
                    setCommands(oldstate => [...oldstate, [1,j,j+1]])
                }
            }
        }
    }

    let bubbleSort_iterative = (i=0, j=elements.length-1,swapcount=0) => {
        let hold;
        let arr = elements
        setColoredElements([i,i+1])
        if(arr[i]>arr[i+1]) {
            ++swapcount
            hold = arr[i]
            arr[i] = arr[i+1]
            arr[i+1] = hold
            setElements(arr) 
        }
        if (j === 1){
            return
        }
        if (i < j){
            console.log('DELAY on call ', DELAY)
            setTimeout(() => {
                console.log('DELAY in the setTimeout', DELAY)
                bubbleSort_iterative(i+1,j,swapcount)
            }, DELAY);
        }else {
            if (swapcount === 0) return
            swapcount = 0;
            setTimeout(() => {
                bubbleSort_iterative(0,j-1,swapcount)
            }, DELAY);
        }
    }

    let timeDelay = 0;

    let quickSortPartition = (arr:Array<number>, start:number, end:number) => {
        let hold;
        let x = arr[end]
        let i = start-1
        for(let j=start; j<end; j++) {
            setTimeout((j) => {
                setColoredElements([j,j+1])
            }, timeDelay, j)
            timeDelay += DELAY
            if(arr[j] <= x) {
                i++
                hold = arr[i]
                arr[i] = arr[j]
                arr[j] = hold
                setTimeout((arr) => {
                    setElements(arr)
                }, timeDelay, arr.slice(0))
                timeDelay += DELAY
            }
        }
        hold = arr[i+1]
        arr[i+1] = arr[end]
        arr[end] = hold
        setTimeout((arr) => {
            setElements(arr)
        }, timeDelay, arr.slice(0))
        timeDelay += DELAY
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
        quickSortRecurse(elements)
    }

    let merge = (arr:Array<number>, start:number, middle:number, end:number) => {
        let left = []
        let right = []
        let i =0
        let j =0
        for(let i=start;i<=middle;i++) {
            left.push(arr[i])
        }
        for(let i=middle+1;i<=end;i++) {
            right.push(arr[i])
        }
        while(left.length!==0 && right.length!==0) {
            setTimeout((j, i) => {
                setColoredElements([j,i])
            }, timeDelay, start+i, middle+1+j)
            timeDelay += DELAY
            if(left[0] < right[0]) {
                arr[start+i+j] = left.splice(0,1)[0]
                setTimeout((arr) => {
                    setElements(arr)
                }, timeDelay, arr.slice(0))
                timeDelay += DELAY
                i++
            } else {
                arr[start+i+j] = right.splice(0,1)[0]
                setTimeout((arr) => {
                    setElements(arr)
                }, timeDelay, arr.slice(0))
                timeDelay += DELAY
                j++
            }
        }
        while(left.length!==0) {
            arr[start+i+j] = left.splice(0,1)[0]
            setTimeout((arr) => {
                setElements(arr)
            }, timeDelay, arr.slice(0))
            timeDelay += DELAY
            i++
        }
        while(right.length!==0) {
            arr[start+i+j] = right.splice(0,1)[0]
            setTimeout((arr) => {
                setElements(arr)
            }, timeDelay, arr.slice(0))
            timeDelay += DELAY
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
        mergeSortRecurse(elements)
    }

    let selectionSort = () => {
        let least;
        let leastInd = 0;
        let arr = elements
        let hold;
        for(let i=0; i<arr.length;i++) {
            least = Infinity
            for(let j=i;j<arr.length;j++) {
                setTimeout((i, j) => {
                    setColoredElements([i, j])
                }, timeDelay, i, j)
                timeDelay += DELAY
                if(arr[j]<least) {
                    least = arr[j]
                    leastInd = j
                }
            }
            hold = arr[i]
            arr[i] = arr[leastInd]
            arr[leastInd] = hold
            setTimeout((arr) => {
                setElements(arr)
            }, timeDelay, arr.slice(0))
            timeDelay += DELAY
        }
    }

    let cocktailSort = () => {
        let leastGreatest;
        let leastGreatestInd = 0;
        let arr = elements
        let hold;
        let passes=0
        let i=0
        let j=arr.length-1
        while (i!==j) {
            leastGreatest = passes%2===0 ? Infinity : -1*Infinity
            if(passes%2===0) {
                for(let k=i;k<=j;k++) {
                    setTimeout((i, k) => {
                        setColoredElements([i, k])
                    }, timeDelay, i, k)
                    timeDelay += DELAY
                    if(arr[k]<leastGreatest) {
                        leastGreatest = arr[k]
                        leastGreatestInd =k
                    }
                }
            } else {
                for(let k=j;k>=i;k--) {
                    setTimeout((j, k) => {
                        setColoredElements([j, k])
                    }, timeDelay, j, k)
                    timeDelay += DELAY
                    if(arr[k]>leastGreatest) {
                        leastGreatest = arr[k]
                        leastGreatestInd = k
                    }
                }
            }
            if(passes%2===0) {
                hold = arr[i]
                arr[i] = arr[leastGreatestInd]
                arr[leastGreatestInd] = hold
                i++
            } else {
                hold = arr[j]
                arr[j] = arr[leastGreatestInd]
                arr[leastGreatestInd] = hold
                j--
            }
            setTimeout((arr) => {
                console.log('here iam')
                setElements(arr)
            }, timeDelay, arr.slice(0))
            timeDelay += DELAY
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
        setColoredElements([-1,-1])
    }, [path])

    useEffect(() => {
        const setUpArrays = () => {
            let arr = []
            for(let i=0;i<nOfElem;i++) {
                arr.push(Math.floor(Math.random() *nOfElem))
            }
            setElements(arr)
        }
        setUpArrays()
    }, [nOfElem])

    return (
        <div className="flex-1 w-full h-full bg-gray-200 items-center flex flex-col pt-12 ">
            <div className="container flex items-end bg-white rounded-md h-64 shadow">
                {elements.map((val,ind) => (
                    <div key={ind} className={coloredElements.includes(ind) ? 'bg-red-500' : 'bg-gray-500'} style={{width: '1%', marginRight: '1px', height: 100*val/elements.length+'%'}}></div>
                ))}
                {/* <canvas className="mx-auto" width="1240" height="260" ref={inputEl} id="mycanvas"></canvas> */}
            </div>
            <input type="text" value={DELAY} onChange={e => setDELAY(+e.target.value)}/>
            <button onClick={() => algorithmHandler(1)} className="bg-green-500 hover:bg-green-600 animation-fast text-white px-3 py-2 text-lg mt-3 rounded">Go!</button>
            <button onClick={() => setPlaying(false)} className="bg-green-500 hover:bg-green-600 animation-fast text-white px-3 py-2 text-lg mt-3 rounded">Pause</button>
            <div className="fle">
                <button onClick={() => setLoc(prev=>prev+1)} className="bg-green-500 hover:bg-green-600 animation-fast text-white px-3 py-2 text-lg mt-3 rounded">Right</button>
                <button onClick={() => setLoc(prev=>prev-1)} className="bg-green-500 hover:bg-green-600 animation-fast text-white px-3 py-2 text-lg mt-3 rounded">Left</button>
            </div>
            <button onClick={() => resetElements()} className="bg-gray-500 hover:bg-gray-600 animation-fast text-white px-3 py-2 text-lg mt-3 rounded">Reset</button>
            <Slider />
        </div>
    )
}
