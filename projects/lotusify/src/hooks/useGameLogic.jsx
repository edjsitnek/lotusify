import { useState, useEffect } from "react";

export default function useGameLogic(setShowGameOverModal) {
  const [songs, setSongs] = useState([]); // List of songs to pull the answer from
  const [randomSong, setRandomSong] = useState(null); // Random song which is the answer to the current game
  const [songGuess, setSongGuess] = useState(""); // Temporarily hold user input for song title guess
  const [guessHistory, setGuessHistory] = useState([]); // History of all guesses in one game
  const [keyStatuses, setKeyStatuses] = useState([]); // Statuses for correct or incorrect guessed letter keys
  const [gameOver, setGameOver] = useState(false); // Keep track of game over state
  const [isWin, setIsWin] = useState(false); // Track if the game over is a win or not

  // Load list of songs
  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error loading songs:", error));
  }, []);

  // Automatically pick a random song on page load
  useEffect(() => {
    if (songs.length > 0) {
      pickRandomSong();
    }
  }, [songs]); // Run when songs file is loaded

  // Initialize songGuess with blanks, if applicable
  useEffect(() => {
    if (randomSong) {
      setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : "")));
    }
  }, [randomSong]);

  // Pick the song to be guessed from loaded song list
  const pickRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setRandomSong(songs[randomIndex]);
      setGuessHistory([]); // Reset guesses when new song is picked
      setKeyStatuses([]); // Reset key statuses
      setGameOver(false); // Reset game over state
      setIsWin(false); // Reset win state
    }
  };

  // Add guesses to history while handling duplicate guesses
  const addToHistory = (comparison, guessEntry, correct) => {
    setGuessHistory((prevHistory) =>
      prevHistory.some((entry) => entry.guess === comparison) ? prevHistory : [...prevHistory, { guess: guessEntry, correct }]
    );
  }

  // Handle single letter guesses
  const handleGuessLetter = (letter) => {
    if (gameOver || !randomSong) return;

    const correct = randomSong.name.toLowerCase().includes(letter.toLowerCase());
    addToHistory(letter, letter, correct);

    // Check if all of the blanks are filled for game over condition
    const allFilled = randomSong.name.split("").every((char) => {
      return (
        char === " " ||
        [...guessHistory, { guess: letter, correct }].some(
          (entry) => entry.guess.toLowerCase() === char.toLowerCase() && entry.correct
        )
      );
    });

    // Check if game is over
    if (allFilled || guessHistory.length + 1 >= 12) {
      if (allFilled) setIsWin(true);
      setGameOver(true);
      setShowGameOverModal(true);
    }
  };

  // Handle whole song title guesses
  const handleGuessSong = () => {
    if (gameOver || !randomSong) return;

    const joinedSongGuess = songGuess.join(""); // Convert songGuess array to string
    const correct = joinedSongGuess.toLowerCase() === randomSong.name.toLowerCase();
    addToHistory(joinedSongGuess.toLowerCase(), joinedSongGuess, correct);
    setSongGuess(randomSong.name.split("").map((char) => (char === " " ? " " : ""))) // Reset input after submission

    // Check if game is over
    if (correct || guessHistory.length + 1 >= 12) {
      if (correct) setIsWin(true);
      setGameOver(true);
      setShowGameOverModal(true);
    }
  };

  // Update key statuses whenever guessHistory or randomSong changes
  useEffect(() => {
    if (!randomSong) return;
    const newKeyStatuses = { ...keyStatuses };

    // Filter for single character guesses and update letter key colors
    guessHistory
      .filter((entry) => entry.guess.length === 1)
      .forEach((entry) => {
        const upperLetter = entry.guess.toUpperCase();
        if (randomSong.name.toUpperCase().includes(upperLetter)) {
          newKeyStatuses[upperLetter] = 'correct';
        } else {
          newKeyStatuses[upperLetter] = 'incorrect';
        }
      });
    setKeyStatuses(newKeyStatuses);
  }, [guessHistory, randomSong]);

  const renderBlanks = () => {
    if (!randomSong) return null;

    return randomSong.name.split("").map((char, index) => {
      // Check if the char has been guessed
      const isGuessed = guessHistory.some(
        (entry) => entry.guess.toLowerCase() === char.toLowerCase() && entry.correct
      );
      // If char is a space, display a space
      // If char has been guessed, display the char
      // If char has not been guessed, display underscore
      const displayChar = char === " " ? " " : isGuessed ? char : "_";

      return (
        <span key={index} className={isGuessed ? "revealed" : ""}>
          {displayChar}
        </span>
      );
    });
  };

  return {
    pickRandomSong,
    randomSong,
    songGuess,
    setSongGuess,
    handleGuessLetter,
    handleGuessSong,
    renderBlanks,
    keyStatuses,
    guessHistory,
    gameOver,
    isWin
  };
}