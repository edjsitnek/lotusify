import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/Modals/GameOverModal';
import HistoryModal from './components/Modals/HistoryModal';
import SongGuessModal from './components/Modals/SongGuessModal';
import useGameLogic from './hooks/useGameLogic'
import { useState, useEffect } from 'react';

function App() {
  const [showHistory, setShowHistory] = useState(false); // Track if show history modal is on the screen
  const [showSongGuess, setShowSongGuess] = useState(false); // Track if song guess modal is on the screen
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false); // Track if modal is open
  const [historyButtonText, setHistoryButtonText] = useState("View History") // Change button text for history modal
  const [guessButtonText, setGuessButtonText] = useState("Guess Song") // Change button text for song guess modal
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
  } = useGameLogic(setGameOverModalOpen);

  // Initialize songGuess with blanks, if applicable
  useEffect(() => {
    if (randomSong) {
      setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : "")));
    }
  }, [randomSong]);

  // Handle keyboard clicks
  const handleKeyboardClick = (letter) => {
    if (!showHistory) {
      handleGuessLetter(letter);
    }
  };

  // Handle song title guesses
  const handleGuessSongSubmit = () => {
    if (!showHistory) {
      handleGuessSong(songGuess, setSongGuess);
      setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : ""))) // Clear input after submission
    }
  }

  // Toggle history modal and change button text
  const handleHistoryButton = () => {
    setShowHistory(!showHistory)
    if (!showHistory) {
      setHistoryButtonText("Close History")
    }
    else {
      setHistoryButtonText("View History")
    }
  }

  // Toggle song guess modal and change button text
  const handleGuessSongButton = () => {
    setShowSongGuess(!showSongGuess)
    if (!showSongGuess) {
      setGuessButtonText("Return")
    }
    else {
      setGuessButtonText("Guess Song")
    }
  }

  return (
    <>
      <div className="game-container">
        <div className="header">Lotusify</div>

        <div className="body">
          <div className="blanks">{renderBlanks()}</div>
          {showHistory && (
            <div>
              <HistoryModal
                guessHistory={guessHistory}
                onClickX={handleHistoryButton}
              />
            </div>
          )}
          {showSongGuess && (
            <div>
              <SongGuessModal
                randomSong={randomSong}
                songGuess={songGuess}
                setSongGuess={setSongGuess}
                guessHistory={guessHistory}
                handleGuessSongSubmit={handleGuessSongSubmit}
                onClickX={handleGuessSongButton}
              />
            </div>
          )}
        </div>

        <div className="footer">
          <div>
            Guesses: {guessHistory.length}/12
            <button onClick={() => handleGuessSongButton()}>{guessButtonText}</button>
            <button onClick={() => handleHistoryButton()}>{historyButtonText}</button>
          </div>

          <Keyboard onKeyPress={handleKeyboardClick} keyStatuses={keyStatuses} />
        </div>
        {gameOver && (
          gameOverModalOpen ? (
            <GameOverModal
              isWin={isWin}
              numGuesses={guessHistory.length}
              solution={randomSong.name}
              onClickX={setGameOverModalOpen}
              onClickReset={pickRandomSong}
            />
          ) : (
            <button onClick={pickRandomSong}>Pick a Random Song</button>
          )
        )}
      </div>
    </>
  )
}

export default App
