# Publish to brandspace.megaautomation.ai

This site is **static files** (HTML, CSS, JS, JSON, images). Any static host can serve it. Below is a practical path using **Cloudflare Pages** (works well with domains already on Cloudflare) and a **Netlify** alternative.

**Target hostname:** `brandspace.megaautomation.ai`

---

## Before you publish

1. **Tawk.to** — Replace `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID` in `index.html` and every `blog/*.html`, or remove the inline script + `tawk.js` if you are not using chat yet.
2. **HTTPS** — Use your host’s automatic HTTPS (default on Cloudflare Pages, Netlify, Vercel).
3. **Test locally** — `python -m http.server 8080` and confirm EN/RU/UA and blog pages load.

---

## Option A — Cloudflare Pages (recommended if `megaautomation.ai` uses Cloudflare DNS)

### 1. Put the project on Git (optional but easiest for updates)

```bash
cd "path/to/Brandspace Legal"
git init
git add .
git commit -m "Initial Brandspace Legal static site"
```

Create a **private** repo on GitHub/GitLab, add `git remote`, `git push`.

### 2. Create a Pages project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** (or **Direct Upload** for a one-off ZIP).
2. Select the repo, or upload a **ZIP** of the site folder (contents must include `index.html` at the **root** of the upload).
3. **Build settings:**  
   - **Framework preset:** None  
   - **Build command:** *(empty)*  
   - **Build output directory:** `/` (root) — for a plain static folder, the project root is the output.

If Cloudflare insists on a build step, use output directory `.` and no build command.

### 3. Attach the custom subdomain

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter: `brandspace.megaautomation.ai`.
3. Cloudflare will usually add the correct **DNS** record automatically for zones on the same account.

### 4. DNS (if you manage `megaautomation.ai` elsewhere)

In the DNS panel for **megaautomation.ai**, add:

| Type  | Name        | Target / content                                      | Proxy |
|-------|-------------|--------------------------------------------------------|-------|
| CNAME | `brandspace` | `<your-project>.pages.dev` (shown in Pages UI)         | Yes (orange cloud) if using Cloudflare |

TTL: Auto. Wait a few minutes for propagation.

### 5. Verify

Open `https://brandspace.megaautomation.ai/` — check hero, language switcher, `locales/*.json` (no 404 in browser devtools **Network** tab), and one blog article.

---

## Option B — Netlify

1. [Netlify](https://www.netlify.com/) → **Add new site** → **Deploy manually** (drag-and-drop the project folder) or connect Git.
2. **Publish directory:** repository root (where `index.html` lives).
3. **Domain management** → **Add domain** → `brandspace.megaautomation.ai`.
4. Netlify will show a DNS target (e.g. `brandspace.megaautomation.ai` CNAME to `something.netlify.app`). Add that CNAME at your DNS host for **megaautomation.ai**.

---

## Option C — Vercel

Similar to Netlify: import project as static, no framework, root = output. Add `brandspace.megaautomation.ai` in project domains and set the CNAME they provide.

---

## DNS summary (any host)

- **Subdomain:** `brandspace`
- **Full name:** `brandspace.megaautomation.ai`
- Usually a **CNAME** from `brandspace` → your host’s target (e.g. `xxx.pages.dev` or `xxx.netlify.app`).

Do **not** point the bare domain `megaautomation.ai` to this site unless you intend the main site to be replaced; only the **brandspace** host is needed.

---

## After go-live

- [ ] Confirm `https://brandspace.megaautomation.ai` loads with a valid certificate.
- [ ] Submit **sitemap** (when you add one) in Google Search Console for that URL prefix.
- [ ] Optional: add a **redirect** from `www.brandspace.megaautomation.ai` to non-www or vice versa in your host’s settings.

---

## What I cannot do for you

I do not have access to your **Cloudflare / registrar / Netlify** accounts. You (or your DNS admin) must create the **CNAME** (or follow the host’s wizard) and complete **custom domain verification** in the hosting UI.

If you tell me whether **megaautomation.ai** is on **Cloudflare** or only at a registrar (Namecheap, GoDaddy, etc.), the exact clicks differ slightly; the table above stays the same.
