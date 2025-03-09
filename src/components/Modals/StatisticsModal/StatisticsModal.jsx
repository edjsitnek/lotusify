import '../Modal.css'
import './StatisticsModal.css'

// A modal containing game instructions that pops up when the info button is pressed
export default function StatisticsModal({ onClickX }) {
  const handleModalContent = () => {
    return (
      <div className="stats">
        <ul>
          <li>
            <div className="statNum">X</div>
            <div className="statName">Played</div>
          </li>
          <li>
            <div className="statNum">X</div>
            <div className="statName">Win%</div>
          </li>
          <li>
            <div className="statNum">X</div>
            <div className="statName">Average Attempts</div>
          </li>
        </ul>
      </div>
    )
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
        {handleModalContent()}
        <div className="footer">
          <button className="reset-button active-button">Reset Stats</button>
        </div>
      </div>
    </div>
  );
};