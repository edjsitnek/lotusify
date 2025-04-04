import * as cheerio from "cheerio";

export default {
  // Cloudflare Worker fetch handler for frontend API access (/today endpoint)
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    // Manual cron trigger for testing
    if (url.pathname === "/test") {
      await this.scheduled(req, env, ctx);
      return new Response("Ran scheduled cron logic manually");
    }

    // Return today's song from KV
    if (url.pathname === "/today") {
      const history = await env.SONG_CACHE.get("song-history", "json");
      const today = history?.[history.length - 1];

      if (!today) {
        return new Response("No song set for today", {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      return new Response(JSON.stringify(today), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Record play count for the day 
    if (url.pathname === "/play-counter" && req.method === "POST") {
      const today = new Date().toISOString().split("T")[0];
      const runningTotal = await env.SONG_CACHE.get("play-count", "json") || {};

      runningTotal[today] = (runningTotal[today] || 0) + 1;

      await env.SONG_CACHE.put("play-count", JSON.stringify(runningTotal));
      return new Response("Play recorded", { status: 200 });
    }

    // Return play count for the day
    if (url.pathname === "/play-count") {
      const runningTotal = await env.SONG_CACHE.get("play-count", "json") || {};
      return new Response(JSON.stringify(runningTotal), { status: 200 });
    }

    return new Response("404 Not Found", { status: 404 });
  },

  /*
  Cloudflare Worker scheduled cron job handler
  - Picks a new daily song 
  - Scrapes its "Times Played" from Phantasy Tour
  - Updates songs & history in KV (SONG_CACHE)
 */
  async scheduled(controller, env, ctx) {
    const today = new Date().toISOString().split("T")[0];

    // Load existing song data
    const songs = await env.SONG_CACHE.get("songs", "json") || [];
    const history = await env.SONG_CACHE.get("song-history", "json") || [];

    // Filter to unplayed songs
    let availableSongs = songs.filter(song => !history.map(item => item.name).includes(song.name));
    // Back up and reset history if all songs used
    if (availableSongs.length === 0) {
      console.log("All songs used, archiving history and resetting");

      const timestamp = new Date().toISOString().split("T")[0];
      await env.SONG_CACHE.put(`song-history-${timestamp}`, JSON.stringify(history));

      availableSongs = [...songs];
      history.length = 0;
    }

    // Pick random song
    const dailySong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    history.push({ ...dailySong, date: today });
    console.log(`Picked daily song for ${new Date().toISOString()}`);

    // Scrape new timesPlayed from Phantasy Tour
    let timesPlayed = null;

    if (dailySong.source?.url) {
      try {
        const scraped = await fetch(dailySong.source.url);
        const html = await scraped.text();
        timesPlayed = extractPlayCount(html);
        console.log(`Scraped timesPlayed: ${timesPlayed}`);
      } catch (err) {
        console.error(`Failed to scrape timesPlayed for ${dailySong.name}:`, err);
      }
    } else {
      console.warn(`No source.url provided for ${dailySong.name}, skipping scrape.`);
    }

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
  const $ = cheerio.load(html);
  let timesPlayed = null;

  $("dt").each((_, el) => {
    const label = $(el).text().trim();
    if (label === "Play Count:") {
      const value = $(el).next("dd").text().trim();
      const match = value.match(/^(\d+)/);
      if (match) {
        timesPlayed = parseInt(match[1]);
      }
    }
  });

  return timesPlayed;
}