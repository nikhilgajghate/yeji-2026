# yeji-2026

A small birthday website — landing → letter → two notes → 26 reasons → quiz → finale.

## Run locally

```bash
make start
```

Then open **http://127.0.0.1:8000** in Chrome (use that exact URL, not `localhost`).

Or:

```bash
python -m http.server 8000 --bind 127.0.0.1
```


## Customize

Edit **`js/config.js`**:

- `name` — hero name
- `hero.korean` — Korean follow-up after the landing
- `card` — open message, note, photo path
- `afterLetter` — two single-text pages after the letter
- `reasons` (10) + `moreReasons` (16) — `{ text, photo }` per page
- `quiz` — 5 questions
- `nav` — back / next labels

Drop photos in `assets/photos/`:

- `letter.jpg` (card photo)
- `finale.jpg`

Stack: Tailwind CSS 4 + daisyUI 5 retro theme (CDN), fonts Syne + DM Sans.
