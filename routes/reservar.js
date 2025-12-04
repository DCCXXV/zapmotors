const express = require("express");
const router = express.Router();
const vehiculoRep = require("../repository/vehicleRepository");

router.get("/", (req, res) => {
    vehiculoRep.getAll((err, vehicles) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al cargar vehículos");
        }
        res.render("reservar", {vehicles: vehicles || []})
    })
});

module.exports = router;
