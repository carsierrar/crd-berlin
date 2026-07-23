/* ==========================================================
   CRD BERLIN
   MAIN JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const header = document.querySelector(".header");

    const logo = document.getElementById("site-logo");

    const mobileToggle = document.querySelector(".mobile-toggle");

    const navigation = document.querySelector(".navigation");

    const navLinks = document.querySelectorAll(".navigation a");

    const sections = document.querySelectorAll("section[id]");

    const backToTop = document.querySelector(".back-to-top");

    const revealElements = document.querySelectorAll(
        ".feature, .service-card, .approach-card, .contact-item, .section-title, .about-image, .about-content, .cta-content"
    );



    /* ==========================================
       HEADER SCROLL
    ========================================== */

    function updateHeader(){

        if(window.scrollY > 80){

            header.classList.add("scrolled");

            if(logo){

                logo.src="assets/images/logo-dark.png";

            }

        }

        else{

            header.classList.remove("scrolled");

            if(logo){

                logo.src="assets/images/logo-light.png";

            }

        }

    }

    updateHeader();

    window.addEventListener("scroll",updateHeader);



    /* ==========================================
       MOBILE MENU
    ========================================== */

    if(mobileToggle){

        mobileToggle.addEventListener("click",()=>{

            navigation.classList.toggle("active");

            mobileToggle.classList.toggle("active");

        });

    }



    /* ==========================================
       CLOSE MENU WHEN CLICKING A LINK
    ========================================== */

    navLinks.forEach(link=>{

        link.addEventListener("click",()=>{

            navigation.classList.remove("active");

            mobileToggle.classList.remove("active");

        });

    });



    /* ==========================================
       ACTIVE MENU
    ========================================== */

    function activeSection(){

        let current="";

        sections.forEach(section=>{

            const top=section.offsetTop-120;

            const height=section.offsetHeight;

            if(window.scrollY>=top){

                current=section.getAttribute("id");

            }

        });

        navLinks.forEach(link=>{

            link.classList.remove("active");

            if(link.getAttribute("href")==="#" + current){

                link.classList.add("active");

            }

        });

    }

    activeSection();

    window.addEventListener("scroll",activeSection);



    /* ==========================================
       BACK TO TOP
    ========================================== */

    function toggleBackToTop(){

        if(window.scrollY>500){

            backToTop.classList.add("active");

        }

        else{

            backToTop.classList.remove("active");

        }

    }

    toggleBackToTop();

    window.addEventListener("scroll",toggleBackToTop);



    /* ==========================================
       REVEAL ON SCROLL
    ========================================== */

    revealElements.forEach(element=>{

        element.classList.add("reveal");

    });

    function reveal(){

        const trigger=window.innerHeight*0.88;

        revealElements.forEach(element=>{

            const top=element.getBoundingClientRect().top;

            if(top<trigger){

                element.classList.add("active");

            }

        });

    }

    reveal();

    window.addEventListener("scroll",reveal);



    /* ==========================================
       FOOTER YEAR
    ========================================== */

    const year=document.getElementById("year");

    if(year){

        year.textContent=new Date().getFullYear();

    }



    /* ==========================================
       SMOOTH SCROLL
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            const target=document.querySelector(this.getAttribute("href"));

            if(!target){

                return;

            }

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        });

    });

});