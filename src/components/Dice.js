import React from 'react';
import './Dice.css';
import dice1 from '../images/Dice1.png';
import dice2 from '../images/Dice2.png';
import dice3 from '../images/Dice3.png';
import dice4 from '../images/Dice4.png';
import dice5 from '../images/Dice5.png';
import dice6 from '../images/Dice6.png';

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

function Dice({ dice, held, toggleHold, isRolling }) {
  return (
    <div className="dice">
      {dice.map((die, idx) => (
        <img
          key={idx}
          src={die ? diceImages[die - 1] : ''}
          alt={`Dice ${die}`}
          className={`die ${held[idx] ? 'held' : ''} ${!held[idx] && isRolling ? 'rolling' : ''}`}
          onClick={() => toggleHold(idx)}
        />
      ))}
    </div>
  );
}

export default Dice;
