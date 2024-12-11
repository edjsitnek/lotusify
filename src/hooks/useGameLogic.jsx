import { useState, useEffect } from "react";

export default function useGameLogic() {
  const [songs, setSongs] = useState([]);
  const [randomSong, setRandomSong] = useState(null);

  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => {
        setSongs(data)
      })
      .catch((error) => console.error("Error loading songs:", error));
  }, []);

  const pickRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setRandomSong(songs[randomIndex]);
    }
  };

  return { pickRandomSong, randomSong };
}