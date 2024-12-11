import './Keyboard.css'

// An on-screen keyboard for typing guesses
export default function Keyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

  // Fills in letter keys to keyboard rows according to slice start and end parameters
  const fillLetterKeys = (start, end) => {
    return (
      keys.slice(start, end).map((key, i) => (
        <button key={i} className={"key"} >
          {key}
        </button>
      ))
    )
  };

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {fillLetterKeys(0, 10)}
      </div>
      <div className="keyboard-row">
        {fillLetterKeys(10, 19)}
      </div>
      <div className="keyboard-row">
        <button className="key key-large">
          123*
        </button>
        {fillLetterKeys(19)}
        <button className="key key-large">
          ⌫
        </button>
      </div>
    </div>
  );
};
