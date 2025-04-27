const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para obtener el archivo JSON dinámicamente
app.get("/quiz/:id", (req, res) => {
    // Obtener el parámetro 'id' desde la URL
    const quizId = req.params.id;
    // Definir la ruta del archivo basado en el id
    const filePath = path.join(__dirname, "quiz", `Quiz${quizId}.json`);

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
        // Leer y devolver el archivo JSON
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Error al leer el archivo" });
            }
            res.header("Content-Type", "application/json");
            res.status(200).send(data);
        });
    } else {
        return res.status(404).json({ error: "Archivo no encontrado" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
