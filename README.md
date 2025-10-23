# Lotusify - The Lotus Song Title Guessing Game

**Lotusify** is a daily word game for fans of the jam band **Lotus**, inspired by [Spellify](https://commandersherald.com/games/spellify). Guess the Lotus song title of the day in a Hangman-style format using your keyboard or on-screen keys. One song is released every day at 5 am EST.

**[Play the game here](https://www.lotusify-game.com)**

## Technologies Used

- **React** + **Vite** for fast frontend UI
- **Cloudflare Pages** for frontend hosting
- **Cloudflare Workers** for backend logic
- **Cloudflare KV** for persistent daily song data
- **Cheerio** for scraping live play counts from [Phantasy Tour](https://www.phantasytour.com/)
- **LocalStorage** for preserving guess history across refreshes

## Lotusify Infinite

For unlimited, just-for-fun practice mode — check out:

[Lotusify Infinite](https://lotusify-infinite.pages.dev)

Unlike the main version, Lotusify Infinite lets you play randomly selected songs without the daily restriction.

## Features

- Every day features a new randomly selected Lotus song title
- Guess letters or full song names
- Album art, year, and play count revealed at game end
- Detailed statistics (win rate, average guesses)
- Hint system (optional)
- Keyboard accessibility
- Fully responsive on mobile
- Persistent guess data across refreshes

## Accessibility

Lotusify supports a variety of accessible features:

- Full keyboard navigation
- Focus management across modals
- Screen reader labels (`aria-label`, roles)
- Touch-friendly button sizing for mobile users

## Attribution

- Song titles, albums, and logo are from [Lotus](https://www.lotusvibes.com/) — all rights belong to the band and their licensors.
- Play count data is sourced from [Phantasy Tour](https://www.phantasytour.com/), used for informational and non-commercial purposes under their [Terms of Use](https://www.phantasytour.com/terms-of-use).
- Lotusify was created by **[Ethan Sitnek](https://github.com/edjsitnek)** as a personal fan project.

## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ethan-sitnek-7203971a1/)
