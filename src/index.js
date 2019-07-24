import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  if (props.winningSquares.length > 0) {
    return (
      <button
        className={
          props.winningSquares.includes(props.index) ? "square win" : "square"
        }
        onClick={() => props.onClick({})}
      >
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={() => props.onClick({})}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(value, winningSquares) {
    return (
      <Square
        winningSquares={winningSquares}
        value={this.props.squares[value]}
        index={value}
        onClick={() => this.props.onClick(value)}
      />
    );
  }

  render() {
    return [0, 1, 2].map(index1 => (
      <div key={index1} className="board-row">
        {[0, 1, 2].map(index2 => (
          <Fragment key={index2 + index1 * 3}>
            {this.renderSquare(index2 + index1 * 3, this.props.winningSquares)}
          </Fragment>
        ))}
      </div>
    ));
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      coordinates: [Array(9).fill(null)]
    };
  }
  handleClick(value) {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coordinates = this.state.coordinates;
    if (calculateWinner(squares).win || squares[value]) {
      return;
    }
    squares[value] = this.state.xIsNext ? "X" : "O";
    switch (value) {
      case 0:
        coordinates[stepNumber] = "(0,0)";
        break;
      case 1:
        coordinates[stepNumber] = "(1,0)";
        break;
      case 2:
        coordinates[stepNumber] = "(2,0)";
        break;
      case 3:
        coordinates[stepNumber] = "(0,1)";
        break;
      case 4:
        coordinates[stepNumber] = "(1,1)";
        break;
      case 5:
        coordinates[stepNumber] = "(2,1)";
        break;
      case 6:
        coordinates[stepNumber] = "(0,2)";
        break;
      case 7:
        coordinates[stepNumber] = "(1,2)";
        break;
      default:
        coordinates[stepNumber] = "(2,2)";
        break;
    }
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      coordinates: coordinates,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const coordinates = this.state.coordinates;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    let winningSquares = calculateWinner(squares).squares;
    const winner = calculateWinner(squares).win;
    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}, ${coordinates[move - 1]}`
        : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (this.state.stepNumber === 9) {
      status = "This is a draw";
      winningSquares = { squares: null };
    } else {
      status = `This player: ${this.state.xIsNext ? "X" : "O"}`;
      winningSquares = { squares: null };
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={value => this.handleClick(value)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { win: squares[a], squares: lines[i] };
    }
  }
  return { win: null, squares: null };
}
