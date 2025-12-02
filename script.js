const initNavigation = () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
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

window.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initContactForm();
});
