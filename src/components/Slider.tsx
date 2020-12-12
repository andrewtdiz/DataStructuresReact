import React from 'react'

export default function Slider() {
    const [sliding, setSliding] = React.useState(false)

    

    const handleStartSliding = (e:any) => {
        setSliding(true)

    }

    const handleMouseMove = (e:any) => {
        if(sliding) {
            console.log(e.clientX)
        }
    }

    return (
        <div className="w-full  py-12 flex justify-center" onMouseMove={handleMouseMove} onMouseLeave={() => setSliding(false)} >
            <div className="flex items-center h-32 w-64" onMouseDown={() => setSliding(true)} onMouseUp={() => setSliding(false)} >
                <div className="w-6 h-6 hover:shadow-lg shadow rounded-full bg-green-500 hover:bg-green-600 cursor-pointer select-none absolute">

                </div>
                <div className="h-1 w-full bg-gray-300">

                </div>
            </div>
        </div>
    )
}
