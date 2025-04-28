import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'; // Importa la libreria para crear y verificar tokens JWT
import { UserRepository } from './user-repository.js'; // Importa el repositorio de usuarios
import {PORT, SECRET_JWT_KEY} from './config.js';

const app = express();

app.set('view engine', 'ejs'); // Configura el motor de plantillas EJS

app.use(express.json()); // Middleware para parsear el cuerpo de la peticion a JSON
app.use(cookieParser()); // Middleware para parsear cookies

app.use((req, res, next) => {
  const token = req.cookies.access_token; //se obtiene el token de la cookie
  req.session = { user: null }; //se inicializa la variable session

  if (token){
    try {
      const data = jwt.verify(token, SECRET_JWT_KEY); //verifica el token
      req.session.user = data; //se guarda el usuario en la session
      console.log('Usuario autenticado:', req.session.user); // DEPURACIÓN
    } catch (error){
      console.log('Error al verificar el token en middleware:', error.message); // DEPURACIÓN
    }  
  }else{
    console.log('No se encontró el token en las cookies'); // DEPURACIÓN
  }
  

  next(); //sigue con la siguiente funcion middleware
})

app.get('/', (req, res) => {
  const { user } = req.session; //se obtiene el usuario de la session
  res.render('index',  user ) // Renderiza la vista 'index.ejs' (se le pasa el usuario a la vista)
  
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body; //cuerpo de la peticion

    try {
        //validar username y password
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign(
          { id: user._id, username: user.username}, 
          SECRET_JWT_KEY,{
          expiresIn: '1h' //el token expira en 1 hora
        })
        console.log('Token generado al iniciar sesión:', token); // DEPURACIÓN

        //guardar el token en una cookie
        res
          .cookie('access_token', token, { //se guarda el token en una cookie
            httpOnly: true, //la cookie no es accesible desde el cliente
            secure: process.env.NODE_ENV == 'production', //la cookie solo se puede acceder por https
            sameSite: 'strict', //la cookie solo se envia en la misma pagina
            maxAge: 1000 * 60 * 60, //la cookie expira en 1 hora
          })
          .send({ user, token }); 

    } catch (error) {
        res.status(401).send( error.message ); //si hay un error, se envia el mensaje de error
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body; //cuerpo de la peticion

    console.log(username, password); //DEPURACION

    
    try {
        // Crea el usuario en el repositorio
        const user = await UserRepository.create({ username, password });
        console.log('Usuario creado:', user); // DEPURACIÓN

        // Genera un token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        console.log('Token generado al registrar:', token); // Depuración

        // Envía el token en una cookie
        res
            .cookie('access_token', token, {
                httpOnly: true, // La cookie no es accesible desde el cliente
                secure: process.env.NODE_ENV === 'production', // Solo se envía por HTTPS en producción
                sameSite: 'strict', // Solo se envía en la misma página
                maxAge: 1000 * 60 * 60, // La cookie expira en 1 hora
            })
            .send({ user, token }); // Envía el usuario y el token como respuesta
    }catch (error) {
      res.status(400).send({ error: error.message }); 
    }
});

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token') //se limpia la cookie
    .send({ message: 'Logout successful' }); //se envia un mensaje de logout exitoso
});

app.get('/protected', (req, res) => {
  
  const { user } = req.session; //se obtiene el usuario de la session
  console.log('Usuario en sesión: ', req.session.user); // DEPURACIÓN
  
  if (!user) {
    return res.status(403).send('Access not authorized') //si no hay usuario, se envia un error 401
  }
  res.render('protected', {name: user.username}) // Renderiza la vista 'protected.ejs' (se le puso como name para la vista de protected)
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});