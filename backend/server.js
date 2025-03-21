// Importation d’Express (framework web pour Node.js)
const express = require('express');

// Importation du middleware CORS pour permettre les requêtes cross-origin (ex: React ↔ Express)
const cors = require('cors');

// Importation des routes (fichiers séparés pour une bonne organisation du code)
const employeeRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');

// Création de l’application Express
const app = express();

// Port sur lequel le serveur backend va écouter
const PORT = 5000;
const dashboardRoutes = require('./routes/dashboard');
// ✅ Application des middlewares avant les routes

// CORS : autorise les échanges entre le frontend (ex: React sur localhost:3000) et le backend
app.use(cors());
app.use('/api/dashboard', dashboardRoutes);
// Middleware pour parser les données JSON reçues dans les requêtes
app.use(express.json());

// ✅ Application des routes

// Route de connexion (login) => accessible à partir de "/signin"
app.use('/', authRoutes);

// Routes liées à la gestion des employés (ajout, suppression, récupération, etc.)
app.use('/api/employees', employeeRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
