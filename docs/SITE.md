# Brandspace Legal — site documentation

This document describes the static marketing site: structure, behavior, conventions, and operational notes. It is the single source of truth for developers and content editors.

**Repository root:** project folder containing `index.html`.

---

## 1. Overview

| Item | Detail |
|------|--------|
| **Purpose** | Marketing and lead generation for Brandspace Legal / D&L IP Group (US trademark, brand protection, Amazon Brand Registry). |
| **Languages** | English (default), Russian, Ukrainian — UI strings in JSON; language persisted in `localStorage`. |
| **Stack** | Static HTML, [Tailwind CSS](https://tailwindcss.com/) via CDN, vanilla JavaScript, no build step. |
| **Hosting** | Any static host; **must** serve `locales/*.json` with correct MIME type (`application/json`). |

---

## 2. Repository layout

```
├── index.html              # Main single-page application (all sections)
├── README.md               # Quick start, deploy, images, Tawk
├── docs/
│   ├── SITE.md             # This file
│   └── ACTION-ITEMS.md     # Backlog for follow-up work
├── css/
│   └── styles.css          # Design tokens, hero, FAQ, services, testimonials, forms, motion
├── js/
│   ├── i18n.js             # Translation loader and applier
│   ├── main.js             # UI interactions
│   └── tawk.js             # Optional Tawk.to loader
├── locales/
│   ├── en.json             # English strings (source of key structure)
│   ├── ru.json             # Russian
│   └── ua.json             # Ukrainian (file name `ua`; `html lang` follows chosen code)
├── images/
│   ├── logo.svg
│   ├── partner-portrait.png
│   ├── brandspace-hero-bg.png
│   ├── brandspace-about-illustration.png
│   └── brandspace-texture-light.png
└── blog/
    ├── amazon-brand-registry.html
    ├── uspto-post-registration-audit.html
    ├── trademark-modernization-act.html
    ├── ukrainians-register-us.html
    ├── new-us-trademark-law.html
    ├── uspto-identity-verification.html
    └── electronic-registration-certificates.html
```

---

## 3. Pages and anchors (`index.html`)

| Section ID | Purpose |
|------------|---------|
| `#hero` | Hero, CTAs, phone numbers, capability pills |
| `#about` | Who we are, stats, illustration |
| `#why` | Three reasons for brand protection (`.section-textured`) |
| `#services` | Eight expandable service cards |
| `#testimonials` | Carousel (`.section-textured`) |
| `#faq` | Accordion FAQ |
| `#blog` | Grid linking to `blog/*.html` |
| `#contact` | Offices, email, demo contact form |

**Blog:** Each article is a standalone HTML file under `blog/` with shared header/footer pattern and `data-base="../"` on `i18n.js`.

---

## 4. Internationalization (i18n)

### 4.1 Script and base path

- **Home:** `<script src="js/i18n.js" data-base=""></script>` → fetches `locales/{lang}.json`.
- **Blog:** `<script src="../js/i18n.js" data-base="../"></script>` → fetches `../locales/{lang}.json`.

`data-base` is read from `document.currentScript` at parse time.

### 4.2 Storage and default

- Key: `brandspace-lang` in `localStorage`.
- Default language: `en`.
- On load, `document.documentElement.lang` is set to the active code (`en`, `ru`, or `ua`).

### 4.3 DOM attributes

| Attribute | Behavior |
|-----------|----------|
| `data-i18n="a.b.c"` | Sets `textContent` from nested JSON path. |
| `data-i18n-html="a.b.c"` | Sets `innerHTML` (use for trusted HTML only). |
| `data-i18n-placeholder="a.b.c"` | Sets input/textarea `placeholder`. |
| `data-i18n-alt="a.b.c"` | Sets `alt` on images (e.g. `about.partnerAlt`). |

### 4.4 API (`window.i18n`)

- `setLanguage(lang)` — async; loads JSON, applies, saves preference, dispatches `languageChanged` on `document` with `detail.lang`.
- `getCurrentLanguage()` — current code after successful load.
- `t(key)` — dot-path lookup on loaded dictionary.

### 4.5 Adding or changing copy

1. Add the key to **`locales/en.json`** (keep structure flat or nested consistently).
2. Mirror the same keys in **`ru.json`** and **`ua.json`**.
3. Add or update the element in HTML with the matching `data-i18n*` attribute.

Blog article copy lives under `articles.{id}.*` in each locale file.

---

## 5. JavaScript (`main.js`)

Runs on `DOMContentLoaded`.

| Feature | Selector / ID | Notes |
|---------|-----------------|-------|
| Navbar scroll state | `#navbar` | Adds `scrolled` when `scrollY > 50`. |
| Mobile menu | `#menu-toggle`, `#mobile-menu` | Toggles `active`; updates `aria-expanded` / `aria-label`; closes on in-menu anchor tap (mobile). |
| Smooth scroll | `a[href^="#"]` | 80px offset; respects `prefers-reduced-motion`. |
| Scroll reveal | `.reveal-on-scroll` | `IntersectionObserver` or immediate `revealed` if reduced motion. |
| FAQ | `.faq-item`, `.faq-question` | One open at a time; `aria-expanded` on buttons. |
| Testimonials | `#testimonial-track`, `.testimonial-card`, `#testimonial-dots` | Auto-advance 5s; dot navigation. |
| Service cards | `.service-card` | Toggle `expanded`; clicks on `a` do not toggle. |
| Contact form | `#contact-form`, `#form-success` | `preventDefault`; success message; reset after 3s. |
| Language | `.lang-btn[data-lang]` | Calls `i18n.setLanguage`; toggles `.active`. |

---

## 6. CSS (`styles.css`)

- **Design tokens:** `:root` — primary navy `#1e3a8a`, CTA `#b45309`, fonts EB Garamond / Lato.
- **`.hero`:** `.hero-backdrop` (background image + drift animation), `::before` gradient overlay, `.hero-content` above.
- **`.section-textured`:** Light repeat texture via `::before` on `#why` and `#testimonials`.
- **Components:** FAQ accordion, service expand/collapse, testimonial dots, form focus rings, menu hamburger.
- **`prefers-reduced-motion`:** Disables transitions/animations and forces reveal visible; hero backdrop animation off.

---

## 7. Third-party services

| Service | Files | Configuration |
|---------|--------|----------------|
| Google Fonts | All HTML | EB Garamond + Lato via `fonts.googleapis.com`. |
| Tailwind CDN | All HTML | `cdn.tailwindcss.com` + inline `tailwind.config` for brand colors/fonts. |
| Tawk.to | `js/tawk.js`, inline `window.__TAWK_*` | Set real property/widget IDs in `index.html` and each `blog/*.html`; placeholders skip load. |

---

## 8. Images

- Paths in HTML: `images/...` from site root.
- Paths in CSS: `../images/...` from `css/styles.css`.
- Hero image preloaded in `index.html` for LCP.

See [README.md](../README.md) for asset list and optimization notes.

---

## 9. Accessibility practices (current)

- Skip link to `#main`.
- Semantic landmarks: `header`, `nav`, `main`, `footer`, `section` with headings.
- FAQ uses `<button>` with `aria-expanded`.
- Focus styles on form controls and testimonial dots.
- Decorative hero imagery `aria-hidden="true"`; about illustration uses empty `alt` + `sr-only` figcaption pattern.
- Reduced motion honored globally in CSS and for scroll behavior in JS.

---

## 10. Local development

```bash
# From project root (required for fetch of locales)
python -m http.server 8080
```

Open `http://127.0.0.1:8080/`. Do not rely on `file://` for i18n.

---

## 11. Deployment checklist

For **brandspace.megaautomation.ai** (or any custom host), see **[DEPLOY-SUBDOMAIN.md](./DEPLOY-SUBDOMAIN.md)**.

- [ ] Replace Tawk placeholders or remove script block if unused.
- [ ] Wire contact form to a real endpoint.
- [ ] Optimize images (WebP/AVIF, compression).
- [ ] Confirm `locales/*.json` are served and not cached incorrectly during updates.
- [ ] HTTPS enabled (required for many third-party features).
- [ ] Test EN/RU/UA and blog pages from deployed origin.

---

## 12. Contact information (canonical)

Documented in `locales/*.json` and `index.html` where hardcoded for `tel:` / `mailto:`:

- USA: +1 (347) 512 52 14 — weekdays 9:00–18:00 ET  
- Kyiv: +38 (044) 272 3369 — weekdays 9:00–18:00  
- Email: info@brandspace.legal  

Keep these in sync when contact details change.

---

## 13. Related documents

- [ACTION-ITEMS.md](./ACTION-ITEMS.md) — Recommended next improvements.
- [README.md](../README.md) — Quick reference for authors and deployers.
