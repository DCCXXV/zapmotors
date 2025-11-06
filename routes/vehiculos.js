const express = require("express");
const router = express.Router();

const cars = [
    //coches
    { matricula: "12가 3456", marca: "Kia", autonomiaKm: 528, tipo: "coche" },
    {
        matricula: "34나 7890",
        marca: "Hyundai",
        autonomiaKm: 507,
        tipo: "coche",
    },
    { matricula: "56다 1122", marca: "Tesla", autonomiaKm: 602, tipo: "coche" },

    // patinetes
    { matricula: "PT-001", marca: "Xiaomi", autonomiaKm: 45, tipo: "patinete" },
    {
        matricula: "PT-002",
        marca: "Ninebot",
        autonomiaKm: 65,
        tipo: "patinete",
    },

    // motos
    { matricula: "MT-001", marca: "NIU", autonomiaKm: 110, tipo: "moto" },
    { matricula: "MT-002", marca: "Zero", autonomiaKm: 160, tipo: "moto" },
];

router.get("/", (req, res) => {
    const tipo = (req.query.tipo || "").toLowerCase().trim();
    const sol = tipo ? cars.filter((v) => v.tipo.toLowerCase() === tipo) : cars;
    res.render("vehiculos", { sol });
});

module.exports = router;
