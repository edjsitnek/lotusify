import { readFile } from "fs/promises";
import { execSync } from "child_process";

const songs = await readFile("./songs.json", "utf-8");

// Upload the songs.json to KV
try {
  execSync(`npx wrangler kv key put --binding=SONG_CACHE songs '${songs}'`, {
    stdio: "inherit"
  });
} catch (err) {
  console.error("Failed to upload songs to KV:", err);
}
