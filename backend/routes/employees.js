const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // ✅ import bcrypt

// Ajouter un nouvel employé
router.post("/", async (req, res) => {
  const { name, username, department, email, password, role } = req.body;

  if (!name || !username || !department || !email || !password || !role) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    // Vérification de username existant
    const [existing] = await db.query("SELECT * FROM employees WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Nom d'utilisateur déjà utilisé" });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion
    const [result] = await db.query(
      "INSERT INTO employees (name, username, department, email, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, department, email, hashedPassword, role]
    );

    const insertedId = result.insertId;
    const [newEmployee] = await db.query("SELECT * FROM employees WHERE id = ?", [insertedId]);

    res.json(newEmployee[0]);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'employé:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Obtenir tous les employés
router.get("/", async (req, res) => {
  try {
    const [employees] = await db.query("SELECT * FROM employees");
    res.json(employees);
  } catch (err) {
    console.error("Erreur lors de la récupération des employés:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un employé par ID
router.delete("/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    await db.query("DELETE FROM employees WHERE id = ?", [employeeId]);
    res.json({ message: "Employé supprimé" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'employé:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
