import '../Modal.css'
import './GameOverModal.css'
import { focusOnNewContent } from '../../../utils/focusOnNewContent';
import { useState, useRef, useEffect } from 'react'

// A modal that pops up when game is over, with different content for a win or a loss
export default function GameOverModal({ isWin, numGuesses, randomSong, stats, showGameOverModal, lastFocusedElement, summaryButtonRef, onClickX }) {
  const [enlargedImage, setEnlargedImage] = useState(null); // Track enlarged album art state
  const [countdown, setCountdown] = useState(""); // Countdown to next game

  // Update countdown to next game
  useEffect(() => {
    if (!randomSong?.date) return;

    const updateCountdown = () => {
      const now = new Date();

      // Target: today at 10:00 UTC (5 am EST)
      const target = new Date(`${randomSong.date}T10:00:00Z`);

      // If 10:00 UTC today has passed, move to tomorrow
      if (now > target) target.setUTCDate(target.getUTCDate() + 1);

      const diff = target - now;
      if (diff <= 0) {
        setCountdown("Next game is live!");
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setCountdown(`Next game in ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [randomSong]);

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

  // Display a link to Bandcamp of a song, album, or Lotus' music page depending on shareType
  const displayShareLink = () => {
    if (randomSong.shareType === "band") {
      return (
        <a
          href={randomSong.shareUrl}
          className="share-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Listen to Lotus on Bandcamp!
        </a>
      )
    } else if (randomSong.shareType === "song") {
      return (
        <a
          href={randomSong.shareUrl}
          className="share-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Listen to {randomSong.name} on Bandcamp!
        </a>
      )
    } else if (randomSong.shareType === "album") {
      return (
        <a
          href={randomSong.shareUrl}
          className="share-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Listen to {randomSong.album} on Bandcamp!
        </a>
      )
    }
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
            {displayShareLink()}
          </div>
          <hr />
          <div className="footer">
            {displayStats()}
            <p className="countdown-timer">{countdown}</p>
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
            {displayShareLink()}
          </div>
          <hr />
          <div className="footer">
            {displayStats()}
            <p className="countdown-timer">{countdown}</p>
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