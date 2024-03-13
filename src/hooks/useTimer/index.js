import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";

const INITIAL_TIME = dayjs().hour(0).minute(0).second(0);

export const useTimer = () => {
  const [time, setTime] = useState(INITIAL_TIME);
  const interval = useRef(null);

  const startTimer = () => {
    if (interval.current) return;

    interval.current = setInterval(() => {
      setTime((time) => time.add(1, "second"));
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(interval.current);
    setTime(INITIAL_TIME);
    interval.current = null;
  };

  const pauseTimer = () => {
    clearInterval(interval.current);
    interval.current = null;
  };

  useEffect(() => () => clearInterval(interval.current), []);

  return { startTimer, resetTimer, pauseTimer, time: time.format("HH:mm:ss") };
};
