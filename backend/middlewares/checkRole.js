// middlewares/auth.js

// Middleware pour vérifier si l'utilisateur est un admin
const isAdmin = (req, res, next) => {
  // On récupère l'utilisateur connecté depuis l'objet `req`
  // (Il faudra attacher `req.user` lors de l'authentification dans le futur)
  const user = req.user;

  // Si aucun utilisateur n'est connecté ou si ce n'est pas un admin
  if (!user || user.role !== 'admin') {
      // On renvoie une erreur 403 (Forbidden)
      return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Si c'est bien un admin, on passe au middleware suivant
  next();
};

// On exporte le middleware pour pouvoir l'utiliser dans les routes protégées
module.exports = { isAdmin };
