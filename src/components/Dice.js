import React from 'react';
import './Dice.css';

const diceImages = [
  '/images/Dice1.png', // Replace with the actual path to your dice images
  '/images/Dice2.png',
  '/images/Dice3.png',
  '/images/Dice4.png',
  '/images/Dice5.png',
  '/images/Dice6.png',
];

function Dice({ dice, held, toggleHold }) {
  return (
    <div className="dice">
      {dice.map((die, idx) => (
        <img
          key={idx}
          src={diceImages[die - 1]}
          alt={`Dice ${die}`}
          className={`die ${held[idx] ? 'held' : ''}`}
          onClick={() => toggleHold(idx)}
        />
      ))}
    </div>
  );
}

export default Dice;
