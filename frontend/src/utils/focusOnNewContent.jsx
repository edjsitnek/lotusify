import { useEffect } from 'react';

// Utility for focusing on new modal content when it appears for accessibility
export const focusOnNewContent = (showContent, newContentRef) => {
  useEffect(() => {
    if (showContent && newContentRef.current) {
      newContentRef.current.focus();
    }
  }, []);
}