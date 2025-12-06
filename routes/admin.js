const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const vehicleRep = require("../repository/vehicleRepository");
const dealershipRep = require("../repository/dealershipRepository");
const reservaRep = require("../repository/reservaRepository");


router.get("/", (req, res) => {
    let users;
    let vehicles;
    let dealerships;
    let statsByDealership;
    let mostUsedVehicles;

    userRep.getUsersWithoutUser(req.session.user.id, (err, rows) => {
        if (err) {
            console.log("Error al mostrar los usuarios");
            return res.status(500).render("500");
        }
        users = rows;
        vehicleRep.getAll((err, rows) => {
            if (err) {
                console.log("Error al mostrar los vehículos");
                return res.render("500");
            }
            vehicles = rows;

            dealershipRep.getDealerships((err, rows) => {
                if (err) {
                    console.log("Error al mostrar los concesionarios");
                    return res.render("500");
                }
                dealerships = rows;

                // obtener stats
                reservaRep.getStatsByDealership((err, rows) => {
                    if (err) {
                        console.log("Error al obtener estadísticas por concesionario");
                        statsByDealership = [];
                    } else {
                        statsByDealership = rows;
                    }

                    reservaRep.getMostUsedVehicles((err, rows) => {
                        if (err) {
                            console.log("Error al obtener vehículos más usados");
                            mostUsedVehicles = [];
                        } else {
                            mostUsedVehicles = rows;
                        }

                        res.render("admin", {
                            users: users,
                            vehicles: vehicles,
                            dealerships: dealerships,
                            statsByDealership: statsByDealership,
                            mostUsedVehicles: mostUsedVehicles,
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
