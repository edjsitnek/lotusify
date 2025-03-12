import '../Modal.css'
import './GameOverModal.css'
import { focusOnNewContent } from '../../../utils/focusOnNewContent';
import { useState, useRef } from 'react'

// A modal that pops up when game is over, with different content for a win or a loss
export default function GameOverModal({ isWin, numGuesses, randomSong, stats, showGameOverModal, onClickX, onClickReset }) {
  const [enlargedImage, setEnlargedImage] = useState(null); // Track enlarged album art state

  // Focus on modal content when opened
  const newContentRef = useRef(null);
  focusOnNewContent(showGameOverModal, newContentRef);

  // Display song info
  const displaySongInfo = () => {
    if (randomSong.liveOnly === false) {
      return (
        <>
          <div className="song-info">
            <p><span className="label">Song: </span>{randomSong.name}</p>
            <p><span className="label">Album: </span>{randomSong.album} ({randomSong.year})</p>
            <img
              src={randomSong.albumArt}
              alt={randomSong.album}
              className="album-cover"
              onClick={() => handleImageClick(randomSong.albumArt)}
            />
            <p><span className="label">Times Played: </span>{randomSong.timesPlayed}</p>
          </div>

        </>
      )
    } else if (randomSong.liveOnly === true && randomSong.album) {
      return (
        <>
          <div className="song-info">
            <p><span className="label">Song: </span>{randomSong.name}</p>
            <p><span className="label">Appears On: </span>{randomSong.album} ({randomSong.year})</p>
            <img
              src={randomSong.albumArt}
              alt={randomSong.album}
              className="album-cover"
              onClick={() => handleImageClick(randomSong.albumArt)}
            />
            <p><span className="label">First played: </span>{randomSong.year}</p>
            <p><span className="label">Times Played: </span>{randomSong.timesPlayed}</p>
          </div>
        </>
      )
    }
    else if (randomSong.liveOnly === true && !randomSong.album) {
      return (
        <>
          <div className="song-info">
            <p><span className="label">Song: </span>{randomSong.name}</p>
            <p><span className="label">First Played: </span>{randomSong.year}</p>
            <p><span className="label">Times Played: </span>{randomSong.timesPlayed}</p>
          </div>
        </>
      )
    }
  }

  // Display game stats
  const displayStats = () => {
    return (
      <div className="stats">
        <ul>
          <li>
            <div className="statNum">{stats.gamesPlayed}</div>
            <div className="statName">Played</div>
          </li>
          <li>
            <div className="statNum">{stats.winPercentage}</div>
            <div className="statName">Win%</div>
          </li>
          <li>
            <div className="statNum">{stats.averageGuesses}</div>
            <div className="statName">Average Guesses</div>
          </li>
        </ul>
      </div>
    )
  }

  // Handle content based on win or loss
  const handleModalContent = () => {
    if (isWin === true) { // Content if the game was won
      return (
        <>
          <div className="gameover modal-header title" ref={newContentRef} tabIndex="-1">
            {(numGuesses === 1) ? (
              <p>You got it in 1 guess!</p>
            ) : (
              <p>You got it in {numGuesses} guesses!</p>
            )}
            <button aria-label="Close summary modal" onClick={exitModal}>X</button>
          </div>
          <div className="body">
            {displaySongInfo()}
          </div>
          <hr />
          <div className="footer">
            {displayStats()}
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
    if (isWin === false) { // Content if the game was lost
      return (
        <>
          <div className="gameover modal-header title" ref={newContentRef} tabIndex="-1">
            <p>Game Over!</p>
            <button aria-label="Close summary modal" onClick={exitModal}>X</button>
          </div>
          <div className="body">
            {displaySongInfo()}
          </div>
          <hr />
          <div className="footer">
            {displayStats()}
            <button onClick={onClickReset} className="resetButton">Start New Game</button>
          </div>
        </>
      )
    }
  }

  // Enlarge album art on click
  const handleImageClick = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  // Close enlarged album art
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // Close modal
  const exitModal = () => {
    onClickX(false);
  }

  return (
    // Clicking on the background will close modal
    <div
      className="gameover modal-background"
      onClick={() => {
        if (!enlargedImage) exitModal()
      }}>
      <div className="gameover modal-container" onClick={e => e.stopPropagation()}>
        {handleModalContent()}
      </div>
      {enlargedImage && (
        <div className="image-overlay" onClick={closeEnlargedImage}>
          <img
            src={enlargedImage}
            alt={`Enlarged ${randomSong.album} Album Art`}
            className="enlarged-album-art"
          />
        </div>
      )}
    </div>

  );
};