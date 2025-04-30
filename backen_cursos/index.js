const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: "http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io", // tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
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

// Sirve la carpeta de documentación en /docs
app.use(
  "/docs",
  express.static(path.join(__dirname, "../my-documentation/build"))
);

// Ruta raíz del sitio
app.get("/", (req, res) => {
  res.redirect("/docs"); // o res.send('Bienvenido a mi app');
});

app.get("/cursos/usuario/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM capacitaciones WHERE id_capacitador = ?",
    [id],
    (err, resultados) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error en la base de datos");
      }
      res.json(resultados);
    }
  );
});

app.get("/usario/:user/:password", (req, res) => {
  const { user, password } = req.params;
  db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
    [user, password],
    (err, resultados) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error en la base de datos");
      }
      if (resultados.length === 0) {
        return res
          .status(404)
          .send("Usuario no encontrado o contraseña incorrecta");
      }
      res.json(resultados[0]);
    }
  );
});

// obtiene todos los cursos
app.get("/api/capacitacioness", (req, res) => {
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

app.get("/api/inscribir/:id_usuario/:id_capacitacion", (req, res) => {
  const { id_usuario, id_capacitacion } = req.params;
  db.query(
    "INSERT INTO inscripciones (id_alumno, id_capacitacion) VALUES (?, ?);",
    [id_usuario, id_capacitacion],
    (err, resultados) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error en la base de datos");
      }
      res.json({ mensaje: "Inscripción exitosa" });
    }
  );
});

app.get("/cursos/alumnos/:id", (req, res) => {
  const id = req.params.id;
  db.query("CALL sp_cursos_por_alumno(?)", [id], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error en la base de datos");
    }
    res.json(resultados[0]);
  });
});

// obtiene tipos de usuario
app.get("/api/usuarios/tipo/:correo", (req, res) => {
  const correo = req.params.correo;

  // Evitar errores con correos codificados (como los que llevan "@")
  const correoDecodificado = decodeURIComponent(correo);

  db.query(
    "SELECT obtenerTipoPorCorreo(?) AS tipo_usuario",
    [correoDecodificado],
    (err, resultados) => {
      if (err) {
        console.error("Error al ejecutar función:", err);
        return res.status(500).send("Error en la base de datos");
      }

      const tipo = resultados[0]?.tipo_usuario;

      if (!tipo) {
        return res.status(404).send("Correo no encontrado o tipo no definido");
      }

      res.json({ tipo_usuario: tipo });
    }
  );
});

app.put("/api/capacitaciones", (req, res) => {
  const { titulo, descripcion, id_capacitador, fecha } = req.body;

  if (!titulo || !descripcion || !id_capacitador || !fecha) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Consulta SQL para insertar
  const sql = `
    INSERT INTO capacitaciones (titulo, descripcion, id_capacitador, fecha)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descripcion, id_capacitador, fecha], (err, result) => {
    if (err) {
      console.error("Error al insertar capacitación:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    res.status(201).json({
      mensaje: "Capacitación agregada exitosamente",
      id_insertado: result.insertId,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
