/* COZY ADMIN V5 — Orders dashboard
   Orders are stored locally under cozy_store_orders.
   Demo password is client-side only and is NOT secure for production. */
(() => {
  "use strict";
  const ORDERS_KEY = "cozy_store_orders";
  const AUTH_KEY = "cozy_admin_demo_auth";
  const DEMO_PASSWORD = "cozy2026";
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => "Rs. " + Number(value || 0).toLocaleString("en-LK", {maximumFractionDigits:2});
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const readOrders = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not read Cozy orders:", error);
      return [];
    }
  };
  const saveOrders = (orders) => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  let selectedOrderNumber = null;

  const overlay = $("#loginOverlay");
  const isAuthenticated = () => sessionStorage.getItem(AUTH_KEY) === "yes";
  const showLoginIfNeeded = () => { overlay.hidden = isAuthenticated(); };
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = $("#adminPassword").value;
    if (entered === DEMO_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "yes");
      $("#loginError").textContent = "";
      overlay.hidden = true;
      render();
    } else {
      $("#loginError").textContent = "That password doesn't match. Please try again.";
      $("#adminPassword").select();
    }
  });
  $("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    showLoginIfNeeded();
  });

  const getStatus = (order) => order.status || "Pending";
  const getCustomer = (order) => order.customer || {};
  const getOrderNumber = (order) => order.orderNumber || order.id || "COZY-ORDER";
  const getDate = (order) => {
    const date = new Date(order.date || Date.now());
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-LK", {year:"numeric",month:"short",day:"numeric"});
  };
  const getTotal = (order) => {
    if (order.total != null) return Number(order.total) || 0;
    const subtotal = (order.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    return subtotal + (subtotal >= 5000 ? 0 : 350);
  };
  const statusClass = (status) => String(status).toLowerCase().replace(/[^a-z]/g, "");

  function renderStats(orders) {
    const revenue = orders.filter(o => getStatus(o) !== "Cancelled").reduce((sum, o) => sum + getTotal(o), 0);
    const attention = orders.filter(o => ["Pending", "Processing"].includes(getStatus(o))).length;
    $("#totalOrders").textContent = orders.length;
    $("#totalRevenue").textContent = money(revenue);
    $("#pendingOrders").textContent = attention;
    $("#averageOrder").textContent = money(orders.length ? revenue / Math.max(1, orders.filter(o => getStatus(o) !== "Cancelled").length) : 0);
    $("#todayLabel").textContent = new Date().toLocaleDateString("en-LK", {weekday:"short", day:"numeric", month:"short", year:"numeric"});
  }

  function renderOrders() {
    const orders = readOrders().slice().reverse();
    const query = $("#orderSearch").value.trim().toLowerCase();
    const status = $("#statusFilter").value;
    const filtered = orders.filter(order => {
      const customer = getCustomer(order);
      const searchable = [getOrderNumber(order), customer.name, customer.phone, customer.email, customer.city].join(" ").toLowerCase();
      return searchable.includes(query) && (status === "all" || getStatus(order) === status);
    });
    const tbody = $("#ordersTable");
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-cell">${orders.length ? "No orders match your search." : "No orders yet. Test the checkout flow to see an order here."}</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map(order => {
        const customer = getCustomer(order);
        const number = getOrderNumber(order);
        const statuses = ["Pending","Processing","Shipped","Delivered","Cancelled"];
        const options = statuses.map(s => `<option value="${s}" ${getStatus(order) === s ? "selected" : ""}>${s}</option>`).join("");
        return `<tr>
          <td>${safe(number)}</td>
          <td><div class="customer-name">${safe(customer.name || "Customer")}</div><div class="customer-contact">${safe(customer.phone || customer.email || "No contact")}</div></td>
          <td>${safe(getDate(order))}</td><td><b>${money(getTotal(order))}</b></td>
          <td><select class="status-select" data-status-order="${safe(number)}" aria-label="Status for ${safe(number)}">${options}</select></td>
          <td><button type="button" class="view-btn" data-view-order="${safe(number)}">View</button></td>
        </tr>`;
      }).join("");
    }
    $("#ordersCount").textContent = `${filtered.length} ${filtered.length === 1 ? "order" : "orders"}`;
    tbody.querySelectorAll("[data-status-order]").forEach(select => select.addEventListener("change", () => updateStatus(select.dataset.statusOrder, select.value)));
    tbody.querySelectorAll("[data-view-order]").forEach(button => button.addEventListener("click", () => openOrder(button.dataset.viewOrder)));
  }

  function render() {
    const orders = readOrders();
    renderStats(orders);
    renderOrders();
  }

  function updateStatus(orderNumber, status) {
    const orders = readOrders();
    const order = orders.find(o => getOrderNumber(o) === orderNumber);
    if (!order) return;
    order.status = status;
    saveOrders(orders);
    render();
  }

  function openOrder(orderNumber) {
    const order = readOrders().find(o => getOrderNumber(o) === orderNumber);
    if (!order) return;
    selectedOrderNumber = orderNumber;
    const customer = getCustomer(order);
    $("#dialogOrderNumber").textContent = orderNumber;
    const items = (order.items || []).map(item => `<div class="detail-item"><span>${safe(item.name || item.title || "Product")} × ${Number(item.quantity || 1)}</span><b>${money(Number(item.price || 0) * Number(item.quantity || 1))}</b></div>`).join("") || "<p>No item details saved.</p>";
    $("#orderDetails").innerHTML = `
      <div class="detail-block"><h3>Customer</h3><p>${safe(customer.name || "—")}<br>${safe(customer.phone || "—")} · ${safe(customer.email || "—")}<br>${safe(customer.address || "—")}, ${safe(customer.city || "")} ${safe(customer.postal || "")}</p></div>
      <div class="detail-block"><h3>Items</h3>${items}</div>
      <div class="detail-block"><div class="detail-item"><span>Subtotal</span><b>${money(order.subtotal)}</b></div><div class="detail-item"><span>Delivery</span><b>${money(order.delivery)}</b></div><div class="detail-item"><span>Total</span><b>${money(getTotal(order))}</b></div><div class="detail-item"><span>Payment</span><b>${safe(order.paymentMethod || "—")}</b></div><div class="detail-item"><span>Status</span><b>${safe(getStatus(order))}</b></div><div class="detail-item"><span>Placed</span><b>${safe(getDate(order))}</b></div></div>`;
    $("#cancelOrderBtn").hidden = getStatus(order) === "Cancelled" || getStatus(order) === "Delivered";
    const dialog = $("#orderDialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else alert(`${orderNumber}\nCustomer: ${customer.name || "—"}\nTotal: ${money(getTotal(order))}`);
  }

  $("#cancelOrderBtn").addEventListener("click", () => {
    if (!selectedOrderNumber) return;
    const orders = readOrders();
    const order = orders.find(o => getOrderNumber(o) === selectedOrderNumber);
    if (order && confirm(`Cancel order ${selectedOrderNumber}?`)) {
      order.status = "Cancelled";
      saveOrders(orders);
      $("#orderDialog").close();
      render();
    }
  });
  $("#closeDetailsBtn").addEventListener("click", () => $("#orderDialog").close());
  $("#orderSearch").addEventListener("input", renderOrders);
  $("#statusFilter").addEventListener("change", renderOrders);
  $("#refreshBtn").addEventListener("click", render);
  $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  document.querySelectorAll(".side-link").forEach(link => link.addEventListener("click", () => $("#sidebar").classList.remove("open")));

  showLoginIfNeeded();
  if (isAuthenticated()) render();
})();
