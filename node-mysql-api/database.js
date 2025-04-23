// database backend requierements
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcrypt')
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io"], // Allow requests only from your frontend
    methods: ["POST", "GET"],
    credentials: true, 
    allowedHeaders: ["Content-Type"]
}));

// Session config
app.use(session({
  secret: "cookiesuser",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true si usas HTTPS
    maxAge: 1000 * 60 * 60
  }
}));

// SQL DB Connection
const pool = mysql.createConnection({
    host: "4.172.252.35",
    user: "root",
    password: "Ht1EHtaeYopyicq9MeXa1CDTaqz0lXzEh0F7ZIifA69tPN8600YzfrtX5FfzsDZN",
    database: "dbreto",
    port: 3307,
    connectionLimit: 10
})

pool.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

// limite de intentos
const limiter = rateLimit({
    windowMs: 7 * 60 * 1000, 
    max: 5,
    message: { success: false, message: "Demasiados intentos fallidos. Intenta otra vez en 7 minutos." }
});


app.post("/verify", limiter, (req, res) => {
  const { correo, contrasena } = req.body;
  console.log("Solicitud recibida:", req.body);

  if (!correo || !contrasena) {
      return res.status(400).json({ message: "Favor de llenar todos los campos." });
  }

  const query = "SELECT contrasena, tipo FROM usuarios WHERE correo = ?";

  pool.query(query, [correo], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Error al acceder a la base de datos." });
      }

      if (results.length === 0) {
          return res.status(401).json({ success: false, message: "Correo o Contraseña Inválida." });
      }

      const hashedPassword = results[0].contrasena;
      const tipoUsuario = results[0].tipo;

      bcrypt.compare(contrasena, hashedPassword, (err, match) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, message: "Error verificando contraseña." });
          }

          if (match) {
              req.session.user = { correo, tipo: tipoUsuario };

              let redirectPath;
              switch (tipoUsuario) {
                  case "usuario":
                      redirectPath = "/vista-estudiante/coursescreen.html";
                      break;
                  case "capacitador":
                      redirectPath = "/vista-administrador/vistaAdministrador.html";
                      break;
                  case "supervisor":
                      redirectPath = "/";
                      break;
                  default:
                      return res.status(403).json({ success: false, message: "Usuario no registrado." });
              }

              return res.redirect(`http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io${redirectPath}`);
          } else {
              res.status(401).json({ success: false, message: "Correo o Contraseña Inválida." });
          }
      });
  });
});

app.get("/", (req, res) => {
  const host = req.headers.host;
  if (host.startsWith("inicio.")) {
    // Ruta protegida
    if (req.session.user) {
      res.sendFile(path.join(__dirname, "/vista-estudiante/coursescreen.html"));
    } else {
      res.redirect("http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io");
    }
  } else {
    // Ruta pública
    res.sendFile(path.join(__dirname, "http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io"));
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API corriendo en puerto ${PORT}`);
});