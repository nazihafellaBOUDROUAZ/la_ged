import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar";
import "./dashboard.css";
import { FaCrown, FaUsers, FaFileAlt } from 'react-icons/fa';
import img from "../pictures/dash-imj.png";

function Dashboard() {
  // ✅ State pour stocker les statistiques
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    totalDocuments: 0
  });

  // ✅ Récupération dynamique depuis le backend
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données récupérées :", data);
        setStats({
          totalAdmins: data.totalAdmins || 0,
          totalUsers: data.totalUsers || 0,
          totalDocuments: data.totalDocuments || 0
        });
      })
      .catch((err) => console.error("Erreur récupération stats:", err));
  }, []);

  return (
    <div>
      <Sidebar>
        <h1 className='entete-admin'> Admin Dashboard </h1>
        <div className='dash-section'>
          <div className='left-sec'>
            <div className='about-us'>
              <div className='paragraphe'>
                <h2>Bienvenu A</h2>
                <h3>Ton G.E.D :</h3>
                <p>OU TU VAS COLABORER ET TROUVER TOUS <br /> VOS FICHIERS EN FORMAT <br /> ELECTRONIQUE</p>
                <button className='savoire-plus'>Savoir plus</button>
              </div>
              <div>
                <img src={img} alt="Dashboard illustration" />
              </div>
            </div>
            <div className='recent-users'>
              {/* Tu pourras ici afficher les users récents dynamiquement plus tard */}
            </div>  
          </div>

          {/* RIGHT SECTION */}
          <div className='right-sec'>
            <p className="activities-title">Activités</p>

            <div className="activity-stats-container">
              <div className="activity-card purple">
                <div className="activity-icon">
                  <FaCrown className="icon" />
                </div>
                <div className="activity-info">
                  <p>Total Admin</p>
                  <h4>{stats.totalAdmins}</h4>
                </div>
              </div>

              <div className="activity-card green">
                <div className="activity-icon">
                  <FaUsers className="icon" />
                </div>
                <div className="activity-info">
                  <p>Total Users</p>
                  <h4>{stats.totalUsers}</h4>
                </div>
              </div>

              <div className="activity-card yellow">
                <div className="activity-icon">
                  <FaFileAlt className="icon" />
                </div>
                <div className="activity-info">
                  <p>Total Documents</p>
                  <h4>{stats.totalDocuments}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Dashboard;
