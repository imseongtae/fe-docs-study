import { useState } from 'react';

/**
 * - 보드 컴포넌트에서 각 value prop를 받을 수 있도록 Square 컴포넌트를 수정
 * - React에서는 주로 이벤트를 나타내는 prop에는 onSomething과 같은 이름을 사용
 * @param {*}
 */
const Square = ({ value, onSquareClick }) => {
  return (
    <button role="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], // 첫 번째 행
    [3, 4, 5], // 두 번째 행
    [6, 7, 8], // 세 번째 행
    [0, 3, 6], // 첫 번째 열
    [1, 4, 7], // 두 번째 열
    [2, 5, 8], // 세 번째 열
    [0, 4, 8], // 대각선 (\ 모양)
    [2, 4, 6], // 대각선 (/ 모양)
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

// Board 추후 Grid 로 변경
const Board = ({ xIsNext, squares, onPlay }) => {
  // const [xIsNext, setXIsNext] = useState(true);
  /**
   * 9개 사각형에 해당하는 9개의 null의 배열을 기본값으로 하는 state 변수 squares를 선언
   * Array(9).fill(null)은 9개의 엘리먼트로 배열을 생성하고 각 엘리먼트를 null로 설정
   */
  // const [squares, setSquares] = useState(Array(9).fill(null));

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  /**
   * React에서는 주로 이벤트를 처리하는 함수를 정의 할 때는 handleSomething과 같은 이름을 사용
   * @param {number} index
   */
  const handleClick = (index) => {
    console.log('handleClick');
    // squares[index] → 사용자가 클릭한 칸이 채워져 있다면 클릭을 무시 (즉, 한 번 선택한 칸은 다시 선택 불가)
    // calculateWinner(squares) → 이미 승자가 정해진 상태라면 클릭 무시
    if (squares[index] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[index] = 'X';
    } else {
      nextSquares[index] = 'O';
    }

    // Board 컴포넌트의 squares state가 업데이트되면, Board와 그 모든 자식이 다시 렌더링됨
    onPlay(nextSquares);
    // onPlay 함수에 대한 단일 호출로 대체함으로써 사용자가 사각형을 클릭할 때 Game 컴포넌트가 Board를 업데이트
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);
  };

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};

const Game = () => {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // setHistory([...history, nextSquares]);

    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
