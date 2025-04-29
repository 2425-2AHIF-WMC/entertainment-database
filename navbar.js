// SCROLL TOGGLE SCRIPT
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > 100) {
            navbar.classList.add("bubble");
        } else {
            navbar.classList.remove("bubble");
        }
    });
});
