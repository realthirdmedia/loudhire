# Loud Hire website

Static Astro site for [loudhire.co.uk](https://www.loudhire.co.uk): event production (sound, lighting, staging, video and power) and dry hire, based in Thornbury, serving Bristol, the Cotswolds and the South West.

- **Stack:** Astro 7, plain CSS, no CMS. Content is Markdown and JSON in the repo. Deployed on Vercel.
- **Editing:** change files, commit, push. Vercel builds every push to `main` (production) and every branch/PR (preview URL).

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into .vercel/output (Vercel adapter)
```

Node 22 or newer.

## Where things live

| What | Where |
| --- | --- |
| Contact details, nav, tagline, capability blurbs, event types, testimonials | `src/data/site.ts` |
| Event Production sub-pages (5 capabilities + 5 event types): copy, kit lists, featured projects | `src/data/eventProduction.ts` |
| Homepage | `src/pages/index.astro` |
| Event Production hub, Dry Hire, About, Contact, Privacy, 404 | `src/pages/*.astro` |
| News & Projects entries (one file each) | `src/content/news-and-projects/*.md` |
| Photos for entries and pages | `src/assets/projects/<entry>/`, `src/assets/news/<entry>/`, `src/assets/pages/` |
| Equipment list (256 items) and categories | `src/data/equipment.json`, `src/data/equipment-categories.json`, images in `src/assets/equipment/` |
| Redirects from the old WordPress URLs | `src/data/redirects.mjs` → run `npm run vercel-json` to regenerate `vercel.json` |
| Enquiry form endpoint | `src/pages/api/enquiry.ts` (Vercel function) |
| Global styles and design tokens | `src/styles/global.css` |
| Logo, favicons, default share image | `public/images/`, `public/*.png` |

## News & Projects

One collection, one entry per article or project, one URL: `/news-and-projects/<filename>/`.

Every "Latest" section (homepage, thank-you page), the listing filters, service-page project cards and the homepage feature all read from these files. There is nothing else to update.

### Add an entry

1. Create `src/content/news-and-projects/my-new-entry.md` (the filename becomes the URL slug: lowercase, hyphens).
2. Put the photos in `src/assets/projects/my-new-entry/` (or `src/assets/news/my-new-entry/`). JPEG, 1600 to 2000px on the long edge is plenty; Astro generates the responsive sizes at build.
3. Fill in the frontmatter (below), write the body in Markdown, commit.

```md
---
title: "Event production for Client at Venue"        # required
date: 2026-09-01                                      # required, drives ordering and "Latest"
type: project                                         # project | news | both
summary: "One or two sentences for cards and search results (max 220 characters)."
services: [sound, lighting, staging, video, power]    # any subset, in this order
cover: ../../assets/projects/my-new-entry/cover.jpg   # required, landscape works best
coverAlt: "Describe the photo"                        # required
# --- optional project fields ---
client: "Client name"
location: "Venue, town"
eventType: "Corporate event"
brief: "One or two sentences on what the client asked for."
servicesDelivered:
  - "Danley J7 PA system"
  - "Stage lighting with operator"
gallery:
  - src: ../../assets/projects/my-new-entry/photo-1.jpg
    alt: "Describe the photo"
    caption: "Optional caption"
testimonial:
  quote: "What the client said."
  name: "Name, organisation"
featured: true     # eligible for the homepage "selected projects" style blocks (defaults to false)
hideDate: false    # true for legacy entries where only the year is known
draft: false       # true hides the entry from the build
---

Body text in Markdown. Use `## Headings`, paragraphs, lists and links.
Link to other pages with site-relative URLs, e.g. [contact us](/contact/).
```

Rules of thumb: keep distinct events as distinct entries, only list services actually supplied at that event, and credit partners (for example Big Stage Hire for stages) where they supplied part of the job.

### Homepage feature and selected projects

`src/pages/index.astro` names the featured entry (`hawkstone-advert-launch`) and the three "selected projects" by id. Change the ids there to swap them. The "Latest" block is automatic.

### Service pages

`src/data/eventProduction.ts` lists `projectIds` per page. If fewer than three ids resolve, the page falls back to anything tagged with that service.

## Equipment list

`src/data/equipment.json` has one object per item:

```json
{
  "slug": "allen-heath-sq6",
  "name": "Allen & Heath SQ6",
  "section": "sound",
  "category": "Mixers",
  "categorySlug": "mixers",
  "pricePerDay": 80,
  "description": "Short spec, line breaks allowed",
  "image": "allen-heath-sq6.jpg",
  "oldUrl": "/product/allen-heath-sq6/"
}
```

- `section` is one of `sound`, `lighting`, `staging`, `video`, `power`, `accessories` and decides which block of the list the item appears in.
- `pricePerDay` is ex VAT; use `null` for "Price on enquiry".
- Images live in `src/assets/equipment/<slug>.jpg` (product shot on white, around 800px).
- `oldUrl` keeps the redirect from the old WooCommerce URL; leave it blank for new items.
- Categories with their display names are in `src/data/equipment-categories.json`; a category page is generated for each one.

## Redirects

All old WordPress URLs (pages, posts, portfolio items, product and category pages, sitemaps) are mapped in `src/data/redirects.mjs`. Two layers use it:

1. `vercel.json` (generated by `npm run vercel-json`) redirects at the edge with a 301.
2. `src/pages/[...legacy].astro` is a server-side catch-all that redirects anything the edge misses, and otherwise serves the 404 page.

After editing the map, run `npm run vercel-json` and commit `vercel.json`.

## Enquiry form

The form posts to `/api/enquiry/` (see `src/pages/api/enquiry.ts`). It validates, drops honeypot submissions and rate-limits, then delivers by email:

- **Default:** FormSubmit forwards the message to `ENQUIRY_TO` (defaults to `info@loudhire.co.uk`). The first submission triggers a one-time activation email to that inbox; click the link once and every enquiry after that is delivered.
- **Optional:** set `RESEND_API_KEY` (and `ENQUIRY_FROM` on a verified domain) in Vercel environment variables to send via Resend instead.

Copy `.env.example` to `.env` for local overrides.

## Design notes

Orange (`#f39200`) and black branding with the existing logo. Light backgrounds for content, black header and footer so the white lettering in the logo works. Typography: Manrope for headings, Inter for body (self-hosted via Fontsource). Tokens are at the top of `src/styles/global.css`.
