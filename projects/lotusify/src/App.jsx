import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/Modals/GameOverModal';
import HistoryModal from './components/Modals/HistoryModal';
import SongGuessModal from './components/Modals/SongGuessModal';
import useGameLogic from './hooks/useGameLogic'
import useKeyboard from './hooks/useKeyboard';
import { useState, useEffect } from 'react';

function App() {
  const [gameMode, setGameMode] = useState("letter"); // Track if game is in letter guess or song guess mode
  const [showHistory, setShowHistory] = useState(false); // Track if show history modal is on the screen
  const [showSongGuess, setShowSongGuess] = useState(false); // Track if song guess modal is on the screen
  const [modalOrder, setModalOrder] = useState([]); // Track modal stacking order
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

  // Handle song title guesses
  const handleGuessSongSubmit = () => {
    if (!gameOver) {
      handleGuessSong(songGuess, setSongGuess);
      setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : ""))) // Reset input after submission
    }
  }

  // Initialize songGuess with blanks, if applicable
  useEffect(() => {
    if (randomSong) {
      setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : "")));
    }
  }, [randomSong]);

  const {
    handleBackspace,
    handleKeyDown,
  } = useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSongSubmit);


  // useEffect(() => {
  //   console.log("gameMode updated:", gameMode);
  // }, [gameMode]);

  // Handle onscreen keyboard clicks 
  const handleOnscreenKeyboard = (key) => {
    if (!showHistory) {
      if (gameMode === "letter") {
        handleGuessLetter(key);
      }
      else if (gameMode === "song") {
        const firstEmptyIndex = songGuess.findIndex((char) => !char);
        if (firstEmptyIndex !== -1) {
          const updatedGuess = [...songGuess];
          updatedGuess[firstEmptyIndex] = key.toUpperCase();
          setSongGuess(updatedGuess);
        }
        if (key === "BACKSPACE") handleBackspace()
      }
    }
  };

  // Toggle history modal and change button text
  const handleHistoryButton = () => {
    setShowHistory(!showHistory)
    if (!showHistory) {
      openModal("history");
      setHistoryButtonText("Close History")
    }
    else {
      closeModal("history");
      setHistoryButtonText("View History")
    }
  }

  // Toggle song guess modal and change button text
  const handleGuessSongButton = () => {
    setShowSongGuess(!showSongGuess)
    if (!showSongGuess) {
      setGuessButtonText("Return")
      setGameMode("song")
      openModal("songGuess");
    }
    else {
      setGuessButtonText("Guess Song")
      closeModal("songGuess");
      setGameMode("letter")
    }
  }

  // Handle game over modal close
  const handleGameOverModalClose = () => {
    setGameOverModalOpen(!gameOverModalOpen);
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

  return (
    <>
      <div className="game-container">
        <div className="header">Lotusify</div>

        <div className="body">
          <div className="blanks">{renderBlanks()}</div>
          {showHistory && modalOrder.includes("history") && (
            <div>
              <HistoryModal
                guessHistory={guessHistory}
                onClickX={handleHistoryButton}
                isOnTop={modalOrder[modalOrder.length - 1] === "history"}
              />
            </div>
          )}
          {showSongGuess && !gameOver && modalOrder.includes("songGuess") && (
            <div>
              <SongGuessModal
                randomSong={randomSong}
                songGuess={songGuess}
                setSongGuess={setSongGuess}
                guessHistory={guessHistory}
                handleKeyDown={handleKeyDown}
                handleGuessSongSubmit={handleGuessSongSubmit}
                isOnTop={modalOrder[modalOrder.length - 1] === "songGuess"}
              />
            </div>
          )}
        </div>

        <div className="footer">
          <div>
            Guesses: {guessHistory.length}/12
            {!gameOver && (
              <button onClick={() => handleGuessSongButton()}>{guessButtonText}</button>
            )}
            <button onClick={() => handleHistoryButton()}>{historyButtonText}</button>
          </div>

          <Keyboard
            onKeyPress={handleOnscreenKeyboard}
            keyStatuses={keyStatuses}
            handleBackspace={handleBackspace}
          />
        </div>
        {gameOver && (
          gameOverModalOpen ? (
            <GameOverModal
              isWin={isWin}
              numGuesses={guessHistory.length}
              solution={randomSong.name}
              onClickX={handleGameOverModalClose}
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
