"use strict";
const express = require("express");
const router = express.Router();
const clientRep = require("../../repository/clientRepository");

router.post("/", (req, res) => {
    const { nombre, correo} = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const now = new Date();

    const data = {
        nombre,
        correo,
        fecha_creacion: now
    }

    clientRep.createClient(data, (err, result) => {
        if (err) {
            console.error("Error al crear cliente:", err);
            res.status(500).json({ error: "Error al crear la cliente" });
        }else{
            res.status(201).json({
                id: result.insertId,
                message: "cliente creada correctamente"
            });
        }
    });
});

module.exports = router;
