"use strict";
const fs = require("fs");
const path = require("path");

function router(req, res) {
    const basePath = path.join(__dirname, "public");
    let filePath = "";

    console.log(`Petición recibida: ${req.method} ${req.url}`);

    const cleanUrl = req.url.split("?")[0];

    switch (cleanUrl) {
        case "/":
            filePath = path.join(basePath, "index.html");
            break;
        default:
            filePath = path.join(basePath, cleanUrl);
    }

    if (!filePath.startsWith(basePath)) {
        res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>403 - Acceso prohibido</h1>");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            console.warn(`Archivo no encontrado: ${filePath}`);
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<h1>404 - Página no encontrada</h1>");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = getContentType(ext);

        res.writeHead(200, { "Content-Type": contentType });

        const readStream = fs.createReadStream(filePath);

        readStream.on("error", (streamErr) => {
            console.error("Error al leer:", streamErr);
            res.writeHead(500, {
                "Content-Type": "text/html; charset=utf-8",
            });
            res.end("<h1>500 - Error interno del servidor</h1>");
        });

        readStream.pipe(res);
    });
}

function getContentType(ext) {
    const types = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".pdf": "application/pdf",
        ".ico": "image/x-icon",
    };
    return types[ext] || "application/octet-stream";
}

module.exports = router;
