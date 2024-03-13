import { useState } from "react";

import { Board } from "./components/Board";
import { Reset } from "./components/Reset";
import { Start } from "./components/Start";
import { Time } from "./components/Time";
import { FlagCount } from "./components/FlagCount";
import { useTimer } from "./hooks/useTimer";

import style from "./App.module.scss";

const GAME_SETTING = {
  rowSize: 8,
  colSize: 8,
  mineCount: 6,
};

function App() {
  const [boardKey, setBoardKey] = useState(Date.now());
  const [started, setStarted] = useState(false);
  const { startTimer, resetTimer, pauseTimer, time } = useTimer();
  const [flagCount, setFlagCount] = useState(GAME_SETTING.mineCount);
  const [gameResult, setGameResult] = useState(null);

  const handleStart = () => {
    startTimer();
    setStarted(true);
  };

  const handleReset = () => {
    setBoardKey(Date.now());
    resetTimer();
    setStarted(false);
    setGameResult(null);
    setFlagCount(GAME_SETTING.mineCount);
  };

  const handleGameResult = ({ isWining }) => {
    pauseTimer();
    setGameResult(isWining ? "You win!" : "You lose!");
  };

  return (
    <div className={style.root}>
      <div>
        <div className={style.control}>
          <div>
            <Time time={time} />
            <FlagCount flagCount={flagCount} />
          </div>

          <Reset onClick={handleReset} />
        </div>

        <div className={style.board}>
          {gameResult && <div className={style.mask}>{gameResult}</div>}

          {!started && (
            <div className={style.mask}>
              <Start onClick={handleStart} />
            </div>
          )}

          <Board
            key={boardKey}
            boardSetting={GAME_SETTING}
            setFlagCount={setFlagCount}
            onGameResult={handleGameResult}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
