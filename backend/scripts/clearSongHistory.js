import { execSync } from "child_process";
import { confirm } from "../src/utils/confirm.js";

// Clear the song-history KV for testing purposes
if (await confirm("This will reset LOCAL song-history. Proceed?")) {
  try {
    execSync(`npx wrangler kv key put --binding=SONG_CACHE song-history []`, { // Add --remote to clear PRODUCTION KV
      stdio: "inherit"
    });
    console.log("song-history has been cleared and reset to []");
  } catch (err) {
    console.error("Failed to reset song-history:", err);
  }
} else {
  console.log("Cancelled");
}
