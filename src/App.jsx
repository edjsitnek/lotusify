import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import useGameLogic from './hooks/useGameLogic'

function App() {
  const {
    pickRandomSong,
    randomSong,
    guessedLetters,
    handleGuess,
    renderBlanks,
    keyStatuses
  } = useGameLogic();

  const handleKeyboardClick = (letter) => {
    handleGuess(letter);
  };

  return (
    <>
      <div className="game-container">
        <div className="header">Lotusify</div>
        <div className="body">
          <button onClick={pickRandomSong}>Pick a Random Song</button>
          <div className="blanks">{renderBlanks()}</div>
          <p>{randomSong && randomSong.name}</p>
          <div>
            Guesses: {guessedLetters.length}/13
            <button>Guess Song</button>
            <button>View Guess History</button>
          </div>

          <Keyboard onKeyPress={handleKeyboardClick} keyStatuses={keyStatuses} />
        </div>
        <div className="footer">

        </div>
      </div>
    </>
  )
}

export default App
