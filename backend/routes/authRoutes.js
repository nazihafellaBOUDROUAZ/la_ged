const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Route de connexion (login)
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });

        if (result.length === 0) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Vérification du rôle et redirection
        if (user.role === "admin") {
            return res.json({ message: "Connexion réussie", redirect: "/dashboard" });
        } else {
            return res.json({ message: "Connexion réussie", redirect: "/home" });
        }
    });
});

// Route d'inscription (register)
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (role === "admin") {
        db.query("SELECT * FROM users WHERE role = 'admin'", async (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });

            if (result.length > 0) {
                return res.status(400).json({ error: "Un administrateur existe déjà !" });
            }

            insertUser(name, email, password, role, res);
        });
    } else {
        insertUser(name, email, password, role, res);
    }
});

const insertUser = async (name, email, password, role, res) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur lors de l'inscription" });

            res.status(201).json({ message: "Utilisateur créé avec succès" });
        }
    );
};

module.exports = router;
