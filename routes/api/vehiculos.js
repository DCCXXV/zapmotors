"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();
const vehiculosRep = require("../../repository/vehicleRepository");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/img/uploads"));
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);
        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formatted = `${day}-${month}-${year}_${hours}-${minutes}`;
        const fileName = `${name}_${formatted}${extension}`;
        cb(null, fileName);
    },
});

const multerFactory = multer({ storage });


router.get("/", (req, res) => {
    const { autonomia, plazas, color } = req.query;

    const filtros = {
        autonomia: autonomia ? Number(autonomia) : null,
        plazas: plazas ? Number(plazas) : null,
        color: color && color.trim() !== "" ? color.trim() : null,
    };

    vehiculosRep.findWithFilters(filtros, (err, vehiculos) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al filtrar vehículos" });
        } else {
            res.json(vehiculos);
        }
    });
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    vehiculosRep.findById(id, (err, row) => {
        if (err) {
            res.status(500).json({error: "Error al buscar vehículo"})
        } else if (!row) {
            res.status(404).json({error: "Vehículo no encontrado"})
        } else {
            res.json(row);
        }
    })
});

router.post("/", multerFactory.single("image"), async (req, res) => {
    const {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        dealershipId,
        status,
    } = req.body;

    let imgName = null;
    if (req.file.filename) {
        imgName = req.file.filename;
    }

    const vehicleData = {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        image: `${imgName}`,
        dealershipId,
        status,
    };

    vehiculosRep.createVehicle(vehicleData, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creando vehículo");
        } else {
            res.status(201).json({ message: "Vehículo creado", id: result.insertId });
        }
    });
});


router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    vehiculosRep.deleteById(id, (err) => {
        if (err) {
            res.status(500).json({ error: "Error al eliminar vehículo" });
        } else {
            res.json({ message: "Vehículo eliminado" });
        }
    });
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const vehicleData = req.body;

    vehiculosRep.updateVehicle(id, vehicleData, (err) => {
        if (err) {
            res.status(500).json({ error: "Error al actualizar vehículo" });
        } else {
            res.json({ message: "Vehículo actualizado" });
        }
    });
});

module.exports = router;
