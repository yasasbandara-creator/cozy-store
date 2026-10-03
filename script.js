/* =========================================================
   COZY STORE JAVASCRIPT
========================================================= */


/* ================= MOBILE MENU ================= */

const menuButton =
    document.querySelector(".mobile-menu-button");

const mobileMenu =
    document.querySelector(".mobile-menu");

const mobileLinks =
    document.querySelectorAll(".mobile-menu a");


menuButton.addEventListener("click", () => {

    const active =
        menuButton.classList.toggle("active");

    mobileMenu.classList.toggle("active");

    menuButton.setAttribute(
        "aria-expanded",
        active
    );

});


mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        menuButton.classList.remove("active");

        mobileMenu.classList.remove("active");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


/* ================= HEART BUTTONS ================= */

const heartButtons =
    document.querySelectorAll(".heart-button");


heartButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("liked");

        const icon =
            button.querySelector("i");

        if (button.classList.contains("liked")) {

            icon.classList.remove(
                "fa-regular"
            );

            icon.classList.add(
                "fa-solid"
            );

        } else {

            icon.classList.remove(
                "fa-solid"
            );

            icon.classList.add(
                "fa-regular"
            );

        }

    });

});


/* ================= SHOPPING BAG ================= */

let bagCount = 0;

const bagCounter =
    document.querySelector(".bag-count");

const toast =
    document.querySelector(".toast");

const addButtons =
    document.querySelectorAll(".quick-add");


addButtons.forEach(button => {

    button.addEventListener("click", () => {

        bagCount++;

        bagCounter.textContent =
            bagCount;

        showToast();

        button.textContent =
            "✓ ADDED";

        setTimeout(() => {

            button.textContent =
                "+ ADD TO BAG";

        }, 1200);

    });

});


function showToast() {

    toast.classList.add("show");

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


/* ================= SCROLL REVEAL ================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* ================= MAGNETIC BUTTON ================= */

const magneticButtons =
    document.querySelectorAll(".magnetic");


magneticButtons.forEach(button => {

    button.addEventListener(
        "mousemove",
        event => {

            if (
                window.matchMedia(
                    "(hover: none)"
                ).matches
            ) return;

            const rect =
                button.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            button.style.transform =
                `translate(${x * 0.12}px,
                ${y * 0.12}px)`;

        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform =
                "";

        }
    );

});


/* ================= NEWSLETTER ================= */

const newsletterForm =
    document.querySelector(
        ".newsletter-form"
    );


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const input =
            newsletterForm.querySelector(
                "input"
            );

        if (!input.value.trim()) return;

        input.value = "";

        showToast();

        toast.innerHTML =
            "<span>✦</span> Welcome to our cozy corner!";

    }
);


/* ================= CURSOR SPARKLE ================= */

let lastSparkle = 0;

document.addEventListener(
    "mousemove",
    event => {

        const now =
            Date.now();

        if (now - lastSparkle < 120)
            return;

        lastSparkle = now;

        createSparkle(
            event.clientX,
            event.clientY
        );

    }
);


function createSparkle(x, y) {

    if (
        window.matchMedia(
            "(hover: none)"
        ).matches
    ) return;


    const sparkle =
        document.createElement(
            "span"
        );

    sparkle.textContent =
        Math.random() > .5
            ? "✦"
            : "·";

    sparkle.style.position =
        "fixed";

    sparkle.style.left =
        `${x}px`;

    sparkle.style.top =
        `${y}px`;

    sparkle.style.pointerEvents =
        "none";

    sparkle.style.zIndex =
        "9999";

    sparkle.style.fontSize =
        Math.random() * 7 + 5 + "px";

    sparkle.style.color =
        "#718b68";

    sparkle.style.transition =
        "all .7s ease";

    document.body.appendChild(
        sparkle
    );


    requestAnimationFrame(() => {

        sparkle.style.transform =
            `translate(
                ${(Math.random() - .5) * 30}px,
                ${(Math.random() - .5) * 30}px
            ) scale(0)`;

        sparkle.style.opacity =
            "0";

    });


    setTimeout(() => {

        sparkle.remove();

    }, 700);

}


/* ================= CURRENT YEAR ================= */

const yearElement =
    document.querySelector(
        ".footer-bottom span"
    );

if (yearElement) {

    yearElement.textContent =
        `© ${new Date().getFullYear()} cozy. all rights reserved.`;

}