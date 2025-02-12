import './HistoryModal.css'

// A modal that displays guess history and pops up when the "View Guess History" button is pressed
export default function HistoryModal({ guessHistory, onClickX, isOnTop }) {
  const exitModal = () => {
    onClickX(false);
  }

  // Set content and class of result row to change text/color according to result
  const handleResult = (entry) => {
    if (entry.correct) {
      return <td className="correct">Correct</td>
    }
    else {
      return <td className="incorrect">Incorrect</td>
    }
  }

  return (
    <div className="history-modal-background" onClick={exitModal} style={{ zIndex: isOnTop ? 1001 : 1000 }}>
      <div className="history-modal-content" onClick={e => e.stopPropagation()}>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Guess</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {guessHistory.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.guess}</td>
                {handleResult(entry)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}