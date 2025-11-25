const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const bcrypt = require("bcrypt");

const users = [];

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contacto", (req, res) => {
    res.render("contacto");
});

router.get("/iniciar_sesion", (req, res) => {
    res.render("iniciar_sesion");
});

router.post("/iniciar_sesion", (req, res) => {
    const { email, password } = req.body;

    userRep.findByEmail(email, function (err, user) {
        if (err) {
            console.log("Error al buscar usuario:", err);
            return res.render("iniciar_sesion", {
                error: "Error del servidor. Intenta de nuevo.",
            });
        }

        if (!user) {
            console.log("Usuario no encontrado");
            return res.render("iniciar_sesion", {
                error: "Usuario o contraseña incorrecto",
            });
        }

        bcrypt.compare(password, user.contrasena, function (err, isMatch) {
            if (err) {
                console.log("Error al comparar contraseñas:", err);
                return res.render("iniciar_sesion", {
                    error: "Error del servidor. Intenta de nuevo.",
                });
            }

            if (!isMatch) {
                console.log("Contraseña incorrecta");
                return res.render("iniciar_sesion", {
                    error: "Usuario o contraseña incorrecto",
                });
            }

            req.session.user = {
                id: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol,
                id_concesionario: user.id_concesionario,
            };

            res.redirect("/");
        });
    });
});

router.get("/logout", (req, res) => {
    console.log("cerrando");
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

router.get("/admin", (req, res) => {
    res.render("admin");
});

router.use((req, res) => {
    res.status(404).render("404");
});

router.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("500");
});

module.exports = router;
