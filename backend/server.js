// server.js
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
