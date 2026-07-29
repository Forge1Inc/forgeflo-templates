# forgeflo-templates

Public template library for [ForgeFlo](https://forgeflo.io) — the Forge 1 website factory.

Each folder under `templates/<key>/` is a **forgeified** website template: a real,
license-verified design converted to the FG1 contract (content slots, add-on-gated
sections, `--fg1-*` palette variables, FG1 lead-form wiring). The ForgeFlo engine fills
slots from live business research and deploys in under a minute.

## Layout

```
templates/<key>/
  pages/          the 3 core pages (index.html + 2)
  styles.css      all colours/fonts via --fg1-* CSS variables
  site.js         FG1 lead-form wiring
  assets/         vendored images/fonts
  LICENSE         upstream license (verbatim)
  SOURCE.md       provenance: source, author, license, fetch date
  manifest.json   the machine-readable contract
  screenshot.png  1200×900 capture of the live demo
incoming/<key>/   pristine upstream downloads (audit trail)
tools/FORGEIFY.md the conversion checklist
registry.json     generated index (tools/build-registry.mjs) — paths repo-relative
```

Live demos: `https://demo-<key>.fg1.ca`.

`registry.json` is deterministic (no timestamps) and stores repo-relative paths; the
factory's sync step pins a commit SHA and composes raw.githubusercontent.com URLs at
that SHA.

## Licensing

Hard rules, enforced by `tools/build-registry.mjs --check`:
- MIT/BSD: fine. CC-BY: only with the upstream attribution kept (marked immutable in
  the manifest). "Personal use only" / ThemeForest / no-redistribution sources: never.
- **No LICENSE file in the template folder → the check fails → no import.**

Repo tooling and docs are MIT (see `LICENSE`); each template folder is governed by its
own `LICENSE`.
