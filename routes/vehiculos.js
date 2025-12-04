const express = require("express");
const router = express.Router();
const vehiculosRep = require("../repository/vehicleRepository");
const { findById } = require("../repository/userRepository");



router.get("/", (req, res) => {
    vehiculosRep.getAll(function (err, rows) {
        if (err) {
            console.log("Error al mostrar todos los vehículos");
        } else {
            const sol = rows;
            res.render("vehiculos", { sol });
        }
    });
});

router.get("/filtrar", (req, res) => {
    const { autonomia, plazas, color } = req.query;

    const filtros = {
        autonomia: autonomia ? Number(autonomia) : null,
        plazas: plazas ? Number(plazas) : null,
        color: color && color.trim() !== "" ? color.trim() : null,
    };

    vehiculosRep.findWithFilters(filtros, (err, vehiculos) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Error al filtrar vehículos" });
        }
        res.json(vehiculos);
    });
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    vehiculosRep.findById(id, function (err, row) {
        if (err) {
            console.log("Error al buscar vehículo por Id");
        } else {
            const sol = row;
            res.render("vehiculos", { sol });
        }
    });
});

module.exports = router;
