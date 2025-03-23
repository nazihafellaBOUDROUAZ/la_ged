import React, { useState, useEffect } from "react";
import "./documents.css";
import Sidebar from "./Sidebar";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    filename: "",
    date: new Date().toISOString().split("T")[0],
    department: "",
    file: null,
  });

  const [filterDept, setFilterDept] = useState("All");
  const departments = ["All", "RH", "INFO", "FINANCE", "MARKETING"];

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

  const computeFileHash = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        resolve(hashHex);
      };
      reader.onerror = () => reject("Erreur lecture fichier");
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (!newDoc.file || !newDoc.filename || !newDoc.department) {
        setErrorMessage("Veuillez remplir tous les champs.");
        setLoading(false);
        return;
      }

      const fileHash = await computeFileHash(newDoc.file);
      const isDuplicate = documents.some((doc) => doc.fileHash === fileHash);
      if (isDuplicate) {
        setErrorMessage("Un fichier avec le même contenu existe déjà.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", newDoc.file);
      formData.append("filename", newDoc.filename);
      formData.append("date", newDoc.date);
      formData.append("department", newDoc.department);
      formData.append("fileHash", fileHash);

      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du document.");
      }

      // 🔥 Mise à jour automatique depuis le backend
      await fetchDocuments();
      setShowForm(false);

      // Reset du formulaire
      setNewDoc({
        filename: "",
        date: new Date().toISOString().split("T")[0],
        department: "",
        file: null,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setErrorMessage("Une erreur est survenue lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/files/${id}`, {
        method: "DELETE",
      });

      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "All" || doc.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="documents-container">
      <Sidebar>
        <div className="header">
          <h2>Documents</h2>
          <button className="add-button" onClick={() => setShowForm(true)}>
            Ajouter un document
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="documents-list">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="document-card">
              <h4>{doc.filename}</h4>
              <p>Département : {doc.department}</p>
              <p>Date : {doc.date}</p>
              <div className="document-actions">
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  Télécharger
                </a>
                <button onClick={() => handleDelete(doc.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-card">
              <h3>Ajouter un document</h3>
              <form onSubmit={handleAddDocument}>
                <input
                  type="text"
                  placeholder="Nom du fichier"
                  value={newDoc.filename}
                  onChange={(e) => setNewDoc({ ...newDoc, filename: e.target.value })}
                />

                <input
                  type="date"
                  value={newDoc.date}
                  onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                />

                <select
                  value={newDoc.department}
                  onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                >
                  <option value="">-- Sélectionner un département --</option>
                  {departments.filter((d) => d !== "All").map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files[0] })}
                />

                {errorMessage && <p className="error-text">{errorMessage}</p>}
                {loading && <p className="loading-text">Ajout en cours...</p>}

                <div className="form-buttons">
                  <button type="submit">Ajouter</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Documents;