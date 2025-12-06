"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();
const dealershipRep = require("../../repository/dealershipRepository");


router.get("/", (req, res) => {
    dealershipRep.getDealerships((err, dealerships) => {
      if(err){
        console.error(err);
        res.status(500).json({error: "Error al obtener los concesionarios"})
      }else{
        res.json(dealerships);
      }
    });
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    dealershipRep.findById(id, (err, dealership) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener concesionario" });
        } else if (!dealership) {
            res.status(404).json({ error: "Concesionario no encontrado" });
        } else {
            res.json(dealership);
        }
    });
});

router.post("/", (req, res) => {
    const {
      dealershipsName,
      city,
      address,
      phone
    } = req.body;

    const dealershipData = {
      nombre: dealershipsName,
      ciudad: city,
      direccion: address,
      telefono_contacto: phone
    };

    dealershipRep.createDealership(dealershipData, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creando concesionario");
        } else {
            res.status(201).json({ message: "Concesionario creado", id: result.insertId });
        }
    });
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    dealershipRep.deleteById(id, (err) => {
        if (err) {
            res.status(500).json({ error: "Error al eliminar concesionario" });
        } else {
            res.json({ message: "Concesionario eliminado" });
        }
    });
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const dealershipData = req.body;

    dealershipRep.updateDealership(id, dealershipData, (err) => {
        if (err) {
            res.status(500).json({ error: "Error al actualizar Concesionario" });
        } else {
            res.json({ message: "Concesionario actualizado" });
        }
    });
});

module.exports = router;
