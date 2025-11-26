"use strict";

const pool = require("../connection");

function findById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT * FROM reservas WHERE id_reserva = ? AND activo = TRUE`,
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
                `SELECT * FROM reservas WHERE activo = TRUE`,
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

function getByUsuario(idUsuario, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT
                    r.id_reserva,
                    r.id_usuario,
                    r.id_vehiculo,
                    r.id_cliente,
                    DATE_FORMAT(r.fecha_inicio, '%d/%m/%Y %H:%i') AS fecha_inicio_fmt,
                    DATE_FORMAT(r.fecha_fin, '%d/%m/%Y %H:%i') AS fecha_fin_fmt,
                    r.estado,
                    r.kilometros_recorridos,
                    r.incidencias_reportadas,
                    c.nombre AS cliente_nombre,
                    c.correo AS cliente_correo
                FROM reservas r
                LEFT JOIN clientes c ON r.id_cliente = c.id_cliente AND c.activo = TRUE
                WHERE r.id_usuario = ? AND r.activo = TRUE`,
                [idUsuario],
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

function getByCliente(idCliente, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `SELECT
                    r.id_reserva,
                    r.id_usuario,
                    r.id_vehiculo,
                    r.id_cliente,
                    DATE_FORMAT(r.fecha_inicio, '%d/%m/%Y %H:%i') AS fecha_inicio_fmt,
                    DATE_FORMAT(r.fecha_fin, '%d/%m/%Y %H:%i') AS fecha_fin_fmt,
                    r.estado,
                    r.kilometros_recorridos,
                    r.incidencias_reportadas,
                    v.matricula,
                    v.marca,
                    v.modelo
                FROM reservas r
                LEFT JOIN vehiculos v ON r.id_vehiculo = v.id_vehiculo AND v.activo = TRUE
                WHERE r.id_cliente = ? AND r.activo = TRUE`,
                [idCliente],
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

function createReserva(reserva, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `INSERT INTO reservas
                (id_usuario, id_vehiculo, id_cliente, fecha_inicio, fecha_fin, estado, activo)
                VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
                [
                    reserva.id_usuario,
                    reserva.id_vehiculo,
                    reserva.id_cliente,
                    reserva.fecha_inicio,
                    reserva.fecha_fin,
                    reserva.estado || 'activa'
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

function updateReserva(id, reserva, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE reservas
                SET fecha_fin = ?, estado = ?, kilometros_recorridos = ?, incidencias_reportadas = ?
                WHERE id_reserva = ? AND activo = TRUE`,
                [
                    reserva.fecha_fin,
                    reserva.estado,
                    reserva.kilometros_recorridos,
                    reserva.incidencias_reportadas,
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

function deleteById(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(
                `UPDATE reservas SET activo = FALSE WHERE id_reserva = ?`,
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
    getAll,
    getByUsuario,
    getByCliente,
    createReserva,
    updateReserva,
    deleteById
};
