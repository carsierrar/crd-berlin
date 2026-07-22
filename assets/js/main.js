/* ==========================================================
   CRD BERLIN
   MAIN.JS
========================================================== */


/* ==========================================
   HEADER SCROLL
========================================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* ==========================================
   REVEAL ON SCROLL
========================================== */

const revealElements = document.querySelectorAll(

    ".service-card, .about-grid, .two-columns, .process article, .intro, .cta"

);

function revealOnScroll() {

    revealElements.forEach((element) => {

        const windowHeight = window.innerHeight;

        const revealTop = element.getBoundingClientRect().top;

        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


/* ==========================================
   BACK TO TOP
========================================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        backToTop.style.display = "flex";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* ==========================================
   SMOOTH LINKS
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/* ==========================================
   ACTIVE MENU
========================================== */

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".navigation a");

function activateMenu(){

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 150;

        const sectionHeight = section.clientHeight;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href") === "#" + current

        ){

            link.classList.add("active");

        }

    });

}

window.addEventListener("scroll",activateMenu);


/* ==========================================
   HERO FADE
========================================== */

const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll",()=>{

    const value = window.scrollY;

    heroContent.style.opacity = 1 - value / 600;

    heroContent.style.transform =

        `translateY(${value * 0.18}px)`;

});


/* ==========================================
   IMAGE PARALLAX
========================================== */

const heroImage = document.querySelector(".hero-image");

window.addEventListener("scroll",()=>{

    const offset = window.scrollY;

    heroImage.style.transform =

        `translateY(${offset*0.25}px) scale(1.05)`;

});


/* ==========================================
   BUTTON HOVER RIPPLE
========================================== */

document.querySelectorAll(".button-primary").forEach(button=>{

    button.addEventListener("mousemove",(e)=>{

        const rect = button.getBoundingClientRect();

        button.style.setProperty(

            "--x",

            `${e.clientX-rect.left}px`

        );

        button.style.setProperty(

            "--y",

            `${e.clientY-rect.top}px`

        );

    });

});


/* ==========================================
   YEAR
========================================== */

const year = new Date().getFullYear();

const footerYear = document.getElementById("year");

if(footerYear){

    footerYear.textContent = year;

}


/* ==========================================
   PRELOADER (optional)
========================================== */

window.addEventListener("load",()=>{

    document.body.classList.add("loaded");

});