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
    origin: ["chttp://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io"], // Allow requests only from your frontend
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


app.post("/verify", (req, res) => {
  const { correo, contrasena } = req.body;
  console.log("Received request:", req.body);

  if (!correo || !contrasena) {
      return res.status(400).json({ message: "Favor de llenar todos los campos." });
  }

  const query = "SELECT contrasena, tipo FROM usuarios WHERE correo = ?";

  pool.query(query, [correo], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Error en Database." });
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
                      redirectPath = "/coursescreen.html";
                      break;
                  case "capacitador":
                      redirectPath = "/curso_tecnicos.html";
                      break;
                  case "supervisor":
                      redirectPath = "/vistaAdministrador.html";
                      break;
                  default:
                      return res.status(403).json({ success: false, message: "Tipo de usuario no permitido." });
              }

              return res.redirect('http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io${redirectPath}');
          } else {
              res.status(401).json({ success: false, message: "Correo o Contraseña Inválida." });
          }
      });
  });
});


app.use("/verify", limiter);

// ruta principal para capacitatec.whirlpool.com (index.html)
app.get("/", (req, res) => {
    const host = req.headers.host;
    if (host.startsWith("inicio.")) {
      // Ruta protegida (inicio.capacitatec.whirlpool.com)
      if (req.session.user) {
        res.sendFile(path.join(__dirname, "../cursosInicio/coursescreen.html"));
      } else {
        res.redirect("capacitatec.whirlpool.com");
      }
    } else {
      // Ruta pública
      res.sendFile(path.join(__dirname, "../cursosSitio/index.html"));
    }
  });

//Form Submission
app.post("/verify", (req, res) => {
    const { correo, contrasena } = req.body;
    console.log("Received request:", req.body);
    
    if (!correo || !contrasena) {
        return res.status(400).json({ message: "Favor de llenar todos los campos." });
    }

    const query = "SELECT contrasena FROM usuarios WHERE correo = ?";
    
    pool.query(query, [correo], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Error en Database." });
        }
    
        if (results.length === 0) {
          return res.status(401).json({ success: false, message: "Correo o Contraseña Inválida." });
        }
    
        bcrypt.compare(contrasena, results[0].contrasena, (err, match) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Error verificando contraseña." });
          }
    
          if (match) {
            req.session.user = { correo };
            return res.redirect("inicio.capacitatec.whirlpool.com");
          } else {
            res.status(401).json({ success: false, message: "Correo o Contraseña Inválida." });
          }
        });
      });
    });

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Servidor
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
    console.log('SERVER STARTING ON ${PORT}')
})