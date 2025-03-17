import "./signin.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const [signIn, setSignIn] = useState(true); // État pour basculer entre Admin et Utilisateur
    const [nomdutilisateur, setNomdutilisateur] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 📌 Connexion pour Admin
    const handleSubmitAdmin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/signin-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomdutilisateur, password }),
        });

        const data = await response.json();
        if (response.status === 201 || response.status === 200) {
            alert(data.message);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="ggg">
            <div className={`container ${signIn ? "" : "sign-in-mode"}`}>
                {/* 🔵 Formulaire pour Utilisateur */}
                <div className="sign-up-container form-container">
                    <form className="Form">
                        <h1 className="Title">Se connecter en tant qu'Utilisateur</h1>
                        <input type="text" placeholder="Nom d'utilisateur" />
                        <input type="password" placeholder="Mot de passe" />
                        <button>Sign In</button>
                    </form>
                </div>

                {/* 🔴 Formulaire pour Admin */}
                <div className="sign-in-container form-container">
                    <form className="Form" onSubmit={handleSubmitAdmin}>
                        <h1 className="Title">Se connecter en tant qu'Admin</h1>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={nomdutilisateur}
                            onChange={(e) => setNomdutilisateur(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* Effet flip-flop */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-left overlay-panel">
                            <h1 className="Title1">Bienvenue !</h1>
                            <p>Accédez à vos documents en toute sécurité.</p>
                            <button className="ghost" onClick={() => setSignIn(true)}>
                                Admin
                            </button>
                        </div>

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

export default SignIn;
