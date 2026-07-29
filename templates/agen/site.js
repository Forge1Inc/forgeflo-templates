/* Agen — FG1 site script (vanilla JS, no dependencies) */

/* nav: sticky background + mobile toggle */
(function () {
  "use strict";

  var nav = document.querySelector(".navigation");
  if (nav) {
    var onScroll = function () {
      if (window.pageYOffset > 100) {
        nav.classList.add("nav-bg");
      } else {
        nav.classList.remove("nav-bg");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  var toggler = document.querySelector(".navbar-toggler");
  var collapse = document.getElementById("navigation");
  if (toggler && collapse) {
    toggler.addEventListener("click", function () {
      var open = collapse.classList.toggle("show");
      toggler.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();

/* FG1 lead form handler (contract) */
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

/* FG1 auxiliary forms (consultation band + newsletter) — same endpoint, same demo rules */
(function () {
  function wire(id, buildMessage) {
    var form = document.getElementById(id);
    if (!form) return;
    var note = form.querySelector(".fg1-form-note");
    if (!note && form.nextElementSibling && form.nextElementSibling.classList &&
        form.nextElementSibling.classList.contains("fg1-form-note")) {
      note = form.nextElementSibling;
    }
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
          message: buildMessage(data)
        })
      }).then(function (res) {
        show(res.ok ? "Thanks — we got your request and will be in touch shortly."
                    : "Something went wrong sending your request. Please call us instead.");
        if (res.ok) form.reset();
      }).catch(function () {
        show("Something went wrong sending your request. Please call us instead.");
      });
    });
  }

  wire("booking-form", function (data) {
    var topic = data.get("topic") || "";
    return "Consultation request from website" + (topic ? " — " + topic : "");
  });

  wire("newsletter-form", function () {
    return "Newsletter signup request from website";
  });
})();
