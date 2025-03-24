// Utility for checking if a character is a punctuation mark
export const isPunctuation = (value) => {
  return /[!?&',.\-\(\)]/.test(value);
}