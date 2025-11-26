"user strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM concesionarios WHERE id_concesionario = ?`,
                [id],
                (err, rows) => {
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

function createDealership(dealership, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `INSERT INTO
                concesionarios (nombre, ciudad, direccion, telefono_contacto)
                VALUES (?, ?, ?, ?)`,
                [
                    dealership.nombre,
                    dealership.ciudad,
                    dealership.direccion,
                    dealership.telefono_contacto,
                ],
                (err, rows) => {
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

function getDealerships(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM concesionarios`, (err, rows) => {
                connection.release();
                if (err) {
                    callback(err);
                } else if (rows.lenght == 0) {
                    callback(null, null);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
}

function deleteById(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `DELETE FROM concesionarios WHERE id_concesionario = ?`,
                [id],
                (err, result) => {
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

module.exports = {
    findById,
    createDealership,
    getDealerships,
    deleteById,
};
