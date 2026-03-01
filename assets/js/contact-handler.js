/**
 * ═══════════════════════════════════════════════════════════════
 *  HAWKSBILL TECHNIK — Unified Form Handler
 *  Handles: Contact Form (index.html) + Service Enquiry Modal
 *
 *  IMPORTANT: Replace GAS_URL with your deployed Apps Script URL
 * ═══════════════════════════════════════════════════════════════
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycbzGcZQMBYG7ngkJuagazY7bTQ8WbmPicrR_uDyH3cuttVUVXL1mWFp1RUXDfj5Awwwoag/exec";

// ─── UTM + Lead Source Helpers ────────────────────────────────────
function getUTM(key) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

function getLeadInfo() {
  return {
    leadSource:   document.referrer || "Direct",
    utm_source:   getUTM("utm_source"),
    utm_medium:   getUTM("utm_medium"),
    utm_campaign: getUTM("utm_campaign"),
    utm_term:     getUTM("utm_term"),
    utm_content:  getUTM("utm_content"),
    page_url:     window.location.href,
  };
}

// ─── Generic Submit to GAS ────────────────────────────────────────
async function submitToGAS(payload) {
  // mode: "no-cors" avoids CORS preflight — Apps Script handles it.
  // We won't get a parseable JSON back with no-cors, so we treat
  // any network success as a form success (GAS always writes to sheet).
  const res = await fetch(GAS_URL, {
    method:  "POST",
    mode:    "no-cors",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  // no-cors always returns opaque response (status 0) — treat as success
  return { status: "success" };
}

// ═══════════════════════════════════════════════════════════════════
//  1. CONTACT FORM  (index.html #contact section)
// ═══════════════════════════════════════════════════════════════════
(function initContactForm() {
  const form = document.getElementById("ht-contact-form");
  if (!form) return;

  const btnSpan  = form.querySelector(".btn-submit span");
  const btnIcon  = form.querySelector(".btn-submit i");
  const loadingEl = form.querySelector(".loading");
  const errorEl   = form.querySelector(".error-message");
  const sentEl    = form.querySelector(".sent-message");

  function setStatus(state, msg) {
    loadingEl.style.display = state === "loading" ? "block" : "none";
    errorEl.style.display   = state === "error"   ? "block" : "none";
    sentEl.style.display    = state === "success"  ? "block" : "none";
    if (msg && state === "error")   errorEl.textContent = msg;
    if (msg && state === "success") sentEl.textContent  = msg;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    btn.disabled = true;
    if (btnSpan) btnSpan.textContent = "Sending…";
    setStatus("loading");

    const fd = new FormData(form);
    const data = {
      form_type: "contact",
      name:    fd.get("name")    || "",
      email:   fd.get("email")   || "",
      subject: fd.get("subject") || "",
      message: fd.get("message") || "",
      ...getLeadInfo(),
    };

    try {
      await submitToGAS(data);
      setStatus("success", "✓ Message sent! We'll reply within 1 business day.");
      form.reset();
    } catch (err) {
      setStatus("error", "Network error — please try again or email us directly.");
    } finally {
      btn.disabled = false;
      if (btnSpan) btnSpan.textContent = "Send Message";
    }
  });
})();

// ═══════════════════════════════════════════════════════════════════
//  2. SERVICE ENQUIRY MODAL  (service-details.html)
// ═══════════════════════════════════════════════════════════════════
(function initEnquiryModal() {
  const modal   = document.getElementById("svc-enquiry-modal");
  if (!modal) return;

  const form      = document.getElementById("svc-enquiry-form");
  const closeBtn  = document.getElementById("svc-modal-close");
  const statusEl  = document.getElementById("svc-enquiry-status");
  const productNameEl  = document.getElementById("svc-modal-product-name");
  const productFieldEl = document.getElementById("svc-form-product-name");
  const pageFieldEl    = document.getElementById("svc-form-page-url");

  // ── Open / Close ──────────────────────────────────────────────
  function openModal(productName) {
    if (productNameEl) productNameEl.textContent = productName || "Service";
    if (productFieldEl) productFieldEl.value = productName || "";
    if (pageFieldEl)    pageFieldEl.value = window.location.href;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    // Focus first visible input
    setTimeout(() => form?.querySelector("input:not([type=hidden])")?.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (statusEl) { statusEl.textContent = ""; statusEl.className = "svc-status"; }
  }

  // Delegate open to any .enquiry-trigger with data-product
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".enquiry-trigger");
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.product || trigger.textContent.trim());
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Expose globally for breadcrumb / service card onclick use
  window.openServiceEnquiry = openModal;

  // ── Form Submit ───────────────────────────────────────────────
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;

    if (statusEl) {
      statusEl.textContent = "Sending enquiry…";
      statusEl.className   = "svc-status sending";
    }

    const fd = new FormData(form);
    const data = {
      form_type:    "enquiry",
      name:         fd.get("name")         || "",
      email:        fd.get("email")        || "",
      phone:        fd.get("phone")        || "",
      company:      fd.get("company")      || "",
      enquiry_type: fd.get("enquiry_type") || "",
      message:      fd.get("message")      || "",
      product_name: fd.get("product_name") || fd.get("service_name") || "",
      ...getLeadInfo(),
    };

    try {
      await submitToGAS(data);
      if (statusEl) {
        statusEl.textContent = "✓ Enquiry sent! We'll contact you within 1 business day.";
        statusEl.className   = "svc-status success";
      }
      form.reset();
      setTimeout(closeModal, 2800);
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = "✗ Network error — please retry or email us directly.";
        statusEl.className   = "svc-status error";
      }
    } finally {
      btn.disabled = false;
    }
  });
})();
