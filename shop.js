/* =========================================================
   COZY STORE — SHOP V3
   Search + filters + sorting + persistent bag
   ========================================================= */

const CART_KEY = "cozy_store_cart_v3";

const state = {
  search: "",
  category: "all",
  sort: "featured"
};

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#shopSearch");
const sortSelect = document.querySelector("#sortProducts");
const categoryButtons = [...document.querySelectorAll("[data-category]")];
const emptyState = document.querySelector("#emptyState");
const bagCount = document.querySelector("#bagCount");
const toast = document.querySelector("#toast");

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateBagCount() {
  const count = loadCart().reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (bagCount) {
    bagCount.textContent = count;
  }
}

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) return;

  const cart = loadCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity += 1;
    } else {
      showToast("That’s all we have in stock ♡");
      return;
    }
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart(cart);
  updateBagCount();

  showToast(`${product.name} added to your cozy bag ✨`);
}

function toggleWishlist(button) {
  button.classList.toggle("is-liked");

  const liked = button.classList.contains("is-liked");

  button.setAttribute("aria-pressed", liked);
  button.textContent = liked ? "♥" : "♡";
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.cozyToastTimer);

  window.cozyToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function getFilteredProducts() {
  let items = PRODUCTS.filter(product => {
    const searchText = `
      ${product.name}
      ${product.category}
      ${product.mood}
      ${product.description}
    `.toLowerCase();

    const matchesSearch = searchText.includes(
      state.search.toLowerCase()
    );

    const matchesCategory =
      state.category === "all" ||
      product.category === state.category;

    return matchesSearch && matchesCategory;
  });

  switch (state.sort) {
    case "price-low":
      items.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      items.sort((a, b) => b.price - a.price);
      break;

    case "name":
      items.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "new":
      items.sort((a, b) =>
        (b.badge === "New") -
        (a.badge === "New")
      );
      break;

    case "featured":
    default:
      items.sort(
        (a, b) =>
          Number(b.featured) -
          Number(a.featured)
      );
      break;
  }

  return items;
}

function productCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">

      <div
        class="product-visual"
        style="
          --tone-a:${product.colors[0]};
          --tone-b:${product.colors[1]}
        "
      >

        ${
          product.badge
            ? `<span class="product-badge">${product.badge}</span>`
            : ""
        }

        <button
          class="wishlist"
          type="button"
          aria-label="Add ${product.name} to wishlist"
          aria-pressed="false"
        >
          ♡
        </button>

        <a
          class="product-image-link"
          href="product.html?id=${product.id}"
          aria-label="View ${product.name}"
        >
          <div class="product-emoji" aria-hidden="true">
            ${product.emoji}
          </div>
        </a>

        <span class="visual-sparkle sparkle-one">✦</span>
        <span class="visual-sparkle sparkle-two">·</span>

      </div>

      <div class="product-info">

        <p class="product-category">
          ${product.category}
        </p>

        <a
          class="product-name-link"
          href="product.html?id=${product.id}"
        >
          <h2>${product.name}</h2>
        </a>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <strong>
            ${formatPrice(product.price)}
          </strong>

          <button
            class="add-button"
            type="button"
            data-add="${product.id}"
          >
            <span>+</span> Add
          </button>

        </div>

      </div>

    </article>
  `;
}

function renderProducts() {
  const items = getFilteredProducts();

  if (resultCount) {
    resultCount.textContent =
      `${items.length} ${
        items.length === 1
          ? "little thing"
          : "little things"
      }`;
  }

  if (!items.length) {
    productGrid.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  productGrid.innerHTML =
    items.map(productCard).join("");
}

function setCategory(category) {
  state.category = category;

  categoryButtons.forEach(button => {
    const active =
      button.dataset.category === category;

    button.classList.toggle("active", active);

    button.setAttribute(
      "aria-pressed",
      active
    );
  });

  renderProducts();
}

function openFilters() {
  document
    .querySelector("#filterPanel")
    ?.classList.add("open");

  document
    .querySelector("#filterBackdrop")
    ?.classList.add("show");

  document.body.classList.add("filter-open");
}

function closeFilters() {
  document
    .querySelector("#filterPanel")
    ?.classList.remove("open");

  document
    .querySelector("#filterBackdrop")
    ?.classList.remove("show");

  document.body.classList.remove("filter-open");
}

searchInput?.addEventListener(
  "input",
  event => {
    state.search =
      event.target.value.trim();

    renderProducts();
  }
);

sortSelect?.addEventListener(
  "change",
  event => {
    state.sort =
      event.target.value;

    renderProducts();
  }
);

categoryButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      setCategory(
        button.dataset.category
      );

      if (window.innerWidth < 760) {
        closeFilters();
      }
    }
  );
});

productGrid?.addEventListener(
  "click",
  event => {

    const addButton =
      event.target.closest("[data-add]");

    if (addButton) {

      addToCart(
        addButton.dataset.add
      );

      addButton.classList.add(
        "added"
      );

      addButton.innerHTML =
        "✓ Added";

      setTimeout(() => {

        addButton.classList.remove(
          "added"
        );

        addButton.innerHTML =
          "<span>+</span> Add";

      }, 1400);

      return;
    }

    const wishlistButton =
      event.target.closest(
        ".wishlist"
      );

    if (wishlistButton) {
      toggleWishlist(
        wishlistButton
      );
    }
  }
);

document
  .querySelector("#mobileFilterButton")
  ?.addEventListener(
    "click",
    openFilters
  );

document
  .querySelector("#filterBackdrop")
  ?.addEventListener(
    "click",
    closeFilters
  );

document
  .querySelector("#closeFilters")
  ?.addEventListener(
    "click",
    closeFilters
  );

document
  .querySelector("#clearFilters")
  ?.addEventListener(
    "click",
    () => {

      state.search = "";
      state.category = "all";
      state.sort = "featured";

      if (searchInput) {
        searchInput.value = "";
      }

      if (sortSelect) {
        sortSelect.value =
          "featured";
      }

      setCategory("all");
    }
  );

document
  .querySelector("#shopBag")
  ?.addEventListener(
    "click",
    () => {

      window.location.href =
        "cart.html";
    }
  );

const year =
  document.querySelector("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}

updateBagCount();
renderProducts();