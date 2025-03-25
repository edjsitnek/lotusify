import '../Modal.css'
import './GameOverModal.css'
import { focusOnNewContent } from '../../../utils/focusOnNewContent';
import { useState, useRef } from 'react'

// A modal that pops up when game is over, with different content for a win or a loss
export default function GameOverModal({ isWin, numGuesses, randomSong, stats, showGameOverModal, lastFocusedElement, summaryButtonRef, onClickX }) {
  const [enlargedImage, setEnlargedImage] = useState(null); // Track enlarged album art state

  // Focus on modal content when opened
  const newContentRef = useRef(null);
  focusOnNewContent(showGameOverModal, newContentRef);

  // Display album art on certain summary screens
  const displayAlbumArt = () => {
    return (
      <img
        src={randomSong.albumArt}
        alt={randomSong.album}
        className="album-cover"
        loading="lazy"
        onClick={() => handleImageClick(randomSong.albumArt)}
      />
    )
  }

  // Display song info
  const displaySongInfo = () => {
    if (randomSong.liveOnly === false) {
      return (
        <>
          <div className="song-info">
            <p><span className="label">Song: </span>{randomSong.name}</p>
            <p><span className="label">Album: </span>{randomSong.album} ({randomSong.year})</p>
            {displayAlbumArt()}
            <p><span className="label">Times Played Live: </span>{randomSong.timesPlayed}</p>
          </div>

        </>
      )
    } else if (randomSong.liveOnly === true && randomSong.album) {
      return (
        <>
          <div className="song-info">
            <p><span className="label">Song: </span>{randomSong.name}</p>
            <p><span className="label">Appears On: </span>{randomSong.album} ({randomSong.year})</p>
            {displayAlbumArt()}
            <p><span className="label">First played: </span>{randomSong.year}</p>
            <p><span className="label">Times Played Live: </span>{randomSong.timesPlayed}</p>
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
            <p><span className="label">Times Played Live: </span>{randomSong.timesPlayed}</p>
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
          <div className="gameover modal-header title" ref={newContentRef} tabIndex="-1" aria-live="assertive">
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
          </div>
        </>
      )
    }
    if (isWin === false) { // Content if the game was lost
      return (
        <>
          <div className="gameover modal-header title" ref={newContentRef} tabIndex="-1" aria-live="assertive">
            <p>Game Over!</p>
            <button aria-label="Close summary modal" onClick={exitModal}>X</button>
          </div>
          <div className="body">
            {displaySongInfo()}
          </div>
          <hr />
          <div className="footer">
            {displayStats()}
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
    // If lastFocusedElement exists, return focus normally
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
    // If lastFocusedElement is null, focus on "View Summary" button
    else {
      setTimeout(() => {
        summaryButtonRef.current?.focus();
      }, 0);
    }
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