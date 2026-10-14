
/* =====================================================
   COZY. — STAGE 2: ACCOUNT + CHECKOUT INTEGRATION
   Uses the Stage 1 demo account storage.
   Front-end prototype only — not secure for production.
   ===================================================== */

(() => {
  "use strict";

  const USERS_KEY = "cozy_customer_accounts_demo_v1";
  const SESSION_KEY = "cozy_customer_session_demo_v1";

  const fields = {
    name: document.getElementById("customerName"),
    email: document.getElementById("customerEmail"),
    phone: document.getElementById("customerPhone"),
    address: document.getElementById("customerAddress"),
    city: document.getElementById("customerCity"),
    postal: document.getElementById("customerPostal")
  };

  function readUsers() {
    try {
      const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );

      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function getSignedInUser() {
    const email = localStorage.getItem(SESSION_KEY);

    if (!email) return null;

    return readUsers().find(
      user => user.email === email
    ) || null;
  }

  function fillIfEmpty(field, value) {
    if (field && !field.value.trim() && value) {
      field.value = value;
    }
  }

  function showAccountMessage(message) {
    let note = document.getElementById(
      "accountCheckoutNotice"
    );

    if (!note) {
      note = document.createElement("p");
      note.id = "accountCheckoutNotice";

      note.style.cssText = [
        "padding:12px 14px",
        "margin:0 0 18px",
        "border-radius:12px",
        "background:#e7f2e8",
        "color:#315b48",
        "font-size:12px",
        "line-height:1.6"
      ].join(";");

      const form = document.getElementById("checkoutForm");

      if (form) {
        form.prepend(note);
      }
    }

    note.textContent = message;
  }

  function loadAccountDetails() {
    const user = getSignedInUser();

    if (!user) return;

    fillIfEmpty(fields.name, user.name);
    fillIfEmpty(fields.email, user.email);
    fillIfEmpty(fields.phone, user.phone);
    fillIfEmpty(fields.address, user.address);

    showAccountMessage(
      "♡ Welcome back! Your saved account details have been filled in where available. Please check them before placing your order."
    );
  }

  function saveUpdatedAccountDetails() {
    const user = getSignedInUser();

    if (!user) return;

    const users = readUsers();

    const index = users.findIndex(
      item => item.email === user.email
    );

    if (index === -1) return;

    // Update the demo account's saved delivery details.
    users[index].name = fields.name.value.trim();
    users[index].phone = fields.phone.value.trim();
    users[index].address = fields.address.value.trim();

    // Save the additional delivery fields for future checkout use.
    users[index].city = fields.city.value.trim();
    users[index].postal = fields.postal.value.trim();

    try {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
      );
    } catch (error) {
      console.error(
        "Could not update demo account details.",
        error
      );
    }
  }

  function loadAdditionalSavedDetails() {
    const user = getSignedInUser();

    if (!user) return;

    fillIfEmpty(fields.city, user.city);
    fillIfEmpty(fields.postal, user.postal);
  }

  function initialise() {
    if (!document.getElementById("checkoutForm")) return;

    loadAccountDetails();
    loadAdditionalSavedDetails();

    const form = document.getElementById("checkoutForm");

    // The existing checkout.js still handles the order.
    // This listener only updates the demo account profile.
    form.addEventListener("submit", () => {
      saveUpdatedAccountDetails();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialise
    );
  } else {
    initialise();
  }
})();
