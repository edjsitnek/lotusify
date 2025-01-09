import { useState, useEffect } from "react";

export default function useGameLogic() {
  const [songs, setSongs] = useState([]);
  const [randomSong, setRandomSong] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);

  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error loading songs:", error));
  }, []);

  const pickRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setRandomSong(songs[randomIndex]);
      setGuessedLetters([]); // Reset guesses when new song is picked
    }
  };

  const handleGuess = (letter) => {
    // Add guessed letter if not already guessed
    setGuessedLetters((prevGuessed) =>
      prevGuessed.includes(letter.toLowerCase()) ? prevGuessed : [...prevGuessed, letter.toLowerCase()]
    );
  };

  const renderBlanks = () => {
    if (!randomSong) return null;

    return randomSong.name.split("").map((char, index) => {
      // Check if the char has been guessed
      const isGuessed = guessedLetters.includes(char.toLowerCase());
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

  return { pickRandomSong, randomSong, guessedLetters, handleGuess, renderBlanks };
}