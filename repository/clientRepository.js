"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM clientes WHERE id_cliente = ? AND activo = TRUE`,
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

function findByEmail(email, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM clientes WHERE correo = ? AND activo = TRUE`,
                [email],
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
                `SELECT * FROM clientes WHERE activo = TRUE`,
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

function createClient(client, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `INSERT INTO clientes (nombre, correo, activo, fecha_creacion)
                VALUES (?, ?, TRUE, ?)`,
                [client.nombre, client.correo, client.fecha_creacion],
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

function updateClient(id, client, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE clientes
                SET nombre = ?, correo = ?
                WHERE id_cliente = ? AND activo = TRUE`,
                [client.nombre, client.correo, id],
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
                `UPDATE clientes SET activo = FALSE WHERE id_cliente = ?`,
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

module.exports = {
    findById,
    findByEmail,
    getAll,
    createClient,
    updateClient,
    deleteById
};
