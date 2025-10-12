document.addEventListener("DOMContentLoaded", function () {
    const fullNameInput = document.querySelector("#fullName");
    const emailInput = document.querySelector("#email");
    const dateInput = document.querySelector("#dateInput");
    const durationInput = document.querySelector("#durationInput");
    const submitBtn = document.querySelector("#submitBtn");

    const fullNameInputError = document.querySelector("#fullNameError");
    const emailInputError = document.querySelector("#emailError");
    const dateInputError = document.querySelector("#dateInputError");
    const durationInputError = document.querySelector("#durationInputError");

    const progressBar = document.querySelector("#progressBar")
    let progress = 0;
    let increment = 100/9;

    function updateProgressBar() {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute("aria-valuenow", progress);
    }

    fullNameInput.addEventListener("input", function () {
        const fullName = fullNameInput.value.trim();

        if (fullName.length < 3) {
            fullNameInputError.innerHTML = "El nombre y apellidos deben tener al menos 3 caracteres.";
            fullNameInputError.style.display = "block";
            fullNameInput.style.borderColor = "red";
            return;
        } else {
            fullNameInput.style.borderColor = "green";
            fullNameInputError.style.display = "none";
            progress += increment;
            updateProgressBar();
            fullNameInput.dataset.valid = "false";
        }
    });

    emailInput.addEventListener("input", function () {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = emailInput.value.trim();
        if (!emailRegex.test(email)) {
            emailInputError.innerHTML = "Por favor, introduce un correo electrónico válido.";
            emailInputError.style.display = "block";
            emailInput.style.borderColor = "red";
            return;
        } else {
            emailInput.style.borderColor = "green";
            emailInputError.style.display = "none";
        }
    });

    dateInput.addEventListener("input", function () {
        const selectedDateString = dateInput.value;
        const selectedDate = new Date(selectedDateString);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            dateInputError.innerHTML = "Por favor, escoja una fecha posterior al actual.";
            dateInputError.style.display = "block";
            dateInput.style.borderColor = "red";
        } else{
            dateInput.style.borderColor = "green";
            dateInputError.style.display = "none";
        }
    });

    durationInput.addEventListener("input", function() {
        if (durationInput.value < 0) {
            durationInputError.innerHTML = "Por favor, introduzca una duración postiva.";
            durationInput.style.borderColor = "red";
            durationInputError.style.display = "block"
        } else {
            durationInput.style.borderColor = "green";
        }
    })

    submitBtn.addEventListener("click", function (event) {
        event.preventDefault();
        fullNameInputError.style.display = "none";
        emailInputError.style.display = "none";
        dateInputError.style.display = "none";

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const selectedDateString = dateInput.value;

        if (fullName.length < 3) {
            fullNameInputError.innerHTML = "El nombre y apellidos deben tener al menos 3 caracteres.";
            fullNameInputError.style.display = "block";
            fullNameInput.focus();
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            emailInputError.innerHTML = "Por favor, introduce un correo electrónico válido.";
            emailInputError.style.display = "block";
            emailInput.focus();
            return;
        }

        if (!selectedDateString) {
            dateInputError.innerHTML = "Por favor, selecciona una fecha.";
            dateInputError.style.display = "block"
            dateInput.focus();
            return;
        }

        const selectedDate = new Date(selectedDateString);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            dateInputError.innerHTML = "Por favor, escoja una fecha posterior al actual.";
            dateInputError.style.display = "block"
            dateInput.focus();
            return;
        }

        alert("Formulario enviado correctamente");
    });

    resetBtn.addEventListener("click", function() {
        fullNameInputError.style.display = "none";
        emailInputError.style.display = "none";
        dateInputError.style.display = "none";
        durationInputError.style.display = "none";

        fullNameInput.style.borderColor = "";
        emailInput.style.borderColor = "";
        dateInput.style.borderColor = "";
        durationInput.style.borderColor = "";
    });
});
