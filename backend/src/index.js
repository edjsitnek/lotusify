/*
  Cloudflare Worker scheduled cron job handler
  - Picks a new daily song 
  - Scrapes its "Times Played" from Phantasy Tour
  - Updates songs & history in KV (SONG_CACHE)
 */
export default {
  async scheduled(controller, env, ctx) {
    const today = new Date().toISOString().split("T")[0];

    // Load existing song data
    const songs = await env.SONG_CACHE.get("songs", "json") || [];
    const history = await env.SONG_CACHE.get("song-history", "json") || [];

    // Filter to unplayed songs
    let availableSongs = songs.filter(song => !history.includes(song.name));
    if (availableSongs.length === 0) {
      availableSongs = [...songs]; // Reset pool if all have been played
      history.length = 0;
    }

    // Pick random song
    const dailySong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    history.push({ ...dailySong, date: today });
    console.log(`Picked daily song for ${new Date().toISOString()}`);

    // Scrape new timesPlayed from Phantasy Tour
    const scraped = await fetch(dailySong.source.url);
    const html = await scraped.text();
    const timesPlayed = extractPlayCount(html);
    console.log(`Scraped timesPlayed: ${timesPlayed}`);

    // Update song if value changed
    const match = songs.find(s => s.name === dailySong.name);
    if (match && timesPlayed && match.timesPlayed !== timesPlayed) {
      console.log(`Updating timesPlayed: old=${match.timesPlayed}, new=${timesPlayed}`);
      match.timesPlayed = timesPlayed;
      match.source.date = today;
    }

    // Write back updated KV
    await env.SONG_CACHE.put("songs", JSON.stringify(songs));
    await env.SONG_CACHE.put("song-history", JSON.stringify(history));
    console.log('KV updated: songs and song-history');
  },
};


//Extract "Times Played" from Phantasy Tour HTML
function extractPlayCount(html) {
  const regex = /Play Count:\s*<dd>(\d+) times<\/dd>/;
  const match = html.match(regex);
  return match?.[1] ? parseInt(match[1]) : null;
}
