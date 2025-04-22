const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createConnection({
    host: "4.172.252.35",
    user: "root",
    password: "Ht1EHtaeYopyicq9MeXa1CDTaqz0lXzEh0F7ZIifA69tPN8600YzfrtX5FfzsDZN",
    database: "dbreto",
    port: 3307,
    connectionLimit: 10
})

pool.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
}); 

const users = [
    { nombre: 'Santiago', correo: 'santiago@whirpool.com', contrasena: 'userCap1', tipo: '2'},
    { nombre: 'Jaime', correo: 'jaime@whirpool.com', contrasena: 'userCap2', tipo: '1'},
    { nombre: 'Patricio', correo: 'patricio@whirpool.com', contrasena: 'userCap3', tipo: '3'},
    { nombre: 'Mario', correo: 'mario@whirpool.com', contrasena: 'userCap4', tipo: '3'},
    { nombre: 'Manuel', correo: 'manuel@whirpool.com', contrasena: 'userCap5', tipo: '3'}
];

async function insertUsers() {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.contrasena, 10);
        
        const sql = `INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, ?)`;
        const values = [user.nombre, user.correo, hashedPassword, user.tipo];

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error(`Error inserting user ${user.nombre}:`, err);
            } else {
                console.log(`User ${user.nombre} inserted successfully.`);
            }
        });
    }

    pool.end(); // closes connection after inserting users
}

insertUsers();