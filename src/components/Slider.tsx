import React, {useRef} from 'react'

export default function Slider(props:any) {
    const [sliding, setSliding] = React.useState(false)
    const [xSlide, setXSlide] = React.useState(0)

    let parent = useRef<HTMLDivElement | null>(null)
    let slider = useRef<HTMLDivElement | null>(null)

    const handleStartSliding = (e:any) => {
        setSliding(true)
    }

    const handleMouseMove = (e:any) => {
        if(sliding) {
            let offset:number | undefined;
            let newVal = 0
            if(parent.current!==null) {
                offset = e.clientX - parent.current.offsetLeft
            }
            if(offset!==undefined && slider.current!==null && parent.current!==null) {
                newVal = (offset)/parent.current.offsetWidth
                if(newVal>1) newVal = 100
                else if(newVal<0) newVal = 0
                else {
                    props.onChange(1-newVal)
                    setXSlide(newVal)
                }
            }
        }
    }

    return (
        <div className="px-6 flex items-center justify-center" onMouseMove={handleMouseMove} onMouseUp={() => setSliding(false)} onMouseLeave={() => setSliding(false)}  >
            <div className="mr-4">
                <h1>{props.label}:</h1>
            </div>
            <div ref={parent} className="flex items-center w-64 relative" >
                <div ref={slider} onMouseDown={handleStartSliding} className="w-6 h-6 hover:shadow-lg shadow rounded-full bg-green-500 hover:bg-green-600 cursor-pointer select-none absolute" style={{left: xSlide*((parent.current!==null&&slider.current!==null) ? parent.current.clientWidth-slider.current.clientWidth : 0)}}>

                </div>
                <div className="h-1 w-full bg-gray-300">

                </div>
                
            </div>
        </div>
    )
}
