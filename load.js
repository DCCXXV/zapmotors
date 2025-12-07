const pool = require("./connection");
const bcrypt = require("bcrypt");

function loadData(jsonData, updateExisting, callback) {
    if (typeof updateExisting === 'function') {
        callback = updateExisting;
        updateExisting = false;
    }

    pool.getConnection((err, connection) => {
        if (err) return callback(err);

        const logs = {
            concesionarios: { added: [], updated: [], skipped: [] },
            vehiculos: { added: [], updated: [], skipped: [] },
            admin: null
        };

        // verificar si hay usuarios en la BD
        connection.query('SELECT COUNT(*) as count FROM usuarios WHERE activo = TRUE', (err, rows) => {
            if (err) {
                connection.release();
                return callback(err);
            }

            const dbEmpty = rows[0].count === 0;

            // procesar concesionarios
            processConcesionarios(connection, jsonData.concesionarios || [], logs, (err) => {
                if (err) {
                    connection.release();
                    return callback(err, logs);
                }

                // procesar vehículos
                processVehiculos(connection, jsonData.vehiculos || [], updateExisting, logs, (err) => {
                    if (err) {
                        connection.release();
                        return callback(err, logs);
                    }

                    // verificar si hay que crear admin por defecto
                    connection.query('SELECT COUNT(*) as count FROM usuarios WHERE activo = TRUE', (err, rows) => {
                        if (err) {
                            connection.release();
                            return callback(err, logs);
                        }

                        const noUsers = rows[0].count === 0;

                        if (noUsers) {
                            // verificar que exista al menos un concesionario
                            connection.query('SELECT id_concesionario FROM concesionarios WHERE activo = TRUE LIMIT 1', (err, rows) => {
                                if (err || rows.length === 0) {
                                    connection.release();
                                    return callback(err || new Error('No hay concesionarios para asignar al admin'), logs);
                                }

                                const defaultAdmin = {
                                    nombre: "Administrador",
                                    correo: "admin@zapmotors.com",
                                    contrasena: "Abcd1234@",
                                    rol: "admin",
                                    telefono: "600000000",
                                    id_concesionario: rows[0].id_concesionario,
                                    preferencias_accesibilidad: null
                                };

                                createAdmin(connection, defaultAdmin, logs, (err) => {
                                    connection.release();
                                    callback(err, logs);
                                });
                            });
                        } else {
                            connection.release();
                            callback(null, logs);
                        }
                    });
                });
            });
        });
    });
}

function processConcesionarios(connection, concesionarios, logs, callback) {
    let i = 0;
    const next = () => {
        if (i >= concesionarios.length) return callback();

        const c = concesionarios[i++];

        // Verificar si existe por nombre
        connection.query(
            'SELECT id_concesionario FROM concesionarios WHERE nombre = ? AND activo = TRUE',
            [c.nombre],
            (err, rows) => {
                if (err) return callback(err);

                if (rows.length > 0) {
                    logs.concesionarios.skipped.push(c.nombre);
                    next();
                } else {
                    connection.query(
                        'INSERT INTO concesionarios (nombre, ciudad, direccion, telefono_contacto) VALUES (?,?,?,?)',
                        [c.nombre, c.ciudad, c.direccion, c.telefono_contacto],
                        (err) => {
                            if (err) return callback(err);
                            logs.concesionarios.added.push(c.nombre);
                            next();
                        }
                    );
                }
            }
        );
    };
    next();
}

function processVehiculos(connection, vehiculos, updateExisting, logs, callback) {
    let i = 0;
    const next = () => {
        if (i >= vehiculos.length) return callback();

        const v = vehiculos[i++];

        // Verificar si existe por matrícula
        connection.query(
            'SELECT id_vehiculo FROM vehiculos WHERE matricula = ? AND activo = TRUE',
            [v.matricula],
            (err, rows) => {
                if (err) return callback(err);

                if (rows.length > 0) {
                    if (updateExisting) {
                        // Actualizar vehículo existente
                        connection.query(
                            `UPDATE vehiculos SET
                                marca = ?, modelo = ?, ano_matriculacion = ?,
                                numero_plazas = ?, autonomia_km = ?, color = ?,
                                imagen = ?, estado = ?, id_concesionario = ?
                            WHERE matricula = ? AND activo = TRUE`,
                            [v.marca, v.modelo, v.ano_matriculacion, v.numero_plazas,
                             v.autonomia_km, v.color, v.imagen, v.estado,
                             v.id_concesionario, v.matricula],
                            (err) => {
                                if (err) return callback(err);
                                logs.vehiculos.updated.push(`${v.marca} ${v.modelo} (${v.matricula})`);
                                next();
                            }
                        );
                    } else {
                        logs.vehiculos.skipped.push(`${v.marca} ${v.modelo} (${v.matricula})`);
                        next();
                    }
                } else {
                    // Insertar nuevo vehículo
                    connection.query(
                        `INSERT INTO vehiculos
                            (matricula, marca, modelo, ano_matriculacion, numero_plazas,
                             autonomia_km, color, imagen, estado, id_concesionario)
                        VALUES (?,?,?,?,?,?,?,?,?,?)`,
                        [v.matricula, v.marca, v.modelo, v.ano_matriculacion, v.numero_plazas,
                         v.autonomia_km, v.color, v.imagen, v.estado, v.id_concesionario],
                        (err) => {
                            if (err) return callback(err);
                            logs.vehiculos.added.push(`${v.marca} ${v.modelo} (${v.matricula})`);
                            next();
                        }
                    );
                }
            }
        );
    };
    next();
}

function createAdmin(connection, admin, logs, callback) {
    bcrypt.hash(admin.contrasena, 10, (err, hash) => {
        if (err) return callback(err);

        connection.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) VALUES (?,?,?,?,?,?,?)',
            [admin.nombre, admin.correo, hash, admin.rol, admin.telefono, admin.id_concesionario, admin.preferencias_accesibilidad],
            (err) => {
                if (err) return callback(err);
                logs.admin = `Usuario admin creado: ${admin.correo}`;
                callback();
            }
        );
    });
}

module.exports = { loadData };
