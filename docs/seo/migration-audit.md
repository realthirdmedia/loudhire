# SEO migration audit — 12 October 2026

This inventory compares the original WordPress XML sitemap with the Astro site before launch. It contains public URL and metadata information only; Analytics figures are kept out of the public repository.

## Coverage

- Original XML sitemap: **394 URLs** across pages, posts, products, portfolios, categories, hire-duration terms and author archive.
- New XML sitemap: **339 indexable URLs**, including the new dedicated party PA packages page. The thank-you page is deliberately excluded.
- Every original sitemap URL is either retained at its current path or has an explicit 301 redirect to a new page. The thank-you destination exists but is intentionally not indexable.
- **256 original product URLs** have corresponding new product detail pages. **25 further WordPress products** were added after the static catalogue snapshot. These currently redirect to the closest live category until stock and product details can be confirmed.
- Original WordPress Yoast metadata is archived in `legacy-metadata.json` (355 records). Only **three** old pages had a populated meta description. Two apply to equivalent new pages; the old lighting-hire description is archived because its URL now points to the wider dry-hire lighting section. The new site supplies descriptions where the old site left them blank. Original titles are applied on one-to-one equivalent pages, with new canonical URLs and social images.

## Old product pages without equivalent detail pages

These redirects prevent broken links. If any product is still stocked, add it to the static catalogue with its description and photo so its old URL can redirect to a matching detail page. Prioritise products with meaningful organic landing traffic.

| Old product URL | Current 301 destination |
| --- | --- |
| `/product/martin-audio-w8lm/` | `/dry-hire/equipment/category/speakers/` |
| `/product/martin-audio-w8lmd/` | `/dry-hire/equipment/category/speakers/` |
| `/product/112m-loudspeaker/` | `/dry-hire/equipment/category/speakers/` |
| `/product/qsc-gxd8-amplifier/` | `/dry-hire/equipment/category/amplifiers/` |
| `/product/chauvet-rogue-1l-beam/` | `/dry-hire/equipment/category/stage-lighting/` |
| `/product/ipg-wp60ss-60kva-3phase-generator/` | `/dry-hire/equipment/category/power/` |
| `/product/instagrid-one/` | `/dry-hire/equipment/category/power/` |
| `/product/db-audiotechnik-c7-top/` | `/dry-hire/equipment/category/speakers/` |
| `/product/db-audiotechnik-c7-subwoofer/` | `/dry-hire/equipment/category/speakers/` |
| `/product/db-audiotechnik-d12-amplifier/` | `/dry-hire/equipment/category/amplifiers/` |
| `/product/db-audiotechnik-q-subwoofer-q-sub/` | `/dry-hire/equipment/category/speakers/` |
| `/product/iiyama-pl7564u-75-4k-commercial-display/` | `/dry-hire/equipment/category/video/` |
| `/product/db-audiotechnik-d20-amplifier/` | `/dry-hire/equipment/category/amplifiers/` |
| `/product/drum-mic-set-audix-dp7/` | `/dry-hire/equipment/category/microphones/` |
| `/product/elumen8-evora-850-zoom-spot/` | `/dry-hire/equipment/category/stage-lighting/` |
| `/product/elumen8-tour-batten-tw-ip-rated/` | `/dry-hire/equipment/category/stage-lighting/` |
| `/product/gtdeck-staging-2m-x-1m/` | `/dry-hire/equipment/category/staging/` |
| `/product/broughton-ffht32-3phase-28kw-heater/` | `/dry-hire/equipment/category/power/` |
| `/product/500mm-x-1000mm-led-panel-3-9mm-pitch-ip-rated/` | `/dry-hire/equipment/category/video/` |
| `/product/500mm-x-500mm-led-panel-3-9mm-pitch-ip-rated/` | `/dry-hire/equipment/category/video/` |
| `/product/allen-heath-sq5-plus/` | `/dry-hire/equipment/category/mixers/` |
| `/product/rcf-nx-932-a-active-speaker/` | `/dry-hire/equipment/category/speakers/` |
| `/product/rcf-sub-18-ax-active-subwoofer/` | `/dry-hire/equipment/category/speakers/` |
| `/product/chamsys-quickq-20/` | `/dry-hire/equipment/category/dimmers-data/` |
| `/product/jcb-g65qs-60kva-generator/` | `/dry-hire/equipment/category/power/` |

## Launch checks

1. Keep the old-to-new redirects active long term, especially the party packages page and product detail URLs.
2. Submit `https://www.loudhire.co.uk/sitemap-index.xml` in Google Search Console after launch.
3. Check indexed URLs, 404s, redirect errors and search landing pages after launch. A temporary change in crawling and rankings is possible during a URL migration.
4. The quote builder pulls the live Current RMS catalogue, but the static SEO product pages are a separate snapshot. New RMS products require a content/page sync to gain an indexable detail page.
