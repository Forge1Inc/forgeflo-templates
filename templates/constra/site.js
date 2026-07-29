/* Constra — FG1 site script (vanilla JS, no jQuery). */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggler = document.querySelector(".navbar-toggler");
  var collapse = document.getElementById("navbar-collapse");
  if (toggler && collapse) {
    toggler.addEventListener("click", function () {
      var open = collapse.classList.toggle("show");
      toggler.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Sticky main nav once the page scrolls past the header top area
  var header = document.querySelector(".header-one");
  var nav = document.querySelector(".header-one .site-navigation");
  function stickyNav() {
    if (!header || !nav) return;
    var topBar = document.querySelector(".top-bar");
    var logoArea = document.querySelector(".header-one .logo-area");
    var threshold = (topBar ? topBar.offsetHeight : 0) + (logoArea ? logoArea.offsetHeight : 0);
    if (window.pageYOffset > threshold) {
      if (!nav.classList.contains("navbar-fixed")) {
        header.style.marginBottom = nav.offsetHeight + "px";
        nav.classList.add("navbar-fixed");
      }
    } else {
      nav.classList.remove("navbar-fixed");
      header.style.marginBottom = "0";
    }
  }

  // Back-to-top button
  var backToTop = document.getElementById("back-to-top");
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.style.display = window.pageYOffset >= 400 ? "block" : "none";
  }
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", function () {
    stickyNav();
    toggleBackToTop();
  }, { passive: true });
  stickyNav();
  toggleBackToTop();

  // Extra FG1-wired forms (call-back strip + newsletter). Same contract as the
  // lead form: honest demo notice when placeholders are unfilled, real POST
  // to the factory endpoint otherwise.
  function wireFG1Form(form, buildPayload) {
    if (!form) return;
    var note = form.querySelector(".fg1-form-note");
    function show(msg) { if (note) { note.hidden = false; note.textContent = msg; } }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var hp = form.querySelector(".fg1-hp");
      if (hp && hp.value) return;
      if (!window.FG1 || window.FG1.demo || !window.FG1.projectId || window.FG1.projectId.indexOf("{{") === 0) {
        show("This is a demo site — the form is disabled here.");
        return;
      }
      fetch(window.FG1.factoryUrl + "/api/public/site-form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildPayload(new FormData(form)))
      }).then(function (res) {
        show(res.ok ? "Thanks — we got your message and will be in touch shortly."
                    : "Something went wrong sending your message. Please call us instead.");
        if (res.ok) form.reset();
      }).catch(function () {
        show("Something went wrong sending your message. Please call us instead.");
      });
    });
  }

  wireFG1Form(document.getElementById("callback-form"), function (data) {
    return {
      projectId: window.FG1.projectId,
      formToken: window.FG1.formToken,
      name: data.get("name") || "",
      phone: data.get("phone") || "",
      email: "",
      message: "Call back requested from the website."
    };
  });

  wireFG1Form(document.getElementById("newsletter-form"), function (data) {
    return {
      projectId: window.FG1.projectId,
      formToken: window.FG1.formToken,
      name: "",
      phone: "",
      email: data.get("email") || "",
      message: "Newsletter signup request from the website."
    };
  });
})();

/* FG1 lead form handler (verbatim per tools/FORGEIFY.md). */
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
