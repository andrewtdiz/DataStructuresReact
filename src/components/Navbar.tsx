import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Navbar/Dropdown";

export interface NavbarProps {}

export interface NavbarState {}

export default function Navbar() {
  const [tabs] = React.useState([
    {
      name: "Sorting",
      links: [
        "Quicksort",
        "Mergesort",
        "Bubblesort",
        "Insertionsort",
        "Selectionsort",
        "Cocktailsort",
      ],
    },
    {
      name: "Searching",
      links: [
        "Depth First Search",
        "Breadth First Search",
        "A* Search",
        "Dijkstra's algorithm",
        "Greedy Algorithm",
      ],
    },
  ]);

  return (
    <div className="w-full h-16 bg-gray-700 text-white flex justify-center items-center">
      <div className="container flex">
        <Link to="/">
          <button className="text-white mt-1 text-xl hover:text-gray-300 animate-fast">
            JS vs WASM Visualizer
          </button>
        </Link>
        <div className="flex text-white mt-1 ml-6">
          {tabs.map(tab => (
            <Dropdown key={tab.name} label={tab.name} dropDownItems={tab.links}/>
          ))}
        </div>
        <div className="flex ml-auto text-white mt-1">
          <Link to="/resume">
            <button className="text-white mr-6 hover:text-gray-200 text-xl px-3 rounded">
              My resume
            </button>
          </Link>
          <button
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/andrew-dizenzo/",
                "_blank"
              )
            }
            className="bg-white text-red-500 hover:bg-red-500 hover:text-white text-xl px-3 font-medium rounded"
          >
            Hire me!
          </button>
        </div>
      </div>
    </div>
  );
}
