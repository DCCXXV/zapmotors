document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const btn = document.querySelector("#theme-toggle");
    const img = document.querySelector("#theme-img");

    // sincronizar UI con el tema actual
    const currentTheme = window.currentPreferences ? window.currentPreferences.theme : "light";

    if (currentTheme === "dark") {
        img.style.transition = "none";
        btn.classList.add("is-right");
        img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
    } else {
        btn.classList.remove("is-right");
        img.innerHTML = "<i class='bi bi-brightness-high'></i>";
    }

    // función para guardar preferencias (reutilizando la de footer)
    async function savePreferences(preferences) {
        window.currentPreferences = preferences;

        if (window.userId) {
            try {
                const response = await fetch(`/api/usuarios/${window.userId}/preferences`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(preferences)
                });

                if (!response.ok) {
                    console.error('Error al guardar preferencias en DB');
                }
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
            }
        } else {
            localStorage.setItem("zap-theme", preferences.theme);
            sessionStorage.setItem("fontSize", preferences.fontSize);
            sessionStorage.setItem("contrastMode", preferences.contrastMode);
        }
    }

    async function toggleTheme() {
        const isDark = root.getAttribute("data-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";

        if (isDark) {
            img.style.transition = "left 100ms ease";
            root.removeAttribute("data-theme");
            btn.classList.remove("is-right");
            img.innerHTML = "<i class='bi bi-brightness-high '></i>";
        } else {
            root.setAttribute("data-theme", "dark");
            btn.classList.add("is-right");
            img.innerHTML = "<i class='bi bi-moon-stars text-white'></i>";
        }

        // guardar
        await savePreferences({
            ...window.currentPreferences,
            theme: newTheme
        });
    }

    btn.addEventListener("click", toggleTheme);
});
