const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
