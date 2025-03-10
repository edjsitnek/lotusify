import '../Modals/Modal.css'
import './HintPanel.css';
import { useState, useEffect } from "react";

export default function HintPanel({ randomSong, guessHistory, hints, setHints, showHints, setShowHints }) {
  const [enlargedImage, setEnlargedImage] = useState(null); // Track enlarged album art state

  // Update hints based on guess history with different hints for live only or studio songs
  useEffect(() => {
    if (!randomSong) return;

    let updatedHints = [...hints];

    if (guessHistory.length >= 3) {
      updatedHints[0] = {
        ...updatedHints[0],
        title: "Studio release or live only?",
        value: randomSong.liveOnly === true ? "Live Only" : "Studio Release",
        unlocked: true
      };
    }

    if (guessHistory.length >= 6) {
      updatedHints[1] = {
        ...updatedHints[1],
        title: randomSong.liveOnly === true ? "Year First Played" : "Year Released",
        value: randomSong.year,
        unlocked: true
      };
    }

    if (guessHistory.length >= 9) {
      updatedHints[2] = thirdHint(updatedHints);
    }

    setHints(updatedHints);
  }, [guessHistory]);

  // Generate third hint based on song properties
  const thirdHint = (updatedHints) => {
    let hintTitle = "";
    let hintValue = "";
    if (randomSong.liveOnly === false) {
      hintTitle = "Album Art";
      hintValue = randomSong.albumArt;
    }
    else if (randomSong.liveOnly === true && randomSong.album) {
      hintTitle = "Appears On"
      hintValue = randomSong.albumArt;
    }
    else if (randomSong.liveOnly === true && !randomSong.album) {
      hintTitle = "Times Played";
      hintValue = "TBD";
    }

    return {
      ...updatedHints[2],
      title: hintTitle,
      value: hintValue,
      unlocked: true
    }
  }

  // Reveal hint when unlocked
  const revealHint = (index) => {
    let updatedHints = [...hints];
    updatedHints[index].revealed = true;
    setHints(updatedHints);
  };

  // Enlarge album art on click
  const handleImageClick = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  // Close enlarged album art
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="hints-container">
      <button className={`${showHints ? "active-button" : ""}`} onClick={() => setShowHints(!showHints)}>
        {showHints ? "Hide Hints" : `View Hints (${hints.filter(h => h.unlocked).length})`}
      </button>

      {showHints && (
        <table className="hints-table">
          <thead>
            <tr>
              {hints.map((hint, index) => (
                <th key={index}>{hint.revealed ? hint.title : hint.slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {hints.map((hint, index) => (
                <td key={index}>
                  {hint.unlocked ? (
                    hint.revealed ? (
                      hint.title === "Album Art" || hint.title === "Appears On" ? (
                        <img
                          src={hint.value}
                          alt={`${randomSong.album} Album Art`}
                          className="album-cover"
                          onClick={() => handleImageClick(hint.value)}
                        />
                      ) : (
                        <span>{hint.value}</span>
                      )
                    ) : (
                      <button onClick={() => revealHint(index)}>Show Hint</button>
                    )
                  ) : (
                    <span>Unlock in {3 * (index + 1) - guessHistory.length} turns</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      {enlargedImage && (
        <div className="image-overlay" onClick={closeEnlargedImage}>
          <img src={enlargedImage} alt={`Enlarged ${randomSong.album} Album Art`} className="enlarged-album-art" />
        </div>
      )}
    </div>
  )
}