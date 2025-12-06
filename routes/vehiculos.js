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

        dealershipRep.getDealerships((err, concesionarios) => {
            if (err) {
                console.log("Error al obtener concesionarios");
                return res.status(500).send("Error al obtener concesionarios");
            }

            if (rows.length === 0) {
                return res.render("vehiculos", { sol: [], concesionarios: concesionarios || [] });
            }

            let contador = rows.length;
            let vehiculos = rows;

            for(let v of vehiculos){
                dealershipRep.findById(v.id_concesionario, (err, result)=>{
                    if(err || !result){
                        console.log("Error al obtener concesionario:", err);
                        v.nombre_concesionario = "Desconocido";
                        v.ciudad_concesionario = "Desconocida";
                    }else{
                        v.nombre_concesionario = result.nombre;
                        v.ciudad_concesionario = result.ciudad;
                    }

                    contador--;
                    if(contador === 0){
                        res.render("vehiculos", { sol: vehiculos, concesionarios: concesionarios || [] });
                    }
                });
            }
        });
    });
});

router.get("/filtrar", (req, res) => {
    const { autonomia, plazas, color, concesionario, ciudad } = req.query;

    const filtros = {
        autonomia: autonomia ? Number(autonomia) : null,
        plazas: plazas ? Number(plazas) : null,
        color: color && color.trim() !== "" ? color.trim() : null,
        id_concesionario: concesionario ? Number(concesionario) : null,
    };

    vehiculosRep.findWithFilters(filtros, (err, vehiculos) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ error: "Error al filtrar vehículos" });
        }

        if (vehiculos.length === 0) {
            return res.json([]);
        }

        let contador = vehiculos.length;

        for (let v of vehiculos) {
            dealershipRep.findById(v.id_concesionario, (err, result) => {
                if (err || !result) {
                    v.nombre_concesionario = "Desconocido";
                    v.ciudad_concesionario = "Desconocida";
                } else {
                    v.nombre_concesionario = result.nombre;
                    v.ciudad_concesionario = result.ciudad;
                }

                contador--;
                if (contador === 0) {
                    // filtrar por ciudad si se especificó
                    let vehiculosFiltrados = vehiculos;
                    if (ciudad && ciudad.trim() !== "") {
                        vehiculosFiltrados = vehiculos.filter(v =>
                            v.ciudad_concesionario.toLowerCase().includes(ciudad.trim().toLowerCase())
                        );
                    }
                    res.json(vehiculosFiltrados);
                }
            });
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
