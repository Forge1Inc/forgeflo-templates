# Source: Car Mechanic Shop
- Author: Saqib Islam (Saaqi)
- Fetched: 2026-07-28 from https://github.com/saaqi/car-mechanic-shop @ 5dfda5b715abaff4376bab176307d30f4464a917 (vendored `vite build` output)
- License: MIT (https://github.com/saaqi/car-mechanic-shop/blob/master/LICENSE)
- Modifications: forgeified per tools/FORGEIFY.md — the upstream one-pager was split
  into 3 core pages (index / services / contact) reusing its own header, footer and
  design system; content slotted; colours variable-ized (`--fg1-*`); FG1 lead form
  wired into the contact page using the template's own form styling.
  - Assets de-hashed: `index-*.css` regenerated into `styles.css` (purged Bootstrap 5
    + boxicons + preloader + theme, brand colours replaced with vars); the minified
    `index-*.js` bundle replaced with small hand-written equivalents in `site.js`
    (mobile menu, sticky dark header, preloader hide, footer year); font woff2 files
    renamed to `assets/fonts/<family>-latin.woff2`; header backgrounds renamed to
    `assets/header-bg[-mobile].webp`.
  - Removed: testimonials/review carousel (and reviewer photos), deals carousel with
    invented prices, "why us" animated counters (invented stats), Glide.js, Bootstrap
    alert JS, store-open-now widget (hard-coded timezone), author's personal
    favicons/logo, social/contact links pointing at the author, non-Latin font
    subsets, and boxicons eot/woff/ttf/svg (woff2 kept).
  - Added: add-on-gated appointment band (`booking_form`, index) and newsletter
    signup band (`newsletter_signup`, contact — posts to the same FG1
    `/api/public/site-form` endpoint with a "Newsletter signup" name so submissions
    arrive as leads).
  - 2026-07-28: about section on index.html restructured to text + photo columns
    with a CC0 workshop photo (below).

## Photos
- assets/workshop-oil-check.webp: CC0 via Openverse (rawpixel): https://www.rawpixel.com/image/9658224/image-person-public-domain-2022
