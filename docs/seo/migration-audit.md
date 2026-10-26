# SEO migration audit — 12 October 2026

This inventory compares the original WordPress XML sitemap with the Astro site before launch. It contains public URL and metadata information only; Analytics figures are kept out of the public repository.

## Coverage

- Original XML sitemap: **394 URLs** across pages, posts, products, portfolios, categories, hire-duration terms and author archive.
- New XML sitemap: **368 indexable URLs**, including dedicated party PA packages, sound hire, lighting hire, ex-hire equipment and HTML site-map pages. The thank-you page is deliberately excluded.
- Every original sitemap URL is either retained at its current path or has an explicit 301 redirect to a new page. The thank-you destination exists but is intentionally not indexable.
- **All 281 original product URLs** have corresponding product detail pages. The 25 products missing from the earlier snapshot have been restored with original titles and photographs. Their original description fields were blank, so no specifications or prices have been invented. Availability and pricing remain subject to enquiry.
- Original WordPress Yoast metadata is archived in `legacy-metadata.json` (355 records). Only **three** old pages had a populated meta description. All three apply to their equivalent new pages, including the dedicated lighting hire page. The new site supplies descriptions where the old site left them blank. Original titles are applied on one-to-one equivalent pages, with new canonical URLs and social images.

## Restored product pages

Each old product URL redirects directly to its matching detail page. The pages appear in their equipment category, full equipment list and HTML site map.

| Old product URL | Matching detail page |
| --- | --- |
| `/product/martin-audio-w8lm/` | `/dry-hire/equipment/martin-audio-w8lm/` |
| `/product/martin-audio-w8lmd/` | `/dry-hire/equipment/martin-audio-w8lmd/` |
| `/product/112m-loudspeaker/` | `/dry-hire/equipment/112m-loudspeaker/` |
| `/product/qsc-gxd8-amplifier/` | `/dry-hire/equipment/qsc-gxd8-amplifier/` |
| `/product/chauvet-rogue-1l-beam/` | `/dry-hire/equipment/chauvet-rogue-1l-beam/` |
| `/product/ipg-wp60ss-60kva-3phase-generator/` | `/dry-hire/equipment/ipg-wp60ss-60kva-3phase-generator/` |
| `/product/instagrid-one/` | `/dry-hire/equipment/instagrid-one/` |
| `/product/db-audiotechnik-c7-top/` | `/dry-hire/equipment/db-audiotechnik-c7-top/` |
| `/product/db-audiotechnik-c7-subwoofer/` | `/dry-hire/equipment/db-audiotechnik-c7-subwoofer/` |
| `/product/db-audiotechnik-d12-amplifier/` | `/dry-hire/equipment/db-audiotechnik-d12-amplifier/` |
| `/product/db-audiotechnik-q-subwoofer-q-sub/` | `/dry-hire/equipment/db-audiotechnik-q-subwoofer-q-sub/` |
| `/product/iiyama-pl7564u-75-4k-commercial-display/` | `/dry-hire/equipment/iiyama-pl7564u-75-4k-commercial-display/` |
| `/product/db-audiotechnik-d20-amplifier/` | `/dry-hire/equipment/db-audiotechnik-d20-amplifier/` |
| `/product/drum-mic-set-audix-dp7/` | `/dry-hire/equipment/drum-mic-set-audix-dp7/` |
| `/product/elumen8-evora-850-zoom-spot/` | `/dry-hire/equipment/elumen8-evora-850-zoom-spot/` |
| `/product/elumen8-tour-batten-tw-ip-rated/` | `/dry-hire/equipment/elumen8-tour-batten-tw-ip-rated/` |
| `/product/gtdeck-staging-2m-x-1m/` | `/dry-hire/equipment/gtdeck-staging-2m-x-1m/` |
| `/product/broughton-ffht32-3phase-28kw-heater/` | `/dry-hire/equipment/broughton-ffht32-3phase-28kw-heater/` |
| `/product/500mm-x-1000mm-led-panel-3-9mm-pitch-ip-rated/` | `/dry-hire/equipment/500mm-x-1000mm-led-panel-3-9mm-pitch-ip-rated/` |
| `/product/500mm-x-500mm-led-panel-3-9mm-pitch-ip-rated/` | `/dry-hire/equipment/500mm-x-500mm-led-panel-3-9mm-pitch-ip-rated/` |
| `/product/allen-heath-sq5-plus/` | `/dry-hire/equipment/allen-heath-sq5-plus/` |
| `/product/rcf-nx-932-a-active-speaker/` | `/dry-hire/equipment/rcf-nx-932-a-active-speaker/` |
| `/product/rcf-sub-18-ax-active-subwoofer/` | `/dry-hire/equipment/rcf-sub-18-ax-active-subwoofer/` |
| `/product/chamsys-quickq-20/` | `/dry-hire/equipment/chamsys-quickq-20/` |
| `/product/jcb-g65qs-60kva-generator/` | `/dry-hire/equipment/jcb-g65qs-60kva-generator/` |

## Crawl paths and verification

- Every page footer links to the HTML site map, which links to every indexable page using ordinary HTML anchors.
- Footer links also lead directly to sound hire, lighting hire, party packages, ex-hire sales and the full equipment list.
- Product and article entries are generated from the same data used by the listing and site-map pages, so added entries receive links automatically.
- The production build runs the SEO check. It fails if an indexable page has no crawl path from home, a footer site-map link is missing, JSON-LD is invalid, metadata is missing, an old sitemap URL loses its destination, or a redirect is not an explicit HTTP 301.
- The ex-hire page retains the sales enquiry route. The old list was dated 2023, so its stale stock quantities and prices are not presented as current.

## Launch checks

1. Keep the old-to-new redirects active long term, especially the party packages page and product detail URLs.
2. Submit `https://www.loudhire.co.uk/sitemap-index.xml` in Google Search Console after launch.
3. Check indexed URLs, 404s, redirect errors and search landing pages after launch. A temporary change in crawling and rankings is possible during a URL migration.
4. The quote builder pulls the live Current RMS catalogue, but the static SEO product pages are a separate snapshot. New RMS products require a content/page sync to gain an indexable detail page.
