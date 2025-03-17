// routes/auth.js

// Importation du module Express et création d’un routeur
const express = require('express');
const router = express.Router();

// Importation du module de connexion à la base de données
const db = require('../db');

// Importation de bcryptjs pour comparer les mots de passe hachés
const bcrypt = require('bcryptjs');

// ========================
// Route POST - Connexion d’un utilisateur
// ========================
router.post('/signin', async (req, res) => {
  // Extraction des champs envoyés depuis le frontend (formulaire de connexion)
  const { nomdutilisateur, password } = req.body;

  // Vérification que les champs sont remplis
  if (!nomdutilisateur || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  try {
    // Requête SQL : vérifier si un utilisateur avec ce nom d'utilisateur existe
    const [users] = await db.query("SELECT * FROM employees WHERE username = ?", [nomdutilisateur]);

    // Si aucun utilisateur trouvé, retourner une erreur d’authentification
    if (users.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // L'utilisateur existe, on extrait ses infos
    const user = users[0];

    // Comparaison du mot de passe envoyé avec celui stocké dans la base (haché)
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si le mot de passe ne correspond pas, renvoyer une erreur d’authentification
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // ✅ Si mot de passe correct, connexion réussie
    // Tu peux renvoyer d’autres infos ici : token, userId, username, etc.
    return res.status(200).json({
      message: "Connexion réussie",
      role: user.role  // Utile pour rediriger l’utilisateur selon son rôle (admin ou normal)
    });

  } catch (err) {
    // En cas d’erreur lors du traitement
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Exportation du routeur pour l’utiliser dans le fichier principal (app.js ou server.js)
module.exports = router;




//Ce que fait ce fichier :

//Permet à un utilisateur de se connecter en envoyant son username et son mot de passe.
//Vérifie que l’utilisateur existe dans la base.
//Compare le mot de passe haché avec celui saisi.
//Si tout est OK, renvoie un succès + rôle de l’utilisateur (pratique pour la redirection dans le frontend).
//Si tu veux aller plus loin :

//Tu peux générer un JSON Web Token (JWT) ici pour sécuriser l’accès aux routes protégées.
//Tu peux aussi renvoyer d'autres données utiles (nom, id, username, etc.).
//Souhaites-tu que je t’aide à :

//Ajouter un JWT pour gérer la session ?
//Faire la redirection automatique côté frontend React selon le rôle (admin ou normal) après connexion ?






