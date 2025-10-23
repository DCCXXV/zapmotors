"use strict";
const http = require("http");

const server = http.createServer((req, res) => {});

server.listen(3000, (err) => {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log(`Servidor escuchando en el puerto 3000.`);
    }
});
