const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const vehicleRep = require("../repository/vehicleRepository");

router.get("/", (req, res) => {
    let reservas = [];
    let vehiculos = [];

    userRep.getReservesById(req.session.user.id, (err, rows) => {
        if (err) {
            console.log("Error al listar las reservas");
            return res.status(500).render("error", {
                errorCode: 500,
                errorMessage: "Error interno del servidor"
            });
        }
        reservas = rows || [];
        console.log(reservas);

        vehicleRep.findAllByIdDealership(
            req.session.user.id_concesionario,
            (err, rows) => {
                if (err) {
                    console.log(
                        "Error al listar los vehículos asociados al id del concesionario del empleado"
                    );
                    return res.status(500).render("error", {
                        errorCode: 500,
                        errorMessage: "Error interno del servidor"
                    });
                }
                vehiculos = rows || [];
                console.log(vehiculos);

                return res.render("empleado", {
                    listaReservas: reservas,
                    listaVehiculos: vehiculos,
                });
            }
        );
    });
});


module.exports = router;
