import { useState } from 'react';
import './Keyboard.css'

// An on-screen keyboard for typing guesses
export default function Keyboard({ onKeyPress, keyStatuses }) {
  const [showNumKeys, setShowNumKeys] = useState(false); // Switch between letter and number/special character keyboards
  const letterKeys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  const numChars = "1234567890!?&-'.()".split("");

  // Fills in keys to keyboard rows according to slice start and end parameters
  const fillKeys = (keys, start, end) => {
    return (
      keys.slice(start, end).map((key, i) => (
        <button
          key={i}
          className={`key ${keyStatuses[key] || ''}`} // Gets the key status or returns empty string
          onClick={() => onKeyPress(key)}
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
            <button className="key key-large">
              ⌫
            </button>
          </div>
        </>
      ) : ( // Keyboard display with numbers and special characters
        <>
          <div className="keyboard-row">
            {fillKeys(numChars, 0, 10)}
          </div>
          <div className="keyboard-row">
            {fillKeys(numChars, 10)}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => setShowNumKeys(false)} >
              ABC
            </button>
            <button className="key key-large">
              ⌫
            </button>
          </div>
        </>
      )}
    </div >
  );
};
