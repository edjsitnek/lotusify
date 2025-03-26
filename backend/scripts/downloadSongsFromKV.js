import { writeFile } from "fs/promises";
import { execSync } from "child_process";
import { confirm } from "../src/utils/confirm.js";

// Download the songs.json from KV and save it locally for reupload
if (await confirm("Download songs.json from PRODUCTION KV and overwrite local file?")) {
  try {
    const result = execSync(`npx wrangler kv key get --binding=SONG_CACHE songs --remote`, {
      encoding: "utf-8"
    });

    await writeFile("./songs.json", result);
    console.log("songs.json downloaded from KV and saved locally.");
  } catch (err) {
    console.error("Failed to download songs.json from KV:", err);
  }
} else {
  console.log("Cancelled.");
}