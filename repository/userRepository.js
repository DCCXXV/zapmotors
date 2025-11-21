"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM usuarios WHERE id_usuario = ?`,
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

function findByEmail(email, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM usuarios WHERE correo = ?`,
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

function findUser(email, password, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM usuarios WHERE correo = ? and contrasena = ?`,
                [email, password],
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

function createUser(user, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `INSERT INTO 
                usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    user.nombre,
                    user.correo,
                    user.contrasena,
                    user.rol,
                    user.telefono,
                    user.id_concesionario,
                    user.preferencias_accesibilidad,
                ],
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

function getUsers(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(`SELECT * FROM usuarios`, function (err, rows) {
                connection.release();
                if (err) {
                    callback(err);
                } else if (rows.length === 0) {
                    callback(null, null);
                } else {
                    callback(null, rows);
                }
            });
        }
    });
}

function deleteById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `DELETE FROM usuarios where id_usuario = ?`,
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

function updateRolUser(id, rol, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE usuarios SET rol = ? WHERE id_usuario = ?`,
                [rol, id],
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

function getReservesById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT
                    id_reserva,
                    id_usuario,
                    id_vehiculo,
                    DATE_FORMAT(fecha_inicio, '%d/%m/%Y %H:%i') AS fecha_inicio_fmt,
                    DATE_FORMAT(fecha_fin, '%d/%m/%Y %H:%i') AS fecha_fin_fmt,
                    estado FROM reservas WHERE id_usuario = ?`,
                [id],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        callback(null, rows);
                    }
                }
            );
        }
    });
}

module.exports = {
    findById,
    findByEmail,
    findUser,
    createUser,
    getUsers,
    deleteById,
    updateRolUser,
    getReservesById,
};
