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
          <p>Guesses: {guessedLetters.length}/10</p>
          <Keyboard onKeyPress={handleKeyboardClick} />
        </div>
        <div className="footer">

        </div>
      </div>
    </>
  )
}

export default App
