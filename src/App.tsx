import React from 'react';
import 'antd/dist/antd.css';
import Navbar from './components/Navbar';
import Sorting from './components/Sorting/Sorting';
import {
  Switch,
  Route
}  from "react-router-dom";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <Switch >
        <Route path="/Insertionsort">
          <Sorting />
        </Route>
        <Route path="/Bubblesort">
          <Sorting />
        </Route>
        <Route path="/Quicksort">
          <Sorting />
        </Route>
        <Route path="/Mergesort">
          <Sorting />
        </Route>
        <Route path="/Selectionsort">
          <Sorting />
        </Route>
        <Route path="/Cocktailsort">
          <Sorting />
        </Route>
        <Route path="/">
          <h1>Here I amm</h1>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
