import style from './style.module.scss';

export const Time = ({ time }) => {
  return <div className={style.root}>{time}</div>;
};
