const initSmoothScroll = () => {
    const scrollLinks = document.querySelectorAll("a[href^='#']:not([href='#'])");
    const getMainTopPadding = () => {
        const main = document.querySelector("main");
        if (!main) return 0;
        const value = parseFloat(window.getComputedStyle(main).paddingTop);
        return Number.isNaN(value) ? 0 : value;
    };

    scrollLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href) return;

            const isPageTopLink = href === "#top" || href === "#page-top";
            const target = document.querySelector(href);
            if (!target && !isPageTopLink) return;

            event.preventDefault();

            if (isPageTopLink) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const requiresTopAlignment = target.dataset.scrollAnchor === "top";
                const offset = requiresTopAlignment ? getMainTopPadding() : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: Math.max(targetPosition, 0), behavior: "smooth" });
            }

            const cleanUrl = `${window.location.pathname}${window.location.search}`;
            history.replaceState(null, "", cleanUrl);
        });
    });
};

const initContactForm = () => {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

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

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (form.dataset.submitting === "true") return;

        form.dataset.submitting = "true";
        showToast("Sending signal…", "pending");
        setSubmitting(true);

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload = await response.json().catch(() => ({}));
            const isSuccessful = payload.success === true || payload.success === "true" || Object.keys(payload).length === 0;
            if (!isSuccessful) {
                throw new Error(payload.message || "Unable to send message.");
            }

            showToast("Message delivered. I’ll be in touch soon.", "success");
            form.reset();
        } catch (error) {
            console.error("Contact form submission failed", error);
            showToast("Message failed. Please email me directly.", "error");
        } finally {
            form.dataset.submitting = "false";
            setSubmitting(false);
        }
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

        const absoluteSource = new URL(source, window.location.href).toString();

        const downloadLink = document.createElement("a");
        downloadLink.href = absoluteSource;
        downloadLink.download = filename;
        downloadLink.rel = "noopener";
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        const previewWindow = window.open(absoluteSource, "_blank", "noopener");
        if (!previewWindow) {
            console.warn("Resume preview blocked by the browser's popup settings.");
        }
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
