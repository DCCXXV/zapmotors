const express = require("express");
const router = express.Router();

const listareservas = [];

router.get("/", (req, res) => {
    res.render("reservas", { listareservas });
});

router.post("/", (req, res) => {
    console.log("reserva:", req.body);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (req.body.fullName.length < 3) {
        return res.redirect("/400");
    } else if (!emailRegex.test(req.body.email.trim())) {
        return res.redirect("/400");   
    } else if (new Date(req.body.dateInput.value) < new Date()){
        return res.redirect("/400");
    } else if(req.body.durationInput < 0 || req.body.durationInput == " ") {
        return res.redirect("/400");
    } else if(req.body.conditions != "on"){
        return res.redirect("/400");
    }
    
    listareservas.push(req.body);
    res.redirect("/reservas");
});

module.exports = router;
