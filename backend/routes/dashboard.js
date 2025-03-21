const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path to your MySQL connection file

router.get('/stats', (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM employees WHERE role = 'admin') AS totalAdmins,
      (SELECT COUNT(*) FROM employees WHERE role = 'user') AS totalUsers,
      (SELECT COUNT(*) FROM documents) AS totalDocuments
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur dans la récupération des statistiques:", err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const stats = results[0];
    res.json(stats);
  });
});

module.exports = router; 

