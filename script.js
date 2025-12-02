const initSmoothScroll = () => {
    const scrollLinks = document.querySelectorAll("a[href^='#']:not([href='#'])");
    scrollLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href) return;

            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                const cleanUrl = `${window.location.pathname}${window.location.search}`;
                history.replaceState(null, "", cleanUrl);
            }
        });
    });
};

const initContactForm = () => {
    const form = document.querySelector("[data-contact-form]");
    const iframe = document.getElementById("form-submit-frame");
    if (!form || !iframe) return;

    const toast = document.getElementById("form-toast");
    let toastTimeoutId;

    const showToast = (message, state = "success") => {
        if (!toast) return;
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toast.textContent = message;
        toast.dataset.state = state;
        toast.hidden = false;
        toastTimeoutId = setTimeout(() => {
            toast.hidden = true;
            toast.removeAttribute("data-state");
        }, 4500);
    };

    const setSubmitting = isSubmitting => {
        const submitButton = form.querySelector("button[type='submit']");
        if (!submitButton) return;
        submitButton.disabled = isSubmitting;
        if (isSubmitting) {
            submitButton.setAttribute("aria-busy", "true");
        } else {
            submitButton.removeAttribute("aria-busy");
        }
    };

    form.addEventListener("submit", () => {
        if (form.dataset.submitting === "true") return;
        form.dataset.submitting = "true";
        showToast("Sending signal…", "pending");
        setSubmitting(true);
    });

    iframe.addEventListener("load", () => {
        if (form.dataset.submitting !== "true") return;
        form.dataset.submitting = "false";
        setSubmitting(false);
        showToast("Message delivered. I’ll be in touch soon.", "success");
        form.reset();
    });
};

const initResumeDownload = () => {
    const trigger = document.querySelector("[data-resume-download]");
    if (!trigger) return;

    const source = trigger.getAttribute("data-resume-src");
    if (!source) return;
    const filename = trigger.getAttribute("data-resume-filename") || "Chandan-Malakar-Resume.pdf";

    trigger.addEventListener("click", event => {
        event.preventDefault();
        const tempLink = document.createElement("a");
        tempLink.href = source;
        tempLink.download = filename;
        tempLink.rel = "noopener";
        tempLink.target = "_self";
        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();
    });
};

const initMobileNav = () => {
    const toggle = document.querySelector(".mobile-nav-toggle");
    const panel = document.querySelector(".mobile-nav-panel");
    if (!toggle || !panel) return;

    const closePanel = () => {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("open", !isOpen);
    });

    panel.addEventListener("click", event => {
        if (event.target.tagName === "A") {
            closePanel();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closePanel();
        }
    });
};

const initialHash = window.location.hash;
if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

if (initialHash) {
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    history.replaceState(null, "", cleanUrl);
    window.scrollTo(0, 0);
}

window.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initContactForm();
    initMobileNav();
    initResumeDownload();
    if (initialHash) {
        requestAnimationFrame(() => {
            const target = document.querySelector(initialHash);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    } else {
        window.scrollTo(0, 0);
    }
});
