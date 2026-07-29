# Source: Phantom (HTML5 UP)
- Author: HTML5 UP (ajlkn)
- Fetched: 2026-07-28 from https://html5up.net/phantom/download (official zip)
- License: CC-BY 3.0 (https://html5up.net/license) — attribution required: the footer credit
  `Design: <a href="https://html5up.net">HTML5 UP</a>` must stay on every page.
- Modifications: forgeified per tools/FORGEIFY.md — pages reduced to 3 core (index, services,
  contact) and positioned for beauty (salon/spa/barber/nails); all demo "ipsum" copy replaced
  with neutral beauty defaults inside FG1 slots; colours variable-ized to the 11 `--fg1-*`
  vars (defaults are Phantom's own palette, warmed toward its rose/magenta/lavender accents;
  the blue/teal tile accents became color-mix derivations of the three brand vars); Google
  Fonts import removed (system humanist stack keeps the Source Sans Pro feel); Font Awesome
  vendored to assets/fonts (woff2/woff only); CSS consolidated (fontawesome-all.min.css +
  main.css + noscript.css) into styles.css; JS consolidated (jquery, browser, breakpoints,
  util, main) into site.js plus the FG1 lead-form and newsletter handlers; upstream footer
  demo form and dead social `#` links removed; demo images are the abstract blur JPGs from
  the official zip, renamed by role. Decorative inline SVG data-URIs (hamburger/close icons,
  select arrow, tile cross) keep their baked-in colours — they are artwork, not themable CSS.
