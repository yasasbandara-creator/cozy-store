/* =========================================================
   COZY STORE — SHOPPING BAG
   ========================================================= */


const CART_KEY = "cozy_store_cart_v3";


/* =========================================================
   SETTINGS
   ========================================================= */

const FREE_DELIVERY_LIMIT = 5000;

const DELIVERY_FEE = 350;



/* =========================================================
   ELEMENTS
   ========================================================= */

const cartItemsElement =
    document.querySelector("#cartItems");

const emptyCartElement =
    document.querySelector("#emptyCart");

const subtotalElement =
    document.querySelector("#subtotal");

const deliveryElement =
    document.querySelector("#delivery");

const totalElement =
    document.querySelector("#total");

const bagCountElement =
    document.querySelector("#bagCount");

const clearCartButton =
    document.querySelector("#clearCartButton");

const checkoutButton =
    document.querySelector("#checkoutButton");

const freeDeliveryMessage =
    document.querySelector(
        "#freeDeliveryMessage"
    );

const toast =
    document.querySelector("#toast");



/* =========================================================
   CART STORAGE
   ========================================================= */

function loadCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CART_KEY
            )
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



/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        window.cozyCartToast
    );

    window.cozyCartToast =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}



/* =========================================================
   BAG COUNT
   ========================================================= */

function updateBagCount(cart) {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    if (bagCountElement) {

        bagCountElement.textContent =
            count;

    }

}



/* =========================================================
   GET CART PRODUCTS
   ========================================================= */

function getCartProducts(cart) {

    return cart
        .map(item => {

            const product =
                getProduct(item.id);

            if (!product) {
                return null;
            }

            return {

                ...product,

                quantity:
                    item.quantity

            };

        })
        .filter(Boolean);

}



/* =========================================================
   UPDATE QUANTITY
   ========================================================= */

function changeQuantity(
    productId,
    change
) {

    const cart =
        loadCart();

    const item =
        cart.find(
            cartItem =>
                cartItem.id === productId
        );

    const product =
        getProduct(productId);

    if (!item || !product) {
        return;
    }


    item.quantity += change;


    if (
        item.quantity <= 0
    ) {

        const index =
            cart.indexOf(item);

        cart.splice(
            index,
            1
        );

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

        showToast(
            "That's all we have in stock ♡"
        );

    }


    saveCart(cart);

    renderCart();

}



/* =========================================================
   REMOVE ITEM
   ========================================================= */

function removeItem(productId) {

    const cart =
        loadCart();

    const updatedCart =
        cart.filter(
            item =>
                item.id !== productId
        );

    saveCart(updatedCart);

    showToast(
        "Removed from your cozy bag"
    );

    renderCart();

}



/* =========================================================
   CLEAR BAG
   ========================================================= */

function clearCart() {

    const cart =
        loadCart();

    if (!cart.length) {
        return;
    }


    const confirmed =
        window.confirm(
            "Clear everything from your cozy bag?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        CART_KEY
    );

    showToast(
        "Your bag is empty now ♡"
    );

    renderCart();

}



/* =========================================================
   RENDER ITEMS
   ========================================================= */

function renderCartItems(
    products
) {

    if (!cartItemsElement) {
        return;
    }


    cartItemsElement.innerHTML =
        products.map(product => `

            <article
                class="cart-item"
            >

                <a
                    href="product.html?id=${product.id}"
                    class="cart-item-visual"
                    style="
                        --tone-a:${product.colors[0]};
                        --tone-b:${product.colors[1]};
                    "
                    aria-label="${product.name}"
                >

                    <div
                        class="cart-item-emoji"
                    >
                        ${product.emoji}
                    </div>

                </a>


                <div
                    class="cart-item-info"
                >

                    <p
                        class="cart-item-category"
                    >
                        ${product.category}
                    </p>


                    <h3
                        class="cart-item-name"
                    >
                        ${product.name}
                    </h3>


                    <p
                        class="cart-item-price"
                    >
                        ${formatPrice(product.price)}
                    </p>


                    <div
                        class="cart-quantity"
                    >

                        <button
                            class="quantity-button"
                            type="button"
                            data-action="decrease"
                            data-id="${product.id}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span
                            class="quantity-number"
                        >
                            ${product.quantity}
                        </span>


                        <button
                            class="quantity-button"
                            type="button"
                            data-action="increase"
                            data-id="${product.id}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div
                    class="cart-item-right"
                >

                    <strong
                        class="cart-item-total"
                    >
                        ${formatPrice(
                            product.price *
                            product.quantity
                        )}
                    </strong>


                    <button
                        class="remove-item"
                        type="button"
                        data-action="remove"
                        data-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </article>

        `).join("");

}



/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(
    products
) {

    const subtotal =
        products.reduce(
            (total, product) =>
                total +
                (
                    product.price *
                    product.quantity
                ),
            0
        );


    let delivery = 0;


    if (
        subtotal > 0 &&
        subtotal < FREE_DELIVERY_LIMIT
    ) {

        delivery =
            DELIVERY_FEE;

    }


    const total =
        subtotal +
        delivery;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0 && subtotal > 0
                ? "FREE"
                : formatPrice(delivery);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }


    if (freeDeliveryMessage) {

        if (subtotal === 0) {

            freeDeliveryMessage.textContent =
                "";

        }

        else if (
            subtotal <
            FREE_DELIVERY_LIMIT
        ) {

            const remaining =
                FREE_DELIVERY_LIMIT -
                subtotal;

            freeDeliveryMessage.textContent =
                `Add ${formatPrice(remaining)} more for FREE delivery ✨`;

        }

        else {

            freeDeliveryMessage.textContent =
                "Yay! You unlocked FREE delivery ✨";

        }

    }

}



/* =========================================================
   EMPTY STATE
   ========================================================= */

function updateEmptyState(
    products
) {

    const isEmpty =
        products.length === 0;


    if (emptyCartElement) {

        emptyCartElement.hidden =
            !isEmpty;

    }


    if (cartItemsElement) {

        cartItemsElement.hidden =
            isEmpty;

    }


    if (clearCartButton) {

        clearCartButton.style.display =
            isEmpty
                ? "none"
                : "";

    }

}



/* =========================================================
   MAIN RENDER
   ========================================================= */

function renderCart() {

    const cart =
        loadCart();

    const products =
        getCartProducts(cart);


    updateBagCount(cart);

    updateEmptyState(products);

    renderCartItems(products);

    updateSummary(products);

}



/* =========================================================
   BUTTON EVENTS
   ========================================================= */

cartItemsElement?.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );

        if (!button) {
            return;
        }


        const productId =
            button.dataset.id;

        const action =
            button.dataset.action;


        if (
            action ===
            "increase"
        ) {

            changeQuantity(
                productId,
                1
            );

        }


        if (
            action ===
            "decrease"
        ) {

            changeQuantity(
                productId,
                -1
            );

        }


        if (
            action ===
            "remove"
        ) {

            removeItem(
                productId
            );

        }

    }
);



/* =========================================================
   CLEAR BUTTON
   ========================================================= */

clearCartButton?.addEventListener(
    "click",
    clearCart
);



/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutButton?.addEventListener(
    "click",
    () => {

        const cart =
            loadCart();


        if (!cart.length) {

            showToast(
                "Your cozy bag is empty ♡"
            );

            return;

        }


        showToast(
            "Checkout is coming in the next step ✨"
        );

    }
);



/* =========================================================
   FOOTER YEAR
   ========================================================= */

const year =
    document.querySelector(
        "#year"
    );

if (year) {

    year.textContent =
        new Date().getFullYear();

}



/* =========================================================
   STORE NAME
   ========================================================= */

document
    .querySelectorAll(
        "[data-store-name]"
    )
    .forEach(element => {

        element.textContent =
            STORE_CONFIG.name;

    });



/* =========================================================
   START
   ========================================================= */

renderCart();