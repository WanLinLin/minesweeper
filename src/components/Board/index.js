import { useRef, useState } from "react";
import { Cell } from "../Cell";
import { Row } from "../Row";
import style from "./style.module.scss";
import { CELL_TYPE } from "../../constant";

const getNeighborCoordinates = ({ row, col, board }) => {
  const rowSize = board.length;
  const colSize = board[0].length;
  const coordinates = [];

  [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ].forEach(([rowDiff, colDiff]) => {
    const newRow = row + rowDiff;
    const newCol = col + colDiff;
    if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize) {
      coordinates.push([newRow, newCol]);
    }
  });
  return coordinates;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const initBoard = ({ rowSize, colSize }) => {
  return Array.from({ length: rowSize }, () =>
    Array.from({ length: colSize }, () => ({
      type: CELL_TYPE.EMPTY,
      isOpen: false,
      isMarked: false,
      hintNumber: 0,
    }))
  );
};

const updateMineBoard = ({ board, mineCount, noMinePosition }) => {
  let count = mineCount;
  const rowSize = board.length;
  const colSize = board[0].length;

  while (count > 0) {
    const row = getRandomNumber(0, rowSize - 1);
    const col = getRandomNumber(0, colSize - 1);
    const isNoBombPosition =
      row === noMinePosition.row && col === noMinePosition.col;
    if (board[row][col].type === CELL_TYPE.MINE || isNoBombPosition) {
      continue;
    }

    board[row][col].type = CELL_TYPE.MINE;
    getNeighborCoordinates({ row, col, board }).forEach(([x, y]) => {
      if (board[x][y].type !== CELL_TYPE.MINE) {
        board[x][y].type = CELL_TYPE.HINT;
        board[x][y].hintNumber += 1;
      }
    });
    count--;
  }
};

const copyBoard = (board) => {
  return [...board.map((row) => row.map((cell) => ({ ...cell })))];
};

const expandCell = ({ board, row, col }) => {
  board[row][col].isOpen = true;

  if (board[row][col].type === CELL_TYPE.HINT) return;

  getNeighborCoordinates({ row, col, board }).forEach(([x, y]) => {
    if (!board[x][y].isOpen) {
      expandCell({ board, row: x, col: y });
    }
  });
};

export const Board = ({
  boardSetting,
  flagCount,
  setFlagCount,
  onGameResult,
}) => {
  const [board, setBoard] = useState(() => initBoard(boardSetting));
  const [bombInitialized, setBombInitialized] = useState(false);
  const remainingMines = useRef(boardSetting.mineCount);

  const handleCellClick = ({ row, col }) => {
    const { isMarked, isOpen } = board[row][col].isMarked;
    if (isMarked || isOpen) return;

    const newBoard = copyBoard(board);
    newBoard[row][col].isOpen = true;

    if (!bombInitialized) {
      updateMineBoard({
        board: newBoard,
        mineCount: boardSetting.mineCount,
        noMinePosition: { row, col },
      });
      setBombInitialized(true);
    }

    if (board[row][col].type === CELL_TYPE.EMPTY) {
      expandCell({ board: newBoard, row, col });
    } else if (board[row][col].type === CELL_TYPE.MINE) {
      onGameResult({ isWining: false });
    }

    setBoard(newBoard);
  };

  const handleRightClick = (e) => {
    const { row, col } = e.target.dataset;
    if (!row || !col) return;
    e.preventDefault(); // prevent opening the context menu

    if (board[row][col].isOpen) return;

    const newBoard = copyBoard(board);
    const cell = newBoard[row][col];
    cell.isMarked = !cell.isMarked;

    const newFlagCount = cell.isMarked ? flagCount - 1 : flagCount + 1;
    if (cell.type === CELL_TYPE.MINE) {
      remainingMines.current = cell.isMarked
        ? remainingMines.current - 1
        : remainingMines.current + 1;
    }

    if (newFlagCount === 0 && remainingMines.current === 0) {
      onGameResult({ isWining: true });
    }

    setFlagCount(newFlagCount);
    setBoard(newBoard);
  };

  const handleDoubleClick = (e) => {
    const { row, col } = e.target.dataset;
    if (!row || !col) return;
    if (board[row][col].type !== CELL_TYPE.HINT) return;

    const coordinates = getNeighborCoordinates({
      row: Number(row),
      col: Number(col),
      board,
    });

    let markedCount = 0;
    coordinates.forEach(([x, y]) => {
      if (board[x][y].isMarked) {
        markedCount++;
      }
    });

    if (markedCount === board[row][col].hintNumber) {
      const newBoard = copyBoard(board);
      let expandOnMine = false;

      coordinates.forEach(([x, y]) => {
        const cell = newBoard[x][y];
        if (cell.isMarked || cell.isOpen) return;

        if (cell.type === CELL_TYPE.EMPTY) {
          expandCell({ board: newBoard, row: x, col: y });
        } else {
          cell.isOpen = true;
          expandOnMine ||= cell.type === CELL_TYPE.MINE;
        }
      });

      if (expandOnMine) {
        onGameResult({ isWining: false });
      }

      setBoard(newBoard);
    }
  };

  return (
    <div
      className={style.root}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
    >
      {board.map((row, i) => (
        <Row key={i}>
          {row.map((cell, j) => (
            <Cell
              key={j}
              onClick={handleCellClick}
              row={i}
              col={j}
              type={cell.type}
              isOpen={cell.isOpen}
              isMarked={cell.isMarked}
              hintNumber={cell.hintNumber}
            />
          ))}
        </Row>
      ))}
    </div>
  );
};
