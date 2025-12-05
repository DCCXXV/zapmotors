const express = require("express");
const router = express.Router();
const vehiculoRep = require("../repository/vehicleRepository");
const reservaRep = require("../repository/reservaRepository");
const clienteRep = require("../repository/clientRepository");

router.get("/", (req, res) => {
    vehiculoRep.getAll((err, vehicles)=>{
        if(err){
            console.log(err);
            return res.status(500).send("Error al cargar reservas");
        }else{
            reservaRep.getAll((err, reservations) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al cargar reservas");
                }
                let contador = reservations.length;

                if (reservations.length === 0) {
                    return res.render("reservar", {
                        listareservas: reservations
                    });
                }
                for(let r of reservations){
                    clienteRep.findById(r.id_reserva, (err, row)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).send("Error al cargar reservas");
                        }else{           
                            r.nombre = row.nombre;
                            r.correo = row.correo;

                            const fecha_inicio = new Date(r.fecha_inicio);
                            const fecha_fin = new Date(r.fecha_fin);
                            r.fecha_inicio = fecha_inicio.toLocaleString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });
                            r.fecha_fin = fecha_fin.toLocaleString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });
                            contador--;
                            if(contador === 0){
                                res.render("reservar", {
                                    vehicles: vehicles,
                                    listareservas: reservations
                                });
                            }
                        }
                        
                    });

                }
            
            });
        }
    });
});

module.exports = router;
