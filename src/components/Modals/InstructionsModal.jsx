import './InstructionsModal.css'

// A modal containing game instructions that pops up when the info button is pressed
export default function InstructionsModal({ onClickX }) {
  const handleModalContent = () => {
    return (
      <div className="body">
        <ul>
          <li>
            You have 12 total guesses to figure out the Lotus song title.
          </li>
          <li>
            Guess one letter/number at a time to reveal all instances of that character OR guess the full song title by pressing "Guess Song"
          </li>
          <li>
            Hints unlock at 3, 6, and 9 guesses. Their type depends on whether the song is a studio release or live only.
          </li>
          <li>
            Songs without a studio version or that appear only on live albums (e.g. Germination, Escaping Sargasso Sea) count as Live Only.
          </li>
        </ul>
      </div>
    )
  }


  const exitModal = () => {
    onClickX(false);
  }

  return (
    // Clicking on the background will close modal
    <div className="instructions-modal-background" onClick={exitModal}>
      <div className="instructions-modal-container" onClick={e => e.stopPropagation()}>
        <div className="instructions-modal-header">
          <div className="title">
            <h1>Lotusify Instructions</h1>
          </div>
          <button onClick={exitModal}>X</button>
        </div>
        {handleModalContent()}
      </div>
    </div>
  );
};