const express = require("express");
const router = express.Router();
const pool = require("../connection");
const userRep = require("../repository/userRepository");

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
    const { name, email, password } = req.body;

    const sql = `INSERT INTO usuarios 
    (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = {
        nombre: name,
        correo: email,
        contrasena: password,
        rol: "empleado",
        telefono: "123456789",
        id_concesionario: 1,
        preferencias_accesibilidad: null,
    };

    console.log(values);


    userRep.createUser(values, function (err, rows) {
        if (err) {
            console.log("Error al crear usuario");
        } else {
            console.log('Usuario registrado con ID:', rows.insertId);
            res.redirect("/");
        }
    });
});

router.get("/iniciar_sesion", (req, res) => {
    res.render("iniciar_sesion");
});

router.post("/iniciar_sesion", (req, res) => {
    const { email, password } = req.body;

    userRep.findUser(email, password, function (err, row) {
        if (err) {
            console.log("Error al buscar usuario");
        }
        if (!row) {
            console.log("Usuario o contraseña incorrecto");
            return res.render("iniciar_sesion", { error: "Usuario o contraseña incorrecto" })
        }

        req.session.userId = row.id_usuario;
        req.session.userName = row.nombre;

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
