export default function useKeyboard(randomSong, songGuess, setSongGuess, gameMode, handleGuessLetter, handleGuessSong, showHistoryModal) {
  // Handle the backspace action for physical and onscreen keyboard
  const handleBackspace = (index) => {
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

  // Handle backspace, enter, left arrow, and right arrow key presses
  const handleKeyDown = (e, index) => {
    if (gameMode === "letter") {
      handleGuessLetter(e.key);
    }
    else if (gameMode === "song") {
      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace(index);
      }
      else if (e.key === "Enter") {
        handleGuessSong();
        const firstInput = document.querySelector(".interactive-blanks input:not([disabled])");
        firstInput?.focus();
      }
      else if (e.key === "ArrowLeft") {
        let prevIndex = index - 1;
        while (randomSong.name[prevIndex] === " " && prevIndex >= 0) {
          prevIndex--;
        }

        setTimeout(() => {
          const prevInput = document.querySelector(`input:nth-child(${prevIndex + 1})`);
          prevInput?.focus();
          prevInput?.select();
        }, 0);
      }
      else if (e.key === "ArrowRight") {
        let nextIndex = index + 1;
        while (randomSong.name[nextIndex] === " " && nextIndex < randomSong.name.length) {
          nextIndex++;
        }

        setTimeout(() => {
          const nextInput = document.querySelector(`input:nth-child(${nextIndex + 1})`);
          nextInput?.focus();
          nextInput?.select();
        }, 0);
      }
    }
  };

  // Handle onscreen keyboard clicks 
  const handleOnscreenKeyboard = (key) => {
    if (!showHistoryModal) {
      if (gameMode === "letter") {
        handleGuessLetter(key);
      }
      else if (gameMode === "song") {
        const firstEmptyIndex = songGuess.findIndex((char) => !char);
        if (firstEmptyIndex !== -1) {
          const updatedGuess = [...songGuess];
          updatedGuess[firstEmptyIndex] = key.toUpperCase();
          setSongGuess(updatedGuess);
        }
        if (key === "BACKSPACE") handleBackspace()
      }
    }
  };

  return { handleBackspace, handleKeyDown, handleOnscreenKeyboard }
}