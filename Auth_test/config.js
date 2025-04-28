export const{
    PORT = 7000,
    SALT_ROUNDS = 10,
    SECRET_JWT_KEY = 'this-is-an-awesome-secret-key-pero-con-muchas-mas-palabras'
} = process.env; //si no existe la variable de entorno PORT, se le asigna el valor 7000