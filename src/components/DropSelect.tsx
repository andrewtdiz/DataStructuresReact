import React from 'react'

export default function DropSelect(props:any) {
    let [open, setOpen] = React.useState<boolean>(false)
    let options = props.options!=="graph" ? [20,50,100,250] : [10, 50, 100, 150]

    return (
        <div className="flex items-center">
            <div className="mr-4">
                <h1>{props.label}:</h1>
            </div>
            <div onClick={() => setOpen(!open)} className={"relative px-3 py-2 cursor-pointer border hover:border-gray-400 border-gray-300 " + (props.options==="graph" ? "mr-8" : "")}>
                {props.value}
                {open &&
                    <div className="absolute bg-white border border-gray-200 rounded flex flex-col left-0 items-stretch" style={{top: '100%'}}>
                    {options.map((value) => (
                        <button key={value} className="hover:bg-gray-200 px-2 py-1 " onClick={() => props.onChange(value)}>
                            {value}
                        </button>
                    ))}
                </div>}
            </div>
        </div>
        
    )
}
