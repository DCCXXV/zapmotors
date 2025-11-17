"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM vehiculos WHERE id_vehiculo = ?`, [id], function (err, rows) {
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

function findAll(callback) {
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

module.exports = { findById, findAll };