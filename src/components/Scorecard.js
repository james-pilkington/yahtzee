import React from 'react';
import './Scorecard.css';

const categories = [
  'Ones',
  'Twos',
  'Threes',
  'Fours',
  'Fives',
  'Sixes',
  'Three of a Kind',
  'Four of a Kind',
  'Full House',
  'Small Straight',
  'Large Straight',
  'Yahtzee',
  'Chance',
];

const calculateScore = (category, dice) => {
  if (!dice || dice.length === 0) return 0;

  const counts = Array(6).fill(0);
  dice.forEach((die) => counts[die - 1]++);

  switch (category) {
    case 'Ones':
      return counts[0] * 1;
    case 'Twos':
      return counts[1] * 2;
    case 'Threes':
      return counts[2] * 3;
    case 'Fours':
      return counts[3] * 4;
    case 'Fives':
      return counts[4] * 5;
    case 'Sixes':
      return counts[5] * 6;

    case 'Three of a Kind':
      return counts.some((count) => count >= 3) ? dice.reduce((sum, d) => sum + d, 0) : 0;

    case 'Four of a Kind':
      return counts.some((count) => count >= 4) ? dice.reduce((sum, d) => sum + d, 0) : 0;

    case 'Full House':
      return counts.some((count) => count === 3) && counts.some((count) => count === 2) ? 25 : 0;

    case 'Small Straight':
      return [1, 2, 3, 4].every((v) => counts[v - 1] > 0) ||
        [2, 3, 4, 5].every((v) => counts[v - 1] > 0) ||
        [3, 4, 5, 6].every((v) => counts[v - 1] > 0)
        ? 30
        : 0;

    case 'Large Straight':
      return [1, 2, 3, 4, 5].every((v) => counts[v - 1] > 0) ||
        [2, 3, 4, 5, 6].every((v) => counts[v - 1] > 0)
        ? 40
        : 0;

    case 'Yahtzee':
      return counts.includes(5) ? 50 : 0;

    case 'Chance':
      return dice.reduce((sum, d) => sum + d, 0);

    default:
      return 0;
  }
};

function Scorecard({
  player,
  dice,
  currentPlayer,
  setScore,
  scores,
  temporaryScores,
  handleTemporaryScore,
}) {
  const topHalfCategories = categories.slice(0, 6);
  const bottomHalfCategories = categories.slice(6);

  // Calculate top half total, bonus, and total + bonus
  const topHalfTotal = scores
    .slice(0, 6)
    .reduce((total, score) => total + (score !== null ? score : 0), 0);

  const bonus = topHalfTotal >= 63 ? 35 : 0;
  const totalWithBonus = topHalfTotal + bonus;

  const bottomHalfTotal = scores
    .slice(6)
    .reduce((total, score) => total + (score !== null ? score : 0), 0);

  const grandTotal = totalWithBonus + bottomHalfTotal;

  return (
    <div className={`scorecard ${currentPlayer ? 'current-player' : ''}`}>
      <h3>Player {player + 1}'s Scorecard</h3>
      <table>
        <tbody>
          {categories.map((cat, idx) => {
            const potentialScore = calculateScore(cat, dice);
            const isTemporary = temporaryScores[idx] !== null;

            return (
              <React.Fragment key={cat}>
                <tr>
                  <td>{cat}</td>
                  <td>
                    {scores[idx] !== null ? (
                      scores[idx]
                    ) : (
                      <button
                        className={`score-btn ${isTemporary ? 'temporary' : ''}`}
                        disabled={!currentPlayer}
                        onClick={() => handleTemporaryScore(idx, potentialScore)}
                      >
                        {isTemporary ? temporaryScores[idx] : potentialScore || 0}
                      </button>
                    )}
                  </td>
                </tr>
                {/* Insert the Top Half Total and Bonus rows after "Sixes" */}
                {idx === 5 && (
                  <>
                    <tr className="totals">
                      <td>Top Half Total</td>
                      <td>{topHalfTotal}</td>
                    </tr>
                    <tr className="totals">
                      <td>Bonus</td>
                      <td>{bonus}</td>
                    </tr>
                    <tr className="totals">
                      <td>Total + Bonus</td>
                      <td>{totalWithBonus}</td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            );
          })}
          <tr className="totals">
            <td>Bottom Half Total</td>
            <td>{bottomHalfTotal}</td>
          </tr>
          <tr className="totals">
            <td>Grand Total</td>
            <td>{grandTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Scorecard;
