const express = require("express");
const router = express.Router();
const connection = require("../connection");

const users = [];

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contacto", (req, res) => {
    res.render("contacto");
});

router.get("/registro", (req, res) => {
    res.render("registro");
});

router.post("/registro", (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    
    const sql = `INSERT INTO usuarios 
    (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        name,
        email,
        password,
        "empleado",
        "123456789",
        1,
        null,
    ];

    connection.query(sql, values, (error, rows, fields) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).send('Error al registrar');
        }
        
        console.log("rows:", rows);
        console.log('Usuario registrado con ID:', rows.insertId);
        res.redirect("/");
    });
});

router.use((req, res) => {
    res.status(404).render("404");
});

router.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("500");
});


module.exports = router;
