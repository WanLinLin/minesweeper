export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const copyBoard = (board) => {
  return [...board.map((row) => row.map((cell) => ({ ...cell })))];
};
