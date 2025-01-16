import { useState, useEffect } from "react";

export default function useGameLogic() {
  const [songs, setSongs] = useState([]); // List of songs to pull the answer from
  const [randomSong, setRandomSong] = useState(null); // Random song which is the answer to the current game
  const [keyStatuses, setKeyStatuses] = useState([]); // Statuses for correct or incorrect guessed letter keys
  const [guessHistory, setGuessHistory] = useState([]); // History of all guesses in one game

  // Load list of songs
  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error loading songs:", error));
  }, []);

  // Pick the song to be guessed from loaded song list
  const pickRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setRandomSong(songs[randomIndex]);
      setGuessHistory([]); // Reset guesses when new song is picked
      setKeyStatuses([]); // Reset key statuses
    }
  };

  // Handle single letter guesses
  const handleGuessLetter = (letter) => {
    if (!randomSong) return;

    const correct = randomSong.name.toLowerCase().includes(letter.toLowerCase());

    // Prevent duplicate letter guesses
    setGuessHistory((prevHistory) =>
      prevHistory.some((entry) => entry.guess === letter) ? prevHistory : [...prevHistory, { guess: letter, correct }]
    );
  };

  // Handle whole song title guesses
  const handleGuessSong = (songGuess) => {
    if (!randomSong) return;

    const correct = songGuess.toLowerCase() === randomSong.name.toLowerCase();

    setGuessHistory((prevHistory) => [...prevHistory, { guess: songGuess, correct }]);

    if (correct) {
      alert("You guessed the song title correctly!");
    }
  }

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

  return { pickRandomSong, randomSong, handleGuessLetter, handleGuessSong, renderBlanks, keyStatuses, guessHistory };
}