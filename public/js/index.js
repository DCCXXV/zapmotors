const showBtn = document.querySelector("#show-btn");
const password = document.querySelector("#passwordInput");

showBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const visible = password.type === "password";
    password.type = visible ? "text" : "password";
    if (visible) {
        showBtn.innerHTML = '<i class="bi bi-eye-fill"></i>';
    } else {
        showBtn.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    }
});
