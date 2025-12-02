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
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(form);
        const subject = `Portfolio inquiry from ${formData.get("name")}`;
        const body = `${formData.get("message")}%0D%0A%0D%0AFrom: ${formData.get("name")} (${formData.get("email")})`;
        window.location.href = `mailto:hey@chandanmalakar.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        form.reset();
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
