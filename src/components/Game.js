import React, { useContext, useState } from 'react';
import { GameContext } from './GameContext';
import Dice from './Dice';
import Scorecard from './Scorecard';
import './Game.css';

function Game({ playerCount, scorecards: initialScorecards }) {
  const [dice, setDice] = useState(Array(5).fill(null)); // Use null for placeholders
  const [held, setHeld] = useState(Array(5).fill(false));
  const [rolls, setRolls] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [turnsPlayed, setTurnsPlayed] = useState(0); // Tracks total turns played
  const [gameOver, setGameOver] = useState(false); // Tracks if the game is over
  const [totals, setTotals] = useState([]); // Store totals for players
  const { setStartGame } = useContext(GameContext);
  const [showWarning, setShowWarning] = useState(false); // Warning state
  const [isRolling, setIsRolling] = useState(false); // New state for animation

  const [scorecards, setScorecards] = useState(() =>
    Array(playerCount).fill().map(() =>
      Array(initialScorecards).fill().map(() => Array(13).fill(null))
    )
  );

  const [temporaryScores, setTemporaryScores] = useState(() =>
    Array(playerCount).fill().map(() =>
      Array(initialScorecards).fill().map(() => Array(13).fill(null))
    )
  );

  const startNewGame = () => {
    setDice(Array(5).fill(null));
    setHeld(Array(5).fill(false));
    setRolls(3);
    setCurrentPlayer(0);
    setTurnsPlayed(0);
    setGameOver(false);
    setTotals([]);
    setScorecards(
      Array(playerCount).fill().map(() =>
        Array(initialScorecards).fill().map(() => Array(13).fill(null))
      )
    );
  };

  const endGame = () => {
    setStartGame(false); // Reset to go back to the home page
  };

  const rollDice = () => {
    if (rolls > 0) {
      setIsRolling(true); // Start animation
      setTimeout(() => {
        const newDice = dice.map((die, idx) =>
          held[idx] ? die : Math.floor(Math.random() * 6) + 1
        );
        setDice(newDice);
        setRolls(rolls - 1);
        setIsRolling(false); // Stop animation after dice are rolled
      }, 500); // Match the animation duration
    }
  };

  const toggleHold = (idx) => {
    const newHeld = [...held];
    newHeld[idx] = !newHeld[idx];
    setHeld(newHeld);
  };

  const handleTemporaryScore = (cardIdx, categoryIdx, score) => {
    const newTemporaryScores = temporaryScores.map((playerScores, playerIdx) =>
      playerScores.map((scorecard, currentCardIdx) =>
        scorecard.map((tempScore, tempCatIdx) =>
          playerIdx === currentPlayer &&
          currentCardIdx === cardIdx &&
          tempCatIdx === categoryIdx
            ? score
            : null
        )
      )
    );
    setTemporaryScores(newTemporaryScores);
  };

  const clearTemporaryScores = () => {
    const clearedScores = temporaryScores.map((playerScores, playerIdx) =>
      playerScores.map((scorecard) => scorecard.map(() => null))
    );
    setTemporaryScores(clearedScores);
  };

  const finalizeScores = () => {
    const newScores = [...scorecards];
    temporaryScores[currentPlayer].forEach((tempCardScores, cardIdx) => {
      tempCardScores.forEach((score, catIdx) => {
        if (score !== null) {
          newScores[currentPlayer][cardIdx][catIdx] = score;
        }
      });
    });
    setScorecards(newScores);
    clearTemporaryScores();
  };

  const calculateTotals = () => {
    return scorecards.map((playerScorecards) =>
      playerScorecards.flat().reduce((total, score) => total + (score || 0), 0)
    );
  };


  const endTurn = () => {

    const hasTemporaryScore = temporaryScores[currentPlayer].some((card) =>
      card.some((category) => category !== null)
    );

    if (!hasTemporaryScore) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // Clear warning after 3 seconds
      return;
    }


    finalizeScores();

    const newTurnsPlayed = turnsPlayed + 1;
    setTurnsPlayed(newTurnsPlayed);

    if (newTurnsPlayed >= playerCount * initialScorecards * 13) {
      const totals = calculateTotals();
      setTotals(totals);
      setGameOver(true);
      return;
    }


    setRolls(3);
    setHeld(Array(5).fill(false));
    setDice(Array(5).fill(null));
    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % playerCount);
  };

  return (
    <div className="game">
      <div className="setup">
        <h1>Yahtzee Game</h1>
        <button class="btn" onClick={startNewGame}>Start New Game</button>
        <button class="btn" onClick={endGame}>End Game</button>
      </div>
      {!gameOver ? (
        <>
          {dice && dice.some((die) => die !== null) ? (
            <Dice dice={dice} held={held} toggleHold={toggleHold} isRolling={isRolling} />
          ) : (
            <h2>ROLL TO START TURN</h2>
          )}
          <button className="btn" onClick={rollDice} disabled={rolls === 0 || isRolling}>
            Roll Dice ({rolls} rolls left)
          </button>
          <button class="btn" onClick={endTurn}>End Turn</button>
          {showWarning && <p className="warning">Please select a score before ending your turn!</p>}

          <div className="scorecards-carousel">
            {scorecards[currentPlayer]?.map((score, cardIdx) => (
              <Scorecard
                key={cardIdx}
                player={currentPlayer}
                dice={dice}
                currentPlayer={true}
                setScore={(catIdx, newScore) => {
                  const updatedScores = [...scorecards];
                  updatedScores[currentPlayer][cardIdx][catIdx] = newScore;
                  setScorecards(updatedScores);
                }}
                scores={scorecards[currentPlayer][cardIdx]}
                temporaryScores={temporaryScores[currentPlayer][cardIdx]}
                handleTemporaryScore={(catIdx, score) =>
                  handleTemporaryScore(cardIdx, catIdx, score)
                }
              />
            ))}
          </div>
        </>
      ) : (
        <div className="results">
          <h2>Game Over!</h2>
          {totals.map((total, idx) => (
            <p key={idx}>
              Player {idx + 1}: {total} points
            </p>
          ))}
          <h3>
            Winner: Player {totals.indexOf(Math.max(...totals)) + 1}!
          </h3>
          <div class="firework"></div>
          <div class="firework"></div>
          <div class="firework"></div>
        </div>
      )}
    </div>
  );
}

export default Game;
