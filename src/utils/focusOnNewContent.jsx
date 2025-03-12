import { useEffect } from 'react';

// Utility for focusing on new content when it appears
export const focusOnNewContent = (showContent, newContentRef) => {
  useEffect(() => {
    if (showContent && newContentRef.current) {
      newContentRef.current.focus();
    }
  }, []);
}