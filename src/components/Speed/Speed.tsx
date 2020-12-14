import React from 'react'
import TestingZone from '../Testing/TestingZone'
import {languages} from '../../Constants'

export default function Speed(props:any) {
    return (
        <div className="flex-1 w-full bg-gray-200 items-center flex flex-col h-full py-12 ">
            <div className="container flex items-start">
                <h1 className="container text-4xl font-medium text-left mr-auto">{props.title}</h1>
            </div>
            <div className="flex container mb-12 justify-around">
                {languages.map(lang => (
                    <TestingZone key={lang.name} test={'Sorting'} type={lang.name} img={lang.img} />
                ))}
            </div>
        </div>
    )
}
