// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 8003;



// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de archivo no permitido'));
  }
});

// Middleware
app.use(cors({
  origin: 'http://zwwk4ocg8k0ko4g08wkgoo00.4.172.252.35.sslip.io', 
  methods: ['GET', 'POST'],
  
}));

app.use('/uploads', express.static('uploads'));

// Ruta para subir archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
  upload.single('archivo')(req, res, function (err) {
    if (err) return res.status(400).send(err.message);
    res.send('Archivo subido correctamente.');
  });
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
