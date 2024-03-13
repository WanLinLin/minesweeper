import { useState } from "react";
import { Cell } from "../Cell";
import { Row } from "../Row";
import style from "./style.module.scss";
import { CELL_CONTENT } from "../../constant";

const BOARD_SETTING = {
  easy: {
    rowSize: 8,
    colSize: 10,
    mineCount: 10,
  },
};

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
  ].forEach(([dx, dy]) => {
    const x = row + dx;
    const y = col + dy;
    if (x >= 0 && x < rowSize && y >= 0 && y < colSize) {
      coordinates.push([x, y]);
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
      type: CELL_CONTENT.EMPTY,
      isOpen: false,
      isMarked: false,
    }))
  );
};

const updateMineBoard = ({ board, mineCount, noMinePosition }) => {
  let count = mineCount;
  const rowSize = board.length;
  const colSize = board[0].length;
  let loop = 0;

  while (count > 0 && loop < 1000) {
    loop++;
    const row = getRandomNumber(0, rowSize - 1);
    const col = getRandomNumber(0, colSize - 1);
    const isNoBombPosition =
      row === noMinePosition.row && col === noMinePosition.col;
    if (board[row][col].type === CELL_CONTENT.MINE || isNoBombPosition) {
      continue;
    }

    board[row][col].type = CELL_CONTENT.MINE;
    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const x = row + dx;
      const y = col + dy;
      if (
        x >= 0 &&
        x < rowSize &&
        y >= 0 &&
        y < colSize &&
        board[x][y].type !== CELL_CONTENT.MINE
      ) {
        board[x][y].type += 1;
      }
    }
    count--;
  }
};

const copyBoard = (board) => {
  return [...board.map((row) => row.map((cell) => ({ ...cell })))];
};

const expandCell = ({ board, row, col }) => {
  const rowSize = board.length;
  const colSize = board[0].length;
  board[row][col].isOpen = true;

  if (![CELL_CONTENT.MINE, CELL_CONTENT.EMPTY].includes(board[row][col].type))
    return;

  for (const [dx, dy] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]) {
    const x = row + dx;
    const y = col + dy;
    if (x >= 0 && x < rowSize && y >= 0 && y < colSize && !board[x][y].isOpen) {
      expandCell({ board, row: x, col: y });
    }
  }
};

export const Board = ({ difficulty }) => {
  const boardSetting = BOARD_SETTING[difficulty];
  const [board, setBoard] = useState(() => initBoard(boardSetting));
  const [bombInitialized, setBombInitialized] = useState(false);

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

    if (board[row][col].type === CELL_CONTENT.EMPTY) {
      expandCell({ board: newBoard, row, col });
    }

    if (board[row][col].type === CELL_CONTENT.MINE) {
      // lose game
    }

    setBoard(newBoard);
  };

  const handleRightClick = (e) => {
    const { row, col } = e.target.dataset;
    if (!row || !col) return;

    setBoard((board) => {
      const newBoard = copyBoard(board);
      newBoard[row][col].isMarked = !newBoard[row][col].isMarked;
      return newBoard;
    });
    e.preventDefault();
  };

  const handleDoubleClick = (e) => {
    const { row, col } = e.target.dataset;
    if (!row || !col) return;

    setBoard((board) => {
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

      if (markedCount === board[row][col].type) {
        const newBoard = copyBoard(board);
        coordinates.forEach(([x, y]) => {
          if (!newBoard[x][y].isMarked) {
            if (newBoard[x][y].type === CELL_CONTENT.EMPTY) {
              expandCell({ board: newBoard, row: x, col: y });
            } else {
              newBoard[x][y].isOpen = true;
            }
          }
        });
        return newBoard;
      }
      
      return board;
    });
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
            />
          ))}
        </Row>
      ))}
    </div>
  );
};
