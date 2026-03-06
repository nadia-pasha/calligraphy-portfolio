# Calligraphy Portfolio Website

This is a static GitHub Pages website. You can update everything by editing two JSON files and uploading images.

## File map
- `content/site.json`: all website text (headings, paragraph copy, contact info, links).
- `content/gallery.json`: artwork cards shown in the portfolio gallery.
- `assets/uploads/`: image files used by gallery items.

## Update text content
1. Open `content/site.json`.
2. Edit the values inside quotes.
3. Save.

Common fields:
- `heroHeading`, `heroCopy`
- `statementHeading`, `statementParagraph1`, `statementParagraph2`
- `aboutHeading`, `aboutBio`
- `contactEmail`, `instagramUrl`, `behanceUrl`

Important:
- Keep JSON formatting valid (commas and quotes matter).
- Do not change field names unless you also change code.

## Add or replace gallery images
1. Put new image files in `assets/uploads/`.
2. Open `content/gallery.json`.
3. In each item, set `image` to the file path, for example:

```json
"image": "assets/uploads/my-new-piece.jpg"
```

4. Update other item fields:
- `title`
- `medium`
- `category` (`flourish`, `minimal`, or `experimental`)
- `alt` (short description for accessibility)

## Add a new artwork card
In `content/gallery.json`, duplicate one object in `items`, then edit it.

Example object:

```json
{
  "title": "Evening Script",
  "medium": "Walnut ink on handmade paper",
  "category": "flourish",
  "image": "assets/uploads/evening-script.jpg",
  "alt": "Flowing calligraphy on textured paper"
}
```

## Upload changes to GitHub (web method)
1. Open the GitHub repo (`calligraphy-portfolio`) in your browser.
2. Go to `content/site.json` or `content/gallery.json` and click the pencil icon to edit, then commit.
3. For images: open `assets/uploads/` -> `Add file` -> `Upload files`.
4. Keep the same folder paths.

GitHub Pages usually updates within 1-3 minutes.

## Local preview
Run a local server from project root:

```bash
python3 -m http.server 8000
```

Open:
- `http://localhost:8000`

## No `/admin`
This project no longer uses a CMS admin panel. Content is managed directly through JSON files and image uploads.
