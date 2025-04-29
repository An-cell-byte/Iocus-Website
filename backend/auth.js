'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./database'); // Conexión a la base de datos

const router = express.Router();

// Configuración de la base de datos (ejemplo)
const username = 'admin';
const password = 'admin123';

// Crear un nuevo usuario (solo para propósitos de demostración, no se recomienda en producción)
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  const query = 'INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)';
  db.query(query, [username, hash], (err, result) => {
    if (err) throw err;
    console.log('Usuario creado:', result);
  });
});

// Configuración de sesiones
router.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

// Función para autenticar usuarios
async function authenticate(username, password, callback) {
  try {
    // Buscar el usuario en la base de datos
    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(query, [username], async (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null); // Usuario no encontrado

      const user = results[0];
      // Comparar la contraseña ingresada con el hash almacenado
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        callback(null, user); // Usuario autenticado
      } else {
        callback(null, null); // Contraseña incorrecta
      }
    });
  } catch (error) {
    callback(error);
  }
}

// Middleware para restringir acceso
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Access denied');
  }
}

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  authenticate(username, password, (err, user) => {
    if (err) return res.status(500).send('Error interno del servidor');
    if (user) {
      req.session.user = user; // Guardar el usuario en la sesión
      res.status(200).send({ success: true, message: 'Autenticación exitosa' });
    } else {
      res.status(401).send({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).send({ success: true, message: 'Sesión cerrada' });
  });
});

// Ruta protegida (opcional)
router.get('/restricted', restrict, (req, res) => {
  res.send('Área restringida');
});

module.exports = router;