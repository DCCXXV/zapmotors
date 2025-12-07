const express = require("express");
const router = express.Router();
const vehiculoRep = require("../repository/vehicleRepository");
const userRep= require("../repository/userRepository");
const clienteRep = require("../repository/clientRepository");

router.get("/", (req, res) => {
    
    vehiculoRep.getAllAvailable((err, vehicles)=>{
        if(err){
            console.log(err);
            return res.status(500).send("Error al cargar reservas");
        }else{
            userRep.getReservesById(req.session.user.id, (err, reservations) => {
                
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error al cargar reservas");
                }
                let contador = reservations.length;
                                
                if (reservations.length === 0) {
                    return res.render("reservas", {
                        vehicles: vehicles,
                        listareservas: reservations
                    });
                }
                for(let r of reservations){
                    clienteRep.findById(r.id_cliente, (err, row)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).send("Error al cargar reservas");
                        }else{
                            r.nombre = row.nombre;
                            r.correo = row.correo;

                            vehiculoRep.findById(r.id_vehiculo, (err, vehiculo)=>{
                                if(err || !vehiculo){
                                    console.log(err);
                                    r.matricula = "Desconocida";
                                }else{
                                    const v = Array.isArray(vehiculo) ? vehiculo[0] : vehiculo;
                                    r.matricula = v.matricula;
                                }

                                const ahora = new Date();
                                const fecha_inicio = new Date(r.fecha_inicio);
                                const fecha_fin = new Date(r.fecha_fin);

                                const esActiva = r.estado === 'activa';

                                r.puede_cancelar = esActiva && (ahora < fecha_inicio);
                                r.puede_finalizar = esActiva && (ahora > fecha_fin);

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
                                    res.render("reservas", {
                                        vehicles: vehicles,
                                        listareservas: reservations
                                    });
                                }
                            });
                        }
                    });
                }
            
            });
        }
    });
});

module.exports = router;
