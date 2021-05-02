import React from 'react';
import Dropdown from './Navbar/Dropdown';
import NAVBAR_ITEMS, { NavbarItem } from '../constants/Navbar';
export interface NavbarProps {}

export interface NavbarState {}

export default function Navbar() {
    return (
        <div className="w-full h-16 bg-white shadow-sm text-white flex justify-center items-center">
            <div className="container flex">
                <button className="mt-1 text-xl animate-fast text-gray-600 hover:text-gray-900">
                    Algorithms Visualizer
                </button>
                <div className="flex text-gray-600 mt-1 ml-6">
                    {NAVBAR_ITEMS.map((navbarItem: NavbarItem) => (
                        <Dropdown key={navbarItem.text} navbarItem={navbarItem} />
                    ))}
                </div>
                <div className="flex ml-auto text-white mt-1">
                    <button
                        onClick={() => window.open('https://www.linkedin.com/in/andrew-dizenzo/', '_blank')}
                        className="bg-white text-red-500 hover:bg-red-500 hover:text-white text-xl px-3 font-medium rounded"
                    >
                        Resume
                    </button>
                </div>
            </div>
        </div>
    );
}
