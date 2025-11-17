"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM usuarios WHERE ID = ?`, [id], function (err, rows) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
};

function findByEmail(email, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM usuarios WHERE correo = ?`, [email], function (err, rows) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
};

function createUser(user, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`INSERT INTO 
                usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user.nombre, user.correo, user.contrasena, user.rol, user.telefono, user.id_concesionario, user.preferencias_accesibilidad], function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                });
        }
    });
};

module.exports = { findById, findByEmail, createUser };