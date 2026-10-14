/* =========================================================
   COZY STORE — CHECKOUT
   ========================================================= */

const CART_KEY = "cozy_store_cart_v3";

const cart =
    JSON.parse(
        localStorage.getItem(CART_KEY)
    ) || [];



/* =========================================================
   ELEMENTS
   ========================================================= */

const checkoutItems =
    document.querySelector("#checkoutItems");

const checkoutSubtotal =
    document.querySelector("#checkoutSubtotal");

const checkoutDelivery =
    document.querySelector("#checkoutDelivery");

const checkoutTotal =
    document.querySelector("#checkoutTotal");

const checkoutForm =
    document.querySelector("#checkoutForm");

const successModal =
    document.querySelector("#successModal");

const orderNumber =
    document.querySelector("#orderNumber");

const continueShopping =
    document.querySelector("#continueShopping");



/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {

    return "Rs. " +
        Number(price).toLocaleString("en-LK");

}



/* =========================================================
   EMPTY CART CHECK
   ========================================================= */

if (!cart.length) {

    window.location.href = "cart.html";

}



/* =========================================================
   GET PRODUCT VALUES
   ========================================================= */

function getItemName(item) {

    return (
        item.name ||
        item.title ||
        "Product"
    );

}


function getItemPrice(item) {

    return Number(
        item.price || 0
    );

}


function getItemImage(item) {

    return (
        item.image ||
        item.img ||
        null
    );

}


function getItemEmoji(item) {

    const product =
        typeof getProduct === "function"
            ? getProduct(item.id)
            : null;

    return product?.emoji || "♡";

}


function getItemQuantity(item) {

    return Number(
        item.quantity || 1
    );

}



/* =========================================================
   RENDER CHECKOUT ITEMS
   ========================================================= */

function renderCheckoutItems() {

    checkoutItems.innerHTML = "";

    let subtotal = 0;


    cart.forEach(item => {

        const quantity =
            getItemQuantity(item);

        const price =
            getItemPrice(item);

        subtotal +=
            price * quantity;


        const itemElement =
            document.createElement("div");

        itemElement.className =
            "checkout-item";


        const image = getItemImage(item);
        const visual = image
            ? `<img
                    class="checkout-item-image"
                    src="${image}"
                    alt="${getItemName(item)}"
                >`
            : `<div
                    class="checkout-item-image checkout-item-emoji"
                    aria-hidden="true"
                >${getItemEmoji(item)}</div>`;


        itemElement.innerHTML = `

            ${visual}

            <div class="checkout-item-info">

                <div class="checkout-item-name">
                    ${getItemName(item)}
                </div>

                <div class="checkout-item-quantity">
                    Qty: ${quantity}
                </div>

            </div>

            <div class="checkout-item-price">
                ${formatPrice(price * quantity)}
            </div>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    /*
       Change this amount later
       if you want a different
       delivery charge.
    */

    const deliveryFee =
        subtotal >= 5000
            ? 0
            : 350;


    const total =
        subtotal + deliveryFee;


    checkoutSubtotal.textContent =
        formatPrice(subtotal);


    checkoutDelivery.textContent =
        deliveryFee === 0
            ? "FREE"
            : formatPrice(deliveryFee);


    checkoutTotal.textContent =
        formatPrice(total);

}



/* =========================================================
   INITIAL RENDER
   ========================================================= */

renderCheckoutItems();

/* ==========================================
    PAYMENT METHOD DISPLAY
   ========================================== */

const paymentRadios = document.querySelectorAll(
    'input[name="payment"]'
);

const bankTransferInfo = document.getElementById(
    "bankTransferInfo"
);

function updatePaymentDisplay() {
    const selected = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (bankTransferInfo) {
        bankTransferInfo.hidden =
            !selected || selected.value !== "bank";
    }
}

paymentRadios.forEach(radio => {
    radio.addEventListener("change", updatePaymentDisplay);
});

updatePaymentDisplay();




/* =========================================================
   GENERATE ORDER NUMBER
   ========================================================= */

function generateOrderNumber() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );


    return `COZY-${year}${month}${day}-${random}`;

}



/* =========================================================
   PLACE ORDER
   ========================================================= */

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.querySelector(
                "#customerName"
            ).value.trim();


        const phone =
            document.querySelector(
                "#customerPhone"
            ).value.trim();


        const email =
            document.querySelector(
                "#customerEmail"
            ).value.trim();


        const address =
            document.querySelector(
                "#customerAddress"
            ).value.trim();


        const city =
            document.querySelector(
                "#customerCity"
            ).value.trim();


        const postal =
            document.querySelector(
                "#customerPostal"
            ).value.trim();


        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            ).value;



        /* ================= TOTAL ================= */

        let subtotal = 0;

        cart.forEach(item => {

            subtotal +=
                getItemPrice(item) *
                getItemQuantity(item);

        });


        const delivery =
            subtotal >= 5000
                ? 0
                : 350;


        const total =
            subtotal + delivery;



        /* ================= ORDER ================= */

        
const newOrder = {
    orderNumber: generateOrderNumber(),

    date: new Date().toISOString(),

    customer: {
        name,
        phone,
        email,
        address,
        city,
        postal
    },

    paymentMethod: payment,

    // This is a status label, not proof of payment.
    paymentStatus:
        payment === "cash"
            ? "Pay on Delivery"
            : "Awaiting Bank Transfer",

    items: cart,

    subtotal,
    delivery,
    total,

    status: "Pending"
};



        /* =================================================
           SAVE ORDER
           ================================================= */

        const previousOrders =
            JSON.parse(
                localStorage.getItem(
                    "cozy_store_orders"
                )
            ) || [];


        previousOrders.push(
            newOrder
        );


        localStorage.setItem(
            "cozy_store_orders",
            JSON.stringify(
                previousOrders
            )
        );



        /* =================================================
           CLEAR CART
           ================================================= */

        localStorage.removeItem(
            CART_KEY
        );



        /* =================================================
           SHOW SUCCESS
           ================================================= */

        orderNumber.textContent =
            newOrder.orderNumber;


        successModal.classList.add(
            "show"
        );

    }
);



/* =========================================================
   CONTINUE SHOPPING
   ========================================================= */

continueShopping.addEventListener(
    "click",
    function() {

        window.location.href =
            "shop.html";

    }
);