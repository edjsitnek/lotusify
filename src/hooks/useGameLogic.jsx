import { useState, useEffect } from "react";
import { isPunctuation } from "../utils/isPunctuation";

export default function useGameLogic(setShowGameOverModal) {
  const initialHints = [
    { slot: "Hint 1", title: "", value: "", unlocked: false, revealed: false },
    { slot: "Hint 2", title: "", value: "", unlocked: false, revealed: false },
    { slot: "Hint 3", title: "", value: "", unlocked: false, revealed: false }
  ]

  const defaultStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: 0,
    totalGuesses: 0,
    averageGuesses: 0
  };

  const initializeStats = () => {
    const savedStats = localStorage.getItem('stats');
    return savedStats ? JSON.parse(savedStats) : defaultStats;
  }

  const [songs, setSongs] = useState([]); // List of songs to pull the answer from
  const [randomSong, setRandomSong] = useState(null); // Random song which is the answer to the current game
  const [songGuess, setSongGuess] = useState(""); // Temporarily hold user input for song title guess
  const [guessHistory, setGuessHistory] = useState([]); // History of all guesses in one game
  const [keyStatuses, setKeyStatuses] = useState([]); // Statuses for correct or incorrect guessed letter keys
  const [gameOver, setGameOver] = useState(false); // Keep track of game over state
  const [isWin, setIsWin] = useState(false); // Track if the game over is a win or not
  const [hints, setHints] = useState(initialHints); // List of hints to display
  const [showHints, setShowHints] = useState(false); // Track if hints are shown
  const [stats, setStats] = useState(initializeStats); // Track statistics of previous games played

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
      setSongGuess(randomSong.name.split("").map((char) => (/[a-zA-Z0-9]/.test(char) ? "" : char)));
    }
  }, [randomSong]);

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

  // Update local storage whenever stats change
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats])

  // Pick the song to be guessed from loaded song list
  const pickRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setRandomSong(songs[randomIndex]);
      setGuessHistory([]); // Reset guesses when new song is picked
      setKeyStatuses([]); // Reset key statuses
      setGameOver(false); // Reset game over state
      setIsWin(false); // Reset win state
      setHints(initialHints); // Reset hints
      setShowHints(false); // Reset show hints
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
        char === " " || isPunctuation(char) ||
        [...guessHistory, { guess: letter, correct }].some(
          (entry) => entry.guess.toLowerCase() === char.toLowerCase() && entry.correct
        )
      );
    });

    // Check if game is over
    if (allFilled || guessHistory.length + 1 >= 12) {
      if (allFilled) {
        setIsWin(true);
        handleStatistics(true);
      } else handleStatistics(false);

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
    setSongGuess(randomSong.name.split("").map((char) => (/[a-zA-Z0-9]/.test(char) ? "" : char))) // Reset input after submission

    // Check if game is over
    if (correct || guessHistory.length + 1 >= 12) {
      if (correct) {
        setIsWin(true);
        handleStatistics(true);
      } else handleStatistics(false);

      setGameOver(true);
      setShowGameOverModal(true);
    }
  };

  // Update statistics for games played, games won, total guesses, average guesses, and win percentage
  const handleStatistics = (isWin) => {
    setStats((prevStats) => {
      const updatedStats = { ...prevStats };

      // Increment games played
      updatedStats.gamesPlayed += 1;

      if (isWin) {
        // Increment games won
        updatedStats.gamesWon += 1;

        // Add guesses to total guesses
        updatedStats.totalGuesses += guessHistory.length + 1;

        // Calculate average guesses
        updatedStats.averageGuesses = (
          updatedStats.totalGuesses / updatedStats.gamesWon
        ).toFixed(2); // Round to 2 decimal places
      }

      // Update win percentage
      updatedStats.winPercentage = Math.round(
        (updatedStats.gamesWon / updatedStats.gamesPlayed) * 100
      );

      return updatedStats;
    })
  }

  // Reset stats when "Reset Stats" button is clicked
  const resetStats = () => {
    localStorage.clear();
    setStats(defaultStats);
  }

  // Render blanks for letter guess mode
  const renderBlanks = () => {
    if (!randomSong) return null;

    return randomSong.name.split("").map((char, index) => {
      const isSpace = char === " ";
      // Check if the char has been guessed
      const isGuessed = guessHistory.some(
        (entry) => entry.guess.toLowerCase() === char.toLowerCase() && entry.correct
      );

      // Auto-populate spaces & punctuation, otherwise show guessed letters or blanks
      const displayChar = isSpace || isPunctuation(char) ? char : isGuessed ? char : "_";
      const className = isGuessed || isPunctuation(char) ? "revealed punctuation" : "";

      return (
        <span key={index} className={className}>
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
    isWin,
    hints,
    setHints,
    showHints,
    setShowHints,
    stats,
    resetStats
  };
}