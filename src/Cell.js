import React, {Component} from 'react'
import './Cell.css';

class Cell extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        let target = e.target;
        let [x, y] = target.id.split("-");
        [x, y] = [parseInt(x), parseInt(y)];
        this.props.onClick(x, y);
    }

    render(){
        let parentHeight = document.getElementById("grid").clientWidth;
        let height = "" + (parentHeight / this.props.size) - 2 + "px";
        let width = height;
        let styles = {
            width: width,
            height: height,
            backgroundColor: (this.props.state === "X" ? "#607d8b" : "black"),
            border: "1px solid white",
            display: "inline-block",
            padding: "0px",
            margin: "0px",
        }
        return (
            <div
                onClick={this.onClick}
                style={styles}
                id={"" + this.props.x + "-" + this.props.y}
            ></div>
        )
    }
}

export default Cell;
