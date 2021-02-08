import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Pure Component. Controller component to Board.
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history:[
                {
                    squares: Array(9).fill(null),
                    moves: [{row: -1, col: -1}],
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            increasingOrder: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let moves = current.moves.slice();
        if (getWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.getMarker();
        moves = moves.concat([{row: Math.trunc(i / 3), col: i % 3}]);
        this.setState({
            history: history.concat([{
                squares: squares,
                moves: moves,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleClickOnSort() {
        this.setState({increasingOrder: !this.state.increasingOrder});
    }

    getMarker() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = getWinner(current.squares);
        let moves = [];
        for (let move = 0; move < history.length; ++move) {
            let currentHistory = history[move];
            let desc = "Go to game start";
            if (move > 0) {
                const pos = currentHistory.moves[move];
                desc = 'Go to move #' + move + ": " + (move % 2 === 0 ? 'O' : 'X') + ' at (' + (pos.row)  + ', ' + (pos.col) + ')';
            }

            const element = (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
            if (this.state.increasingOrder) {
                moves.push(element);
            } else {
                moves.unshift(element);
            }
        }

        let status;
        if (winner) {
            status = 'Winnder: ' + winner;
        } else {
            status = 'Next player: ' + this.getMarker();
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <button onClick={() => this.handleClickOnSort()}>
                        {this.state.increasingOrder ? 'increasing' : 'decresing'}
                    </button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function getWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; ++i) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
