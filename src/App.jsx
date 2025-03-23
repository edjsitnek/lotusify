import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import GameOverModal from './components/Modals/GameOverModal/GameOverModal';
import HistoryModal from './components/Modals/HistoryModal/HistoryModal';
import SongGuessModal from './components/Modals/SongGuessModal/SongGuessModal';
import InstructionsModal from './components/Modals/InstructionsModal/InstructionsModal';
import StatisticsModal from './components/Modals/StatisticsModal/StatisticsModal';
import HintPanel from './components/HintPanel/HintPanel';
import useGameLogic from './hooks/useGameLogic'
import useKeyboard from './hooks/useKeyboard';
import { useEffect, useState, useRef } from 'react';
import logo from './assets/lotusifyLogo.png';
import statsIcon from './assets/statsIcon.png';
import infoIcon from './assets/infoIcon.png';

function App() {
  const [gameMode, setGameMode] = useState("letter"); // Track if game is in letter guess or song guess mode
  const [showHistoryModal, setShowHistoryModal] = useState(false); // Track if show history modal is on the screen
  const [showSongGuessModal, setShowSongGuessModal] = useState(false); // Track if song guess modal is on the screen
  const [showInstructionsModal, setShowInstructionsModal] = useState(false); // Track if instructions modal is on the screen
  const [showStatisticsModal, setShowStatisticsModal] = useState(false); // Track if statistics modal is on the screen
  const [showGameOverModal, setShowGameOverModal] = useState(false); // Track if game over modal is on the screen
  const [anyModalOpen, setAnyModalOpen] = useState(false); // Track if any modal is open
  const [modalOrder, setModalOrder] = useState([]); // Track modal stacking order
  const [historyButtonText, setHistoryButtonText] = useState("View History") // Change button text for history modal
  const [guessButtonText, setGuessButtonText] = useState("Guess Song") // Change button text for song guess modal

  const lastFocusedElement = useRef(null); // Used as a reference element to refocus on when modal is closed for accessibility
  const summaryButtonRef = useRef(null); // Used to focus on the summary button after the game over modal is closed

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
    isWin,
    hints,
    setHints,
    showHints,
    setShowHints,
    stats,
    resetStats
  } = useGameLogic(setShowGameOverModal);

  const {
    activeIndex,
    setActiveIndex,
    handleBackspace,
    handleKeyDown,
    handleKeyClick,
    handleTypedLetterGuess,
    handleClickBackOnGame
  } = useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSong, anyModalOpen);

  // Keep track of if any obstructing modal is open to prevent game input
  useEffect(() => {
    if (showHistoryModal || showInstructionsModal || showStatisticsModal) {
      setAnyModalOpen(true);
    }
    else {
      setAnyModalOpen(false);
    }
  }, [showHistoryModal, showSongGuessModal, showInstructionsModal, showStatisticsModal, showGameOverModal]);

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
      if (showHistoryModal) handleHistoryButton(); // Keep history modal from interfering with song guess modal
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

  // Toggle statistics modal
  const handleStatsButton = () => {
    lastFocusedElement.current = document.activeElement; // Store the last focused element
    setShowStatisticsModal(!showStatisticsModal);
    if (!showStatisticsModal) {
      openModal("statistics");
    }
    else {
      closeModal("statistics");
    }
  }

  // Toggle instructions modal
  const handleInfoButton = () => {
    lastFocusedElement.current = document.activeElement; // Store the last focused element
    setShowInstructionsModal(!showInstructionsModal);
    if (!showInstructionsModal) {
      openModal("instructions");
    }
    else {
      closeModal("instructions");
    }
  }

  // Toggle summary/game over modal
  const handleSummaryButton = () => {
    setShowGameOverModal(!showGameOverModal)
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
        <header className="header">
          <img src={logo} alt="Lotusify Logo" className="logo" />
          <div className="header-buttons">
            <button
              className="corner-button stats-button"
              aria-label="Statistics"
              onClick={() => handleStatsButton()}
            >
              <img src={statsIcon} alt="Statistics Icon" />
            </button>
            <button
              className="corner-button instructions-button"
              aria-label="Instructions"
              onClick={() => handleInfoButton()}
            >
              <img src={infoIcon} alt="Instructions Icon" />
            </button>
          </div>
        </header>
        <main className="body">
          <div className="letter-guess-container">
            <div className="blanks">{renderBlanks()}</div>
          </div>
          {showHistoryModal && modalOrder.includes("history") && (
            <HistoryModal
              guessHistory={guessHistory}
              onClickX={handleHistoryButton}
              isOnTop={modalOrder[modalOrder.length - 1] === "history"}
            />
          )}
          {showSongGuessModal && !gameOver && modalOrder.includes("songGuess") && (
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
              isSongGuessOpen={showSongGuessModal}
            />
          )}
          {!gameOver && !showSongGuessModal &&
            <HintPanel
              randomSong={randomSong}
              guessHistory={guessHistory}
              hints={hints}
              setHints={setHints}
              showHints={showHints}
              setShowHints={setShowHints}
            />}
          {gameOver && (
            <button
              className="summary-button"
              ref={summaryButtonRef}
              onClick={() => handleSummaryButton()}
              onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
            >
              View Summary
            </button>
          )}
        </main>
        <footer className="footer">
          <div>
            Guesses: {guessHistory.length}/12
            {!gameOver && (
              <button
                className={`${showSongGuessModal ? "active-button" : ""}`}
                onClick={() => handleGuessSongButton()}
                onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
              >
                {guessButtonText}
              </button>
            )}
            <button
              className={`${showHistoryModal ? "active-button" : ""}`}
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
        </footer>

        {showStatisticsModal && (
          <StatisticsModal
            stats={stats}
            resetStats={resetStats}
            showStatisticsModal={showStatisticsModal}
            lastFocusedElement={lastFocusedElement}
            isOnTop={modalOrder[modalOrder.length - 1] === "statistics"}
            onClickX={() => setShowStatisticsModal(!showStatisticsModal)}
          />
        )}
        {showInstructionsModal && (
          <InstructionsModal
            showInstructionsModal={showInstructionsModal}
            lastFocusedElement={lastFocusedElement}
            isOnTop={modalOrder[modalOrder.length - 1] === "instructions"}
            onClickX={() => setShowInstructionsModal(!showInstructionsModal)}
          />
        )}
        {gameOver && (
          showGameOverModal ? (
            <GameOverModal
              isWin={isWin}
              numGuesses={guessHistory.length}
              randomSong={randomSong}
              stats={stats}
              showGameOverModal={showGameOverModal}
              lastFocusedElement={lastFocusedElement}
              summaryButtonRef={summaryButtonRef}
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
