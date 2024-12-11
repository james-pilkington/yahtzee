// GameContext.js
import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [startGame, setStartGame] = useState(false);

  return (
    <GameContext.Provider value={{ startGame, setStartGame }}>
      {children}
    </GameContext.Provider>
  );
}
