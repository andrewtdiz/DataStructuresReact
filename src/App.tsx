import React from 'react';
import 'antd/dist/antd.css';
import Navbar from './components/Navbar';
import Sorting from './components/Sorting/Sorting';
import Speed from './components/Speed/Speed';
import { Switch, Route } from 'react-router-dom';
import Searching from './components/Searching/Searching';
import NAVBAR_ITEMS, { NavbarItem } from './constants/Navbar';
import './App.css';

function App() {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <Switch>
                {NAVBAR_ITEMS.map(
                    (navbarItem: NavbarItem) =>
                        navbarItem.links &&
                        navbarItem.links.map((tab: string) => (
                            <Route path={'/' + tab.split(' ').join('')}>
                                {navbarItem.text === 'Searching' && <Searching title={tab} />}
                                {navbarItem.text === 'Sorting' && <Sorting title={tab} />}
                                {navbarItem.text === 'Speed Test' && <Speed title={tab} />}
                            </Route>
                        )),
                )}
                <Route path="/">
                    <div className="w-full bg-gray-200 flex-1 flex flex-col items-center justify-center">
                        <h1 className="text-5xl font-bold">Coming Soon!</h1>
                    </div>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
