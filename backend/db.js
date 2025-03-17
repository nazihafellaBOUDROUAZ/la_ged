// db.js
const mysql = require("mysql2/promise");

// Create a pool or connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",         // ton nom d'utilisateur phpMyAdmin
  password: "",         // ton mot de passe s’il y en a
  database: "la_ged",   // adapte si nécessaire
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;