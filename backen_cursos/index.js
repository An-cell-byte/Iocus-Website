const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(
  cors({
    origin: "http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io",
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
  database: "dbreto",
});

db.connect((err) => {
  if (err) console.error("Error conectando MySQL:", err);
  else console.log("¡Conectado a MySQL!");
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = /pdf|png|jpe?g|mp4|zip/i.test(path.extname(file.originalname));
    cb(null, ok);
  },
});


app.get("/cursos/usuario/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM capacitaciones WHERE id_capacitador = ?",
    [id],
    (err, r) => {
      if (err) return res.status(500).send("Error en la base de datos");
      res.json(r);
    }
  );
});

app.get("/usario/:user/:password", (req, res) => {
  const { user, password } = req.params;
  db.query(
    "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
    [user, password],
    (err, r) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (!r.length) return res.status(404).send("Usuario no encontrado");
      res.json(r[0]);
    }
  );
});

app.get("/cursos/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM capacitaciones WHERE id = ?", [id], (err, rCurso) => {
    if (err) return res.status(500).send("Error en la base de datos");
    if (!rCurso.length) return res.status(404).send("Curso no encontrado");
    db.query(
      "SELECT nombre_original, ruta FROM archivos WHERE curso_id = ?",
      [id],
      (e, rArch) => {
        if (e) return res.status(500).send("Error en la base de datos");
        const curso = rCurso[0];
        curso.material = rArch;
        res.json(curso);
      }
    );
  });
});

app.post("/cursos/:id/archivos", upload.single("archivo"), (req, res) => {
  const idCurso = req.params.id;
  const archivo = req.file;
  if (!archivo) return res.status(400).json({ error: "Archivo requerido" });
  db.query(
    "INSERT INTO archivos (curso_id, nombre_original, ruta) VALUES (?,?,?)",
    [idCurso, archivo.originalname, archivo.filename],
    (err) => {
      if (err) return res.status(500).send("Error al guardar archivo");
      res.json({ ok: true, ruta: `/uploads/${archivo.filename}` });
    }
  );
});

app.use("/uploads", express.static("uploads"));

app.get("/api/capacitacioness", (_, res) => {
  db.query("SELECT * FROM capacitaciones", (err, r) => {
    if (err) res.status(500).send("Error en el servidor");
    else res.json(r);
  });
});

app.get("/api/usuarios/:id/correo", (req, res) => {
  const id = req.params.id;
  db.query("SELECT correo FROM usuarios WHERE correo = ?", [id], (err, r) => {
    if (err) return res.status(500).send("Error en la base de datos");
    if (!r.length) return res.status(404).send("Usuario no encontrado");
    res.json({ correo: r[0].correo });
  });
});

app.get("/api/usuarios/:id/contrasena", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT contrasena FROM usuarios WHERE contraseña = ?",
    [id],
    (err, r) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (!r.length) return res.status(404).send("Usuario no encontrado");
      res.json({ contrasena: r[0].contrasena });
    }
  );
});

app.get("/api/inscribir/:id_usuario/:id_capacitacion", (req, res) => {
  const { id_usuario, id_capacitacion } = req.params;
  db.query(
    "INSERT INTO inscripciones (id_alumno, id_capacitacion) VALUES (?,?)",
    [id_usuario, id_capacitacion],
    (err) => {
      if (err) return res.status(500).send("Error en la base de datos");
      res.json({ mensaje: "Inscripción exitosa" });
    }
  );
});

app.get("/cursos/alumnos/:id", (req, res) => {
  const id = req.params.id;
  db.query("CALL sp_cursos_por_alumno(?)", [id], (err, r) => {
    if (err) return res.status(500).send("Error en la base de datos");
    res.json(r[0]);
  });
});

app.post("/api/capacitaciones/:idCap/preguntas", async (req, res) => {
  const { idCap } = req.params; // viene en la URL
  const preguntas = req.body; // viene en el JSON

  // 1) Validación rápida
  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ error: "Manda al menos una pregunta 🥲" });
  }

  // 2) Pasamos la conexión a modo promesa para usar async/await
  const dbP = db.promise();

  try {
    // 🔒  Empezamos transacción (todo o nada)
    await dbP.query("START TRANSACTION");

    // 3) Recorremos las preguntas del JSON
    for (const p of preguntas) {
      const { pregunta, respuestas, correctAnswerIndex } = p;

      if (!pregunta || !Array.isArray(respuestas) || respuestas.length === 0) {
        throw new Error("Formato de pregunta inválido");
      }

      // Texto de la opción correcta
      const textoCorrecto = respuestas[correctAnswerIndex];

      // 3-a) Guardamos la fila en la tabla
      await dbP.query(
        `INSERT INTO preguntas
           (id_capacitacion, pregunta, respuestas, respuesta_correcta)
         VALUES (?,?,?,?)`,
        [idCap, pregunta, JSON.stringify(respuestas), textoCorrecto]
      );
    }

    // ✅  Todo salió OK
    await dbP.query("COMMIT");
    res.status(201).json({ msg: "Preguntas guardadas 👌" });
  } catch (err) {
    // ⛔  Algo falló → revertimos
    await dbP.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "No se pudieron guardar las preguntas 😖" });
  }
});

app.delete("/api/quiz/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM preguntas WHERE id_capacitacion = ?", [id], (err) => {
    if (err) return res.status(500).send("Error en la base de datos");
    res.json({ mensaje: "Quizz Eliminado" });
  });
});

app.delete("/api/quiz/:idcapacitacion/:nombre", (req, res) => {
  const { idcapacitacion, nombre } = req.params;
  db.query(
    "DELETE FROM preguntas WHERE id_capacitacion = ? AND nombre = ?",
    [idcapacitacion, nombre],
    (err) => {
      if (err) return res.status(500).send("Error en la base de datos");
      res.json({ mensaje: "Pregunta Elimnada" });
    }
  );
});

app.get("/api/usuarios/tipo/:correo", (req, res) => {
  const correo = decodeURIComponent(req.params.correo);
  db.query(
    "SELECT obtenerTipoPorCorreo(?) AS tipo_usuario",
    [correo],
    (err, r) => {
      if (err) return res.status(500).send("Error en la base de datos");
      const tipo = r[0]?.tipo_usuario;
      if (!tipo) return res.status(404).send("Correo no encontrado");
      res.json({ tipo_usuario: tipo });
    }
  );
});
//xdd

app.get("/quiz/:id_capacitacion", (req, res) => {
  const id_capacitacion = req.params.id_capacitacion;
  db.query(
    "SELECT * FROM preguntas WHERE id_capacitacion = ?",
    [id_capacitacion],
    (err, r) => {
      if (err) return res.status(500).send("Error en la base de datos");
      if (!r.length) return res.status(404).send("Preguntas no encontradas");
      res.json(r);
    }
  );
});

app.put("/api/capacitaciones", (req, res) => {
  const { titulo, descripcion, id_capacitador, fecha } = req.body;
  if (!titulo || !descripcion || !id_capacitador || !fecha)
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  const sql =
    "INSERT INTO capacitaciones (titulo,descripcion,id_capacitador,fecha) VALUES (?,?,?,?)";
  db.query(sql, [titulo, descripcion, id_capacitador, fecha], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({
      mensaje: "Capacitación agregada",
      id_insertado: result.insertId,
    });
  });
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
