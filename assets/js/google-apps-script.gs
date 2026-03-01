/**
 * ═══════════════════════════════════════════════════════════════
 *  HAWKSBILL TECHNIK — Google Apps Script Backend
 *  Version: 1.0  |  Handles: Contact Form + Service Enquiry
 * ═══════════════════════════════════════════════════════════════
 *
 *  SETUP:
 *  1. Go to https://script.google.com → New Project
 *  2. Paste this entire file
 *  3. Set SHEET_ID and ADMIN_EMAIL below
 *  4. Deploy → Web App → Execute as: Me → Access: Anyone
 *  5. Copy the Web App URL into contact-handler.js
 */

// ─── CONFIGURATION ────────────────────────────────────────────────
const SHEET_ID = "1i_aI1AHaxsYGzxYILsIQYPBA0gjnQ3yHDmsu6sZXdXk";
const ADMIN_EMAIL = "hawksbilltechnik2026@gmail.com"; // Receives all lead alerts
const COMPANY_NAME = "Hawksbill Technik";
const COMPANY_SITE = "https://hawksbilltechnik.in";

// Sheet tab names — create these tabs in your Google Sheet
const CONTACT_SHEET = "Contact Leads";
const ENQUIRY_SHEET = "Service Enquiries";

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────
function doPost(e) {
  try {
    const raw = e.postData ? e.postData.contents : null;
    if (!raw)
      return jsonResponse({ status: "error", message: "No data received" });

    const data = JSON.parse(raw);
    const type = data.form_type || "contact"; // "contact" | "enquiry"

    if (type === "enquiry") {
      return handleEnquiry(data);
    } else {
      return handleContact(data);
    }
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ─── CONTACT FORM HANDLER ─────────────────────────────────────────
function handleContact(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = getOrCreateSheet(ss, CONTACT_SHEET, [
    "Timestamp",
    "Name",
    "Email",
    "Subject",
    "Message",
    "Lead Source",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content",
    "Page URL",
  ]);

  const email = (data.email || "").trim().toLowerCase();
  if (!email)
    return jsonResponse({ status: "error", message: "Email required" });

  // Write row
  const ts = new Date();
  sheet.appendRow([
    ts,
    data.name || "",
    email,
    data.subject || "",
    data.message || "",
    data.leadSource || document_referrer(data),
    data.utm_source || "",
    data.utm_medium || "",
    data.utm_campaign || "",
    data.utm_term || "",
    data.utm_content || "",
    data.page_url || "",
  ]);

  // Admin email
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `📬 New Contact — ${data.name || "Unknown"} | ${COMPANY_NAME}`,
    htmlBody: adminEmailHtml("Contact Form", {
      Name: data.name,
      Email: email,
      Subject: data.subject,
      Message: data.message,
      Source: data.leadSource || "Direct",
      Page: data.page_url,
    }),
  });

  // Auto-reply to lead
  MailApp.sendEmail({
    to: email,
    subject: `We received your message — ${COMPANY_NAME}`,
    htmlBody: autoReplyHtml(data.name, "contact", null),
  });

  return jsonResponse({
    status: "success",
    message: "Message sent successfully",
  });
}

// ─── SERVICE ENQUIRY HANDLER ──────────────────────────────────────
function handleEnquiry(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = getOrCreateSheet(ss, ENQUIRY_SHEET, [
    "Timestamp",
    "Name",
    "Email",
    "Phone",
    "Company",
    "Enquiry Type",
    "Service / Product",
    "Message",
    "Lead Source",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content",
    "Page URL",
  ]);

  const email = (data.email || "").trim().toLowerCase();
  if (!email)
    return jsonResponse({ status: "error", message: "Email required" });

  // Duplicate check (last 1000 rows)
  const lastRow = Math.max(sheet.getLastRow(), 1);
  const existingEmails =
    lastRow > 1
      ? sheet
          .getRange(2, 2, lastRow - 1, 1)
          .getValues()
          .flat()
          .map((e) => String(e).toLowerCase())
      : [];

  if (existingEmails.includes(email)) {
    return jsonResponse({
      status: "duplicate",
      message: "This email has already submitted an enquiry.",
    });
  }

  const ts = new Date();
  sheet.appendRow([
    ts,
    data.name || "",
    email,
    data.phone || "",
    data.company || "",
    data.enquiry_type || "",
    data.product_name || "",
    data.message || "",
    data.leadSource || "Direct",
    data.utm_source || "",
    data.utm_medium || "",
    data.utm_campaign || "",
    data.utm_term || "",
    data.utm_content || "",
    data.page_url || "",
  ]);

  // Admin email
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚀 New Service Enquiry — ${data.product_name || "General"} | ${COMPANY_NAME}`,
    htmlBody: adminEmailHtml("Service Enquiry", {
      Name: data.name,
      Email: email,
      Phone: data.phone,
      Company: data.company,
      "Enquiry Type": data.enquiry_type,
      Service: data.product_name,
      Message: data.message,
      Source: data.leadSource || "Direct",
      Page: data.page_url,
    }),
  });

  // Auto-reply
  MailApp.sendEmail({
    to: email,
    subject: `Thank you for your enquiry — ${COMPANY_NAME}`,
    htmlBody: autoReplyHtml(data.name, "enquiry", data.product_name),
  });

  return jsonResponse({
    status: "success",
    message: "Enquiry submitted successfully",
  });
}

// ─── UTILITIES ────────────────────────────────────────────────────

/** Get or create a named sheet and ensure headers exist */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#0ea5e9")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** JSON response helper (required for CORS-free fetch with mode:no-cors) */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function document_referrer(data) {
  return data.leadSource || "Direct";
}

/** Admin HTML email template */
function adminEmailHtml(formType, fields) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#1e293b;background:#f8fafc;border:1px solid #e2e8f0;width:140px">${k}</td>
        <td style="padding:8px 12px;color:#475569;border:1px solid #e2e8f0">${v}</td>
      </tr>`,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Roboto,Arial,sans-serif;background:#f1f5f9;margin:0;padding:20px">
    <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#0c4a6e,#0ea5e9);padding:24px 28px">
        <h1 style="color:#fff;margin:0;font-size:1.2rem">${COMPANY_NAME}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.9rem">New ${formType} Received</p>
      </div>
      <div style="padding:24px 28px">
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <p style="margin-top:24px;font-size:0.82rem;color:#94a3b8">
          Received at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
        </p>
      </div>
    </div>
  </body>
  </html>`;
}

/** Auto-reply HTML email template */
function autoReplyHtml(name, type, productName) {
  const subject =
    type === "enquiry"
      ? `our team will review your enquiry for <strong>${productName || "your selected service"}</strong>`
      : "we received your message";

  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Roboto,Arial,sans-serif;background:#f1f5f9;margin:0;padding:20px">
    <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#0c4a6e,#0ea5e9);padding:24px 28px">
        <h1 style="color:#fff;margin:0;font-size:1.2rem">${COMPANY_NAME}</h1>
      </div>
      <div style="padding:28px">
        <h2 style="color:#1e293b;font-size:1.15rem;margin:0 0 12px">Hi ${name || "there"},</h2>
        <p style="color:#475569;line-height:1.7;margin:0 0 16px">
          Thank you for reaching out — ${subject}.
          Our technical team will get back to you within <strong>1 business day</strong>.
        </p>
        <p style="color:#475569;line-height:1.7;margin:0 0 24px">
          In the meantime, feel free to explore our product catalog or reach us directly on WhatsApp.
        </p>
        <a href="${COMPANY_SITE}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.9rem">
          Visit Our Website →
        </a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0">
        <p style="color:#94a3b8;font-size:0.82rem;margin:0">
          © ${new Date().getFullYear()} ${COMPANY_NAME} · 
          <a href="${COMPANY_SITE}" style="color:#0ea5e9">hawksbilltechnik.com</a>
        </p>
      </div>
    </div>
  </body>
  </html>`;
}
