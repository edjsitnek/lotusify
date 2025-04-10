import '../Modal.css'
import './InstructionsModal.css'
import { focusOnNewContent } from '../../../utils/focusOnNewContent';
import { useRef } from 'react';

// A modal containing game instructions that pops up when the info button is pressed
export default function InstructionsModal({ showInstructionsModal, lastFocusedElement, isOnTop, onClickX }) {
  // Focus on modal content when opened
  const newContentRef = useRef(null);
  focusOnNewContent(showInstructionsModal, newContentRef);

  // Display game instructions
  const handleModalContent = () => {
    return (
      <>
        <div className="body">
          <ul>
            <li>
              You have 12 total guesses to figure out the Lotus song title.
            </li>
            <li>
              Guess one letter/number at a time to reveal all instances of that character OR guess the full song title by pressing "Guess Song."
            </li>
            <li>
              Hints unlock at 3, 6, and 9 guesses. Their type depends on whether the song is a studio release or live only.
            </li>
            <li>
              Songs without a studio version or that appear only on live albums (e.g. Germination, Escaping Sargasso Sea) count as Live Only.
            </li>
          </ul>
        </div>
        <div className="credits">
          <p>
            <strong>Credits:</strong><br />
            Song titles, album names, album artwork, and logo are copyright © <a href="https://www.lotusvibes.com/" target="_blank" rel="noopener noreferrer">Lotus</a>. All rights reserved by the original artists and labels.
          </p>
          <p>
            Play count data sourced from <a href="https://phantasytour.com" target="_blank" rel="noopener noreferrer">Phantasy Tour</a> and used for non-commercial, informational purposes.
          </p>
          <p>
            Website created by Ethan Sitnek. This project is fan-made and not affiliated with Lotus or their management.
          </p>
        </div >
      </>
    )
  }

  const exitModal = () => {
    onClickX(false);
    lastFocusedElement.current?.focus(); // Focus on instruction icon again when modal closes for accessibility
  }

  return (
    // Clicking on the background will close modal
    <div className="instructions modal-background" onClick={exitModal} style={{ zIndex: isOnTop ? 1001 : 1000 }}>
      <div className="instructions modal-container" onClick={e => e.stopPropagation()}>
        <div className="instructions modal-header">
          <div className="title" ref={newContentRef} tabIndex="-1">
            <h1>Lotusify Instructions</h1>
          </div>
          <button aria-label="Close instructions modal" onClick={exitModal}>X</button>
        </div>
        {handleModalContent()}
      </div>
    </div>
  );
};