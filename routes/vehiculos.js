const express = require("express");
const router = express.Router();
const vehiculosRep = require("../repository/vehicleRepository");
const dealershipRep = require("../repository/dealershipRepository");
const { findById } = require("../repository/userRepository");



router.get("/", (req, res) => {
    vehiculosRep.getAll(function (err, rows) {
        if (err) {
            console.log("Error al mostrar todos los vehículos");
            return res.status(500).send("Error al obtener vehículos");
        }

        if (rows.length === 0) {
            return res.render("vehiculos", { sol: [] });
        }

        let contador = rows.length;
        let vehiculos = rows;

        for(let v of vehiculos){
            dealershipRep.findById(v.id_concesionario, (err, result)=>{
                if(err){
                    console.log("Error al obtener concesionario:", err);
                    v.nombre_concesionario = "Desconocido";
                }else{
                    v.nombre_concesionario = result.nombre;
                }

                contador--;
                if(contador === 0){
                    res.render("vehiculos", { sol: vehiculos });
                }
            });
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
