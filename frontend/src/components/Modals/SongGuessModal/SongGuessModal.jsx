import './SongGuessModal.css'
import { isPunctuation as checkPunctuation } from '../../../utils/isPunctuation';
import { useEffect } from 'react';

// A modal that displays an active attempt at a full song title guess and pops up when the "Guess Song" button is pressed
export default function SongGuessModal({ randomSong, songGuess, guessHistory, handleKeyDown, handleKeyClick, handleGuessSong, isOnTop, activeIndex, setActiveIndex, showIncompleteMessage, buttonInvalid }) {
  const findFirstValidIndex = () => {
    let firstValidIndex = 0;
    // Skip leading punctuation at the start of the song title
    while (firstValidIndex < randomSong.name.length && checkPunctuation(randomSong.name[firstValidIndex])) {
      firstValidIndex++;
    }

    setActiveIndex(firstValidIndex); // Set focus to first valid letter
  }

  useEffect(() => {
    if (!randomSong) return;

    // If activeIndex is already valid, keep it. Otherwise, set to first valid index
    if (activeIndex === null || activeIndex < 0 || activeIndex >= randomSong.name.length || checkPunctuation(randomSong.name[activeIndex])) {
      findFirstValidIndex();
    }
  }, [randomSong]);

  // Reset active index when the guess song button is pressed
  const handleGuessButton = () => {
    handleGuessSong();
    findFirstValidIndex();
  }

  // Render interactive blanks for song title guess
  const renderInteractiveBlanks = () => {
    if (!randomSong) return null;

    let charCount = {}; // Track occurrences of each character so index is not duplicated on repeated characters

    return (
      <div className="interactive-blanks">
        {randomSong.name.split(" ").map((word, wordIndex) => (
          <div className="word-group" key={wordIndex}>
            {[...word].map((char) => {
              if (!charCount[char]) {
                charCount[char] = 0;
              }

              // Find correct global index by tracking per-character occurrences
              const globalIndex = [...randomSong.name].reduce((indexArray, currentChar, index) => {
                if (currentChar === char) indexArray.push(index);
                return indexArray;
              }, [])[charCount[char]]; // Get the Nth occurrence of a character

              charCount[char]++; // Increment count for next occurrences

              const isPunctuation = checkPunctuation(char);
              const guessedLetter = songGuess[globalIndex];
              const correctGuesses = guessHistory.filter(
                (entry) => entry.correct && entry.guess.toLowerCase() === char.toLowerCase()
              );
              const placeholder = correctGuesses.length > 0 ? char.toUpperCase() : "";

              return (
                <input
                  data-index={globalIndex}
                  id={globalIndex}
                  key={globalIndex}
                  className={`interactive-blank ${isPunctuation ? "punctuation" : ""} ${activeIndex === globalIndex ? "active-input" : ""}`}
                  type="text"
                  maxLength={1}
                  disabled={isPunctuation} // Punctuation stays visible but uneditable
                  autoComplete="off"
                  readOnly
                  value={guessedLetter || ""}
                  placeholder={!isPunctuation ? placeholder || "" : ""}
                  onFocus={() => setActiveIndex(globalIndex)}
                  onChange={(e) => handleKeyClick(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="song-guess-modal-background" style={{ zIndex: isOnTop ? 1001 : 1000 }}>
      <div className="song-guess-modal-content" onClick={e => e.stopPropagation()}>
        <div className="guess-input-wrapper">
          <div
            className={`input-tooltip ${showIncompleteMessage ? "show" : ""}`}
            aria-live="polite"
          >
            Please fill in all spaces
          </div>
          {renderInteractiveBlanks()}
        </div>
        <button
          className={`guess-button ${buttonInvalid ? "invalid" : ""}`}
          onClick={handleGuessButton}
        >
          Guess Song
        </button>
      </div>
    </div >
  )
}