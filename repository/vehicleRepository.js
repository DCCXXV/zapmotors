"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM vehiculos WHERE id_vehiculo = ? AND activo = TRUE`,
                [id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        callback(null, rows[0]);
                    }
                }
            );
        }
    });
}

function getAll(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM vehiculos WHERE activo = TRUE`,
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

function findAllByIdConcessionaire(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM vehiculos WHERE id_concesionario = ? and estado = "disponible" AND activo = TRUE`,
                [id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

function createVehicle(data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `INSERT INTO vehiculos
                (matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, estado, id_concesionario, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
                [
                    data.licensePlate,
                    data.brand,
                    data.model,
                    data.registrationYear,
                    data.seatsNumber,
                    data.rangeKm,
                    data.color,
                    data.image,
                    data.status,
                    data.dealershipId,
                ],
                function (err, result) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                }
            );
        }
    });
}

function deleteById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE vehiculos SET activo = FALSE WHERE id_vehiculo = ?`,
                [id],
                function (err, result) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                }
            );
        }
    });
}

function updateVehicle(id, data, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE vehiculos
                SET matricula = ?, marca = ?, modelo = ?, ano_matriculacion = ?,
                    numero_plazas = ?, autonomia_km = ?, color = ?, estado = ?
                WHERE id_vehiculo = ? AND activo = TRUE`,
                [
                    data.licensePlate,
                    data.brand,
                    data.model,
                    data.registrationYear,
                    data.seatsNumber,
                    data.rangeKm,
                    data.color,
                    data.status,
                    id,
                ],
                function (err, result) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                }
            );
        }
    });
}

function findByMinAutonomy(minAutonomy, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT *
                 FROM vehiculos
                 WHERE autonomia_km > ?
                 AND activo = TRUE`,
                [minAutonomy],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

function findBySeatsNumber(seatsNumber, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT *
                 FROM vehiculos
                 WHERE numero_plazas = ?
                 AND activo = TRUE`,
                [seatsNumber],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

function findByColor(color, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT *
                 FROM vehiculos
                 WHERE LOWER(color) = LOWER(?)
                 AND activo = TRUE`,
                [color],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

function findWithFilters({ autonomia, plazas, color }, callback) {
    pool.getConnection(function (err, connection) {
        if (err) return callback(err);

        let sql = `SELECT * FROM vehiculos WHERE activo = TRUE AND id_concesionario = 1`;
        const params = [];

        if (autonomia) {
            sql += ` AND autonomia_km >= ?`;
            params.push(autonomia);
        }

        if (plazas) {
            sql += ` AND numero_plazas = ?`;
            params.push(plazas);
        }

        if (color) {
            sql += ` AND LOWER(color) = LOWER(?)`;
            params.push(color);
        }

        connection.query(sql, params, function (err, rows) {
            connection.release();
            if (err) return callback(err);
            callback(null, rows);
        });
    });
}

module.exports = {
    findById,
    getAll,
    findAllByIdConcessionaire,
    createVehicle,
    deleteById,
    updateVehicle,
    findByMinAutonomy,
    findBySeatsNumber,
    findByColor,
    findWithFilters,
};
