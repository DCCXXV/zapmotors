document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#reservationForm");
    const fullNameInput = document.querySelector("#fullName");
    const emailInput = document.querySelector("#email");
    const vehicleInput = document.querySelector("#selectedVehicle");
    const startTimeInput = document.querySelector("#startTime");
    const endTimeInput = document.querySelector("#endTime");
    const resetBtn = document.querySelector("#resetBtn");

    const fullNameInputError = document.querySelector("#fullNameError");
    const emailInputError = document.querySelector("#emailError");
    const startTimeError = document.querySelector("#startTimeError");
    const endTimeError = document.querySelector("#endTimeError");

    const progressBar = document.querySelector("#progressBar");
    
    const fields = 5;
    let progress = Array(5).fill(false);
    let increment = 100 / fields;

    function updateProgressBar() {
        let total = 0;
        for (let i = 0; i < progress.length; i++) {
            if (progress[i]) {
                total += increment;
            }
        }
        progressBar.style.width = `${total}%`;
        progressBar.setAttribute("aria-valuenow", total);
    }

    fullNameInput.addEventListener("input", function () {
        const fullName = fullNameInput.value.trim();

        if (fullName.length < 3) {
            fullNameInputError.innerHTML =
                "El nombre y apellidos deben tener al menos 3 caracteres.";
            fullNameInputError.style.display = "block";
            fullNameInput.classList.remove("border-dark");
            fullNameInput.classList.add("border-danger");
            progress[0] = false;
        } else {
            fullNameInput.classList.remove("border-danger");
            fullNameInput.classList.remove("border-dark");
            fullNameInput.classList.add("border-success");
            fullNameInputError.style.display = "none";
            progress[0] = true;
        }
        updateProgressBar();
    });

    emailInput.addEventListener("input", function () {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const email = emailInput.value.trim();
        if (!emailRegex.test(email)) {
            emailInputError.innerHTML =
                "Por favor, introduce un correo electrónico válido.";
            emailInputError.style.display = "block";
            emailInput.classList.remove("border-dark");
            emailInput.classList.add("border-danger");
            progress[1] = false;
        } else {
            emailInput.classList.remove("border-danger");
            emailInput.classList.remove("border-dark");
            emailInput.classList.add("border-success");
            emailInputError.style.display = "none";
            progress[1] = true;
        }
        updateProgressBar();
    });

    startTimeInput.addEventListener("input", function () {
        const startTime = startTimeInput.value;
        const startTimeDate = new Date(startTime);
        const now = new Date();

        if (startTimeDate < now) {
            startTimeError.innerHTML =
                "Por favor, introduce una fehca de inicio posterior a la actual.";
            startTimeError.style.display = "block";
            startTimeInput.classList.remove("border-dark");
            startTimeInput.classList.add("border-danger");
            progress[2] = false;
        } else {
            startTimeInput.classList.remove("border-danger");
            startTimeInput.classList.remove("border-dark");
            startTimeInput.classList.add("border-success");
            startTimeError.style.display = "none";
            progress[2] = true;
        }

        const endTime = endTimeInput.value;
        const endTimeDate = new Date(endTime);

        console.log(startTimeDate);
        console.log(endTimeDate);

        if (!isNaN(endTimeDate.getTime())) {
            if (endTimeDate <= startTimeDate) {
                endTimeError.innerHTML =
                    "Por favor, introduce una fecha de fin posterior a la fecha de inicio.";
                endTimeError.style.display = "block";
                endTimeInput.classList.remove("border-dark");
                endTimeInput.classList.remove("border-success");
                endTimeInput.classList.add("border-danger");
                progress[3] = false;
            } else {
                endTimeError.style.display = "none";
                endTimeInput.classList.remove("border-danger");
                endTimeInput.classList.add("border-success");
                progress[3] = true;
            }
        }
        updateProgressBar();
    });

    endTimeInput.addEventListener("input", function () {
        const endTime = endTimeInput.value;
        const endTimeDate = new Date(endTime);
        const startTime = startTimeInput.value;
        const startTimeDate = new Date(startTime);
        if (endTimeDate <= startTimeDate) {
            endTimeError.innerHTML =
                "Por favor, introduce una fecha de fin posterior a la fecha de inicio.";
            endTimeError.style.display = "block";
            endTimeInput.classList.remove("border-dark");
            endTimeInput.classList.add("border-danger");
            progress[3] = false;
        } else {
            endTimeInput.classList.remove("border-danger");
            endTimeInput.classList.remove("border-dark");
            endTimeInput.classList.add("border-success");
            endTimeError.style.display = "none";
            progress[3] = true;
        }
        updateProgressBar();
    });

    vehicleInput.addEventListener("change", function () {
        if (vehicleInput.value !== "") {
            progress[4] = true;

            // Actualizar aria-label del botón de enviar con información del vehículo
            const submitBtn = document.querySelector("#submitBtn");
            const selectedOption = vehicleInput.options[vehicleInput.selectedIndex];
            const vehicleInfo = selectedOption.text;
            submitBtn.setAttribute("aria-label", `Reservar vehículo ${vehicleInfo}`);
        }
        updateProgressBar();
    });

    /*
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
    */

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        fullNameInputError.style.display = "none";
        emailInputError.style.display = "none";
        startTimeError.style.display = "none";
        endTimeError.style.display = "none";

        const inputs = [
            fullNameInput,
            emailInput,
            startTimeInput,
            endTimeInput,
            vehicleInput,
        ];

        inputs.forEach((input) => {
            input.classList.remove("border-success", "border-danger");
            input.classList.add("border-dark");
        });

        updateProgressBar();

        const formData = new FormData(e.target);
        const form = e.target;

        const data = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            vehicleId: formData.get("vehicleId"),
            startTime: formData.get("startTime"),
            endTime: formData.get("endTime"),
        };
        console.log(data);

        fetch("/api/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    throw new Error(err.error || "Error al crear reserva");
                });
            }
            return response.json();
        })
        .then((data) => {
            // obtener la matrícula del vehículo seleccionado ANTES de resetear el formulario
            const selectedVehicleOption = vehicleInput.options[vehicleInput.selectedIndex];
            const vehicleText = selectedVehicleOption.text;
            // extraer la matrícula que está entre paréntesis
            const matriculaMatch = vehicleText.match(/\(([^)]+)\)$/);
            const matricula = matriculaMatch ? matriculaMatch[1] : formData.get("vehicleId");

            const startFormatted = new Date(formData.get("startTime")).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            const endFormatted = new Date(formData.get("endTime")).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            form.reset();

            // añadir fila a la tabla
            const tbody = document.querySelector(
                "#reservation-container tbody"
            );

            // eliminar la fila de "No hay reservas" si existe
            const noReservasRow = tbody.querySelector('td[colspan="7"]');
            if (noReservasRow) {
                noReservasRow.parentElement.remove();
            }

            const newRow = document.createElement("tr");
            newRow.className = "text-center align-middle";
            newRow.dataset.reservationId = data.id;
            newRow.innerHTML = `
                <td>${data.id}</td>
                <td>${formData.get("fullName")}</td>
                <td>${formData.get("email")}</td>
                <td><a href="/vehiculos/${formData.get("vehicleId")}" class="text-decoration-none">${matricula}</a></td>
                <td>${startFormatted}</td>
                <td>${endFormatted}</td>
                <td class="action-cell">
                    <button class="btn btn-danger btn-sm update-status-btn"
                        data-id="${data.id}" data-status="cancelada">
                        <i aria-label="Cancelar reserva" class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(newRow);
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
    });

    resetBtn.addEventListener("click", function () {
        fullNameInputError.style.display = "none";
        emailInputError.style.display = "none";
        startTimeError.style.display = "none";
        endTimeError.style.display = "none";

        const inputs = [
            fullNameInput,
            emailInput,
            startTimeInput,
            endTimeInput,
            vehicleInput,
        ];

        inputs.forEach((input) => {
            input.classList.remove("border-success", "border-danger");
            input.classList.add("border-dark");
        });

        updateProgressBar();
    });
});
