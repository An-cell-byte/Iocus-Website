import express from 'express';
import {PORT} from './config.js';

const app = express();
app.use(express.json()); // Middleware para parsear el cuerpo de la peticion a JSON

app.get('/', (req, res) => {
  res.send('Prueba de servidor Express con ESM!');
});

app.post('/login', (req, res) => {});
app.post('/register', (req, res) => {
    const { username, password } = req.body; //cuerpo de la peticion

    console.log({username, password}); //imprime el cuerpo de la peticion

    try {
        const id = UserRepository.create({ username, password });
        res.send({ id });
    }catch (error) {
        res.status(400).send({ error: error.message }); 
    }
});
app.post('/logout', (req, res) => {});

app.get('/protected', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
