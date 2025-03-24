import { useState } from 'react';
import './Keyboard.css'

// An on-screen keyboard for typing guesses
export default function Keyboard({ onKeyClick, keyStatuses, handleBackspace }) {
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
          aria-label={key}
          onClick={() => onKeyClick(key)}
          onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
        >
          {key}
        </button>
      ))
    )
  };

  const fillLargeKeys = (onClick, content, ariaLabel) => {
    return (
      <button
        className="key key-large"
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()} // Prevents focus on mousedown
      >
        {content}
      </button>
    )
  }

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
            {fillLargeKeys(() => setShowNumKeys(true), "123", "Switch to number keys")}
            {fillKeys(letterKeys, 19)}
            {fillLargeKeys(handleBackspace, "⌫", "Backspace")}
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
            {fillLargeKeys(() => setShowNumKeys(false), "ABC", "Switch to letter keys")}
            {fillLargeKeys(handleBackspace, "⌫", "Backspace")}
          </div>
        </>
      )}
    </div >
  );
};
