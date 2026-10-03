/* =========================================================
   COZY STORE — PRODUCT DETAILS
   ========================================================= */

const CART_KEY = "cozy_store_cart_v3";

const params =
  new URLSearchParams(
    window.location.search
  );

const productId =
  params.get("id");

const product =
  getProduct(productId);


/* =========================================================
   ELEMENTS
   ========================================================= */

const productName =
  document.querySelector("#productName");

const productCategory =
  document.querySelector("#productCategory");

const productPrice =
  document.querySelector("#productPrice");

const productDescription =
  document.querySelector("#productDescription");

const productLongDescription =
  document.querySelector("#productLongDescription");

const productEmoji =
  document.querySelector("#productEmoji");

const productVisual =
  document.querySelector("#productVisual");

const productBadge =
  document.querySelector("#productBadge");

const stockText =
  document.querySelector("#stockText");

const quantityElement =
  document.querySelector("#quantity");

const plusButton =
  document.querySelector("#plusButton");

const minusButton =
  document.querySelector("#minusButton");

const addToCartButton =
  document.querySelector("#addToCartButton");

const wishlistButton =
  document.querySelector("#wishlistButton");

const breadcrumbName =
  document.querySelector("#breadcrumbName");

const relatedProducts =
  document.querySelector("#relatedProducts");

const bagCount =
  document.querySelector("#bagCount");

const toast =
  document.querySelector("#toast");


let quantity = 1;


/* =========================================================
   CART
   ========================================================= */

function loadCart() {

  try {

    return JSON.parse(
      localStorage.getItem(CART_KEY)
    ) || [];

  } catch {

    return [];

  }

}


function saveCart(cart) {

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

}


function updateBagCount() {

  const cart =
    loadCart();

  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  if (bagCount) {

    bagCount.textContent =
      count;

  }

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    window.cozyToastTimer
  );

  window.cozyToastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2400);

}


/* =========================================================
   INVALID PRODUCT
   ========================================================= */

if (!product) {

  document.title =
    "Product not found — cozy.";

  document.querySelector(
    "#productPage"
  ).innerHTML = `

    <div style="
      grid-column:1/-1;
      text-align:center;
      padding:80px 20px;
    ">

      <div style="
        font-size:4rem;
      ">
        ☁️
      </div>

      <h1 style="
        margin-top:15px;
        font-family:Fredoka,sans-serif;
      ">
        Hmm... this little thing
        wandered away.
      </h1>

      <p style="
        margin-top:10px;
        color:#788386;
      ">
        We couldn't find that product.
      </p>

      <a
        href="shop.html"
        style="
          display:inline-block;
          margin-top:20px;
          padding:13px 20px;
          border-radius:999px;
          background:#263c3b;
          color:white;
          font-weight:700;
          font-size:.8rem;
        "
      >
        Back to shop
      </a>

    </div>
  `;

} else {


  /* =======================================================
     FILL PRODUCT
     ======================================================= */

  document.title =
    `${product.name} — ${STORE_CONFIG.name}`;


  if (productName) {

    productName.textContent =
      product.name;

  }


  if (productCategory) {

    productCategory.textContent =
      product.category;

  }


  if (productPrice) {

    productPrice.textContent =
      formatPrice(
        product.price
      );

  }


  if (productDescription) {

    productDescription.textContent =
      product.description;

  }


  if (productLongDescription) {

    productLongDescription.textContent =
      product.details;

  }


  if (productEmoji) {

    productEmoji.textContent =
      product.emoji;

  }


  if (productBadge) {

    productBadge.textContent =
      product.badge || "";

  }


  if (breadcrumbName) {

    breadcrumbName.textContent =
      product.name;

  }


  if (productVisual) {

    productVisual.style.setProperty(
      "--tone-a",
      product.colors[0]
    );

    productVisual.style.setProperty(
      "--tone-b",
      product.colors[1]
    );

    productVisual.style.background =
      `linear-gradient(
        135deg,
        ${product.colors[0]},
        ${product.colors[1]}
      )`;

  }


  /* =======================================================
     STOCK
     ======================================================= */

  if (stockText) {

    if (product.stock > 0) {

      stockText.textContent =
        `${product.stock} available`;

    } else {

      stockText.textContent =
        "Currently out of stock";

      addToCartButton.disabled =
        true;

      addToCartButton.textContent =
        "Out of stock";

    }

  }


  /* =======================================================
     QUANTITY
     ======================================================= */

  function updateQuantity() {

    quantityElement.textContent =
      quantity;

  }


  plusButton?.addEventListener(
    "click",
    () => {

      if (
        quantity <
        product.stock
      ) {

        quantity += 1;

        updateQuantity();

      } else {

        showToast(
          "That’s all we have in stock ♡"
        );

      }

    }
  );


  minusButton?.addEventListener(
    "click",
    () => {

      if (quantity > 1) {

        quantity -= 1;

        updateQuantity();

      }

    }
  );


  /* =======================================================
     ADD TO CART
     ======================================================= */

  addToCartButton?.addEventListener(
    "click",
    () => {

      if (
        product.stock <= 0
      ) {

        return;

      }


      const cart =
        loadCart();

      const existing =
        cart.find(
          item =>
            item.id ===
            product.id
        );


      if (existing) {

        const newQuantity =
          existing.quantity +
          quantity;

        if (
          newQuantity >
          product.stock
        ) {

          showToast(
            "You reached the available stock ♡"
          );

          return;

        }

        existing.quantity =
          newQuantity;

      } else {

        cart.push({

          id: product.id,

          quantity: quantity

        });

      }


      saveCart(cart);

      updateBagCount();


      addToCartButton.classList.add(
        "added"
      );

      addToCartButton.innerHTML =
        "Added to your bag ✓";


      showToast(
        `${product.name} added to your cozy bag ✨`
      );


      setTimeout(() => {

        addToCartButton.classList.remove(
          "added"
        );

        addToCartButton.innerHTML =
          `Add to cozy bag <span>♡</span>`;

      }, 1600);

    }
  );


  /* =======================================================
     WISHLIST
     ======================================================= */

  wishlistButton?.addEventListener(
    "click",
    () => {

      wishlistButton.classList.toggle(
        "is-liked"
      );

      const liked =
        wishlistButton.classList.contains(
          "is-liked"
        );

      wishlistButton.textContent =
        liked ? "♥" : "♡";

      wishlistButton.setAttribute(
        "aria-pressed",
        liked
      );

      showToast(
        liked
          ? "Added to your little wishlist ♡"
          : "Removed from wishlist"
      );

    }
  );


  /* =======================================================
     RELATED PRODUCTS
     ======================================================= */

  function renderRelatedProducts() {

    if (!relatedProducts) {
      return;
    }


    const related =
      PRODUCTS
        .filter(item =>
          item.id !== product.id &&
          (
            item.category ===
              product.category ||
            item.mood ===
              product.mood
          )
        )
        .slice(0, 4);


    relatedProducts.innerHTML =
      related.map(item => `

        <a
          class="related-card"
          href="product.html?id=${item.id}"
        >

          <div
            class="related-visual"
            style="
              --tone-a:${item.colors[0]};
              --tone-b:${item.colors[1]};
            "
          >

            <div
              class="related-emoji"
            >
              ${item.emoji}
            </div>

          </div>

          <div class="related-info">

            <h3>
              ${item.name}
            </h3>

            <p>
              ${formatPrice(item.price)}
            </p>

          </div>

        </a>

      `).join("");

  }


  renderRelatedProducts();

}


document.querySelectorAll(
  "[data-store-name]"
).forEach(element => {

  element.textContent =
    STORE_CONFIG.name;

});


const year =
  document.querySelector("#year");

if (year) {

  year.textContent =
    new Date().getFullYear();

}


updateBagCount();