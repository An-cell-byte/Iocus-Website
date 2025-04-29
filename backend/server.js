// database backend requierements
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
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
    allowedHeaders: ['Content-Type', 'Authorization']
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


app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Session config
app.get('/restricted', verificarToken, (req, res) => {
  res.send(`¡Área restringida! Bienvenido ${req.user.correo}, tipo: ${req.user.tipo}.`);
});

app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
      return res.status(400).json({ message: "Favor de llenar todos los campos." });
  }

  const query = "SELECT correo, contrasena, tipo FROM usuarios WHERE correo = ?";
  db.query(query, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error de base de datos" });
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ correo: user.correo, tipo: user.tipo }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, message: "Inicio de sesión exitoso", token });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
