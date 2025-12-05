const pool = require("./connection");
const bcrypt = require("bcrypt");

function loadData(jsonData, callback) {
    pool.getConnection((err, connection) => {
        if (err) return callback(err);

        connection.query('SET FOREIGN_KEY_CHECKS = 0', () => {
            connection.query('TRUNCATE reservas', () => {
                connection.query('TRUNCATE vehiculos', () => {
                    connection.query('TRUNCATE usuarios', () => {
                        connection.query('TRUNCATE clientes', () => {
                            connection.query('TRUNCATE concesionarios', () => {
                                connection.query('SET FOREIGN_KEY_CHECKS = 1', () => {
                                    insertAll(connection, jsonData, callback);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function insertAll(connection, data, callback) {
    const insert = (items, sql, getParams, done) => {
        let i = 0;
        const next = () => {
            if (i >= items.length) return done();
            const params = getParams(items[i++]);
            if (params instanceof Promise) {
                params.then(p => connection.query(sql, p, err => err ? done(err) : next()));
            } else {
                connection.query(sql, params, err => err ? done(err) : next());
            }
        };
        next();
    };

    insert(data.concesionarios || [],
        'INSERT INTO concesionarios (nombre, ciudad, direccion, telefono_contacto) VALUES (?,?,?,?)',
        c => [c.nombre, c.ciudad, c.direccion, c.telefono_contacto],
        err => err ? (connection.release(), callback(err)) :

    insert(data.vehiculos || [],
        'INSERT INTO vehiculos (matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, estado, id_concesionario) VALUES (?,?,?,?,?,?,?,?,?,?)',
        v => [v.matricula, v.marca, v.modelo, v.ano_matriculacion, v.numero_plazas, v.autonomia_km, v.color, v.imagen, v.estado, v.id_concesionario],
        err => err ? (connection.release(), callback(err)) :

    insert(data.usuarios || [],
        'INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario, preferencias_accesibilidad) VALUES (?,?,?,?,?,?,?)',
        u => bcrypt.hash(u.contrasena, 10).then(h => [u.nombre, u.correo, h, u.rol, u.telefono, u.id_concesionario, u.preferencias_accesibilidad]),
        err => err ? (connection.release(), callback(err)) :

    insert(data.clientes || [],
        'INSERT INTO clientes (nombre, correo, fecha_creacion) VALUES (?,?,?)',
        c => [c.nombre, c.correo, c.fecha_creacion],
        err => err ? (connection.release(), callback(err)) :

    insert(data.reservas || [],
        'INSERT INTO reservas (id_usuario, id_vehiculo, id_cliente, fecha_inicio, fecha_fin, estado, kilometros_recorridos, incidencias_reportadas) VALUES (?,?,?,?,?,?,?,?)',
        r => [r.id_usuario, r.id_vehiculo, r.id_cliente, r.fecha_inicio, r.fecha_fin, r.estado, r.kilometros_recorridos, r.incidencias_reportadas],
        err => { connection.release(); callback(err || null); }
    )))));
}

module.exports = { loadData };
