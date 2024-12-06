const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.NAME
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Connexion bdd ok');
});


module.exports = connection;