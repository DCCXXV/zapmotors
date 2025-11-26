"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM vehiculos WHERE id_vehiculo = ?`,
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

function getAll(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM vehiculos`, function (err, rows) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
}

function findAllByIdConcessionaire(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM vehiculos WHERE id_concesionario = ? and estado = "disponible"`,
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
                (matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, estado, id_concesionario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    data.concessionaireId,
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
                `DELETE FROM vehiculos WHERE id_vehiculo = ?`,
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
                WHERE id_vehiculo = ?`,
                [
                    data.licensePlate,
                    data.brand,
                    data.model,
                    data.registrationYear,
                    data.seatsNumber,
                    data.rangeKm,
                    data.color,
                    data.status,
                    id
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

module.exports = { findById, getAll, findAllByIdConcessionaire, createVehicle, deleteById, updateVehicle };
