"use strict";
const express = require("express");
const router = express.Router();
const reservaRep = require("../../repository/reservaRepository");
const clientRep = require("../../repository/clientRepository");

router.post("/", (req, res) => {
    const { fullName, email, vehicleId, startTime, endTime} = req.body;

    console.log(req.body);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!fullName || fullName.trim().length < 3) {
        return res
            .status(400)
            .json({ error: "El nombre debe tener al menos 3 caracteres" });
    }

    if (!email || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    if (!vehicleId) {
        return res.status(400).json({ error: "Debe seleccionar un vehículo" });
    }

    if (!startTime || !endTime) {
        return res
            .status(400)
            .json({ error: "Debe especificar fecha de inicio y fin" });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
        return res
            .status(400)
            .json({ error: "La fecha de inicio no puede ser en el pasado" });
    }

    if (endDate <= startDate) {
        return res.status(400).json({
            error: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
    }

    // verificar disponibilidad del vehículo
    reservaRep.checkVehicleAvailability(vehicleId, startTime, endTime, (err, isAvailable) => {
        if (err) {
            console.error("Error al verificar disponibilidad:", err);
            return res.status(500).json({ error: "Error al verificar disponibilidad del vehículo" });
        }

        if (!isAvailable) {
            return res.status(400).json({
                error: "El vehículo no está disponible en el rango de fechas seleccionado. Por favor, elija otras fechas.",
            });
        }
        
        // si está disponible, continuar con la creación
        const user = {
            nombre: fullName,
            correo: email,
            fecha_creacion: now
        };

        clientRep.findByEmail(email, (err, row) => {
            if (err) {
                console.error("Error al buscar usuario por correo:", err);
                return res.status(500).json({error: "Error al buscar usuario por correo"});
            }


            if (row === null) {
                clientRep.createClient(user, (err, result) => {
                    if (err) {
                        console.error("Error al crear usuario", err);
                        return res.status(500).json({error: "Error al crear usuario"});
                    }
                    
                    const clientId = result.insertId;
                    const data = {
                        id_usuario: req.session.user.id,
                        id_cliente: clientId,
                        id_vehiculo: vehicleId,
                        fecha_inicio: startTime,
                        fecha_fin: endTime
                    };

                    reservaRep.createReserva(data, (err, result) => {
                        if (err) {
                            console.error("Error al crear reserva:", err);
                            return res.status(500).json({ error: "Error al crear la reserva" });
                        }                        
                        res.status(201).json({
                            id: result.insertId,
                            fullName,
                            email,
                            vehicleId,
                            startTime,
                            endTime,
                            message: "Reserva creada correctamente"
                        });
                    });
                });
            } else {
                const clientId = row.id_cliente;
                const data = {
                    id_usuario: req.session.user.id,
                    id_cliente: clientId,
                    id_vehiculo: vehicleId,
                    fecha_inicio: startTime,
                    fecha_fin: endTime
                };
                
                reservaRep.createReserva(data, (err, result) => {
                    if (err) {
                        console.error("Error al crear reserva:", err);
                        return res.status(500).json({ error: "Error al crear la reserva" });
                    }

                    res.status(201).json({
                        id: result.insertId,
                        fullName,
                        email,
                        vehicleId,
                        startTime,
                        endTime,
                        message: "Reserva creada correctamente"
                    });
                });
            }
        });
    });
});

router.patch("/:id", (req, res)=>{
    const idReserva = req.params.id;
    const { estado, kilometros_recorridos, incidencias_reportadas } = req.body;

    if (!idReserva || !estado) {
        return res.status(400).json({ error: "Faltan datos (id o estado)" });
    }

    // Si solo se actualiza el estado (cancelar), usar updateStatus
    if (!kilometros_recorridos && !incidencias_reportadas) {
        reservaRep.updateStatus(idReserva, estado, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al actualizar la reserva" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Reserva no encontrada" });
            }

            res.status(200).json({
                message: `Reserva ${estado} correctamente`,
                id: idReserva,
                estado
            });
        });
    } else {
        // Si se actualiza con datos adicionales (finalizar con km e incidencias)
        const updateData = {
            estado,
            kilometros_recorridos: kilometros_recorridos || null,
            incidencias_reportadas: incidencias_reportadas || null
        };

        reservaRep.updateReservaConDetalles(idReserva, updateData, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al actualizar la reserva" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Reserva no encontrada" });
            }

            res.status(200).json({
                message: `Reserva ${estado} correctamente`,
                id: idReserva,
                estado,
                kilometros_recorridos: updateData.kilometros_recorridos,
                incidencias_reportadas: updateData.incidencias_reportadas
            });
        });
    }
});

router.get("/:id/detalle", (req, res) => {
    const idReserva = req.params.id;

    reservaRep.getDetalleReserva(idReserva, (err, reserva) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener los detalles de la reserva" });
        }

        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        res.status(200).json(reserva);
    });
});

module.exports = router;
