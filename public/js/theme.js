document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const btn = document.querySelector("#theme-toggle");
    const img = document.querySelector("#theme-img");
    const saved = localStorage.getItem("zap-theme");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let initialTheme;
    if (saved) {
        initialTheme = saved;
    } else {
        initialTheme = prefersDark ? "dark" : "light";
    }

    if (initialTheme === "dark") {
        img.style.transition = "none";
        root.setAttribute("data-theme", "dark");
        btn.classList.add("is-right");
        img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
    } else {
        root.removeAttribute("data-theme");
        btn.classList.remove("is-right");
        img.innerHTML = "<i class='bi bi-brightness-high'></i>";
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("zap-theme")) {
            const isDark = e.matches;
            if (isDark) {
                root.setAttribute("data-theme", "dark");
                btn.classList.add("is-right");
                img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
            } else {
                root.removeAttribute("data-theme");
                btn.classList.remove("is-right");
                img.innerHTML = "<i class='bi bi-brightness-high'></i>";
            }
        }
    });

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
