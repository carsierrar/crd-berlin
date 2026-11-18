/* ==========================================================
   CRD BERLIN – MAIN JAVASCRIPT
========================================================== */

(function () {

    "use strict";

    var CONTACT_EMAIL = "info@crd-berlin.de";
    var WHATSAPP_NUMBER = "4915756614358"; // international format, no "+" or "00"
    var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
    var CONSENT_KEY = "crd-cookie-consent";

    /* ------------------------------------------
       Safe localStorage (can throw in private mode)
    ------------------------------------------ */

    var storage = {
        get: function (key) {
            try { return window.localStorage.getItem(key); } catch (e) { return null; }
        },
        set: function (key, value) {
            try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
        }
    };

    document.addEventListener("DOMContentLoaded", function () {

        var header = document.querySelector(".header");
        var logo = document.getElementById("site-logo");
        var mobileToggle = document.querySelector(".mobile-toggle");
        var navigation = document.querySelector(".navigation");
        var navLinks = document.querySelectorAll(".navigation a");
        var backToTop = document.querySelector(".back-to-top");

        /* ==========================================
           HEADER + BACK TO TOP (one throttled scroll handler)
        ========================================== */

        var logoLight = "assets/images/logo-light.webp";
        var logoDark = "assets/images/logo-dark.webp";
        var ticking = false;

        function onScroll() {
            var y = window.scrollY || window.pageYOffset;

            if (header) {
                var scrolled = y > 40;
                header.classList.toggle("scrolled", scrolled);
                if (logo) {
                    var wanted = scrolled ? logoDark : logoLight;
                    if (logo.getAttribute("src") !== wanted) { logo.setAttribute("src", wanted); }
                }
            }

            if (backToTop) {
                backToTop.classList.toggle("active", y > 500);
            }

            ticking = false;
        }

        // Preload the dark logo so the swap is instant
        new Image().src = logoDark;

        onScroll();
        window.addEventListener("scroll", function () {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        /* ==========================================
           MOBILE MENU
        ========================================== */

        function setMenu(open) {
            if (!navigation || !mobileToggle) { return; }
            navigation.classList.toggle("active", open);
            mobileToggle.classList.toggle("active", open);
            mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
            mobileToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
            document.body.classList.toggle("menu-open", open);
            onScroll();
        }

        if (mobileToggle) {
            mobileToggle.addEventListener("click", function () {
                setMenu(!navigation.classList.contains("active"));
            });
        }

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { setMenu(false); }
        });

        document.addEventListener("click", function (e) {
            if (!navigation || !navigation.classList.contains("active")) { return; }
            if (!navigation.contains(e.target) && !mobileToggle.contains(e.target)) {
                setMenu(false);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 992) { setMenu(false); }
        });

        /* ==========================================
           ACTIVE MENU ITEM
        ========================================== */

        var sections = document.querySelectorAll("section[id]");

        if ("IntersectionObserver" in window && sections.length) {
            var sectionObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) { return; }
                    var id = entry.target.getAttribute("id");
                    navLinks.forEach(function (link) {
                        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                    });
                });
            }, { rootMargin: "-45% 0px -50% 0px" });

            sections.forEach(function (section) { sectionObserver.observe(section); });
        }

        /* ==========================================
           HERO ENTRANCE (one orchestrated moment)
        ========================================== */

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.add("is-loaded");
            });
        });

        /* ==========================================
           FOOTER YEAR
        ========================================== */

        var year = document.getElementById("year");
        if (year) { year.textContent = new Date().getFullYear(); }

        /* ==========================================
           WHATSAPP LINKS
           wa.me only accepts the number in international
           format without "+", "00", spaces or dashes.
        ========================================== */

        var waText = encodeURIComponent("Hello CRD Berlin, I would like to know more about your services.");
        document.querySelectorAll(".js-whatsapp").forEach(function (link) {
            link.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + waText);
        });

        /* ==========================================
           "ENQUIRE NOW" → PREFILL SUBJECT
        ========================================== */

        var subjectField = document.getElementById("cf-subject");

        document.querySelectorAll("[data-service]").forEach(function (link) {
            link.addEventListener("click", function () {
                if (subjectField) {
                    subjectField.value = "Enquiry: " + link.getAttribute("data-service");
                }
            });
        });

        /* ==========================================
           CONTACT FORM
        ========================================== */

        initContactForm();

        /* ==========================================
           COOKIE BANNER
        ========================================== */

        initCookieBanner();

    });

    /* ==========================================================
       CONTACT FORM
       Sends the form via FormSubmit (formsubmit.co) to
       info@crd-berlin.de. No server needed – works on GitHub Pages.
    ========================================================== */

    function initContactForm() {

        var form = document.getElementById("contact-form");
        if (!form) { return; }

        var status = form.querySelector(".form-status");
        var button = form.querySelector("button[type='submit']");
        var buttonLabel = button ? button.querySelector(".btn-label") : null;
        var originalLabel = buttonLabel ? buttonLabel.textContent : "";

        function showStatus(type, html) {
            status.className = "form-status form-status-" + type;
            status.innerHTML = html;
            status.hidden = false;
        }

        function setLoading(loading) {
            if (!button) { return; }
            button.disabled = loading;
            button.classList.toggle("is-loading", loading);
            if (buttonLabel) { buttonLabel.textContent = loading ? "Sending…" : originalLabel; }
        }

        function markInvalid(field, invalid) {
            var group = field.closest(".form-group, .form-check");
            if (group) { group.classList.toggle("has-error", invalid); }
            field.setAttribute("aria-invalid", invalid ? "true" : "false");
        }

        function validate() {
            var firstInvalid = null;
            form.querySelectorAll("[required]").forEach(function (field) {
                var value = field.type === "checkbox" ? field.checked : field.value.trim();
                var valid = !!value && field.checkValidity();
                markInvalid(field, !valid);
                if (!valid && !firstInvalid) { firstInvalid = field; }
            });
            return firstInvalid;
        }

        function mailtoFallback(data) {
            var body = "Name: " + data.name + "\nEmail: " + data.email +
                (data.phone ? "\nPhone: " + data.phone : "") + "\n\n" + data.message;
            return "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(data.subject || "Enquiry via crd-berlin.de") +
                "&body=" + encodeURIComponent(body);
        }

        form.querySelectorAll("input, textarea").forEach(function (field) {
            field.addEventListener("input", function () {
                if (field.getAttribute("aria-invalid") === "true") {
                    markInvalid(field, !(field.type === "checkbox" ? field.checked : field.value.trim() && field.checkValidity()));
                }
            });
            field.addEventListener("change", function () {
                if (field.type === "checkbox" && field.required) { markInvalid(field, !field.checked); }
            });
        });

        form.addEventListener("submit", function (e) {

            e.preventDefault();
            status.hidden = true;

            var firstInvalid = validate();
            if (firstInvalid) {
                showStatus("error", "Please fill in all required fields and accept the privacy notice.");
                firstInvalid.focus();
                return;
            }

            // Spam trap filled → pretend success, send nothing
            if (form.querySelector("[name='_honey']").value) {
                form.reset();
                showStatus("success", "Thank you! Your message has been sent.");
                return;
            }

            // form.elements is used because form.name would return the form's own name
            var f = form.elements;
            var data = {
                name: f.namedItem("name").value.trim(),
                email: f.namedItem("email").value.trim(),
                phone: f.namedItem("phone").value.trim(),
                subject: f.namedItem("subject").value.trim(),
                message: f.namedItem("message").value.trim()
            };

            var payload = {
                name: data.name,
                email: data.email,
                phone: data.phone || "–",
                subject: data.subject || "–",
                message: data.message,
                _replyto: data.email,
                _subject: "New enquiry from crd-berlin.de" + (data.subject ? ": " + data.subject : ""),
                _template: "table",
                _captcha: "false"
            };

            setLoading(true);

            var controller = "AbortController" in window ? new AbortController() : null;
            var timeout = setTimeout(function () { if (controller) { controller.abort(); } }, 15000);

            fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload),
                signal: controller ? controller.signal : undefined
            })
                .then(function (response) {
                    return response.json().catch(function () { return {}; }).then(function (json) {
                        if (!response.ok || String(json.success) !== "true") {
                            throw new Error(json.message || "Request failed");
                        }
                        return json;
                    });
                })
                .then(function () {
                    form.reset();
                    showStatus("success",
                        "<strong>Thank you, your message has been sent.</strong> We will get back to you shortly.");
                })
                .catch(function () {
                    showStatus("error",
                        "Sorry, your message could not be sent right now. Please " +
                        "<a href=\"" + mailtoFallback(data) + "\">send it by email</a> or " +
                        "<a href=\"https://wa.me/" + WHATSAPP_NUMBER + "\" target=\"_blank\" rel=\"noopener\">contact us on WhatsApp</a>.");
                })
                .then(function () {
                    clearTimeout(timeout);
                    setLoading(false);
                });
        });
    }

    /* ==========================================================
       COOKIE BANNER
       The site sets no tracking cookies. The choice is stored and
       exposed as window.crdConsent + a "crd:consent" event, so any
       future analytics can be loaded only after "Accept".
    ========================================================== */

    function initCookieBanner() {

        var banner = document.getElementById("cookie-banner");
        if (!banner) { return; }

        function apply(value) {
            window.crdConsent = value;
            document.dispatchEvent(new CustomEvent("crd:consent", { detail: value }));
        }

        function open() {
            banner.hidden = false;
            document.body.classList.add("cookie-open");
            requestAnimationFrame(function () { banner.classList.add("visible"); });
        }

        function close() {
            banner.classList.remove("visible");
            document.body.classList.remove("cookie-open");
            setTimeout(function () { banner.hidden = true; }, 300);
        }

        var saved = storage.get(CONSENT_KEY);

        if (saved) {
            apply(saved);
        } else {
            setTimeout(open, 600);
        }

        banner.querySelectorAll("[data-consent]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var value = btn.getAttribute("data-consent");
                storage.set(CONSENT_KEY, value);
                apply(value);
                close();
            });
        });

        document.querySelectorAll(".js-cookie-settings").forEach(function (btn) {
            btn.addEventListener("click", open);
        });
    }

})();
