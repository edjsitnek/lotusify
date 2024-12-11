import './App.css'
import Keyboard from './components/Keyboard/Keyboard'
import useGameLogic from './hooks/useGameLogic'

function App() {
  const { pickRandomSong, randomSong } = useGameLogic();

  return (
    <>
      <div className="game-container">
        <div className="header">
          Lotusify
        </div>
        <div className="body">
          <button onClick={pickRandomSong}>Pick a Random Song</button>
          <p>{randomSong && randomSong.name}</p>
          <p>_ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Guesses 0/10</p>
          <Keyboard />
        </div>
        <div className="footer">

        </div>
      </div>
    </>
  )
}

export default App
