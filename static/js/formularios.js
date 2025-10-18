document.addEventListener("DOMContentLoaded", function () {
    const fullNameInput = document.querySelector("#fullName");
    const emailInput = document.querySelector("#email");
    const dateInput = document.querySelector("#dateInput");
    const durationInput = document.querySelector("#durationInput");
    const submitBtn = document.querySelector("#submitBtn");
    const vehicle = document.querySelector("#selectedVehicle");
    const startTime = document.querySelector("#startTime");
    const endtTime = document.querySelector("#endTime");
    const checkboxInput = document.querySelector("#checkboxInput");
    const phone = document.querySelector("#phone");

    const fullNameInputError = document.querySelector("#fullNameError");
    const emailInputError = document.querySelector("#emailError");
    const dateInputError = document.querySelector("#dateInputError");
    const durationInputError = document.querySelector("#durationInputError");

    const progressBar = document.querySelector("#progressBar")
    let progress = Array(9).fill(false);
    let increment = 100 / 9;

    function updateProgressBar() {
        let total = 0;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i]) {
                total += 100 / 9;
            }
        }
        progressBar.style.width = `${total}%`;
        progressBar.setAttribute("aria-valuenow", total);
    }

    fullNameInput.addEventListener("input", function () {
        const fullName = fullNameInput.value.trim();

        if (fullName.length < 3) {
            fullNameInputError.innerHTML = "El nombre y apellidos deben tener al menos 3 caracteres.";
            fullNameInputError.style.display = "block";
            fullNameInput.style.borderColor = "red";
            progress[0] = false;
        } else {
            fullNameInput.style.borderColor = "green";
            fullNameInputError.style.display = "none";
            fullNameInput.dataset.valid = "false";
            progress[0] = true;
        }
        updateProgressBar();
    });

    emailInput.addEventListener("input", function () {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = emailInput.value.trim();
        if (!emailRegex.test(email)) {
            emailInputError.innerHTML = "Por favor, introduce un correo electrónico válido.";
            emailInputError.style.display = "block";
            emailInput.style.borderColor = "red";
            progress[1] = false;
        } else {
            emailInput.style.borderColor = "green";
            emailInputError.style.display = "none";
            progress[1] = true;
        }
        updateProgressBar();
    });

    dateInput.addEventListener("input", function () {
        const selectedDateString = dateInput.value;
        const selectedDate = new Date(selectedDateString);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            dateInputError.innerHTML = "Por favor, escoja una fecha posterior al actual.";
            dateInputError.style.display = "block";
            dateInput.style.borderColor = "red";
            progress[2] = false;
        } else {
            dateInput.style.borderColor = "green";
            dateInputError.style.display = "none";
            progress[2] = true;
        }
        updateProgressBar();
    });

    durationInput.addEventListener("input", function () {
        if (durationInput.value < 0 || durationInput.value == "") {
            durationInputError.innerHTML = "Por favor, introduzca una duración postiva.";
            durationInput.style.borderColor = "red";
            durationInputError.style.display = "block"
            progress[3] = false;
        } else {
            durationInput.style.borderColor = "green";
            progress[3] = true;
        }
        updateProgressBar();
    })

    checkboxInput.addEventListener("click", function () {
        if (checkboxInput.checked) {
            progress[4] = true;
        } else {
            progress[4] = false;
        }
        updateProgressBar();
    });

    vehicle.addEventListener("click", function () {
        if (vehicle.value !== "") {
            progress[5] = true;
        }
        updateProgressBar();
    });

    startTime.addEventListener("input", function () {
        if (startTime.value !== "") {
            progress[6] = true;
        } else {
            progress[6] = false;
        }
        updateProgressBar();
    });

    endTime.addEventListener("input", function () {
        if (endTime.value !== "") {
            progress[7] = true;
        } else {
            progress[7] = false;
        }
        updateProgressBar();
    });

    phone.addEventListener("input", function () {
        if (phone.value.length < 9) {
            progress[8] = false;
        } else {
            progress[8] = true;
        }
        updateProgressBar();
    });

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

    resetBtn.addEventListener("click", function () {
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
