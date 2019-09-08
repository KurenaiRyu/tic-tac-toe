import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const styles = {
        background: {
            backgroundColor: props.highlight ?
                '#81d8ff' :
                '#FFF'
        }
    };
    return (
        <button className="square" onClick={props.onClick} style={styles.background}>
            {props.value}
        </button>
    )

}

class Board extends React.Component {
    renderSquare(i, highlight) {
        return <Square
            highlight={highlight}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            let cols = [];
            for (let j = 0; j < 3; j++) {
                let index = (i * 3) + j;
                let highlight = false;
                if(this.props.lines && (this.props.lines.indexOf(index) > -1)) highlight = true;
                cols.push(this.renderSquare(index, highlight));
            }
            rows.push(
                <div className="board-row">
                    {cols}
                </div>
            );
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            jumpStepNum: null,
            reversed: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: (i % 3) + 1,
                row: (Math.floor(i / 3)) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            jumpStepNum: null,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            jumpStepNum: step,
        })
    }

    changeSort() {
        this.setState({
            reversed: !this.state.reversed,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const lines = calculateWinner(current.squares);
        const winner = lines == null ? null : current.squares[lines[0]];
        const sortDesc = this.state.reversed ? 'Asc' : 'Desc';

        const moves = history.map((step, move) => {
            const styles = {
                font:{
                    fontWeight: this.state.jumpStepNum ? 'bold' : '',
                },
            };
            let desc = move ?
                'Go to move #' + move + '(' + step.col + ',' + step.row + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        <text style={styles.font}>{desc}</text>
                    </button>
                </li>
            );
        });

        if(this.state.reversed)moves.reverse();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = "Draw!";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        lines={lines}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol reversed={this.state.reversed ? "reversed":""}>{moves}</ol>
                </div>
                <dev className="reversed">
                    <button onClick={() => this.changeSort()}>
                        {sortDesc}
                    </button>
                </dev>
            </div>
        );
    }
}

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
