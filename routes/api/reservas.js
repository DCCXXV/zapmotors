"use strict";
const express = require("express");
const router = express.Router();
const reservaRep = require("../../repository/reservaRepository");

router.post("/", (req, res) => {
    const { fullName, email, vehicleId, startTime, endTime, conditions } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!fullName || fullName.trim().length < 3) {
        return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }

    if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    if (!vehicleId) {
        return res.status(400).json({ error: "Debe seleccionar un vehículo" });
    }

    if (!startTime || !endTime) {
        return res.status(400).json({ error: "Debe especificar fecha de inicio y fin" });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
        return res.status(400).json({ error: "La fecha de inicio no puede ser en el pasado" });
    }

    if (endDate <= startDate) {
        return res.status(400).json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" });
    }

    if (conditions !== "on") {
        return res.status(400).json({ error: "Debe aceptar las condiciones" });
    }

    reservaRep.createReserva(req.body, (err, result) => {
        if (err) {
            console.error("Error al crear reserva:", err);
            return res.status(500).json({ error: "Error al crear la reserva" });
        }

        return res.status(201).json({
            id: result.insertId,
            fullName,
            email,
            vehicleId,
            startTime,
            endTime,
            message: "Reserva creada correctamente"
        });
    });
});

module.exports = router;
