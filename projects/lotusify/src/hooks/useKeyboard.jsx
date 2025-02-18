import { useState, useEffect } from "react";

export default function useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSong, showHistoryModal) {
  const [activeIndex, setActiveIndex] = useState(0); // Track the active input index for song guesses

  // Refocus on active input whenever it changes
  useEffect(() => {
    const activeInput = document.querySelector(`input[data-index="${activeIndex}"]`);
    if (gameMode === "song") {
      if (activeInput) {
        activeInput.classList.add("active-input"); // Use dynamic class on active input so the color doesn't blink when refocusing
        activeInput.focus();
      }

      // Stay focused on the active input when clicking outside the modal
      const handleBlur = (e) => {
        if (!e.relatedTarget) {
          setTimeout(() => {
            activeInput?.focus();
          }, 0);
        }
      };
      document.addEventListener("blur", handleBlur, true);

      return () => {
        document.removeEventListener("blur", handleBlur, true);
      };
    }
  }, [activeIndex, gameMode]);

  // Handle input change for each blank for a song title guess
  const handleInputChange = (value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // Prevent non-alphanumeric input

    // Update song guess state
    const updatedGuess = [...songGuess];
    updatedGuess[activeIndex] = value.toUpperCase();
    setSongGuess(updatedGuess);

    // Automatically move to the next blank if valid input, skipping spaces
    let nextIndex = activeIndex + 1;
    while (randomSong.name[nextIndex] === " " && nextIndex < randomSong.name.length) {
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
      while (randomSong.name[prevIndex] === " " && prevIndex >= 0) {
        prevIndex--;
      }

      if (prevIndex >= 0) {
        updatedGuess[prevIndex] = ""; // Clear previous input
        setSongGuess(updatedGuess);
        setActiveIndex(prevIndex); // Move focus back
      }
    }
  }

  // Handle backspace, enter, left arrow, and right arrow key presses
  const handleKeyDown = (e) => {
    if (gameMode === "letter") {
      handleGuessLetter(e.key);
    }
    else if (gameMode === "song") {
      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      }
      else if (e.key === "Enter") {
        handleGuessSong();
        setActiveIndex(0);
      }
      else if (/^[a-zA-Z0-9]$/.test(e.key)) {  // If a letter or number is pressed
        e.preventDefault();
        handleKeyPress(e.key);
      }
      else if (e.key === "ArrowLeft") {
        let prevIndex = activeIndex - 1;
        while (prevIndex >= 0 && randomSong.name[prevIndex] === " ") {
          prevIndex--; // Skip spaces
        }
        setActiveIndex(Math.max(0, prevIndex)); // Prevent negative index
      }
      else if (e.key === "ArrowRight") {
        let nextIndex = activeIndex + 1;
        while (nextIndex < songGuess.length && randomSong.name[nextIndex] === " ") {
          nextIndex++; // Skip spaces
        }
        setActiveIndex(Math.min(songGuess.length - 1, nextIndex)); // Prevent out-of-bounds index
      }
    }
  };

  // Handle onscreen and physical keyboard interaction 
  const handleKeyPress = (key) => {
    if (!showHistoryModal) {
      if (gameMode === "letter") {
        handleGuessLetter(key);
      }
      else if (gameMode === "song") {
        handleInputChange(key);
      }
    }
  };

  return { activeIndex, setActiveIndex, handleBackspace, handleKeyDown, handleKeyPress }
}