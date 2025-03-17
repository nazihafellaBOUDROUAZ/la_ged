// db.js

// Importation du module mysql2 avec support des Promesses
const mysql = require("mysql2/promise");

// Création d'un pool de connexions à la base de données
// Un pool permet de gérer plusieurs connexions simultanément
const db = mysql.createPool({
  // Adresse de l’hôte de la base de données (localhost = machine locale)
  host: "localhost",

  // Nom d’utilisateur de la base de données (généralement "root" dans phpMyAdmin en local)
  user: "root",

  // Mot de passe de l’utilisateur (laissé vide ici car il n'y en a pas par défaut en local)
  password: "",

  // Nom de la base de données à laquelle on veut se connecter (ici "la_ged")
  database: "la_ged",

  // Options supplémentaires pour le pool :
  // Autorise l’attente d’une connexion si toutes sont utilisées
  waitForConnections: true,

  // Nombre maximum de connexions simultanées dans le pool
  connectionLimit: 10,

  // Taille maximale de la file d'attente des connexions en attente (0 = illimité)
  queueLimit: 0,
});

// Exportation du pool de connexion pour l’utiliser dans d'autres fichiers (ex: routes/employees.js)
module.exports = db;



// Il centralise la configuration de la connexion à la base de données MySQL, 
// afin de réutiliser le même pool de connexions partout dans ton backend 
// (au lieu de créer une nouvelle connexion à chaque requête).