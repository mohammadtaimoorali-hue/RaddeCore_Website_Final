# Raddecore ERP — Marketing Website & Demo Gateway

Production-ready SaaS marketing website for **Raddecore ERP** — a multi-tenant enterprise platform covering Accounting, Inventory, CRM, HR & Payroll, Restaurant, and Retail.

**Live URL:** https://raddecore.com  
**Demo URL:** https://demo.raddecore.com

---

## Project Structure

```
raddecore/
├── index.html              # Main marketing homepage
├── pricing/
│   └── index.html          # Standalone pricing page with FAQ
├── demo/
│   └── index.html          # Demo gateway / sandbox access page
├── auth/
│   ├── signup/
│   │   └── index.html      # Free trial signup form
│   └── login/
│       └── index.html      # Sign in page
├── app/
│   └── index.html          # App dashboard (post-login shell)
├── src/
│   ├── styles/
│   │   └── main.css        # Global design system & all styles
│   └── lib/
│       └── main.js         # All interactive logic (data, rendering, animations)
├── .env.example            # Environment variable template
└── README.md               # This file
```

---

## Route Map

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.html` | Marketing homepage — hero, modules, demo CTA, pricing, testimonials, about |
| `/pricing` | `pricing/index.html` | Full pricing page with plans, comparison table, FAQ |
| `/demo` | `demo/index.html` | Demo sandbox gateway with credentials |
| `/auth/signup` | `auth/signup/index.html` | Free trial + paid plan signup |
| `/auth/login` | `auth/login/index.html` | Sign in form |
| `/app` | `app/index.html` | Post-login app dashboard (scaffold) |

---

## Quick Start

### Option 1 — Open directly in browser

No build step required. This is a static HTML/CSS/JS site.

```bash
# Clone / unzip the project
cd raddecore

# Open in browser
open index.html
```

Or serve with any static server:

```bash
npx serve .
# → http://localhost:3000
```

### Option 2 — Deploy to Vercel (recommended)

```bash
npm i -g vercel
cd raddecore
vercel deploy
```

Vercel auto-detects static files. No configuration needed.

### Option 3 — Deploy to Netlify

Drag and drop the `raddecore/` folder at https://app.netlify.com/drop

Or via CLI:

```bash
npm i -g netlify-cli
netlify deploy --dir . --prod
```

### Option 4 — Nginx / Apache

Copy the project to your web root:

```bash
cp -r raddecore/* /var/www/html/
```

For clean URLs (without `.html` extensions), add to your nginx config:

```nginx
server {
    listen 80;
    server_name raddecore.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

---

## Deployment: Vercel Configuration

Create `vercel.json` in the project root for clean routing:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/pricing",       "destination": "/pricing/index.html" },
    { "source": "/demo",          "destination": "/demo/index.html" },
    { "source": "/auth/signup",   "destination": "/auth/signup/index.html" },
    { "source": "/auth/login",    "destination": "/auth/login/index.html" },
    { "source": "/app",           "destination": "/app/index.html" }
  ]
}
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```bash
cp .env.example .env
```

These are used when upgrading to a Next.js / backend implementation.

---

## Architecture Notes

### Frontend (current)
- Pure HTML + CSS + Vanilla JS — zero build dependencies
- Google Fonts: DM Sans + DM Mono loaded from CDN
- CSS custom properties for full theme system
- IntersectionObserver for scroll animations
- All data (modules, plans, testimonials) centralised in `src/lib/main.js`

### Upgrading to Next.js (recommended path)

```bash
npx create-next-app@latest raddecore-next --typescript --tailwind
# Move pages to app/ directory
# Replace inline CSS with Tailwind classes
# Connect API routes in app/api/
```

### Backend Integration Points

| Feature | File | Integration |
|---------|------|-------------|
| Signup form | `auth/signup/index.html` | `POST /api/auth/signup` |
| Login form | `auth/login/index.html` | `POST /api/auth/login` |
| Pricing | `src/lib/main.js` | Stripe Products API |
| Demo redirect | `demo/index.html` | `https://demo.raddecore.com` |

### Stripe Integration (pricing)

When ready to wire Stripe:

1. Create Products + Prices in Stripe Dashboard
2. Add Price IDs to each plan in `main.js`:
   ```js
   { name: 'Starter', stripePriceMonthly: 'price_xxx', stripePriceYearly: 'price_yyy', ... }
   ```
3. Replace the signup button handler with `stripe.redirectToCheckout({ priceId })`

### Multi-Tenant Architecture (app)

The app scaffold at `/app` is designed for a multi-tenant SaaS system:

- **Tenant isolation:** Each organisation gets a separate DB schema
- **Subdomain routing:** `{tenant}.app.raddecore.com` → tenant lookup
- **Role-based access:** `admin | manager | staff | viewer` roles
- **Storage limits:** Enforced per plan — Starter 10 GB, Pro 50 GB, Enterprise scalable

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#08090c` | Page background |
| `--card` | `#1a1d28` | Card backgrounds |
| `--accent` | `#4f8cff` | Primary blue |
| `--accent2` | `#7c5cfc` | Purple |
| `--accent3` | `#22d3a0` | Green / success |
| `--accent4` | `#ff6b4a` | Orange / warning |
| `--font` | DM Sans | Body + UI |
| `--mono` | DM Mono | Code, credentials |

---

## SEO

The homepage includes:
- `<title>` and `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:url`)
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)

For production, add:
- `sitemap.xml` at root
- `robots.txt`
- `<link rel="canonical" href="https://raddecore.com" />`
- Schema.org SaaS product markup

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✓ Full |
| Firefox 88+ | ✓ Full |
| Safari 14+ | ✓ Full |
| Edge 90+ | ✓ Full |
| IE 11 | ✗ Not supported |

---

## License

Proprietary. All rights reserved — Raddecore ERP.
