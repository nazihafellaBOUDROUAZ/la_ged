const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM employees WHERE role = 'admin') AS totalAdmins,
        (SELECT COUNT(*) FROM employees WHERE role = 'user') AS totalUsers,
        (SELECT COUNT(*) FROM documents) AS totalDocuments
    `);

    res.json(results[0]);

  } catch (err) {
    console.error("Erreur dans la récupération des statistiques:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Nouvelle route pour les 5 derniers utilisateurs ajoutés
router.get('/recent-users', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, username, department, email, role 
       FROM employees 
       ORDER BY id DESC 
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération utilisateurs récents:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// ✅ Nouvelle route pour les 4 derniers documents ajoutés
router.get('/recent-documents', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, filename, department
       FROM documents 
       ORDER BY date DESC 
       LIMIT 4`
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération documents récents:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
