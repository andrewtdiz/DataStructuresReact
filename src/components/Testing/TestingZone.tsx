import React from 'react'

export default function TestingZone(props:any) {
    const [loc, setLoc] = React.useState<Array<number>>([]);
    const [testing, setTesting] = React.useState<boolean>(false);

    const createRandArray = (i:number) => {
        let outArr = []
        for(let j=0;j<i;j++){
            outArr.push(Math.floor(Math.random()*(i-1))+1)
        }
        return outArr
    }

    const timeSort = (arr:Array<number>) => {
        let hold:number;
        let startDate = new Date();
        arr.sort()
        let endDate   = new Date();
        hold = (endDate.getTime() - startDate.getTime()) / 1000
        console.log(hold);
        setLoc(prev => [...prev, hold])
        setTesting(false)
    }

    const runArrays = () => {
        setTesting(true)
        let arr: Array<number>
        for(let i=0;i<100;i++) {
            arr = createRandArray(1000000)
            setTimeout((arr) => {
                timeSort(arr)
            }, 5*i, arr);
        }
        
    }

    return (
        <div className="bg-white rounded p-5 items-start w-1/5 shadow-sm">
            <div className="flex">
                <img className="w-16 object-scale-down h-16" src={props.img} alt=""/>
            </div>
            <h1 className="font-bold text-lg">{props.type} Speed Test</h1>            
            <p>Run a speed comparison by sorting 1,000 arrays of 10,000 elements in {props.type}.</p>
            <p className="w-full text-2xl text-center" style={{marginBottom: 0}}> <b>0/1,000</b></p>
            <p className="w-full text-center -mt-1">arrays</p>
            <div className="w-full flex justify-center">
                <button onClick={() => runArrays()} className="bg-green-500 hover:bg-green-600 mx-auto focus:outline-none animation-fast text-white px-3 py-2 text-lg rounded">{!testing ? 'Run' : <div className="loader"></div>}</button>
            </div>
        </div>
    )
}
