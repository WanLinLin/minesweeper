import { Board } from "./components/Board";
import { Reset } from "./components/Reset";

import style from "./App.module.scss";

function App() {
  return (
    <div className={style.root}>
      {/* timer */}
      {/* mine count */}
      {/* reset */}
      <div><Reset /></div>
      <Board difficulty="easy" />
    </div>
  );
}

export default App;
