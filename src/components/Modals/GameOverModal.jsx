import './Modal.css'

// A modal that pops up when a song title is being guessed, history is being viewed, or game is over
export default function GameOverModal({ isWin, numGuesses, solution, onClickX, onClickReset }) {
  const handleModalContent = () => {
    if (isWin === true) { // Content if the game was won
      return (
        <>
          <div className="title">
            <h1>You won!</h1>
          </div>
          <div className="body">
            {(numGuesses === 1) ? (
              <p>You guessed the correct word in 1 guess!</p>
            ) : (
              <p>You guessed the correct song in {numGuesses} guesses!</p>
            )}
          </div>
          <div className="footer">
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
    if (isWin === false) { // Content if the game was lost
      return (
        <>
          <div className="title">
            <h1>Game Over!</h1>
          </div>
          <div className="body">
            <p>The correct song was {solution}</p>
          </div>
          <div className="footer">
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
  }

  const exitModal = () => {
    onClickX(false);
  }

  return (
    // Clicking on the background will close modal
    <div className="modal-background" onClick={exitModal}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-close">
          <button onClick={exitModal}>X</button>
        </div>
        {handleModalContent()}
      </div>
    </div>
  );
};