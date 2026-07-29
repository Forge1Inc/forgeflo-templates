/* Mechanic — FG1 site script.
   Hand-written replacement for the upstream minified bundle: only the
   behaviour these three pages actually use (mobile menu, sticky dark
   header, preloader, footer year) plus the FG1 form handlers. */

/* ---- Mobile menu toggle + collapse-on-navigate ---- */
(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector("nav.nav-primary");
  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", function () {
    navigation.classList.toggle("show");
    menuButton.classList.toggle("activated");
    menuButton.classList.toggle("bx-x");
    var expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", expanded ? "false" : "true");
    menuButton.setAttribute("aria-pressed", expanded ? "false" : "true");
  });

  var menuLinks = document.querySelectorAll(".primary-menu .menu-item a, a.top-link, .site-title a");
  menuLinks.forEach(function (eachLink) {
    eachLink.addEventListener("click", function () {
      navigation.classList.remove("show");
      menuButton.classList.remove("activated");
      menuButton.classList.remove("bx-x");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-pressed", "false");
    });
  });
})();

/* ---- Solid header + back-to-top link once the page scrolls ---- */
(function () {
  function onScroll() {
    document.body.classList.toggle("dark", window.scrollY >= 100);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---- Preloader (index only — the element is absent elsewhere) ---- */
(function () {
  var preloader = document.getElementById("loader-wrapper");
  if (!preloader) return;
  function hide() {
    preloader.classList.add("hide-preloader");
    setTimeout(function () {
      preloader.hidden = true;
      preloader.style.display = "none";
    }, 600);
  }
  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
})();

/* ---- Footer year ---- */
(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ---- FG1 lead form handler ---- */
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

/* ---- Newsletter signup (gated add-on) — posts to the same FG1 endpoint ---- */
(function () {
  var form = document.getElementById("newsletter-form");
  if (!form) return;
  var note = form.querySelector(".fg1-form-note");
  function show(msg) { if (note) { note.hidden = false; note.textContent = msg; } }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (form.querySelector(".fg1-hp") && form.querySelector(".fg1-hp").value) return;
    if (!window.FG1 || window.FG1.demo || !window.FG1.projectId || window.FG1.projectId.indexOf("{{") === 0) {
      show("This is a demo site — the signup form is disabled here.");
      return;
    }
    var data = new FormData(form);
    fetch(window.FG1.factoryUrl + "/api/public/site-form", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId: window.FG1.projectId,
        formToken: window.FG1.formToken,
        name: "Newsletter signup",
        phone: "",
        email: data.get("email") || "",
        message: "Newsletter signup request from the website."
      })
    }).then(function (res) {
      show(res.ok ? "Thanks — you're on the list."
                  : "Something went wrong. Please try again later.");
      if (res.ok) form.reset();
    }).catch(function () {
      show("Something went wrong. Please try again later.");
    });
  });
})();
