const express = require("express");
const router = express.Router();
const vehiculosRep = require("../repository/vehicleRepository");
const { findById } = require("../repository/userRepository");

const cars = [
    //coches
    {
        id: 1,
        matricula: "12가 3456",
        marca: "Kia",
        autonomiaKm: 528,
        tipo: "coche",
    },
    {
        id: 2,
        matricula: "34나 7890",
        marca: "Hyundai",
        autonomiaKm: 507,
        tipo: "coche",
    },
    {
        id: 3,
        matricula: "56다 1122",
        marca: "Tesla",
        autonomiaKm: 602,
        tipo: "coche",
    },

    // patinetes
    {
        id: 4,
        matricula: "PT-001",
        marca: "Xiaomi",
        autonomiaKm: 45,
        tipo: "patinete",
    },
    {
        id: 5,
        matricula: "PT-002",
        marca: "Ninebot",
        autonomiaKm: 65,
        tipo: "patinete",
    },

    // motos
    {
        id: 6,
        matricula: "MT-001",
        marca: "NIU",
        autonomiaKm: 110,
        tipo: "moto",
    },
    {
        id: 7,
        matricula: "MT-002",
        marca: "Zero",
        autonomiaKm: 160,
        tipo: "moto",
    },
];

router.get("/", (req, res) => {
    vehiculosRep.getAll(function (err, rows) {
        if (err) {
            console.log("Error al mostrar todos los vehículos");
        } else {
            const sol = rows;
            //console.log(sol);
            res.render("vehiculos", { sol });
        }
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
