#!/usr/bin/env node
// Builds and validates registry.json from templates/*/manifest.json.
//   node tools/build-registry.mjs                 build (writes registry.json)
//   node tools/build-registry.mjs --check         validate + verify registry.json is current
//   add --require-screenshots to make a missing screenshot.png a hard failure
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const REQUIRE_SHOTS = process.argv.includes("--require-screenshots");
// --skip-incomplete: folders without a manifest yet (mid-conversion) are
// warned and skipped instead of failing. Never used in CI — main must always
// be fully valid.
const SKIP_INCOMPLETE = process.argv.includes("--skip-incomplete");

const PLACEHOLDER_ALLOW = ["FG1_PROJECT_ID", "FG1_FORM_TOKEN", "FG1_FACTORY_URL", "FG1_APPROVAL_URL"];
const PALETTE_VARS = [
  "--fg1-primary", "--fg1-secondary", "--fg1-accent", "--fg1-bg", "--fg1-surface",
  "--fg1-text", "--fg1-muted", "--fg1-accent-text", "--fg1-heading-font",
  "--fg1-body-font", "--fg1-radius",
];
const VERTICALS = [
  "tech", "sales_retail", "automotive_services", "auto_sales", "beauty",
  "trades_home_services", "restaurants_cafes", "health_wellness", "professional_services",
];
const SECTION_CODES = ["booking_form", "photo_gallery", "newsletter_signup", "contact_email"];
const REQUIRED_SLOTS = [
  "hero_title", "hero_subtitle", "about_heading", "about_body",
  "services_intro", "service_list", "cta_text", "footer_blurb",
];

const errors = [];
const warnings = [];
const fail = (key, msg) => errors.push(`[${key}] ${msg}`);
const warn = (key, msg) => warnings.push(`[${key}] ${msg}`);

function markerIds(html, kind) {
  const open = [...html.matchAll(new RegExp(`<!--FG1:${kind}:([a-z0-9_]+)-->`, "g"))].map((m) => m[1]);
  const close = [...html.matchAll(new RegExp(`<!--/FG1:${kind}-->`, "g"))].length;
  return { open, close };
}

function validateTemplate(key) {
  const dir = join(ROOT, "templates", key);
  const manifestPath = join(dir, "manifest.json");
  if (!existsSync(manifestPath)) {
    if (SKIP_INCOMPLETE) { warn(key, "manifest.json missing — skipped (in progress)"); return null; }
    return fail(key, "manifest.json missing");
  }
  let m;
  try { m = JSON.parse(readFileSync(manifestPath, "utf8")); } catch (e) { return fail(key, `manifest.json invalid JSON: ${e.message}`); }

  for (const k of ["key", "name", "version", "description", "verticals", "pages", "slots", "sections", "paletteVars", "files", "source"]) {
    if (m[k] === undefined) fail(key, `manifest missing "${k}"`);
  }
  if (m.key !== key) fail(key, `manifest.key "${m.key}" != folder "${key}"`);
  if (!Array.isArray(m.verticals) || !m.verticals.length) fail(key, "verticals empty");
  for (const v of m.verticals || []) if (!VERTICALS.includes(v)) fail(key, `unknown vertical "${v}"`);

  if (!["LICENSE", "LICENSE.txt", "LICENSE.md"].some((f) => existsSync(join(dir, f)))) {
    fail(key, "LICENSE missing — no licence file, no import (hard law)");
  }
  if (!existsSync(join(dir, "SOURCE.md"))) fail(key, "SOURCE.md missing");
  if (!m.source?.license || !m.source?.url) fail(key, "source.license/source.url missing");
  if (/personal use|themeforest|htmlcodex|html codex/i.test(JSON.stringify(m.source))) {
    fail(key, "forbidden source/licence detected");
  }

  const core = (m.pages || []).filter((p) => p.core === true);
  if (core.length !== 3) fail(key, `exactly 3 core pages required, found ${core.length}`);
  const pageFiles = (m.pages || []).map((p) => p.file);
  if (!pageFiles.includes("index.html")) fail(key, "index.html must be a page");

  const declaredByPage = new Map();
  for (const s of m.slots || []) {
    if (!/^[a-z0-9_]+$/.test(s.id || "")) fail(key, `slot id "${s.id}" not snake_case`);
    if (!pageFiles.includes(s.page)) fail(key, `slot "${s.id}" references unknown page "${s.page}"`);
    if (!["text", "html", "list"].includes(s.type)) fail(key, `slot "${s.id}" bad type "${s.type}"`);
    if (!s.description) fail(key, `slot "${s.id}" needs a description`);
    if (!declaredByPage.has(s.page)) declaredByPage.set(s.page, new Set());
    declaredByPage.get(s.page).add(s.id);
  }
  const slotIds = new Set((m.slots || []).map((s) => s.id));
  for (const r of REQUIRED_SLOTS) if (!slotIds.has(r)) fail(key, `required slot "${r}" not declared`);

  const sectionByPage = new Map();
  for (const s of m.sections || []) {
    if (!SECTION_CODES.includes(s.addOnCode)) fail(key, `section "${s.id}" bad addOnCode "${s.addOnCode}"`);
    if (s.id !== s.addOnCode) warn(key, `section id "${s.id}" != addOnCode "${s.addOnCode}" (convention: equal)`);
    if (!pageFiles.includes(s.page)) fail(key, `section "${s.id}" references unknown page "${s.page}"`);
    if (!sectionByPage.has(s.page)) sectionByPage.set(s.page, new Set());
    sectionByPage.get(s.page).add(s.id);
  }
  if ((m.sections || []).length < 2) fail(key, "at least 2 add-on-gated sections required");

  for (const v of PALETTE_VARS) if (!m.paletteVars?.[v]) fail(key, `paletteVars missing "${v}"`);

  for (const f of m.files || []) {
    const p = join(dir, f);
    if (!existsSync(p)) { fail(key, `manifest file missing on disk: ${f}`); continue; }
    const size = statSync(p).size;
    if (size > 2 * 1024 * 1024) fail(key, `${f} exceeds 2 MB (${size})`);
  }
  for (const pf of pageFiles) {
    if (!(m.files || []).includes(`pages/${pf}`)) fail(key, `pages/${pf} not listed in files`);
  }
  if (!(m.files || []).includes("styles.css")) fail(key, "styles.css not in files");
  if (!(m.files || []).includes("site.js")) fail(key, "site.js not in files");

  const css = existsSync(join(dir, "styles.css")) ? readFileSync(join(dir, "styles.css"), "utf8") : "";
  for (const v of PALETTE_VARS) if (css && !css.includes(`${v}:`)) fail(key, `styles.css :root missing ${v}`);

  for (const pf of pageFiles) {
    const p = join(dir, "pages", pf);
    if (!existsSync(p)) continue;
    const html = readFileSync(p, "utf8");

    const slots = markerIds(html, "slot");
    if (slots.open.length !== slots.close) fail(key, `${pf}: unbalanced slot markers (${slots.open.length} open / ${slots.close} close)`);
    const declared = declaredByPage.get(pf) || new Set();
    for (const id of slots.open) if (!declared.has(id)) fail(key, `${pf}: slot marker "${id}" not declared in manifest for this page`);
    for (const id of declared) if (!slots.open.includes(id)) fail(key, `${pf}: declared slot "${id}" has no marker in page`);

    const sections = markerIds(html, "section");
    if (sections.open.length !== sections.close) fail(key, `${pf}: unbalanced section markers`);
    const declaredSections = sectionByPage.get(pf) || new Set();
    for (const id of sections.open) if (!declaredSections.has(id)) fail(key, `${pf}: section marker "${id}" not declared`);
    for (const id of declaredSections) if (!sections.open.includes(id)) fail(key, `${pf}: declared section "${id}" has no marker`);

    for (const ph of [...html.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((x) => x[1])) {
      if (!PLACEHOLDER_ALLOW.includes(ph)) fail(key, `${pf}: placeholder {{${ph}}} not allow-listed`);
    }
    if (/lorem ipsum/i.test(html)) fail(key, `${pf}: lorem ipsum found`);
    if (!html.includes("window.FG1")) fail(key, `${pf}: FG1 bootstrap missing`);
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(key, `${pf}: expected exactly one <h1>, found ${h1s}`);

    for (const mres of html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/g)) {
      const url = mres[1];
      const ok = /demo-[a-z0-9-]+\.fg1\.ca/.test(url) ||
        (m.attribution?.html || "").includes(url.replace(/\/$/, "")) ||
        (m.source?.url || "").startsWith(url.replace(/\/$/, "")) ||
        /^https?:\/\/(html5up\.net|themefisher\.com|github\.com|jahidshah\.com|saaqi\.)/.test(url);
      if (!ok) fail(key, `${pf}: external reference ${url}`);
    }
    if (m.attribution?.required && !html.includes(m.attribution.html)) {
      fail(key, `${pf}: required attribution missing`);
    }
  }

  const leadPage = pageFiles.map((pf) => join(dir, "pages", pf)).filter(existsSync)
    .map((p) => readFileSync(p, "utf8")).some((h) => h.includes('id="lead-form"'));
  if (!leadPage) fail(key, `no page contains id="lead-form"`);

  const js = existsSync(join(dir, "site.js")) ? readFileSync(join(dir, "site.js"), "utf8") : "";
  if (!js.includes("/api/public/site-form")) fail(key, "site.js does not post to /api/public/site-form");
  if (!js.includes("FG1.demo") && !js.includes("window.FG1.demo")) fail(key, "site.js missing demo no-op branch");

  if (!existsSync(join(dir, "screenshot.png"))) {
    (REQUIRE_SHOTS ? fail : warn)(key, "screenshot.png missing");
  }

  return {
    ...m,
    screenshotPath: `templates/${key}/screenshot.png`,
    demoUrl: `https://demo-${key.replace(/_/g, "-")}.fg1.ca`,
  };
}

// TEMPLATE_FILTER=<key> validates a single template (skips registry write/compare) —
// used by conversion agents working in parallel.
const FILTER = process.env.TEMPLATE_FILTER || "";
const keys = existsSync(join(ROOT, "templates"))
  ? readdirSync(join(ROOT, "templates"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  : [];
const entries = keys.filter((k) => !FILTER || k === FILTER).map(validateTemplate).filter(Boolean);

const registry = { schema: 1, templates: entries };
const out = JSON.stringify(registry, null, 2) + "\n";

if (warnings.length) console.warn(warnings.map((w) => `WARN ${w}`).join("\n"));
if (errors.length) {
  console.error(errors.map((e) => `FAIL ${e}`).join("\n"));
  process.exit(1);
}

const registryPath = join(ROOT, "registry.json");
if (FILTER) {
  console.log(`OK — template "${FILTER}" valid (filtered run; registry untouched)`);
  process.exit(0);
}
if (CHECK) {
  const current = existsSync(registryPath) ? readFileSync(registryPath, "utf8") : "";
  if (current !== out) {
    console.error("FAIL registry.json is stale — run: node tools/build-registry.mjs");
    process.exit(1);
  }
  console.log(`OK — ${entries.length} template(s) valid, registry.json current`);
} else {
  writeFileSync(registryPath, out);
  console.log(`Wrote registry.json with ${entries.length} template(s)`);
}
