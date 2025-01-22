import './SongGuessModal.css'

// A modal that displays an active attempt at a full song title guess and pops up when the "Guess Song" button is pressed
export default function SongGuessModal({ randomSong, songGuess, setSongGuess, handleGuessSongSubmit, onClickX }) {
  const exitModal = () => {
    onClickX(false);
  }

  return (
    <div className="song-guess-modal-background" onClick={exitModal}>
      <div className="song-guess-modal-content" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={songGuess}
          name="songGuessInput"
          onChange={(e) => setSongGuess(e.target.value)}
          // placeholder="Enter full song title"
          placeholder={randomSong && randomSong.name}
        />
        <button onClick={handleGuessSongSubmit}>
          Guess Song
        </button>
      </div>
    </div >
  )
}