import '../Modal.css'
import './StatisticsModal.css'
import { useState } from 'react';

// A modal containing game instructions that pops up when the info button is pressed
export default function StatisticsModal({ stats, resetStats, onClickX }) {
  const [resetButtonClicked, setResetButtonClicked] = useState(false);

  // Display game stats
  const displayStats = () => {
    return (
      <div className="stats">
        <ul>
          <li>
            <div className="statNum">{stats.gamesPlayed}</div>
            <div className="statName">Played</div>
          </li>
          <li>
            <div className="statNum">{stats.winPercentage}</div>
            <div className="statName">Win%</div>
          </li>
          <li>
            <div className="statNum">{stats.averageGuesses}</div>
            <div className="statName">Average Guesses</div>
          </li>
        </ul>
      </div>
    )
  }

  // Display reset button and secondary confirmation buttons
  const handleResetButton = () => {
    if (!resetButtonClicked) {
      return <button className="reset-button active-button" onClick={() => setResetButtonClicked(true)}>Reset Stats</button>
    } else {
      return (
        <>
          <button className="reset-button active-button" onClick={resetStats}>Are you sure? (This cannot be undone)</button>
          <button className="cancel-button" onClick={() => setResetButtonClicked(false)}>Cancel</button>
        </>
      )
    }
  }

  const exitModal = () => {
    onClickX(false);
  }

  return (
    // Clicking on the background will close modal
    <div className="statistics modal-background" onClick={exitModal}>
      <div className="statistics modal-container" onClick={e => e.stopPropagation()}>
        <div className="statistics modal-header">
          <div className="title">
            <h1>Game Stats</h1>
          </div>
          <button onClick={exitModal}>X</button>
        </div>
        {displayStats()}
        <div className="footer">
          {handleResetButton()}
        </div>
      </div>
    </div>
  );
};