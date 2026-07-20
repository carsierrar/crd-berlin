/* ==========================================================
   CRD BERLIN
   MAIN JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       HEADER ON SCROLL
    ========================================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.style.background = "rgba(252,251,248,.96)";
            header.style.boxShadow = "0 10px 35px rgba(0,0,0,.08)";

        } else {

            header.style.background = "rgba(252,251,248,.82)";
            header.style.boxShadow = "none";

        }

    });

    /* ==========================================
       BACK TO TOP
    ========================================== */

    const backButton = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 700) {

            backButton.classList.add("show");

        } else {

            backButton.classList.remove("show");

        }

    });

    backButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    /* ==========================================
       ACTIVE MENU
    ========================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a");

    function updateNavigation() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (pageYOffset >= top && pageYOffset < top + height) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", updateNavigation);

    /* ==========================================
       SCROLL ANIMATION
    ========================================== */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: .15

    });

    document.querySelectorAll(

        ".service-card, .feature, .process article, .contact-form, .contact-info"

    ).forEach(element => {

        element.classList.add("fade");

        observer.observe(element);

    });

    /* ==========================================
       HERO PARALLAX
    ========================================== */

    const hero = document.querySelector(".hero");

    window.addEventListener("scroll", () => {

        const offset = window.scrollY * 0.35;

        hero.style.backgroundPosition = `center ${offset}px`;

    });

    /* ==========================================
       BUTTON HOVER EFFECT
    ========================================== */

    document.querySelectorAll(".button").forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "translateY(-3px)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "translateY(0px)";

        });

    });

});
