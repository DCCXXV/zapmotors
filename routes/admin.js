const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    userRep.getUsers((err, rows) => {
        if (err) {
            return res.status(500).render("500");
        }
        res.render("admin", { users: rows });
    });
});

router.post("/usuarios", async (req, res) => {
    console.log(req.body);
    const { name, email, password, telephone, concessionaire } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = {
            nombre: name,
            correo: email,
            contrasena: hashedPassword,
            rol: "empleado",
            telefono: telephone,
            id_concesionario: concessionaire,
            preferencias_accesibilidad: null,
        };

        console.log(values);

        userRep.findByEmail(values.correo, function (err, rows) {
            if (err) {
                console.log("Error al buscar el usuario por correo");
                return res.render("registro", {
                    errMsg: "Error al verificar el correo. Inténtalo de nuevo.",
                });
            }

            if (rows) {
                return res.render("registro", {
                    errMsg: "El email ya está en uso",
                });
            }

            userRep.createUser(values, function (err, rows) {
                if (err) {
                    console.log("Error al crear usuario:", err);
                    return res.render("registro", {
                        errMsg: "Error al crear el usuario. Inténtalo de nuevo.",
                    });
                }

                console.log("Usuario registrado con ID:", rows.insertId);
                return res.redirect("/");
            });
        });
    } catch (error) {
        console.log("Error al hashear la contraseña:", error);
        return res.render("registro", {
            errMsg: "Error al procesar la contraseña. Inténtalo de nuevo.",
        });
    }
});

router.post("/eliminar/:id", (req, res) => {
    const id = req.params.id;
    userRep.deleteById(id, (err, result) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            return res.status(500).render("500");
        } else {
            return res.redirect("/admin");
        }
    });
});

router.post("/actualizar-rol/:id/rol", (req, res) => {
    console.log("iniciando actualizacion de roles");

    const id = req.params.id;
    const rol = req.body.rol;
    console.log("Datos recibidos:", { id, rol });

    userRep.updateRolUser(id, rol, (err, result) => {
        if (err) {
            console.error("Error al actualizar el rol:", err);
            return res.status(500).render("500");
        } else {
            return res.redirect("/admin");
        }
    });
});

module.exports = router;
