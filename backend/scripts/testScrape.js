import fetch from "node-fetch";
import * as cheerio from "cheerio";

const url = "https://www.phantasytour.com/bands/lotus/songs/6378/spiritualize";

// Test scrape the "Times Played" from Phantasy Tour
(async () => {
  try {
    const res = await fetch(url);
    const html = await res.text();

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

    if (timesPlayed !== null) {
      console.log(`Scraped timesPlayed: ${timesPlayed}`);
    } else {
      console.log("Play Count not found.");
    }
  } catch (err) {
    console.error("Error scraping:", err);
  }
})();
