# FORGEIFY — template conversion checklist

Follow this exactly. The output must pass `node tools/build-registry.mjs --check`.

## 0. Preconditions

- The upstream copy sits in `incoming/<key>/` and contains a license file
  (`LICENSE`, `LICENSE.txt`, or `LICENSE.md`). **No license file → STOP, no import.**
- Allowed: MIT, BSD. CC-BY 3.0/4.0 allowed ONLY if the upstream attribution link stays
  in the footer of every page (step 7). Forbidden regardless of claims: "personal use
  only", ThemeForest/Envato, HTML Codex, any "do not redistribute" terms.

## 1. Folder shape

```
templates/<key>/
  pages/index.html      (+ exactly two more core pages)
  styles.css            single consolidated stylesheet
  site.js               single consolidated script
  assets/               images, fonts, icons (vendored — no CDN references)
  LICENSE               copied verbatim from incoming/<key>
  SOURCE.md             provenance (template below)
  manifest.json         contract (schema below)
```

- Pick exactly **3 core pages** (Home + 2). Flatten into `pages/`, filenames lowercase
  (`index.html`, `services.html`, `contact.html`, `about.html`…). Fix links so the 3
  pages reference each other relatively (`services.html`, not `/services` or absolute
  URLs). Remove nav links to pages that no longer exist.
- Consolidate CSS into one `styles.css` (concatenate in original order; keep vendor CSS
  like bootstrap.min.css as the top section). Consolidate JS into `site.js` the same
  way. Update `<link>`/`<script>` tags: each page references exactly `../styles.css`?
  NO — pages are flattened to the site root at build time, so reference `styles.css`
  and `site.js` as siblings: `<link rel="stylesheet" href="styles.css">`,
  `<script src="site.js" defer></script>`. Assets: `assets/<file>`.
- Delete analytics, tracking pixels, Google Fonts/CDN `<link>`s (vendor the font files
  into `assets/fonts/` with `@font-face`, or swap to a system stack that matches the
  design's feel). No external network references may remain in any page
  (`build-registry.mjs --check` greps for `https?://` in `src=`/`href=` outside
  `demo-`/attribution/license links and fails).

## 2. Content slots

Wrap every piece of business-specific copy in slot markers:

```html
<h1><!--FG1:slot:hero_title-->Your trusted local experts<!--/FG1:slot--></h1>
```

- Marker pair: `<!--FG1:slot:<id>-->default content<!--/FG1:slot-->`. Ids snake_case,
  unique per template (not per page).
- Default content = neutral, professional, demo-ready copy. NEVER "lorem ipsum" (the
  engine rejects it). Never invent business claims (no "20 years of experience",
  "award-winning", fake reviews/counts). Generic value language only.
- Required slot ids in every template: `hero_title`, `hero_subtitle`, `about_heading`,
  `about_body`, `services_intro`, `service_list`, `cta_text`, `footer_blurb`.
  Add template-specific slots for every other real copy block (section headings,
  feature blurbs, page intros). Typical total: 12–25 slots.
- `service_list` is `type:"list"`: the marker wraps the whole `<ul>`/card-grid ITEM
  SET, and the default shows 3–6 generic items. The engine replaces the inner HTML
  with items in the SAME item markup — so the manifest slot `description` MUST state
  the exact item markup, e.g. "each item: `<li class=\"service-item\"><h3>…</h3><p>…</p></li>`".
- Images keep their files; wrap alt text: `alt="<!--FG1:slot:hero_image_alt-->Team at work<!--/FG1:slot-->"`
  — WRONG (markers don't work inside attributes). Instead give images stable generic
  alts and list them in manifest `imageNotes` (the engine does not replace images at
  launch; customer photos ride the existing assets pipeline).
- Phone/email/address in headers/footers/contact pages: wrap in slots
  (`contact_phone`, `contact_email_text`, `contact_address`) with neutral defaults
  ("Call us" / "hello@example.com" form) — the engine fills real confirmed data only.

## 3. Add-on-gated sections

Wrap whole optional blocks:

```html
<!--FG1:section:photo_gallery-->
<section class="gallery"> … </section>
<!--/FG1:section-->
```

- Section id = the ForgeFlo pricing add-on code that unlocks it. Valid codes:
  `booking_form`, `photo_gallery`, `newsletter_signup`, `contact_email`.
- The engine deletes the whole block (markers included) when the add-on isn't paid.
  The page must remain visually correct with the block removed (no dangling headings,
  no broken grid).
- Every template must gate at least 2 sections. The lead form (step 5) is NOT gated —
  it is part of the base product.
- Slots may appear inside sections; declare both normally.

## 4. Palette variables

Top of `styles.css`, one `:root` block with EXACTLY these 11 variables, values taken
from the template's own design:

```css
:root {
  --fg1-primary: #1f6f8b;      /* main brand colour */
  --fg1-secondary: #14424f;    /* darker companion */
  --fg1-accent: #ffb600;       /* highlight / CTA */
  --fg1-bg: #ffffff;           /* page background */
  --fg1-surface: #f5f7f9;      /* cards / alt sections */
  --fg1-text: #1c2529;         /* body text */
  --fg1-muted: #5c6b73;        /* secondary text */
  --fg1-accent-text: #10151a;  /* text on accent */
  --fg1-heading-font: "Oswald", Impact, sans-serif;
  --fg1-body-font: "Open Sans", Arial, sans-serif;
  --fg1-radius: 6px;
}
```

- Replace EVERY literal colour in the stylesheet (and inline styles in pages) with the
  matching `var(--fg1-*)`. Shades not covered by the 11 vars: use
  `color-mix(in srgb, var(--fg1-primary) 85%, black)` or pick the nearest var —
  the goal is that changing the 11 values restyles the whole template coherently.
- `font-family` declarations → the two font vars. Heading sizes/weights stay as
  designed.
- Vendor CSS (bootstrap core) may keep its greys; override its themed classes in the
  custom section using the vars (the check only requires zero literal BRAND colours in
  the custom CSS section — annotate the vendor boundary with
  `/* == vendor css above / fg1 custom below == */`).

## 5. FG1 wiring (lead form + bootstrap)

Every template ships the FG1 contract exactly:

1. In `pages/contact.html` (or the core page that hosts contact), the lead form:

```html
<form id="lead-form" class="(match template classes)" novalidate>
  <input type="text" name="name" placeholder="Your name" required>
  <input type="tel" name="phone" placeholder="Phone" required>
  <input type="email" name="email" placeholder="Email">
  <textarea name="message" placeholder="How can we help?"></textarea>
  <input type="text" name="company_website" class="fg1-hp" tabindex="-1"
         autocomplete="off" aria-hidden="true">
  <button type="submit"><!--FG1:slot:lead_form_button-->Request a quote<!--/FG1:slot--></button>
  <p class="fg1-form-note" hidden></p>
</form>
```

`.fg1-hp` is the honeypot — add `position:absolute;left:-9999px` styling in styles.css.

2. At the end of `<body>` on EVERY page, before `site.js`:

```html
<script>
  window.FG1 = {
    projectId: "{{FG1_PROJECT_ID}}",
    formToken: "{{FG1_FORM_TOKEN}}",
    factoryUrl: "{{FG1_FACTORY_URL}}",
    approvalUrl: "{{FG1_APPROVAL_URL}}",
    demo: false
  };
</script>
<script src="site.js" defer></script>
```

ONLY these four `{{FG1_*}}` placeholders may appear anywhere in the template.

3. In `site.js`, append the FG1 handler (adapted to the template's notice styling):

```js
(function () {
  var form = document.getElementById("lead-form");
  if (!form) return;
  var note = form.querySelector(".fg1-form-note");
  function show(msg) { if (note) { note.hidden = false; note.textContent = msg; } }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (form.querySelector(".fg1-hp") && form.querySelector(".fg1-hp").value) return;
    if (!window.FG1 || window.FG1.demo || !window.FG1.projectId || window.FG1.projectId.indexOf("{{") === 0) {
      show("This is a demo site — the form is disabled here.");
      return;
    }
    var data = new FormData(form);
    fetch(window.FG1.factoryUrl + "/api/public/site-form", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId: window.FG1.projectId,
        formToken: window.FG1.formToken,
        name: data.get("name") || "",
        phone: data.get("phone") || "",
        email: data.get("email") || "",
        message: data.get("message") || ""
      })
    }).then(function (res) {
      show(res.ok ? "Thanks — we got your message and will be in touch shortly."
                  : "Something went wrong sending your message. Please call us instead.");
      if (res.ok) form.reset();
    }).catch(function () {
      show("Something went wrong sending your message. Please call us instead.");
    });
  });
})();
```

The demo/unfilled-placeholder branch is what makes demo deploys honest: the button
works, tells the truth, and never posts.

## 6. Nav rules

- One `<h1>` per page. Page `<title>` and meta description present (engine overwrites
  them — keep sensible defaults).
- Nav lists exactly the 3 core pages (+ in-page anchors if the design uses them).
- No `href="#"` dead links anywhere. Buttons that decorated the upstream demo but do
  nothing get removed or wired to a real page/anchor.

## 7. Attribution (CC-BY only)

Keep the upstream credit in the footer of every page, e.g.
`Design: <a href="https://html5up.net">HTML5 UP</a>`, and set in the manifest:
`"attribution": {"required": true, "html": "Design: <a href=\"https://html5up.net\">HTML5 UP</a>"}`.
MIT/BSD templates set `"attribution": null` (credit optional — we still record source
in SOURCE.md).

## 8. manifest.json schema

```json
{
  "key": "constra",
  "name": "Constra",
  "version": "1.0.0",
  "description": "Bold construction & renovation site with project showcase",
  "verticals": ["trades_home_services"],
  "pages": [
    {"file": "index.html", "title": "Home", "core": true},
    {"file": "services.html", "title": "Services", "core": true},
    {"file": "contact.html", "title": "Contact", "core": true}
  ],
  "slots": [
    {"id": "hero_title", "page": "index.html", "type": "text",
     "description": "Main headline, punchy, no punctuation at end", "maxLen": 80}
  ],
  "sections": [
    {"id": "photo_gallery", "addOnCode": "photo_gallery", "page": "index.html"}
  ],
  "paletteVars": {"--fg1-primary": "#ffb600", "…": "all 11 with template defaults"},
  "files": ["pages/index.html", "pages/services.html", "pages/contact.html",
            "styles.css", "site.js", "assets/hero.jpg"],
  "imageNotes": "hero.jpg: wide site/workshop shot; team.jpg: people photo",
  "source": {
    "name": "Constra", "author": "Themefisher",
    "url": "https://github.com/themefisher/constra-bootstrap",
    "license": "MIT",
    "licenseUrl": "https://github.com/themefisher/constra-bootstrap/blob/master/LICENSE",
    "fetchedAt": "2026-07-28"
  },
  "attribution": null
}
```

- Vertical keys: `tech`, `sales_retail`, `automotive_services`, `auto_sales`,
  `beauty`, `trades_home_services`, `restaurants_cafes`, `health_wellness`,
  `professional_services`.
- `slots[].type`: `"text"` (plain text), `"html"` (inline markup allowed),
  `"list"` (array of items in the stated item markup).
- `files` lists EVERY file the engine must download, repo-relative to the template
  folder. Keep assets lean (< 2 MB per file, target < 6 MB total).

## 9. SOURCE.md template

```md
# Source: <upstream name>
- Author: <author>
- Fetched: 2026-07-28 from <exact URL or git URL @ commit SHA>
- License: <MIT/CC-BY 3.0/…> (<link>)
- Modifications: forgeified per tools/FORGEIFY.md — content slotted, colours
  variable-ized, FG1 lead form wired, pages reduced to 3 core.
```

## 10. Verify

- `node tools/build-registry.mjs --check` passes.
- Open each page from disk: layout intact, styles load, no console errors, form shows
  the demo notice on submit.
- Grep yourself honest: no `lorem`, no `href="#"` (except in-page anchors that exist),
  no external CDN loads, no invented claims in defaults.
