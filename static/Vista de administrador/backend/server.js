// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 8000;



// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Ruta para subir archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
  res.send('Archivo subido correctamente.');
});

// Ruta para obtener lista de archivos
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).json({ error: 'Error al leer archivos' });
    res.json(files);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
