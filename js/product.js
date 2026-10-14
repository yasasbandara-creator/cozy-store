/* =========================================================
   COZY STORE — PRODUCT DETAILS
   ========================================================= */

const CART_KEY = "cozy_store_cart_v3";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = typeof getProduct === "function" ? getProduct(productId) : null;

const productPage = document.querySelector("#productPage");
const breadcrumbName = document.querySelector("#breadcrumbName");
const productVisual = document.querySelector("#productVisual");
const productBadge = document.querySelector("#productBadge");
const productEmoji = document.querySelector("#productEmoji");
const productCategory = document.querySelector("#productCategory");
const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const productDescription = document.querySelector("#productDescription");
const productLongDescription = document.querySelector("#productLongDescription");
const stockText = document.querySelector("#stockText");
const quantityElement = document.querySelector("#quantity");
const minusButton = document.querySelector("#minusButton");
const plusButton = document.querySelector("#plusButton");
const addToCartButton = document.querySelector("#addToCartButton");
const wishlistButton = document.querySelector("#wishlistButton");
const relatedProducts = document.querySelector("#relatedProducts");
const bagCount = document.querySelector("#bagCount");
const toast = document.querySelector("#toast");
const year = document.querySelector("#year");

function loadCart() {
    try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateBagCount() {
    const count = loadCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    if (bagCount) bagCount.textContent = count;
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.cozyProductToast);
    window.cozyProductToast = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

function setText(element, value) {
    if (element) element.textContent = value;
}

if (!product) {
    if (productPage) productPage.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 20px">
            <p>We couldn't find that cozy little item.</p>
            <a href="shop.html" class="main-add-button" style="display:inline-flex;margin-top:20px">Back to Shop</a>
        </div>
    `;
} else {
    document.title = `${product.name} | Cozy Store`;

    setText(breadcrumbName, product.name);
    setText(productCategory, product.category);
    setText(productName, product.name);
    setText(productPrice, formatPrice(product.price));
    setText(productDescription, product.description);
    setText(productLongDescription, product.details || product.description);
    setText(stockText, product.stock > 0 ? `${product.stock} available` : "Out of stock");
    setText(productEmoji, product.emoji);

    if (productBadge) {
        productBadge.textContent = product.badge || "";
        productBadge.hidden = !product.badge;
    }

    if (productVisual) {
        productVisual.style.setProperty("--tone-a", product.colors?.[0] || "#dff3f7");
        productVisual.style.setProperty("--tone-b", product.colors?.[1] || "#faf8f1");
    }

    let quantity = 1;
    const cart = loadCart();
    const existing = cart.find(item => item.id === product.id);
    const maxAddable = Math.max(0, product.stock - Number(existing?.quantity || 0));

    function renderQuantity() {
        setText(quantityElement, quantity);
        if (minusButton) minusButton.disabled = quantity <= 1;
        if (plusButton) plusButton.disabled = quantity >= Math.max(1, maxAddable);
    }

    minusButton?.addEventListener("click", () => {
        if (quantity > 1) {
            quantity -= 1;
            renderQuantity();
        }
    });

    plusButton?.addEventListener("click", () => {
        if (quantity < maxAddable) {
            quantity += 1;
            renderQuantity();
        }
    });

    addToCartButton?.addEventListener("click", () => {
        const currentCart = loadCart();
        const item = currentCart.find(item => item.id === product.id);
        const currentQuantity = Number(item?.quantity || 0);

        if (product.stock <= 0 || currentQuantity + quantity > product.stock) {
            showToast("That’s all we have in stock ♡");
            return;
        }

        if (item) {
            item.quantity = currentQuantity + quantity;
        } else {
            currentCart.push({ id: product.id, quantity });
        }

        saveCart(currentCart);
        updateBagCount();
        showToast(`${product.name} added to your cozy bag ✨`);
    });

    wishlistButton?.addEventListener("click", () => {
        const liked = wishlistButton.classList.toggle("is-liked");
        wishlistButton.setAttribute("aria-pressed", liked);
        wishlistButton.textContent = liked ? "♥" : "♡";
    });

    if (relatedProducts) {
        const related = PRODUCTS
            .filter(item => item.id !== product.id && item.category === product.category)
            .slice(0, 4);

        relatedProducts.innerHTML = related.map(item => `
            <a class="related-card" href="product.html?id=${item.id}">
                <div class="related-visual" style="--tone-a:${item.colors[0]};--tone-b:${item.colors[1]}">
                    <span>${item.emoji}</span>
                </div>
                <div class="related-info">
                    <span>${item.category}</span>
                    <h3>${item.name}</h3>
                    <strong>${formatPrice(item.price)}</strong>
                </div>
            </a>
        `).join("");
    }

    renderQuantity();
}

updateBagCount();
if (year) year.textContent = new Date().getFullYear();
