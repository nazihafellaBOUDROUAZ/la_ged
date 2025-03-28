import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./documents.css";
import Sidebar from "./Sidebar";

const DepartmentDocuments = () => {
  const { department } = useParams();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files");
      const data = await response.json();
      setDocuments(data.filter((doc) => doc.department === department));
    } catch (error) {
      console.error("Erreur lors du chargement des documents :", error);
    }
  };

  return (
    <div><Sidebar>
    <div className="documents-container">
      <h2>Documents du département {department}</h2>
      <div className="documents-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-card">
            <h4>{doc.filename}</h4>
            <p>Date : {doc.date}</p>
            <button onClick={() => window.open(doc.cloudinaryUrl, "_blank")}>Télécharger</button>
          </div>
        ))}
      </div>
    </div>
    </Sidebar>
    </div>
  );
};

export default DepartmentDocuments;
