import './HintPanel.css';
import { useEffect } from "react";

export default function HintPanel({ randomSong, guessHistory, hints, setHints, showHints, setShowHints }) {
  // Update hints based on guess history
  useEffect(() => {
    if (!randomSong) return;

    let updatedHints = [...hints];

    if (guessHistory.length >= 3) {
      updatedHints[0] = {
        ...updatedHints[0],
        title: "Studio release or live only?",
        value: randomSong.album === null ? "Live Only" : "Studio Release",
        unlocked: true
      };
    }

    if (guessHistory.length >= 6) {
      updatedHints[1] = {
        ...updatedHints[1],
        title: randomSong.album === null ? "Year First Played" : "Year Released",
        value: randomSong.year,
        unlocked: true
      };
    }

    if (guessHistory.length >= 9) {
      updatedHints[2] = {
        ...updatedHints[2],
        title: randomSong.album === null ? "Placeholder" : "Album Art",
        value: randomSong.album === null ? "To Be Decided" : randomSong.albumArt,
        unlocked: true
      };
    }

    setHints(updatedHints);
  }, [guessHistory]);

  // Reveal hint when unlocked
  const revealHint = (index) => {
    let updatedHints = [...hints];
    updatedHints[index].revealed = true;
    setHints(updatedHints);
  };

  return (
    <div className="hints-container">
      <button className="hint-toggle" onClick={() => setShowHints(!showHints)}>
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
                      hint.title === "Album Art" ? (
                        <img src={hint.value} alt={`${randomSong.album} Album Art`} className="album-cover" />
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
    </div>
  )
}