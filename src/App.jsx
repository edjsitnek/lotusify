import './App.css'
import Keyboard from './components/Keyboard/Keyboard'

function App() {

  return (
    <>
      <div className="game-container">
        <div className="header">
          Lotusify
        </div>
        <div className="body">
          <p>_ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Guesses 0/13</p>
          <Keyboard />
        </div>
        <div className="footer">

        </div>
      </div>
    </>
  )
}

export default App
