# Decap CMS Setup (for non-technical editing)

This project is now wired so site text and gallery images are editable from `/admin`.

## 1) Set your repo in CMS config
Edit [admin/config.yml](admin/config.yml) and replace:
- `YOUR_GITHUB_USERNAME`
- `YOUR_REPOSITORY_NAME`

Example:
- `repo: janedoe/calligraphy-portfolio`

## 2) Push to GitHub and enable Pages
- Push this project to your GitHub repo.
- In GitHub repo settings, enable GitHub Pages from your main branch root.

## 3) Open the CMS
After deploy, visit:
- `https://<your-username>.github.io/<repo>/admin/`

Your mom can now log in with GitHub and edit content in a form UI.

## 4) What she edits
- **Site Content**: all text sections, headings, bio, links, contact, footer name.
- **Gallery**: add/remove/reorder artworks, upload images, set category and alt text.

## 5) Where content is stored
- `content/site.json`
- `content/gallery.json`

Decap writes updates there and commits directly to GitHub.

## Notes
- Image uploads are stored in `assets/uploads/`.
- If your repository default branch is not `main`, change `branch:` in `admin/config.yml`.
- `publish_mode: editorial_workflow` is enabled, so edits can go through draft/review flow.
