import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
    return (
        <button 
            className={`square ${isWinning ? 'winning' : ''}`} 
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
    }

    const winnerInfo = calculateWinner(squares);
    const winner = winnerInfo?.winner;
    const winningLine = winnerInfo?.line || [];
    const isDraw = !winner && squares.every(square => square !== null);
    
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (isDraw) {
        status = "Draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            <div className="status">{status}</div>
            {[0, 1, 2].map((row) => (
                <div key={row} className="board-row">
                    {[0, 1, 2].map((col) => {
                        const index = row * 3 + col;
                        return (
                            <Square
                                key={index}
                                value={squares[index]}
                                isWinning={winningLine.includes(index)}
                                onSquareClick={() => handleClick(index)}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setcurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePLay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setcurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setcurrentMove(nextMove);
    }

    function toggleSortOrder() {
        setIsAscending(!isAscending);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move === currentMove) {
            description = 'You are at move #' + move;
            return (
                <li key={move}>
                    {description}
                </li>
            );
        } else {
            description = move > 0 ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        }
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePLay} />
            </div>
            <div className="game-info">
                <button onClick={toggleSortOrder}>
                    {isAscending ? 'Sort Descending' : 'Sort Ascending'}
                </button>
                <ol>{isAscending ? moves : moves.slice().reverse()}</ol>
            </div>
        </div>
    );
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
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i]
            };
        }
    }
    return null;
}