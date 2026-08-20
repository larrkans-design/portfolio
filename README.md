# Alexander Lärkmo portfolio

A lightweight static portfolio built with HTML, CSS, and vanilla JavaScript. It has no build step, package manager, database, cookies, or tracking. It is ready for GitHub Pages.

## 1. Edit your text

Open `js/content.js` in any text editor.

Everything intended for regular editing is under:

```js
// ===== EDIT YOUR TEXT BELOW =====
```

Replace the instructional text inside square brackets. Keep the surrounding quotation marks and commas. The introduction, About copy, contact labels, categories, years, and all five case-study sections live in this one file.

## 2. Update contact links

In `js/content.js`, find `contact` and edit both the visible label and URL:

```js
email: "hello@example.com",
emailUrl: "mailto:hello@example.com",
linkedin: "LinkedIn",
linkedinUrl: "https://www.linkedin.com/in/your-profile/",
github: "GitHub",
githubUrl: "https://github.com/your-name"
```

The current placeholders do not link anywhere external.

## 3. Replace project images

Optimized project images are grouped inside `assets/projects/`. Keep the existing filenames to replace an image without changing HTML.

For good loading speed:

- export photographs and full-color artwork as WebP;
- use a maximum width around 1800 px for wide images;
- keep tall portrait images near 1080–1800 px wide;
- aim for under 500 KB per image where quality allows;
- keep the original artwork somewhere outside the production website.

If an image's proportions change, update its `width` and `height` attributes in the relevant HTML page.

## 4. Add a résumé PDF

1. Put the final file at `assets/resume/alexander-larkmo-resume.pdf`.
2. Open `index.html`.
3. Find the comment beginning `Replace this href`.
4. Change the résumé link from:

```html
href="assets/resume/alexander-larkmo-resume.webp"
```

to:

```html
href="assets/resume/alexander-larkmo-resume.pdf"
```

The current image résumé stays available as the visual preview.

## 5. Preview the site locally

The simplest option is to open `index.html` directly in a browser.

For the most accurate preview, open Terminal in this folder and run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Stop the preview with `Control-C`.

## 6. Publish with GitHub Pages

1. Create a new repository on GitHub.
2. Upload everything inside this `portfolio` folder so `index.html` is at the repository root.
3. Open the repository's **Settings**.
4. Choose **Pages** in the left sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub will show the public address after publishing finishes.

All links use relative paths, so the site works in a project repository such as `username.github.io/portfolio/`.

## 7. Final live-site details

Search all HTML files for `[EDIT LIVE URL]` and replace it with the final site address. This completes the Open Graph sharing metadata.

The favicon is cropped from the supplied identity bird. Replace `assets/intro/favicon.png` if you want a different mark.

The supplied Manisans and Making Standing fonts are included locally in `assets/fonts/` and configured near the top of `css/styles.css`. No external font service is used.

## File map

```text
portfolio/
├── index.html
├── projects/                 five case-study pages
├── css/styles.css            design tokens, layout, motion, responsive styles
├── js/content.js             all regularly edited text and contact details
├── js/main.js                content binding, reveals, lazy video, current year
├── assets/                   optimized production media only
│   ├── intro/
│   ├── decorative/
│   ├── projects/
│   └── resume/
├── ASSET-MAP.md              source-to-production media reference
└── .gitignore
```
