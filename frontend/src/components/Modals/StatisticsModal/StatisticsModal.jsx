import '../Modal.css'
import './StatisticsModal.css'
import { focusOnNewContent } from '../../../utils/focusOnNewContent';
import { useState, useRef } from 'react';

// A modal containing game instructions that pops up when the info button is pressed
export default function StatisticsModal({ stats, resetStats, showStatisticsModal, lastFocusedElement, isOnTop, onClickX }) {
  const [resetButtonClicked, setResetButtonClicked] = useState(false); // Track if reset button is clicked to toggle confirmation button

  // Focus on modal content when opened
  const newContentRef = useRef(null);
  focusOnNewContent(showStatisticsModal, newContentRef);

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
    lastFocusedElement.current?.focus(); // Focus on stats icon again when modal closes for accessibility
  }

  return (
    // Clicking on the background will close modal
    <div className="statistics modal-background" onClick={exitModal} style={{ zIndex: isOnTop ? 1001 : 1000 }}>
      <div className="statistics modal-container" onClick={e => e.stopPropagation()}>
        <div className="statistics modal-header">
          <div className="title" ref={newContentRef} tabIndex="-1">
            <h1>Game Stats</h1>
          </div>
          <button aria-label="Close statistics modal" onClick={exitModal}>X</button>
        </div>
        {displayStats()}
        <div className="footer">
          {handleResetButton()}
        </div>
      </div>
    </div>
  );
};