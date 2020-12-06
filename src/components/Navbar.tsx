import React from 'react';

export interface NavbarProps {
    
}
 
export interface NavbarState {
    
}
 
class Navbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
    }
    render() { 
        return (  
            <h1>here I am</h1>
        );
    }
}
 
export default Navbar;