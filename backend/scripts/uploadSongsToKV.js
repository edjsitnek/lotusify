import { execSync } from "child_process";
import { confirm } from "../src/utils/confirm.js";

// Upload the songs.json to KV
if (await confirm("Upload songs.json to PRODUCTION KV? This will overwrite the existing list")) {
  try {
    execSync("npx wrangler kv key put --binding=SONG_CACHE songs --path=./songs.json --remote", {
      stdio: "inherit"
    });
  } catch (err) {
    console.error("Failed to upload songs to KV:", err);
  }
} else {
  console.log("Cancelled");
}
