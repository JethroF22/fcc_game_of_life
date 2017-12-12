import React, { Component } from 'react';
import Cell from './Cell.js';
import Grid from './Grid.js';
import './App.css';


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: "",
            cells: [],
            grid: [],
            oldGrid: [],
            generation: 0,
            paused: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.setSize = this.setSize.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.updateGrid = this.updateGrid.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.clear = this.clear.bind(this);

    }

    handleChange(e){
        let value = e.target.value;
        this.setState({
            inputValue: value,
            size: 0,
        });
    }

    setSize(){
        let size = parseInt(this.state.inputValue)
        if(isNaN(size)){
            alert("Please enter a numeric value for the grid size.")
        } else {
            this.setState({
                size: size,
                generation: 0
            });
            this.generateGrid(size, "empty");
        }
    }

    onCellClick(x, y){
        let grid = this.state.grid;
        let cell = grid[x][y];
        cell.cell_state = (cell.cell_state === "X" ? "O" : "X");
        this.setState({
            grid: grid
        });
    }

    generateGrid(size, type){
        let grid = [];
        for (var i = 0; i < size; i++) {
            let row = [];
            for (var j = 0; j < size; j++) {
                let state;
                if (type === "empty") {
                    state = "O";
                } else if (type === "random") {
                    state = Math.floor(Math.random() * 2);
                }
                let neighbours = this.getNeighbours(i, j, size);
                let grid_obj = {
                    cell_state: state,
                    neighbours: neighbours,
                }
                row.push(grid_obj);
            }
            grid.push(row);
        }
        this.setState({
            grid: grid,
        });
    }

    getNeighbours(x, y, size){
        let neighbours = []
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (!(i === 0 && j === 0) && this.checkForValidIndex((x + i), (y + j), size)) {
                    neighbours.push({x: (x + i), y: (y + j)})
                }
            }
        }
        return neighbours;
    }

    checkForValidIndex(x, y, size){
        return (
            (x >= 0 && x < size) && (y >= 0 && y < size)
        );
    }

    createCells(){
        let cells = []
        this.state.grid.forEach((grid_row, i) => {
            let row = []
            grid_row.forEach((grid_obj, j) => {
                let cell = (<Cell
                                size={this.state.size}
                                state={grid_obj.cell_state}
                                key={"" + i + "-" + j}
                                x={i}
                                y={j}
                                onClick={this.onCellClick}
                            ></Cell>)
                            row.push(cell);
            })
            let grid_width = document.getElementById("grid").clientWidth;
            let div_styles = {
                width: "100%",
                height: "" + (grid_width / this.state.size) + "px",
                padding: "0px",
                margin: "0px",
            }
            let cell_row = (<div style={div_styles} key={i}>{row}</div>);
            cells.push(cell_row);
        });
        return cells;
    }

    updateGrid(){
        let generation = this.state.generation + 1;
        let grid = this.state.grid;
        let new_grid = [];
        grid.forEach((grid_row, i) => {
            let new_row = [];
            grid_row.forEach((grid_obj, j) => {
                let living_neighbours = 0;
                grid_obj.neighbours.forEach((coordinates) => {
                    let x = coordinates.x;
                    let y = coordinates.y;
                    let neighbour = grid[x][y];
                    if (neighbour.cell_state === "X") {
                        living_neighbours += 1;
                    }
                });
                let new_state = "";
                if (grid_obj.cell_state === "X") {
                    new_state = ([2, 3].indexOf(living_neighbours) !== -1 ? "X" : "O");
                } else {
                    new_state = (living_neighbours === 3 ? "X" : "O");
                }
                let new_grid_obj = {
                    cell_state: new_state,
                    neighbours: grid_obj.neighbours
                }
                new_row.push(new_grid_obj)
            });
            new_grid.push(new_row);
        });
        this.setState({
            oldGrid: grid,
            grid: new_grid,
            generation: generation,
        });
    }

    start(){
        this.intervalId = setInterval(
            () => this.updateGrid(),
            500
        )
    }

    pause(){
        clearInterval(this.intervalId);
    }

    clear(){
        this.generateGrid(this.state.size, "empty");
    }

    render() {
        let cells = this.createCells();
        let controls = (
            <div>
                <button onClick={this.start}>Start</button>
                <button onClick={(this.state.paused ? this.start : this.pause)}>{this.state.paused ? "Resume" : "Pause"}</button>
                <button onClick={this.clear}>Clear</button>
            </div>
        )
        return (
            <div className="App">
                <label>
                    Enter the number of cells per row:
                    <input
                        type="text"
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                    />
                    <button
                        onClick={this.setSize}
                    >Set size</button>
                    <button
                        onClick={this.updateGrid}
                    >Next</button>
                </label>
                <div>{this.state.grid.length === 0 ? "" : controls}</div>
                <div>Generation: {this.state.generation}</div>
                <Grid cells={cells} />

            </div>
        );
    }
}

export default App;
