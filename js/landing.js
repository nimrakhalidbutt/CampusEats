/* CampusEats landing page: contact form validation.
   There is no server in this project, so a valid submit shows a confirmation
   message and clears the form. Replace the marked block to send the data somewhere. */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) { return; }
  var status = document.getElementById("form-status");
  var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));

  function messageFor(el) {
    if (el.validity.valueMissing) { return el.getAttribute("data-required") || "This field is required."; }
    if (el.validity.typeMismatch) { return "Enter a valid email address, like name@example.com."; }
    if (el.validity.tooShort) { return el.getAttribute("data-short") || "This is too short."; }
    return "";
  }
  function check(el) {
    var err = document.getElementById(el.id + "-error");
    var msg = el.checkValidity() ? "" : messageFor(el);
    err.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  fields.forEach(function (el) {
    el.addEventListener("blur", function () { if (el.value !== "" || el.getAttribute("aria-invalid") === "true") { check(el); } });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") { check(el); } });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = ""; status.className = "lp-form__status";
    var firstBad = null;
    fields.forEach(function (el) { if (!check(el) && !firstBad) { firstBad = el; } });
    if (firstBad) { firstBad.focus(); return; }

    /* --- Replace this block to actually send the message (e.g. fetch() to a form service) --- */
    var name = form.elements.name.value.trim().split(" ")[0];
    form.reset();
    fields.forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    /* ------------------------------------------------------------------------------------- */

    status.textContent = "Thanks, " + name + "! Your message has been sent. We’ll get back to you soon.";
    status.className = "lp-form__status is-success";
    status.focus();
  });
})();
