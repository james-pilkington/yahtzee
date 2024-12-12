import React from 'react';
import './Dice.css';
import dice1 from "../images/Dice1.png"
import dice2 from "../images/Dice2.png"
import dice3 from "../images/Dice3.png"
import dice4 from "../images/Dice4.png"
import dice5 from "../images/Dice5.png"
import dice6 from "../images/Dice6.png"

// const diceImages = [
//   '/images/Dice1.png', // Replace with the actual path to your dice images
//   '/images/Dice2.png',
//   '/images/Dice3.png',
//   '/images/Dice4.png',
//   '/images/Dice5.png',
//   '/images/Dice6.png',
// ];

const diceImages = [
  dice1, // Replace with the actual path to your dice images
  dice2,
  dice3,
  dice4,
  dice5,
  dice6,
];

function Dice({ dice, held, toggleHold }) {
  return (
    <div className="dice">
              {/* <img src={dice1} alt="monotype logo"/> */}
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
