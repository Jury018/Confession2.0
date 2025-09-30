# Confession 2.0

A tiny static visual-novel demo built with vanilla HTML, CSS and JavaScript.

This project is a small, self-contained visual-novel (VN) experience optimized for responsiveness and accessibility. It includes a start screen, character animation, typed dialogue-style presentation, an audio track that preloads and starts on the first user tap, and a gentle blossom particle effect during scene transitions.

## Features

- Static front-end: just `index.html`, `styles.css`, and `main.js`.
- Fluid, responsive layout with safe-area handling for mobile devices.
- Subtle character bobbing animation (respects `prefers-reduced-motion`).
- Dialogue box with improved contrast and typography for readability.
- Particle blossom effect (uses `assets/white_flower.png` and `assets/blue_flower.png`).
- Background music preloaded and played on the first interaction (Play tap). The music is intentionally set to play once at 50% volume.

## Files

- `index.html` — page shell and DOM structure.
- `styles.css` — consolidated, responsive styling and animations.
- `main.js` — VN script, input handling, particle engine, and audio preloading/playback logic.
- `assets/` — images, fonts and the MP3 file.

## How to run locally

1. From the project root, start a simple static server (one of these):

Powershell / CMD:
```powershell
python -m http.server 8000
```

2. Open http://localhost:8000 in a modern browser (Chrome, Edge, Firefox).

3. Tap/click the Play button to begin — this user gesture unlocks audio playback.

## Notes & gotchas

- The MP3 file in `assets/` uses a filename with Unicode glyphs: `𝐇𝐢𝐝𝐝𝐞𝐧 𝐋𝐨𝐯𝐞.mp3`. If you rename the file, update `const audioSrc` in `main.js` accordingly.
- Browsers require a user gesture to enable audio — the Start overlay click provides that.
- If audio doesn’t start immediately on some devices, the code preloads and attempts multiple playback pathways (WebAudio decode + HTMLAudio fallback) to minimize delay.

## Recommended quick tweaks

- Add a `mute` toggle or a gentle fade-in/out for the music if you want smoother audio transitions.
- For a production build, consider compressing assets and inlining critical CSS.

## License & credits

Personal project. Assets likely licensed separately — check any font or image licenses before commercial use.

---

If you'd like, I can:
- Add a repository-level `.gitignore` and `LICENSE`.
- Add a small demo GIF and contribution guidelines.
- Create a short CI workflow that previews the static site on GitHub Pages.

Tell me which you want and I'll add it and push the change.