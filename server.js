const express = require("express");
var session = require("express-session");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    "/bootstrap-icons",
    express.static("node_modules/bootstrap-icons/font")
);

app.use(
    session({
        secret: "VhQak??mj7",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

const authMiddleware = (req, res, next) => {
    if (res.locals.user == null) {
        return res.status(401).render("401");
    }
    next();
};

app.use("/admin", authMiddleware, require("./routes/admin"));
app.use("/empleado", authMiddleware, require("./routes/empleado"));
app.use("/reservar", authMiddleware, require("./routes/reservar"));
app.use("/vehiculos", require("./routes/vehiculos"));

app.use("/api/vehiculos", require("./routes/api/vehiculos"));
app.use("/api/usuarios", require("./routes/api/usuarios"));
app.use("/api/concesionarios", require("./routes/api/concesionarios"));
app.use("/api/reservas", require("./routes/api/reservas"));

app.use("/", require("./routes/index"));

// TODO: página de errores dinámicos ->
app.use((req, res) => {
    res.status(404).render("404");
});

app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("500");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
