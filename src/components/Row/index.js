import style from "./style.module.scss";

export const Row = ({ children }) => (
  <div className={style.root}>{children}</div>
);
