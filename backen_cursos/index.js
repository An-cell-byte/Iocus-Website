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

// obtiene correo del usuario
app.get("/api/usuarios/:id/correo", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT correo FROM usuarios WHERE correo = ?",
    [id],
    (err, resultados) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (resultados.length === 0)
        return res.status(404).send("Usuario no encontrado");

      res.json({ correo: resultados[0].correo });
    }
  );
});

// obtiene contraseña del usuario
app.get("/api/usuarios/:id/contrasena", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT contrasena FROM usuarios WHERE contraseña = ?",
    [id],
    (err, resultados) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (resultados.length === 0)
        return res.status(404).send("Usuario no encontrado");

      res.json({ contrasena: resultados[0].contrasena });
    }
  );
});

// obtiene tipos de usuario
app.get("/api/usuarios/:id/tipo", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT tipo FROM usuarios WHERE tipo = ?",
    [id],
    (err, resultados) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (resultados.length === 0)
        return res.status(404).send("Usuario no encontrado");

      res.json({ tipo: resultados[0].tipo });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
