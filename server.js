const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const path = require("path");

const app = express();
const port = 3000;

const pool = require("./connection");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/bootstrap-icons",
    express.static("node_modules/bootstrap-icons/font")
);

const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "zap"
});

app.use(
    session({
        secret: "VhQak??mj7",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store: sessionStore
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

const authMiddleware = (req, res, next) => {
    if (res.locals.user == null) {
        return res.status(401).render("error", {
            errorCode: 401,
            errorMessage: "No autorizado"
        });
    }
    next();
};

const jsonMiddleware = (req, res, next) => {
    if (req.path === '/setup' || req.path === '/setup/load' || req.path === '/setup/check') {
        return next();
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        } else {
            connection.query(
                `SELECT COUNT(*) as count FROM concesionarios WHERE activo = TRUE`,
                function (err, rows) {
                    connection.release();
                    if (err) {
                        return next(err);
                    } else if (rows[0].count === 0) {
                        return res.redirect("/setup");
                    } else {
                        return next();
                    }
                }
            );
        }
    });
};

app.use(jsonMiddleware);

app.use("/admin", authMiddleware, require("./routes/admin"));
app.use("/empleado", authMiddleware, require("./routes/empleado"));
app.use("/reservas", authMiddleware, require("./routes/reservas"));
app.use("/vehiculos", require("./routes/vehiculos"));

app.use("/api/vehiculos", require("./routes/api/vehiculos"));
app.use("/api/usuarios", require("./routes/api/usuarios"));
app.use("/api/concesionarios", require("./routes/api/concesionarios"));
app.use("/api/reservas", require("./routes/api/reservas"));

app.use("/", require("./routes/index"));

app.use((req, res) => {
    res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Página no encontrada"
    });
});

app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("error", {
        errorCode: 500,
        errorMessage: "Error interno del servidor"
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
