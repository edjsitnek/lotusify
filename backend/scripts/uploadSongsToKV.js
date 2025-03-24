import { execSync } from "child_process";

// Upload the songs.json to KV
try {
  execSync("npx wrangler kv key put --binding=SONG_CACHE songs --path=./songs.json", {
    stdio: "inherit"
  });
} catch (err) {
  console.error("Failed to upload songs to KV:", err);
}
