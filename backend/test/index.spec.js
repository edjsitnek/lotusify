import { describe, it, expect } from "vitest";
import { pickDailySong } from "../src/utils/pickDailySong";

const mockSongs = [
  { name: "Spiritualize" },
  { name: "Umbilical Moonrise" },
  { name: "Nematode" }
];

describe("pickDailySong utility", () => {
  it("selects a random unplayed song", () => {
    const history = ["Spiritualize"];
    const { picked, updatedHistory } = pickDailySong(mockSongs, history);

    expect(picked.name).not.toBe("Spiritualize");
    expect(updatedHistory).toContain(picked.name);
    expect(updatedHistory.length).toBe(history.length + 1);
  });

  it("resets history if all songs are used", () => {
    const history = ["Spiritualize", "Umbilical Moonrise", "Nematode"];
    const { picked, updatedHistory } = pickDailySong(mockSongs, history);

    expect(mockSongs.map(s => s.name)).toContain(picked.name);
    expect(updatedHistory.length).toBe(1);
  });
});
