const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const vehicleRep = require("../repository/vehicleRepository");
const dealershipRep = require("../repository/dealershipRepository");


router.get("/", (req, res) => {
    let users;
    let vehicles;
    let dealerships;
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
                res.render("admin", {
                    users: users,
                    vehicles: vehicles,
                    dealerships: dealerships,
                });
            });
        });
    });
});

module.exports = router;
