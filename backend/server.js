// Importation d’Express (framework web pour Node.js)
const express = require('express');

// Importation du middleware CORS pour permettre les requêtes cross-origin (ex: React ↔ Express)
const cors = require('cors');

// Création de l’application Express
const app = express();

// Port sur lequel le serveur backend va écouter
const PORT = 5000;

// ✅ Middleware CORS : autorise les échanges entre le frontend (ex: React sur localhost:3000) et le backend
app.use(cors());

// ✅ Middleware pour parser les données JSON reçues dans les requêtes
app.use(express.json());

// ✅ Importation des routes (fichiers séparés pour une bonne organisation du code)
const employeeRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const fileRoutes = require('./routes/files');


// ✅ Application des routes
// Route de connexion (login) => accessible à partir de "/signin"
app.use('/', authRoutes);

// Routes liées à la gestion des employés (ajout, suppression, récupération, etc.)
app.use('/api/employees', employeeRoutes);

// Routes du dashboard (statistiques)
app.use('/api/dashboard', dashboardRoutes);
// Routes du documents
app.use('/api/files', fileRoutes);
// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});
