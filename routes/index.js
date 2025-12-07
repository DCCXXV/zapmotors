const express = require("express");
const router = express.Router();
const userRep = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const { loadData } = require("../load");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/setup", (req, res) => {
    res.render("setup");
});

router.post("/setup/check", (req, res) => {
    const pool = require("../connection");
    const vehiculos = req.body.vehiculos || [];

    if (vehiculos.length === 0) {
        return res.json({ duplicates: [] });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error de conexión al verificar duplicados:", err);
            // si hay error de conexión, continuar sin verificar duplicados
            return res.json({ duplicates: [], warning: "No se pudo verificar duplicados" });
        }

        const matriculas = vehiculos.map(v => v.matricula);
        connection.query(
            'SELECT matricula, marca, modelo FROM vehiculos WHERE matricula IN (?) AND activo = TRUE',
            [matriculas],
            (err, rows) => {
                connection.release();
                if (err) {
                    console.error("Error en consulta de duplicados:", err);
                    // si hay error en la consulta (ej: tabla no existe), continuar sin verificar
                    return res.json({ duplicates: [], warning: "No se pudo verificar duplicados" });
                }
                res.json({ duplicates: rows || [] });
            }
        );
    });
});

router.post("/setup/load", (req, res) => {
    const updateExisting = req.body.updateExisting || false;
    const data = req.body.data || req.body;

    loadData(data, updateExisting, (err, logs) => {
        if (err) {
            console.error("Error cargando datos:", err);
            return res.status(500).json({
                error: "Error al cargar datos",
                logs: logs || null
            });
        }

        // mostrar logs en consola solo si existen
        if (logs) {
            console.log("\n=== CARGA DE DATOS COMPLETADA ===");

            if (logs.admin) {
                console.log("\nAdmin:");
                console.log(`  ${logs.admin}`);
            }

            if (logs.concesionarios && logs.concesionarios.added && logs.concesionarios.added.length > 0) {
                console.log("\nConcesionarios añadidos:");
                logs.concesionarios.added.forEach(c => console.log(`  + ${c}`));
            }

            if (logs.concesionarios && logs.concesionarios.skipped && logs.concesionarios.skipped.length > 0) {
                console.log("\nConcesionarios omitidos (ya existían):");
                logs.concesionarios.skipped.forEach(c => console.log(`  - ${c}`));
            }

            if (logs.vehiculos && logs.vehiculos.added && logs.vehiculos.added.length > 0) {
                console.log("\nVehículos añadidos:");
                logs.vehiculos.added.forEach(v => console.log(`  + ${v}`));
            }

            if (logs.vehiculos && logs.vehiculos.updated && logs.vehiculos.updated.length > 0) {
                console.log("\nVehículos actualizados:");
                logs.vehiculos.updated.forEach(v => console.log(`  * ${v}`));
            }

            if (logs.vehiculos && logs.vehiculos.skipped && logs.vehiculos.skipped.length > 0) {
                console.log("\nVehículos omitidos (ya existían):");
                logs.vehiculos.skipped.forEach(v => console.log(`  - ${v}`));
            }

            console.log("\n=================================\n");
        }

        res.json({
            message: "Datos cargados correctamente",
            logs: logs
        });
    });
});

router.get("/contacto", (req, res) => {
    res.render("contacto");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const corporateEmailRegex = /^[A-Za-z0-9._%+-]+@zapmotors\.com$/;
    if (!corporateEmailRegex.test(email)) {
        return res.render("login", {
            error: "Debes usar un correo corporativo (@zapmotors.com)",
        });
    }

    userRep.findByEmail(email, function (err, user) {
        if (err) {
            console.log("Error al buscar usuario:", err);
            return res.render("login", {
                error: "Error del servidor. Intenta de nuevo.",
            });
        }

        if (!user) {
            console.log("Usuario no encontrado");
            return res.render("login", {
                error: "Usuario o contraseña incorrecto",
            });
        }

        bcrypt.compare(password, user.contrasena, function (err, isMatch) {
            if (err) {
                console.log("Error al comparar contraseñas:", err);
                return res.render("login", {
                    error: "Error del servidor. Intenta de nuevo.",
                });
            }

            if (!isMatch) {
                console.log("Contraseña incorrecta");
                return res.render("login", {
                    error: "Usuario o contraseña incorrecto",
                });
            }

            let preferences = null;
            if (user.preferencias_accesibilidad) {
                try {
                    preferences = typeof user.preferencias_accesibilidad === 'string'
                        ? JSON.parse(user.preferencias_accesibilidad)
                        : user.preferencias_accesibilidad;
                } catch (e) {
                    console.error('Error parseando preferencias:', e);
                    preferences = null;
                }
            }

            req.session.user = {
                id: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol,
                id_concesionario: user.id_concesionario,
                preferences: preferences
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
    res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Página no encontrada"
    });
});

router.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("error", {
        errorCode: 500,
        errorMessage: "Error interno del servidor"
    });
});

module.exports = router;
