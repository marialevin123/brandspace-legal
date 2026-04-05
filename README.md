# Brandspace Legal — static site

Trilingual (English, Russian, Ukrainian) marketing site for **Brandspace Legal** / **D&L IP Group**, built with HTML, Tailwind CSS (CDN), and vanilla JavaScript.

## Run locally

Translations and `fetch()` require a local web server (opening `index.html` as a `file://` URL will block loading `locales/*.json` in most browsers).

From this folder:

```bash
python -m http.server 8080
```

Then open [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Main single-page site |
| `blog/*.html` | Seven article pages |
| `css/styles.css` | Design tokens, layout helpers, FAQ, carousel, forms |
| `js/i18n.js` | Loads `locales/{en,ru,ua}.json`, `data-i18n` / `data-i18n-html` / `data-i18n-placeholder` |
| `js/main.js` | Nav scroll state, mobile menu, smooth scroll, reveals, FAQ, services, testimonials, form mock submit, language buttons |
| `js/tawk.js` | Injects [Tawk.to](https://www.tawk.to/) only when real property and widget IDs are set |
| `locales/` | JSON dictionaries for all UI and blog article strings |

Blog pages use `<script src="../js/i18n.js" data-base="../"></script>` so `fetch` resolves to `../locales/…`.

## Live chat (Tawk.to)

1. Create a property at [tawk.to](https://www.tawk.to/) and copy your **Property ID** and **Widget ID**.
2. In `index.html` and each file under `blog/`, replace:

   - `YOUR_PROPERTY_ID`
   - `YOUR_WIDGET_ID`

   in the small inline script before `tawk.js`.

If the placeholders are left as `YOUR_*`, no chat script is loaded (avoids console errors).

## Contact form

The contact form is **front-end only**: it shows a success message and resets after a few seconds. Connect [Formspree](https://formspree.io/), [EmailJS](https://www.emailjs.com/), or your own endpoint when you are ready to receive submissions.

## Images

Raster assets live in `images/`:

- `partner-portrait.png` — leadership portrait (**Diana**) in the **About** section (replace the file when updating the photo).
- `brandspace-hero-bg.png` — full-bleed hero background (AI-generated for this project).
- `brandspace-about-illustration.png` — optional brand graphic (not used on the current homepage; kept for future use).
- `brandspace-texture-light.png` — subtle repeat texture on `#why` and `#testimonials`.

They are fairly large PNGs; before production, run them through an image optimizer (e.g. Squoosh, `pngquant`, or your CDN’s automatic compression) and consider WebP/AVIF sources with `<picture>` if you need faster loads.

You do **not** need a fal.ai account for the current setup. If you later want to regenerate art at scale, you can swap files in `images/` or wire a build step that calls fal.ai (or another API) using your own API key — never commit keys to the repo.

## Design

Visual system follows the UI/UX Pro Max “Trust & Authority” direction: navy primary (`#1E3A8A`), gold CTA (`#B45309`), **EB Garamond** headings, **Lato** body text.

## Deployment

Upload the whole project folder to any static host (Netlify, Cloudflare Pages, S3 + CloudFront, traditional hosting). Ensure the server serves `.json` with a correct MIME type (most defaults do).

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/SITE.md](docs/SITE.md) | Full site documentation: architecture, i18n, JS/CSS behavior, deployment checklist |
| [docs/DEPLOY-SUBDOMAIN.md](docs/DEPLOY-SUBDOMAIN.md) | **Publishing** to `brandspace.megaautomation.ai` (Cloudflare Pages, Netlify, DNS) |
| [docs/ACTION-ITEMS.md](docs/ACTION-ITEMS.md) | Saved backlog of recommended improvements (e.g. for your next working session) |
