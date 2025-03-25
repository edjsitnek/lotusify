// Daily song picker utility for testing purposes 
export function pickDailySong(songs, history) {
  let available = songs.filter(song => !history.includes(song.name));
  const reset = available.length === 0;

  if (reset) {
    available = [...songs];
    history.length = 0;
  }

  const picked = available[Math.floor(Math.random() * available.length)];
  const updatedHistory = reset ? [picked.name] : [...history, picked.name];

  return { picked, updatedHistory };
}
