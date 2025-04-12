import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./departments.css";
import Sidebar from "./Sidebar";

const Departments = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  
  const departments = [
    { name: "RH", icon: "🌐", link: "/departments/RH" },
    { name: "INFO", icon: "🖥️", link: "/departments/INFO" },
    { name: "FINANCE", icon: "📑", link: "/departments/FINANCE" },
    { name: "MARKETING", icon: "📊", link: "/departments/MARKETING" },
    { name: "Ajouter un département", icon: "➕", isAddNew: true },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Erreur lors du chargement des documents :", error);
    }
  };

  const countDocumentsByDepartment = (dept) => {
    return documents.filter((doc) => doc.department === dept).length;
  };

  return (
    <div>
      <Sidebar>
      <div className="departmentscon">
        <h2 className="departementsheader">Départements</h2>
        <div className="departments-grid">
          {departments.map((dept) => (
            <div 
              key={dept.name} 
              className="department-card" 
              onClick={() => dept.isAddNew ? navigate("/add-department") : navigate(dept.link)}
            >
              <div className="department-icon">{dept.icon}</div>
              <h3>{dept.name}</h3>
              {dept.isAddNew ? (
                <button className="department-button">Ajouter département</button>
              ) : (
                <p>{countDocumentsByDepartment(dept.name)} documents</p>
              )}
            </div>
          ))}
        </div>
      </div>
      </Sidebar>
    </div>
  );
};

export default Departments;
