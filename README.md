# yeji-2026

A small birthday website — landing → letter → 26 reasons → quiz → finale.

## Run locally

```bash
# from this folder
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Or simply open `index.html` in a browser.

## Customize

Edit **`js/config.js`**:

- `name` — hero name
- `letter` / `finale` — messages + photo paths
- `reasons` (10) + `moreReasons` (16)
- `quiz` — 5 questions

Drop photos in `assets/photos/`:

- `letter.jpg`
- `finale.jpg`
