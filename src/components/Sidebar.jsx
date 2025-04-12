import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import "./sidebar.css";

import img from "../pictures/img.png";
import logo from "../pictures/logoo.png";
import home from "../pictures/home.png";
import todo from "../pictures/todo.png";
import check from "../pictures/check.png";
import activites from "../pictures/activites.png";
import Setting from "../pictures/setting.png";
import saved from "../pictures/saved.png";
import report from "../pictures/report.png";
import doc from "../pictures/doc.png";
import logoutIcon from "../pictures/logout.png"; // Add a logout icon

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ For redirecting after logout

  const Menus = useMemo(() => [
    { title: "Dashboard", src: home, path: "/dashboard" },
    { title: "Departements", src: todo, path: "/departments" },
    { title: "Documents", src: doc, path: "/documents" },
    { title: "Utilisateurs", src: check, path: "/Usersadmin" },
    { title: "Activités", src: activites, gap: true, path: "/Activites" },
    { title: "Settings", src: Setting, path: "/settings" },
    { title: "Enregistrement", src: saved, path: "/Enregistrement" },
    { title: "Report", src: report, path: "/ReportPage" },
  ], []);

  const handleLogout = () => {
    // ✅ Remove token and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ Redirect to login page
    navigate("/signin");
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : "closed"}`}>
        <img
          src={img}
          alt="Toggle Sidebar"
          className={`toggle-btn ${!open ? "rotate" : ""}`}
          onClick={() => setOpen(!open)}
        />
        <div className="sidebar-logo-container">
          <img src={logo} alt="Logo" className={`sidebar-logo ${open ? "rotate" : ""}`} />
        </div>

        <ul className="menu-list">
          {Menus.map((menu, index) => (
            <React.Fragment key={index}>
              {menu.title === "Activités"}
              <Link to={menu.path} className={`menu-item ${location.pathname === menu.path ? "active" : ""} ${menu.gap ? "menu-gap" : ""}`}>
                <img src={menu.src} alt={menu.title} />
                <span className={`menu-text ${!open ? "hidden" : ""}`}>{menu.title}</span>
              </Link>
            </React.Fragment>
          ))}
        </ul>

        {/* ✅ Logout Button */}
        <div className="logout-container" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout" />
          <span className={`menu-text ${!open ? "hidden" : ""}`}>Déconnexion</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${open ? "open" : "closed"}`}>
        {children}
      </div>
    </div>
  );
}
