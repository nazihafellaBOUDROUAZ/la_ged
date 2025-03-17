// Importation d'Express et création d'un routeur
const express = require('express');
const router = express.Router();

// Importation de la connexion à la base de données
const db = require('../db');

// Importation de bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt'); // ✅ import bcrypt

// ========================
// Route POST - Ajouter un nouvel employé
// ========================
router.post("/", async (req, res) => {
  // Récupération des données envoyées depuis le frontend
  const { name, username, department, email, password, role } = req.body;

  // Vérification que tous les champs obligatoires sont présents
  if (!name || !username || !department || !email || !password || !role) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    // Vérifier si un employé avec le même nom d'utilisateur existe déjà
    const [existing] = await db.query("SELECT * FROM employees WHERE username = ?", [username]);
    if (existing.length > 0) {
      // Si oui, renvoyer une erreur de conflit (409)
      return res.status(409).json({ message: "Nom d'utilisateur déjà utilisé" });
    }

    // ✅ Hachage du mot de passe avec bcrypt (10 tours de salage)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion du nouvel employé dans la base de données
    const [result] = await db.query(
      "INSERT INTO employees (name, username, department, email, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, department, email, hashedPassword, role]
    );

    // Récupérer l'ID du nouvel employé inséré
    const insertedId = result.insertId;

    // Requête pour récupérer les données complètes du nouvel employé
    const [newEmployee] = await db.query("SELECT * FROM employees WHERE id = ?", [insertedId]);

    // Retourner les données de l'employé ajouté au frontend
    res.json(newEmployee[0]);
  } catch (err) {
    // En cas d'erreur lors de l'insertion
    console.error("Erreur lors de l'ajout de l'employé:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// Route GET - Obtenir tous les employés
// ========================
router.get("/", async (req, res) => {
  try {
    // Requête SQL pour récupérer tous les employés
    const [employees] = await db.query("SELECT * FROM employees");
    // Envoyer les employés en réponse
    res.json(employees);
  } catch (err) {
    // En cas d'erreur lors de la récupération
    console.error("Erreur lors de la récupération des employés:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// Route DELETE - Supprimer un employé par ID
// ========================
router.delete("/:id", async (req, res) => {
  // Récupérer l'ID de l'employé depuis les paramètres de l'URL
  const employeeId = req.params.id;

  try {
    // Exécuter la suppression dans la base de données
    await db.query("DELETE FROM employees WHERE id = ?", [employeeId]);

    // Renvoyer une confirmation au frontend
    res.json({ message: "Employé supprimé" });
  } catch (err) {
    // En cas d'erreur lors de la suppression
    console.error("Erreur lors de la suppression de l'employé:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Exportation du routeur pour qu’il soit utilisé dans le fichier principal (app.js ou server.js)
module.exports = router;




//Résumé de ce que fait ce fichier :

//POST / → ajoute un employé avec vérification du username et hachage du mot de passe.
//GET / → récupère tous les employés.
//DELETE /:id → supprime un employé via son id