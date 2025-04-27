// Instala express primero: npm install express body-parser
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Para leer JSON del cuerpo de la petición
app.use(bodyParser.json());

// Endpoint que recibe y guarda el JSON
app.post('/guardar-json', (req, res) => {
    const datos = req.body;

    const rutaDirectorio = path.join(__dirname, 'videojuego', 'quiz'); // Directorio donde quieres guardar
    const nombreArchivo = `Quiz_${Date.now()}.json`; // Nombre único

    // Asegúrate que el directorio exista
    if (!fs.existsSync(rutaDirectorio)) {
        fs.mkdirSync(rutaDirectorio, { recursive: true });
    }

    // Guarda el archivo
    fs.writeFile(path.join(rutaDirectorio, nombreArchivo), JSON.stringify(datos, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            res.status(500).send('Error al guardar el archivo.');
        } else {
            res.send('Archivo guardado correctamente.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});