"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userRep = require("../../repository/userRepository");

router.get("/", (req, res) => {
    userRep.getAll((err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al filtrar usuarios" });
        }
        res.json(users);
    });
});

router.post("/", async (req, res) => {
    const { name, email, password, telephone, dealership } = req.body;

    const corporateEmailRegex = /^[A-Za-z0-9._%+-]+@zapmotors\.com$/;
    if (!corporateEmailRegex.test(email)) {
        return res.status(400).json({
            error: "El correo debe ser corporativo (@zapmotors.com)",
        });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error:"La contraseña debe tener mínimo 8 caracteres, " + "al menos 1 mayúscula, 1 número y 1 carácter especial.",
        });
    }

    if (telephone) {
        if (!/^[0-9]+$/.test(telephone)) {
            return res.status(400).json({ 
                error: 'El teléfono solo puede contener números' 
            });
        }
        if (telephone.length !== 9) {
            return res.status(400).json({ 
                error: 'El teléfono debe tener exactamente 9 dígitos' 
            });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = {
            nombre: name,
            correo: email,
            contrasena: hashedPassword,
            rol: "empleado",
            telefono: telephone,
            id_concesionario: dealership,
            preferencias_accesibilidad: null,
        };

        userRep.findByEmail(values.correo, function (err, existingUser) {
            if (err) {
                console.error("Error al buscar el usuario por correo:", err);
                return res.status(500).json({
                    error: "Error al verificar el correo. Inténtalo de nuevo.",
                });
            }

            if (existingUser) {
                return res.status(409).json({
                    error: "El email ya está en uso",
                });
            }

            userRep.createUser(values, function (err, result) {
                if (err) {
                    console.error("Error al crear usuario:", err);
                    return res.status(500).json({
                        error: "Error al crear el usuario. Inténtalo de nuevo.",
                    });
                }

                console.log("Usuario registrado con ID:", result.insertId);
                return res.status(201).json({
                    id: result.insertId,
                    nombre: values.nombre,
                    correo: values.correo,
                    rol: values.rol,
                    telefono: values.telefono,
                    id_concesionario: values.id_concesionario,
                });
            });
        });
    } catch (error) {
        console.error("Error al hashear la contraseña:", error);
        return res.status(500).json({
            error: "Error al procesar la contraseña. Inténtalo de nuevo.",
        });
    }
});

router.put("/:id/preferences", (req, res) => {
    const id = parseInt(req.params.id);
    const preferences = req.body;

    userRep.updateAccessibilityPreferences(id, preferences, (err, result) => {
        if (err) {
            console.error("Error al actualizar las preferencias:", err);
            return res.status(500).json({ error: "Error al actualizar las preferencias" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // update session if the logged-in user is the one being updated
        if (req.session && req.session.user && req.session.user.id === id) {
            req.session.user.preferences = preferences;
            req.session.save(err => {
                if (err) {
                    console.error("Error saving session:", err);
                }
                res.json({ message: "Preferencias actualizadas correctamente", id });
            });
        } else {
            res.json({ message: "Preferencias actualizadas correctamente", id });
        }
    });
});

router.get("/:id", (req, res) => {
    userRep.findById(req.params.id, (err, user) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            return res.status(500).json({ error: "Error al buscar el usuario" });
        }
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    });
});

router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const rol = req.body.rol;

    userRep.updateRolUser(id, rol, (err, result) => {
        if (err) {
            console.error("Error al actualizar el rol:", err);
            return res.status(500).json({ error: "Error al actualizar el rol" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Rol actualizado correctamente", id, rol });
    });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    userRep.deleteById(id, (err, result) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            return res.status(500).json({ error: "Error al eliminar el usuario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente", id });
    });
});

module.exports = router;
