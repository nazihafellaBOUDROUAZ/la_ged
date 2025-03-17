// middlewares/auth.js
const isAdmin = (req, res, next) => {
    const user = req.user; // We'll attach the logged-in user in the future
  
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  
    next(); // Proceed if admin
  };
  
  module.exports = { isAdmin };
  