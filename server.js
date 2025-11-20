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

const admin = require("./routes/admin");
app.use("/admin", admin);

const reservas = require("./routes/reservas");
app.use("/reservas", authMiddleware, reservas);

const vehiculos = require("./routes/vehiculos");
app.use("/vehiculos", vehiculos);

const indice = require("./routes/index");
app.use("/", indice);

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
