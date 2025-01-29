import './SongGuessModal.css'
import { useEffect } from 'react';

// A modal that displays an active attempt at a full song title guess and pops up when the "Guess Song" button is pressed
export default function SongGuessModal({ randomSong, songGuess, setSongGuess, guessHistory, handleGuessSongSubmit, onClickX }) {
  // Focus on the first blank when the modal opens
  useEffect(() => {
    if (randomSong) {
      const firstInput = document.querySelector(".interactive-blanks input:not([disabled])");
      firstInput?.focus();
    }
  }, [randomSong]);

  useEffect(() => {
    console.log("songGuess updated:", songGuess);
  }, [songGuess]);


  // Close the modal
  const exitModal = () => {
    onClickX(false);
  }

  // Handle input change for each blank
  const handleInputChange = (value, index) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // Prevent non-alphanumeric input

    // Update song guess state
    const updatedGuess = [...songGuess];

    if (updatedGuess[index] === " ") return;

    updatedGuess[index] = value.toUpperCase();
    setSongGuess(updatedGuess);

    // Automatically move to the next blank if valid input, skipping spaces
    let nextIndex = index + 1;
    while (randomSong.name[nextIndex] === " " && nextIndex < randomSong.name.length) {
      nextIndex++;
    }
    const nextInput = document.querySelector(`input:nth-child(${nextIndex + 1})`);
    nextInput?.focus();
  };

  // Handle backspace key press
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const updatedGuess = [...songGuess];

      if (updatedGuess[index]) {
        // First backspace: clear the current input
        updatedGuess[index] = "";
        setSongGuess(updatedGuess);
      } else if (index > 0) {
        // Second backspace: move focus to the previous blank and clear
        let prevIndex = index - 1;
        while (randomSong.name[prevIndex] === " " && prevIndex >= 0) {
          prevIndex--;
        }

        updatedGuess[prevIndex] = ""; // Clear previous input
        setSongGuess(updatedGuess);

        const prevInput = document.querySelector(`input:nth-child(${prevIndex + 1})`);
        prevInput?.focus();
      }
    }
  };

  // Render interactive blanks for song title guess
  const renderInteractiveBlanks = () => {
    if (!randomSong) return null;

    return (
      <div className="interactive-blanks">
        {randomSong.name.split("").map((char, index) => {
          const isSpace = char === " ";
          const guessedLetter = songGuess[index];
          const correctGuesses = guessHistory.filter(
            (entry) => entry.correct && entry.guess.toLowerCase() === char.toLowerCase()
          );
          const placeholder = correctGuesses.length > 0 ? char.toUpperCase() : "";

          return (
            <input
              id={index}
              key={index}
              className={isSpace ? "space" : "interactive-blank"}
              type="text"
              maxLength={1}
              disabled={isSpace} // Disable input for spaces
              value={guessedLetter || ""} // Show guessed letters
              placeholder={!isSpace ? placeholder : ""} // Faded placeholder for correctly guessed blanks
              onFocus={(e) => e.target.select()} // Highlight value
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="song-guess-modal-background" onClick={exitModal}>
      <div className="song-guess-modal-content" onClick={e => e.stopPropagation()}>
        {renderInteractiveBlanks()}
        <button onClick={handleGuessSongSubmit}>
          Guess Song
        </button>
      </div>
    </div >
  )
}