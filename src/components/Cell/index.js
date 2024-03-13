import cx from "classnames";
import style from "./style.module.scss";
import { CELL_TYPE } from "../../constant";

const getContent = ({ type, hintNumber }) => {
  switch (type) {
    case CELL_TYPE.MINE:
      return "💣";
    case CELL_TYPE.EMPTY:
      return null;
    case CELL_TYPE.HINT:
      return hintNumber;
    default:
      return null;
  }
};

export const Cell = ({
  type,
  onClick,
  row,
  col,
  isOpen,
  isMarked,
  hintNumber,
}) => {
  const content = getContent({ type, hintNumber });
  const cover = isMarked ? "🚩" : null;

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
