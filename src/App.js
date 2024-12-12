import React, { useState, useContext} from 'react';
import Game from './components/Game';
import { GameContext, GameProvider } from './components/GameContext';
import './App.css';


function App() {
  const [playerCount, setPlayerCount] = useState(1);
  const [scorecards, setScorecards] = useState(1);
  const { startGame, setStartGame } = useContext(GameContext);


  const handleStart = () => setStartGame(true);

  return (
    <div className="App">

      <h2 className="title">- YAHTZEE -</h2>
      {!startGame ? (
        <div className="setup">
          <h1>Yahtzee Game</h1>
          <label>
            Number of Players:
            <select value={playerCount} onChange={(e) => setPlayerCount(Number(e.target.value))}>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <label>
            Number of Scorecards:
            <select value={scorecards} onChange={(e) => setScorecards(Number(e.target.value))}>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleStart}>Start Game</button>
        </div>
      ) : (
        <Game playerCount={playerCount} scorecards={scorecards} />
      )}
    </div>
  );
}

export default function Root() {
  return (
    <GameProvider>
      <App />
    </GameProvider>
  );
}