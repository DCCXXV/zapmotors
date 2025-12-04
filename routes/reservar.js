const express = require("express");
const router = express.Router();
const vehiculoRep = require("../repository/vehicleRepository");
const reservaRep = require("../repository/reservaRepository");
router.get("/", (req, res) => {
    vehiculoRep.getAll((err, vehicles) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al cargar vehículos");
        }
        reservaRep.getAll((err, reservations) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cargar reservas");
            }
            res.render("reservar", {
                vehicles: vehicles || [],
                listareservas: reservations,
            });
        });
    });
});

module.exports = router;
