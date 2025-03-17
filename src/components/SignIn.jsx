import "./signin.css"; // Import du fichier CSS pour le style
import React, { useState } from "react"; // Import de React et du hook useState
import { useNavigate } from "react-router-dom"; // Import du hook useNavigate pour rediriger après la connexion

function SignIn() {
    // État pour déterminer si l'on est sur le formulaire Admin (true) ou Utilisateur (false)
    const [signIn, setSignIn] = useState(true);

    // États pour les champs de connexion
    const [nomdutilisateur, setNomdutilisateur] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // Hook de navigation (rediriger vers une autre page)

    // 📌 Fonction de connexion Admin
    const handleSubmitLogin = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page au submit

        // Envoi des données de connexion au backend
        const response = await fetch("http://localhost:5000/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomdutilisateur, password }), // Envoi des identifiants
        });

        const data = await response.json(); // Récupération de la réponse du backend

        // Si connexion réussie (code HTTP 200)
        if (response.status === 200) {
            alert(data.message); // Affiche un message de succès
            localStorage.setItem("role", data.role); // Enregistre le rôle dans le localStorage

            // 🔁 Redirection selon le rôle
            if (data.role === "admin") {
                navigate("/dashboard"); // Rediriger vers le tableau de bord Admin
            } else if (data.role === "user") {
                navigate("/dashboard"); // Rediriger vers le tableau de bord Utilisateur
            }
        } else {
            // Affiche le message d’erreur retourné par le backend
            alert(data.message);
        }
    };

    return (
        <div className="ggg">
            {/* Conteneur principal avec classe conditionnelle pour l'effet de transition */}
            <div className={`container ${signIn ? "" : "sign-in-mode"}`}>
                
                {/* 🔵 Formulaire de connexion Utilisateur */}
                <div className="sign-up-container form-container">
                    <form className="Form">
                        <h1 className="Title">Se connecter en tant qu'Utilisateur</h1>
                        <input type="text" placeholder="Nom d'utilisateur" />
                        <input type="password" placeholder="Mot de passe" />
                        <button>Sign In</button>
                    </form>
                </div>

                {/* 🔴 Formulaire de connexion Admin */}
                <div className="sign-in-container form-container">
                    <form className="Form" onSubmit={handleSubmitLogin}>
                        <h1 className="Title">Se connecter en tant qu'Admin</h1>
                        
                        {/* Champ nom d'utilisateur */}
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={nomdutilisateur}
                            onChange={(e) => setNomdutilisateur(e.target.value)}
                            required
                        />

                        {/* Champ mot de passe */}
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Bouton de connexion */}
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* 🌟 Effet d’animation flip/flop entre les deux formulaires */}
                <div className="overlay-container">
                    <div className="overlay">
                        
                        {/* Panneau gauche : bouton pour aller vers Admin */}
                        <div className="overlay-left overlay-panel">
                            <h1 className="Title1">Bienvenue !</h1>
                            <p>Accédez à vos documents en toute sécurité.</p>
                            <button className="ghost" onClick={() => setSignIn(true)}>
                                Admin
                            </button>
                        </div>

                        {/* Panneau droit : bouton pour aller vers Utilisateur */}
                        <div className="overlay-right overlay-panel">
                            <h1 className="Title1">Bienvenue !</h1>
                            <p>Accédez à vos documents en toute sécurité.</p>
                            <button className="ghost" onClick={() => setSignIn(false)}>
                                Utilisateur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn; // Export du composant pour l'utiliser ailleurs
