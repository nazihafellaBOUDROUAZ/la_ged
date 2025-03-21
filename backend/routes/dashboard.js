const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [results] = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM employees WHERE role = 'admin') AS totalAdmins,
          (SELECT COUNT(*) FROM employees WHERE role = 'user') AS totalUsers
      `);
      results[0].totalDocuments = 0; // valeur temporaire à 0
      res.json(results[0]);
      
  } catch (err) {
    console.error("Erreur dans la récupération des statistiques:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;