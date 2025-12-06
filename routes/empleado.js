const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const vehicleRep = require("../repository/vehicleRepository");

router.get("/", (req, res) => {
    let reservas = null;
    let vehiculos = null;

    userRep.getReservesById(req.session.user.id, (err, rows) => {
        if (err) {
            console.log("Error al listar las reservas");
            return res.render("500");
        }
        reservas = rows;
        console.log(reservas);

        vehicleRep.findAllByIdDealership(
            req.session.user.id_concesionario,
            (err, rows) => {
                if (err) {
                    console.log(
                        "Error al listar los vehículos asociados al id del concesionario del empleado"
                    );
                    return res.render("500");
                }
                vehiculos = rows;
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
