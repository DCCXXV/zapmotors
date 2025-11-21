const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");

router.get("/", (req, res) => {
    console.log("buscando reservas");
    console.log(req.session.user.id);

    userRep.getReservesById(req.session.user.id, (err, rows) => {
        if (err) {
            console.log("Error al listar las reservas");
            return res.render("500");
        }
        console.log(rows);

        return res.render("empleado", { listaReservas: rows });
    });
});

router.get("lista-de-reserva/", (req, res) => {
    userRep.getReservesById();
});

module.exports = router;
