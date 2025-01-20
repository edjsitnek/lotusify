import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/Modals/GameOverModal';
import useGameLogic from './hooks/useGameLogic'
import { useState } from 'react';

function App() {
  const [showHistory, setShowHistory] = useState(false); // Track if show history modal is on the screen
  const [modalOpen, setModalOpen] = useState(false); // Track if modal is open
  const [songGuess, setSongGuess] = useState(""); // Temporarily hold user input for song title guess

  const {
    pickRandomSong,
    randomSong,
    handleGuessLetter,
    handleGuessSong,
    renderBlanks,
    keyStatuses,
    guessHistory,
    gameOver,
    isWin
  } = useGameLogic(setModalOpen);

  const handleKeyboardClick = (letter) => {
    handleGuessLetter(letter);
  };

  const handleGuessSongSubmit = () => {
    handleGuessSong(songGuess);
    setSongGuess("") // Clear input after submission
  }

  return (
    <>
      <div className="game-container">
        <div className="header">Lotusify</div>

        <div className="body">
          <button onClick={pickRandomSong}>Pick a Random Song</button>
          <div className="blanks">{renderBlanks()}</div>
          <p>{randomSong && randomSong.name}</p>
        </div>

        <div className="footer">
          <div>
            Guesses: {guessHistory.length}/13
            {/* {gameOver && <p>Game Over! The correct song was: {randomSong?.name}</p>} */}

            <div className="guess-song">
              <input
                type="text"
                value={songGuess}
                name="songGuessInput"
                onChange={(e) => setSongGuess(e.target.value)}
                placeholder="Enter full song title"
              />
              <button onClick={handleGuessSongSubmit}>
                Guess Song
              </button>
            </div>

            <button onClick={() => setShowHistory(!showHistory)}>View Guess History</button>
            {showHistory && (
              <div>
                <h2>Guess History</h2>
                <ol>
                  {guessHistory.map((entry, index) => (
                    <li key={index}>
                      {entry.guess} - {entry.correct ? "Correct" : "Incorrect"}
                    </li>
                  ))}
                </ol>
                <button onClick={() => setShowHistory(false)}>Close</button>
              </div>
            )}
          </div>

          <Keyboard onKeyPress={handleKeyboardClick} keyStatuses={keyStatuses} />
        </div>
        {gameOver && modalOpen && (
          <GameOverModal
            isWin={isWin}
            numGuesses={guessHistory.length}
            solution={randomSong.name}
            onClickX={setModalOpen}
            onClickReset={pickRandomSong}
          />
        )}
      </div>
    </>
  )
}

export default App
