import React from "react";
import { Link } from "react-router-dom";

export interface NavbarProps {
    label: string;
    dropDownItems: Array<string>;
}

export interface NavbarState {
  isActive: boolean;
}

class Dropdown extends React.Component<NavbarProps, NavbarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({ isActive: true })}
        onMouseLeave={() => this.setState({ isActive: false })}
        className="relative ml-12 flex items-center z-40"
      >
        <button className={this.state.isActive ? "text-gray-200 text-base" : "text-base"}>
          {this.props.label}
        </button>
        <svg
          className="fill-current h-3 w-3 ml-1 transition-all duration-200"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 240.811 240.811"
          style={{transform: this.state.isActive ? "rotate(0deg)" : "rotate(-90deg)"}}
        >
          <g>
            <path d="M220.088,57.667l-99.671,99.695L20.746,57.655c-4.752-4.752-12.439-4.752-17.191,0   c-4.74,4.752-4.74,12.451,0,17.203l108.261,108.297l0,0l0,0c4.74,4.752,12.439,4.752,17.179,0L237.256,74.859   c4.74-4.752,4.74-12.463,0-17.215C232.528,52.915,224.828,52.915,220.088,57.667z" />
          </g>
        </svg>
        <div
          className={
            this.state.isActive
              ? "opacity-100 block pt-4 absolute top-0 left-0 transition-all duration-100 "
              : "opacity-0 absolute pointer-events-none  "
          }
          style={{ top: "100%" }}
        >
          <div className="bg-gray-800 rounded flex flex-col text-white w-64 p-1 shadow">
            {this.props.dropDownItems.map(item => (
                <Link onClick={()=> this.setState({isActive: false})} to={'/'+item.split(' ').join('')} key={item} style={{ textDecoration: 'none' }} className="w-full transition-none rounded hover:bg-blue-800 hover:text-gray-200 text-white text-lg text-left px-2 py-1"> {item} </Link>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

export default Dropdown;
