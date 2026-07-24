// Open external web links in a new tab without changing email links.
document.querySelectorAll("main a").forEach(function (linkEl) {
    const url = new URL(linkEl.href);
    const isWebLink = url.protocol === "http:" || url.protocol === "https:";

    if (isWebLink && url.origin !== window.location.origin) {
        linkEl.target = "_blank";
        linkEl.rel = "nofollow noreferrer noopener";
    }
});

// Reveal page content as it enters the viewport.
const revealItems = document.querySelectorAll("main > *");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("has-motion");

    revealItems.forEach(function (item, index) {
        item.dataset.reveal = "";
        item.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 55}ms`);
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealItems.forEach(function (item) {
        observer.observe(item);
    });
}
