const express = require("express");
const router = express.Router();

const listareservas = [];

router.get("/", (req, res) => {
    res.render("reservas", { listareservas });
});

router.post("/", (req, res) => {
    console.log("reserva:", req.body);
    listareservas.push(req.body);
    res.redirect("/reservas");
});

module.exports = router;
