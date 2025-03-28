import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./departments.css";
import Sidebar from "./Sidebar";


const Departments = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  
  const departments = ["RH", "INFO", "FINANCE", "MARKETING"];

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
    <div><Sidebar>
    <div className="departmentscon">
      <h2 className="departementsheader">Départements</h2>
      <div className="departments-grid">
        {departments.map((dept) => (
          <div 
            key={dept} 
            className="department-box" 
            onClick={() => navigate(`/departments/${dept}`)}
          >
            <h3>{dept}</h3>
            <p>{countDocumentsByDepartment(dept)} documents</p>
          </div>
        ))}
      </div>
    </div>
    </Sidebar>
    </div>
  );
};

export default Departments;
