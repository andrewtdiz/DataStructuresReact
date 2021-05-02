import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarItem } from '../../constants/Navbar';

interface DropdownProps {
    navbarItem: NavbarItem;
}

export interface NavbarState {
    isActive: boolean;
}

const Dropdown = ({ navbarItem }: DropdownProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className={'relative ml-10 flex items-center z-40 ' + (isActive ? 'text-gray-900' : '')}
        >
            {navbarItem.icon}
            <button className="text-base">{navbarItem.text}</button>
            {navbarItem.comingSoon && (
                <div className="absolute text-red-500 text-xs" style={{ bottom: '90%', right: '-25%' }}>
                    Coming soon!
                </div>
            )}
            <svg
                className="fill-current h-3 w-3 ml-1 transition-all duration-200"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 240.811 240.811"
                style={{ transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            >
                <g>
                    <path d="M220.088,57.667l-99.671,99.695L20.746,57.655c-4.752-4.752-12.439-4.752-17.191,0   c-4.74,4.752-4.74,12.451,0,17.203l108.261,108.297l0,0l0,0c4.74,4.752,12.439,4.752,17.179,0L237.256,74.859   c4.74-4.752,4.74-12.463,0-17.215C232.528,52.915,224.828,52.915,220.088,57.667z" />
                </g>
            </svg>
            <div
                className={
                    isActive
                        ? 'opacity-100 shadow-lg block pt-5 absolute top-0 left-0 transition-all duration-100 '
                        : 'opacity-0 absolute pointer-events-none  '
                }
                style={{ top: '100%' }}
            >
                <div className="rounded flex flex-col bg-white text-white w-64 p-1 shadow">
                    {navbarItem.links &&
                        navbarItem.links.map((item) => (
                            <Link
                                onClick={() => setIsActive(false)}
                                to={'/' + item.split(' ').join('')}
                                key={item}
                                style={{ textDecoration: 'none' }}
                                className="w-full transition-none rounded hover:bg-gray-200 text-gray-600  hover:text-gray-800 text-lg text-left px-2 py-1"
                            >
                                {item}
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
