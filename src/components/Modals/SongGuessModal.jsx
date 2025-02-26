import './SongGuessModal.css'
import { isPunctuation as checkPunctuation } from '../../utils/isPunctuation';
import { useEffect } from 'react';

// A modal that displays an active attempt at a full song title guess and pops up when the "Guess Song" button is pressed
export default function SongGuessModal({ randomSong, songGuess, guessHistory, handleKeyDown, handleKeyClick, handleGuessSong, isOnTop, activeIndex, setActiveIndex }) {
  const findFirstValidIndex = () => {
    let firstValidIndex = 0;
    // Skip leading punctuation at the start of the song title
    while (firstValidIndex < randomSong.name.length && checkPunctuation(randomSong.name[firstValidIndex])) {
      firstValidIndex++;
    }

    setActiveIndex(firstValidIndex); // Set focus to first valid letter
  }

  useEffect(() => {
    findFirstValidIndex();
  }, [randomSong]);

  // Reset active index when the guess song button is pressed
  const handleGuessButton = () => {
    handleGuessSong();
    findFirstValidIndex();
  }

  // Render interactive blanks for song title guess
  const renderInteractiveBlanks = () => {
    if (!randomSong) return null;

    return (
      <div className="interactive-blanks">
        {randomSong.name.split("").map((char, index) => {
          const isSpace = char === " ";
          const isPunctuation = checkPunctuation(char);
          const guessedLetter = songGuess[index];
          const correctGuesses = guessHistory.filter(
            (entry) => entry.correct && entry.guess.toLowerCase() === char.toLowerCase()
          );
          const placeholder = correctGuesses.length > 0 ? char.toUpperCase() : "";

          return (
            <input
              data-index={index}
              id={index}
              key={index}
              className={`
                ${isSpace ? "space" : "interactive-blank"}
                ${isPunctuation ? "punctuation" : "interactive-blank"} 
                ${activeIndex === index ? "active-input" : ""}
                `}
              type="text"
              maxLength={1}
              disabled={isSpace || isPunctuation} // Disable input for spaces and punctuation
              autoComplete="off"
              readOnly
              value={guessedLetter || ""} // Show guessed letters
              placeholder={!isSpace && !isPunctuation ? placeholder : ""} // Faded placeholder for correctly guessed blanks
              onFocus={() => setActiveIndex(index)} // Highlight value
              onChange={(e) => handleKeyClick(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="song-guess-modal-background" style={{ zIndex: isOnTop ? 1001 : 1000 }}>
      <div className="song-guess-modal-content" onClick={e => e.stopPropagation()}>
        {renderInteractiveBlanks()}
        <button onClick={handleGuessButton}>Guess Song</button>
      </div>
    </div >
  )
}