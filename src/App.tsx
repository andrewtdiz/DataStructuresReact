import React from 'react';
import 'antd/dist/antd.css';
import Navbar from './components/Navbar';
import Sorting from './components/Sorting/Sorting';
import Speed from './components/Speed/Speed';
import {
  Switch,
  Route
}  from "react-router-dom";
import Searching from './components/Searching/Searching';
import {tabs} from './Constants'
import './App.css'

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <Switch >
        {tabs.map((group:{name:string, links: Array<string>}) => (
          group.links.map((tab:string)=> (
            <Route path={'/'+tab.split(' ').join('')}>
              {group.name==='Searching' &&
              <Searching title={tab} />}
              {group.name==='Sorting' &&
              <Sorting title={tab} />}
              {group.name==='Speed Test' &&
              <Speed title={tab} />}
            </Route>
        ))))}
        {/* <Route path="/DepthFirst">
          <Searching title={"Depth First Search"} />
        </Route>
        <Route path="/Insertionsort">
          <Sorting title={"Insertion Sort : O(n²)"} />
        </Route>
        <Route path="/Bubblesort">
          <Sorting title={"Bubble Sort : O(n²)"} />
        </Route>
        <Route path="/Quicksort">
          <Sorting title={"Quick Sort : O(nlog(n))"} />
        </Route>
        <Route path="/Mergesort">
          <Sorting title={"Merge Sort : O(nlog(n))"} />
        </Route>
        <Route path="/Selectionsort">
          <Sorting title={"Selection Sort : O(n²)"} />
        </Route>
        <Route path="/Cocktailsort">
          <Sorting title={"Cocktail Sort : O(n²)"} />
        </Route> */}
        <Route path="/">
          <h1>Here I amm</h1>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
