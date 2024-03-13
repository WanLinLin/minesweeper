import cx from "classnames";
import style from "./style.module.scss";
import { CELL_CONTENT } from "../../constant";

const getContent = (type) => {
  switch (type) {
    case CELL_CONTENT.MINE:
      return "💣";
    case CELL_CONTENT.EMPTY:
      return null;
    default:
      return type;
  }
};

export const Cell = ({ type, onClick, row, col, isOpen, isMarked }) => {
  const content = getContent(type);
  const cover = isMarked ? "🚩" : null

  const handleClick = () => {
    onClick({ row, col });
  };

  return (
    <div
      className={cx(style.root, { [style.opened]: isOpen })}
      onClick={handleClick}
      data-row={row}
      data-col={col}
    >
      {isOpen ? content : cover}
    </div>
  );
};
