const express = require("express");
const path = require("path");
const router = express.Router();
const userRep = require("../repository/userRepository");
const vehicleRep = require("../repository/vehicleRepository");
const bcrypt = require("bcrypt");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/img"));
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const name = path.basename(file.originalname, extension);
        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formatted = `${day}-${month}-${year}_${hours}-${minutes}`;
        const fileName = `${name}_${formatted}${extension}`;
        cb(null, fileName);
    },
});

const multerFactory = multer({ storage });

router.get("/", (req, res) => {
    let users;
    let vehicles;
        
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
            console.log(users);
            
            res.render("admin", { users: users, vehicles: vehicles });
        });
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
                return res.redirect("/admin");
            });
        });
    } catch (error) {
        console.log("Error al hashear la contraseña:", error);
        return res.render("registro", {
            errMsg: "Error al procesar la contraseña. Inténtalo de nuevo.",
        });
    }
});

router.post("/vehiculos", multerFactory.single("image"), async (req, res) => {
    const {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        status,
    } = req.body;

    let imgName = null;
    if (req.file.filename) {
        imgName = req.file.filename;
    }

    const vehicleData = {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        image: `img\\${imgName}`,
        status,
        concessionaireId: req.session.user.id_concesionario,
    };

    console.log(vehicleData);
    console.log(req.session.user);

    vehicleRep.createVehicle(vehicleData, (err, result) => {
        if (err) {
            console.error(err);
            return res.send("Error creando vehículo");
        }
        res.redirect("/admin");
    });
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

router.post("/eliminar-vehiculo/:id", (req, res) => {
    const id = req.params.id;
    vehicleRep.deleteById(id, (err, result) => {
        if (err) {
            console.error("Error al eliminar vehículo: ", err);
            return res.status(500).render("500");
        } else {
            return res.redirect("/admin");
        }
    })
});

router.get("/vehiculo/:id", (req, res) => {
    const id = req.params.id;
    vehicleRep.findById(id, (err, rows) => {
        if (err) {
            console.error("Error al buscar vehículo: ", err);
            return res.status(500).json({ error: "Error al buscar vehículo" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }
        return res.json(rows[0]);
    });
});

router.post("/vehiculo/:id", (req, res) => {
    const id = req.params.id;
    const {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        status
    } = req.body;

    const vehicleData = {
        licensePlate,
        brand,
        model,
        registrationYear,
        seatsNumber,
        rangeKm,
        color,
        status
    };

    vehicleRep.updateVehicle(id, vehicleData, (err, result) => {
        if (err) {
            console.error("Error al actualizar vehículo: ", err);
            return res.status(500).render("500");
        }
        return res.redirect("/admin");
    });
});

module.exports = router;
