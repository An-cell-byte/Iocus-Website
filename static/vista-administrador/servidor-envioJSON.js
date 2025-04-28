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

app.get('/quiz', (req, res) => {
    const rutaDirectorio = path.join(__dirname, 'videojuego'); // Ajusta esta ruta si es necesario
    fs.readdir(rutaDirectorio, (err, archivos) => {
        if (err) {
            return res.status(500).send('Error leyendo archivos');
        }
        // Filtramos solo los archivos .json
        const archivosJson = archivos.filter(archivo => archivo.endsWith('.json'));
        res.json(archivosJson); // Devolvemos la lista de archivos .json
    });
});

app.get('/descargar/:archivo', (req, res) => {
    const nombreArchivo = req.params.archivo;
    const rutaArchivo = path.join(__dirname, 'videojuego', 'quiz', nombreArchivo);

    // Verificamos si el archivo existe
    fs.access(rutaArchivo, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Archivo no encontrado');
        }
        res.sendFile(rutaArchivo); // Enviamos el archivo como respuesta
    });
});
