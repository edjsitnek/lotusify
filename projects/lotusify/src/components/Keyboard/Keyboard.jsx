import { useState } from 'react';
import './Keyboard.css'

// An on-screen keyboard for typing guesses
export default function Keyboard({ onKeyPress, keyStatuses, handleBackspace }) {
  const [showNumKeys, setShowNumKeys] = useState(false); // Switch between letter and number keyboards
  const letterKeys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  const numKeys = "1234567890".split("");

  // Fills in keys to keyboard rows according to slice start and end parameters
  const fillKeys = (keys, start, end) => {
    return (
      keys.slice(start, end).map((key, i) => (
        <button
          key={i}
          className={`key ${keyStatuses[key] || ''}`} // Gets the key status or returns empty string
          onClick={() => onKeyPress(key)}
          onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
        >
          {key}
        </button>
      ))
    )
  };

  return (
    <div className="keyboard">
      {!showNumKeys ? ( // Keyboard display with letter keys
        <>
          <div className="keyboard-row">
            {fillKeys(letterKeys, 0, 10)}
          </div>
          <div className="keyboard-row">
            {fillKeys(letterKeys, 10, 19)}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => setShowNumKeys(true)}>
              123*
            </button>
            {fillKeys(letterKeys, 19)}
            <button className="key key-large" onClick={handleBackspace}>
              ⌫
            </button>
          </div>
        </>
      ) : ( // Keyboard display with number keys
        <>
          <div className="keyboard-row">
            {fillKeys(numKeys, 0, 5)}
          </div>
          <div className="keyboard-row">
            {fillKeys(numKeys, 5)}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => setShowNumKeys(false)} >
              ABC
            </button>
            <button className="key key-large" onClick={handleBackspace}>
              ⌫
            </button>
          </div>
        </>
      )}
    </div >
  );
};
