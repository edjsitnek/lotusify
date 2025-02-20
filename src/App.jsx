import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/Modals/GameOverModal';
import HistoryModal from './components/Modals/HistoryModal';
import SongGuessModal from './components/Modals/SongGuessModal';
import useGameLogic from './hooks/useGameLogic'
import useKeyboard from './hooks/useKeyboard';
import { useState } from 'react';

function App() {
  const [gameMode, setGameMode] = useState("letter"); // Track if game is in letter guess or song guess mode
  const [showHistoryModal, setShowHistoryModal] = useState(false); // Track if show history modal is on the screen
  const [showSongGuessModal, setShowSongGuessModal] = useState(false); // Track if song guess modal is on the screen
  const [showGameOverModal, setShowGameOverModal] = useState(false); // Track if game over modal is on the screen
  const [modalOrder, setModalOrder] = useState([]); // Track modal stacking order
  const [historyButtonText, setHistoryButtonText] = useState("View History") // Change button text for history modal
  const [guessButtonText, setGuessButtonText] = useState("Guess Song") // Change button text for song guess modal

  const {
    pickRandomSong,
    randomSong,
    songGuess,
    setSongGuess,
    handleGuessLetter,
    handleGuessSong,
    renderBlanks,
    keyStatuses,
    guessHistory,
    gameOver,
    isWin
  } = useGameLogic(setShowGameOverModal);

  const {
    activeIndex,
    setActiveIndex,
    handleBackspace,
    handleKeyDown,
    handleKeyClick,
    handleTypedLetterGuess,
    handleClickBackOnGame
  } = useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSong, showHistoryModal);

  // Refocus game container for physical keyboard letter guesses after modal closes
  const refocusGameContainer = () => {
    setTimeout(() => {
      document.querySelector(".game-container")?.focus();
    }, 0);
  };

  // Toggle song guess modal and change button text
  const handleGuessSongButton = () => {
    setShowSongGuessModal(!showSongGuessModal)
    if (!showSongGuessModal) {
      setGuessButtonText("Return")
      setGameMode("song")
      openModal("songGuess");
    }
    else {
      setGuessButtonText("Guess Song")
      setGameMode("letter")
      closeModal("songGuess");
      refocusGameContainer();
    }
  }

  // Toggle history modal and change button text
  const handleHistoryButton = () => {
    setShowHistoryModal(!showHistoryModal)
    if (!showHistoryModal) {
      openModal("history");
      setHistoryButtonText("Close History")
    }
    else {
      closeModal("history");
      setHistoryButtonText("View History")
    }
  }

  // Handle game over modal close
  const handleGameOverModalClose = () => {
    setShowGameOverModal(!showGameOverModal);
    handleGuessSongButton();
  }

  // Open modals based on order
  const openModal = (modalName) => {
    setModalOrder((prevOrder) => [...prevOrder.filter((m) => m !== modalName), modalName]);
  };

  // Close modals based on order
  const closeModal = (modalName) => {
    setModalOrder((prevOrder) => prevOrder.filter((m) => m !== modalName));
  };

  // Reset game state and modals on new game
  const onReset = () => {
    pickRandomSong();
    if (showSongGuessModal) handleGuessSongButton(); // Keep song guess modal from reopening on new game
    if (showHistoryModal) handleHistoryButton(); // Keep history modal from reopening on new game
  }

  return (
    <>
      <div className="game-container" onClick={handleClickBackOnGame} onKeyDown={handleTypedLetterGuess} tabIndex={0}>
        <div className="header">Lotusify</div>
        <div className="body">
          <div className="blanks">{renderBlanks()}</div>
          {showHistoryModal && modalOrder.includes("history") && (
            <div>
              <HistoryModal
                guessHistory={guessHistory}
                onClickX={handleHistoryButton}
                isOnTop={modalOrder[modalOrder.length - 1] === "history"}
              />
            </div>
          )}
          {showSongGuessModal && !gameOver && modalOrder.includes("songGuess") && (
            <div>
              <SongGuessModal
                randomSong={randomSong}
                songGuess={songGuess}
                setSongGuess={setSongGuess}
                guessHistory={guessHistory}
                handleKeyDown={handleKeyDown}
                handleKeyClick={handleKeyClick}
                handleGuessSong={handleGuessSong}
                isOnTop={modalOrder[modalOrder.length - 1] === "songGuess"}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </div>
          )}
        </div>

        <div className="footer">
          <div>
            Guesses: {guessHistory.length}/12
            {!gameOver && (
              <button
                onClick={() => handleGuessSongButton()}
                onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
              >
                {guessButtonText}
              </button>
            )}
            <button
              onClick={() => handleHistoryButton()}
              onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
            >
              {historyButtonText}
            </button>
          </div>
          <Keyboard
            onKeyClick={handleKeyClick}
            keyStatuses={keyStatuses}
            handleBackspace={handleBackspace}
          />
        </div>

        {gameOver && (
          showGameOverModal ? (
            <GameOverModal
              isWin={isWin}
              numGuesses={guessHistory.length}
              solution={randomSong.name}
              onClickX={handleGameOverModalClose}
              onClickReset={onReset}
            />
          ) : (
            <button onClick={onReset}>Pick a Random Song</button>
          )
        )}
      </div>
    </>
  )
}

export default App
