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

  const [randomSong, setRandomSong] = useState(null); // Random song which is the answer to the current game
  const [songGuess, setSongGuess] = useState(""); // Temporarily hold user input for song title guess
  const [guessHistory, setGuessHistory] = useState([]); // History of all guesses in one game
  const [keyStatuses, setKeyStatuses] = useState([]); // Statuses for correct or incorrect guessed letter keys
  const [gameOver, setGameOver] = useState(false); // Keep track of game over state
  const [isWin, setIsWin] = useState(false); // Track if the game over is a win or not
  const [hints, setHints] = useState(initialHints); // List of hints to display
  const [showHints, setShowHints] = useState(false); // Track if hints are shown
  const [stats, setStats] = useState(initializeStats); // Track statistics of previous games played
  const [showIncompleteMessage, setShowIncompleteMessage] = useState(false); // Track if the message for incomplete guesses is shown
  const [buttonInvalid, setButtonInvalid] = useState(false); // Track if the button has been pressed for an incomplete guess

  // Load daily song from backend or locally if in development environment
  useEffect(() => {
    const baseUrl = import.meta.env.DEV
      ? "http://localhost:8787"
      : "https://lotusify-game.com";

    fetch(`${baseUrl}/today`)
      .then(res => res.json())
      .then(data => {
        setRandomSong(data);

        // Clean up stale saved guesses from previous days
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("lotusify-guess-data-") && !key.endsWith(data.name)) {
            localStorage.removeItem(key);
          }
        });

        // Load saved game data from localStorage
        const key = `lotusify-guess-data-${data.name}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          setGuessHistory(parsed.guessHistory || []);
          setIsWin(parsed.isWin || false);
          setGameOver(parsed.gameOver || false);
          setSongGuess(parsed.songGuess || "");
        }
      })
      .catch(err => console.error("Failed to load daily song:", err));
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (!randomSong) return;
    const key = `lotusify-guess-data-${randomSong.name}`;
    const save = {
      guessHistory,
      isWin,
      gameOver,
      songGuess,
    };
    localStorage.setItem(key, JSON.stringify(save));
  }, [guessHistory, isWin, gameOver, songGuess, randomSong]);

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

  // Add guesses to history while handling duplicate guesses
  const addToHistory = (comparison, guessEntry, correct) => {
    setGuessHistory((prevHistory) =>
      prevHistory.some((entry) => entry.guess === comparison) ? prevHistory : [...prevHistory, { guess: guessEntry, correct }]
    );
  }

  // Posts to play-counter route to increment daily play counter
  const playCounter = () => {
    const baseUrl = import.meta.env.DEV
      ? "http://localhost:8787"
      : "https://lotusify-game.com";
    fetch(`${baseUrl}/play-counter`, {
      method: "POST",
    });
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
      playCounter();
    }
  };

  // Handle whole song title guesses
  const handleGuessSong = () => {
    if (gameOver || !randomSong) return;

    const joinedSongGuess = songGuess.join(""); // Convert songGuess array to string

    // Check if there are any blanks in the guess, prevent submission, and show message
    const isIncomplete = randomSong.name.split("").some((char, i) => /[a-zA-Z0-9]/.test(char) && songGuess[i] === "");
    if (isIncomplete) {
      setShowIncompleteMessage(true);
      setButtonInvalid(true);
      setTimeout(() => {
        setShowIncompleteMessage(false);
        setButtonInvalid(false);
      }, 2000);
      return;
    }

    const correct = joinedSongGuess.toLowerCase() === randomSong.name.toLowerCase();
    addToHistory(joinedSongGuess.toLowerCase(), joinedSongGuess, correct);
    setSongGuess(randomSong.name.split("").map((char) => (/[a-zA-Z0-9]/.test(char) ? "" : char))) // Reset input after submission

    // Check if game is over
    if (correct || guessHistory.length + 1 >= 12 && !isIncomplete) {
      if (correct) {
        setIsWin(true);
        handleStatistics(true);
      } else handleStatistics(false);

      setGameOver(true);
      setShowGameOverModal(true);
      playCounter();
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
    resetStats,
    showIncompleteMessage,
    buttonInvalid
  };
}