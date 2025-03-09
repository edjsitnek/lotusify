export const isPunctuation = (value) => {
  return /[!?&',.\-\(\)]/.test(value);
}