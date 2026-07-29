/*
	Aurelia — black & gold luxury salon template (original, Forge 1 Inc.)
	Single consolidated script: small vanilla helpers + the FG1 form handlers.
	No dependencies, no external requests except the FG1 factory endpoint.
*/

/* == mobile nav toggle == */

(function () {
	var toggle = document.querySelector(".nav-toggle");
	var nav = document.getElementById("site-nav");
	if (!toggle || !nav) return;
	function setOpen(open) {
		document.body.classList.toggle("nav-open", open);
		toggle.setAttribute("aria-expanded", open ? "true" : "false");
	}
	toggle.addEventListener("click", function () {
		setOpen(!document.body.classList.contains("nav-open"));
	});
	nav.addEventListener("click", function (ev) {
		var t = ev.target;
		if (t && t.nodeName === "A") setOpen(false);
	});
	document.addEventListener("keydown", function (ev) {
		if (ev.key === "Escape") setOpen(false);
	});
})();

/* == FG1 lead-form handler (verbatim per tools/FORGEIFY.md) == */

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

/* == FG1 newsletter handler (newsletter_signup add-on) == */

(function () {
	var form = document.getElementById("newsletter-form");
	if (!form) return;
	var note = form.querySelector(".fg1-form-note");
	function show(msg) { if (note) { note.hidden = false; note.textContent = msg; } }
	form.addEventListener("submit", function (ev) {
		ev.preventDefault();
		if (form.querySelector(".fg1-hp") && form.querySelector(".fg1-hp").value) return;
		var email = (new FormData(form).get("email") || "").toString().trim();
		if (!email) {
			show("Please enter your email address.");
			return;
		}
		if (!window.FG1 || window.FG1.demo || !window.FG1.projectId || window.FG1.projectId.indexOf("{{") === 0) {
			show("This is a demo site — the signup form is disabled here.");
			return;
		}
		fetch(window.FG1.factoryUrl + "/api/public/site-form", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				projectId: window.FG1.projectId,
				formToken: window.FG1.formToken,
				name: "",
				phone: "",
				email: email,
				message: "Newsletter signup request"
			})
		}).then(function (res) {
			show(res.ok ? "Thanks — you're on the list." : "Something went wrong. Please try again later.");
			if (res.ok) form.reset();
		}).catch(function () {
			show("Something went wrong. Please try again later.");
		});
	});
})();
