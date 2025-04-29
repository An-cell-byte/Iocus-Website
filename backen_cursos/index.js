const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const db = mysql.createConnection({
  host: "4.172.252.35",
  user: "root",
  password: "Ht1EHtaeYopyicq9MeXa1CDTaqz0lXzEh0F7ZIifA69tPN8600YzfrtX5FfzsDZN",
  port: 3307,
  database: "dbreto", // pon aquí el nombre real de tu base de datos
});

// verifica la conexión
db.connect((err) => {
  if (err) {
    console.error("Error conectando MySQL:", err);
  } else {
    console.log("¡Conectado a MySQL!");
  }
});

// obtiene todos los cursos
app.get("/api/capacitaciones", (req, res) => {
  db.query("SELECT * FROM capacitaciones", (err, resultados) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error en el servidor");
    } else {
      res.json(resultados);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
