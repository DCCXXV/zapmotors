document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const btn = document.querySelector("#theme-toggle");
    const img = document.querySelector("#theme-img");
    const saved = localStorage.getItem("zap-theme");

    if (saved === "dark") {
        img.style.transition = "none";
        root.setAttribute("data-theme", "dark");
        btn.classList.add("is-right");
        img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
    } else {
        btn.classList.remove("is-right");
        img.innerHTML = "<i class='bi bi-brightness-high'></i>";
    }

    function toggleTheme() {
        const isDark = root.getAttribute("data-theme") === "dark";
        if (isDark) {
            img.style.transition = "left 100ms ease";
            root.removeAttribute("data-theme");
            localStorage.setItem("zap-theme", "light");
            btn.classList.remove("is-right");
            img.innerHTML = "<i class='bi bi-brightness-high '></i>";
        } else {

            root.setAttribute("data-theme", "dark");
            localStorage.setItem("zap-theme", "dark");
            btn.classList.add("is-right");
            img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
        }
    }
    btn.addEventListener("click", toggleTheme);
});
