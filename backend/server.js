// database backend requierements
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io"],
    methods: ["POST", "GET"],
    credentials: true, 
    allowedHeaders: ["Content-Type"]
}));

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ error: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = userData;
    next();
  });
}
// Session config

app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
      return res.status(400).json({ message: "Favor de llenar todos los campos." });
  }

  const query = "SELECT contrasena, tipo FROM usuarios WHERE correo = ?";
  db.query(query, [correo], async (err, results) => {
      if (err) {
          console.error('Error en la consulta', err);
          return res.status(500).json({ error: "Error al acceder a la base de datos." });
      }

      if (results.length === 0) {
          return res.status(401).json({ error: "Correo o Contraseña Inválida." });
      }

      const hashedPassword = results[0].contrasena;
      const tipoUsuario = results[0].tipo;

      const match = await bcrypt.compare(contrasena, hashedPassword);
    if (!match) {
      return res.status(401).json({ error: "Correo o Contraseña Inválida." });
    }

    const token = jwt.sign({ correo: usuario.correo, tipo: usuario.tipo }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      tipoUsuario,
      token

     });
  });
});

app.get('/api/protegido', verificarToken, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
