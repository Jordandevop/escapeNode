const mysql = require("mysql2");
require("dotenv").config();
const connection = mysql.createConnection({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.NAME,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Connexion OK");
});

module.exports = connection;
