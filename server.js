const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons/font'));

app.get("/", (req, res) => {
    res.render("index");
});

const reservas = require("./routes/reservas");
app.use("/reservas", reservas);

const vehiculos = require("./routes/vehiculos");
app.use("/vehiculos", vehiculos);

app.get("/contacto", (req, res) => {
    res.render("contacto");
});

app.get("/registro", (req, res) => {
    res.render("registro");
});

app.use((req, res) => {
    res.status(404).render("404");
});

app.use((req, res) => {
    res.status(400).render("400");
});

app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err.stack);
    res.status(500).render("500");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
