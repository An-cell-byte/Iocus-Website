// backend/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/quizzes", express.static(path.join(__dirname, "quizzes"))); // Serve JSONs

// Crear carpeta "quizzes" si no existe
const quizzesDir = path.join(__dirname, "quizzes");
if (!fs.existsSync(quizzesDir)) fs.mkdirSync(quizzesDir);

// POST: Guardar quiz
app.post("/api/quizzes", (req, res) => {
	const quizData = req.body;
	const filename = `quiz-${Date.now()}.json`;
	const filepath = path.join(quizzesDir, filename);

	fs.writeFile(filepath, JSON.stringify(quizData, null, 2), err => {
		if (err) return res.status(500).json({ error: "Error al guardar el quiz" });
		return res.status(200).json({
			message: "Quiz guardado",
			file: filename,
			url: `/quizzes/${filename}`,
		});
	});
});

app.listen(PORT, () => {
	console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
