import { useState, useEffect } from "react";
import { isPunctuation } from "../utils/isPunctuation";

export default function useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSong, anyModalOpen) {
  const [activeIndex, setActiveIndex] = useState(0); // Track the active input index for song guesses

  // Refocus on active input whenever it changes
  useEffect(() => {
    const activeInput = document.querySelector(`input[data-index="${activeIndex}"]`);
    if (gameMode === "song") {
      if (activeInput) {
        activeInput.classList.add("active-input"); // Use dynamic class on active input so the color doesn't blink when refocusing
        activeInput.focus();
      }
    }
  }, [activeIndex, gameMode]);

  // Refocus on the active input when clicking back on the game container
  const handleClickBackOnGame = (e) => {
    if (gameMode === "song" && !e.target.closest("button, .modal")) {
      setTimeout(() => {
        const activeInput = document.querySelector(`input[data-index="${activeIndex}"]`);
        activeInput?.focus();
      }, 0);
    }
  };

  // Handle input change for each blank for a song title guess
  const handleInputChange = (value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // Prevent non-alphanumeric input

    // Update song guess state
    const updatedGuess = [...songGuess];
    updatedGuess[activeIndex] = value.toUpperCase();
    setSongGuess(updatedGuess);

    // Automatically move to the next blank if valid input, skipping spaces and punctuation
    let nextIndex = activeIndex + 1;
    while (randomSong.name[nextIndex] === " " || isPunctuation(randomSong.name[nextIndex]) && nextIndex < randomSong.name.length) {
      nextIndex++;
    }
    if (nextIndex < songGuess.length) {
      setActiveIndex(nextIndex);
    }
  };

  // Handle the backspace action for physical and onscreen keyboard
  const handleBackspace = () => {
    const updatedGuess = [...songGuess];

    if (updatedGuess[activeIndex]) {
      // First backspace: clear the current input
      updatedGuess[activeIndex] = "";
      setSongGuess(updatedGuess);
    } else {
      // Second backspace: move focus to the previous blank and clear
      let prevIndex = activeIndex - 1;
      while (randomSong.name[prevIndex] === " " || isPunctuation(randomSong.name[prevIndex]) && prevIndex >= 0) {
        prevIndex--;
      }

      if (prevIndex >= 0) {
        updatedGuess[prevIndex] = ""; // Clear previous input
        setSongGuess(updatedGuess);
        setActiveIndex(prevIndex); // Move focus back
      }
    }
  }

  // Handle physical keyboard input for letter guesses
  const handleTypedLetterGuess = (e) => {
    if (!anyModalOpen) {
      if (gameMode === "letter") {
        if (/^[a-zA-Z0-9]$/.test(e.key)) {
          handleGuessLetter(e.key.toUpperCase());
        }
      }
    }
  }

  // Handle physical keyboard input for song guesses
  const handleKeyDown = (e) => {
    if (!anyModalOpen) {
      if (gameMode === "song") {
        if (e.key === "Backspace") {
          e.preventDefault();
          handleBackspace();
        }
        else if (e.key === "Enter") {
          handleGuessSong();
          let firstValidIndex = 0;
          // Skip leading punctuation at the start of the song title
          while (firstValidIndex < randomSong.name.length && isPunctuation(randomSong.name[firstValidIndex])) {
            firstValidIndex++;
          }

          setActiveIndex(firstValidIndex); // Set focus to first valid letter
        }
        else if (/^[a-zA-Z0-9]$/.test(e.key)) {  // If a letter or number is pressed
          e.preventDefault();
          handleInputChange(e.key);
        }
        else if (e.key === "ArrowLeft") {
          let prevIndex = activeIndex - 1;
          while (prevIndex >= 0 && (randomSong.name[prevIndex] === " " || isPunctuation(randomSong.name[prevIndex]))) {
            prevIndex--; // Skip spaces and punctuation
          }
          const firstValidIndex = randomSong.name.split("").findIndex(char => !isPunctuation(char));
          setActiveIndex(Math.max(firstValidIndex, prevIndex));
        }
        else if (e.key === "ArrowRight") {
          let nextIndex = activeIndex + 1;
          while (nextIndex < songGuess.length && (randomSong.name[nextIndex] === " " || isPunctuation(randomSong.name[nextIndex]))) {
            nextIndex++; // Skip spaces and punctuation
          }
          // Prevent going past the last non-punctuation character
          if (nextIndex < songGuess.length && !isPunctuation(randomSong.name[nextIndex])) {
            setActiveIndex(nextIndex);
          }
        }
      }
    }
  };

  // Handle onscreen keyboard input
  const handleKeyClick = (key) => {
    if (!anyModalOpen) {
      if (gameMode === "letter") {
        handleGuessLetter(key);
      }
      else if (gameMode === "song") {
        handleInputChange(key);
      }
    }
  };

  return { activeIndex, setActiveIndex, handleBackspace, handleKeyDown, handleKeyClick, handleTypedLetterGuess, handleClickBackOnGame }
}