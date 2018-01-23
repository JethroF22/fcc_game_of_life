import React, {Component} from 'react'

class Grid extends Component{
    render(){
        return (
            <div
                id="grid"
                style={{
                    width: "30em",
                    height: "30em",
                    border: "2px double white"}}
            >{this.props.cells}</div>
        )
    }
}

export default Grid;
