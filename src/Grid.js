import React, {Component} from 'react'

class Grid extends Component{
    render(){
        return (
            <div
                id="grid"
                style={{
                    width: "600px",
                    height: "600px",
                    margin: "0 auto",
                    border: "1px solid black"}}
            >{this.props.cells}</div>
        )
    }
}

export default Grid;
