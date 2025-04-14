import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Enregistrement.css";
import { FaFileAlt,FaTrash,FaDownload} from "react-icons/fa";

const Enregistrement = () => {
  const [bookmarkedDocs, setBookmarkedDocs] = useState([]);

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("bookmarkedDocs")) || [];
    setBookmarkedDocs(savedDocs);
  }, []);

  const handleRemoveBookmark = (id) => {
    const updatedDocs = bookmarkedDocs.filter((doc) => doc.id !== id);
    localStorage.setItem("bookmarkedDocs", JSON.stringify(updatedDocs));
    setBookmarkedDocs(updatedDocs);
  };

  return (
    <div>
      <Sidebar>
      <h1 className="documentslist-name">Enregistrements</h1>
      <div className="documents-listt">
        {bookmarkedDocs.map((doc) => (
          <div key={doc.id} className="document-card">
            <div className="idkkk">
                           <div>
                             <FaFileAlt className="file-icone"/>
                           </div>
                           <div> 
                               <h4>{doc.filename} </h4>
                               <p>Département : {doc.department}</p>
                               <p>Date : {doc.date.split("T")[0]}</p>
                            </div>
                          </div>
            <div>
              <button onClick={() => handleRemoveBookmark(doc.id)} className="supprimer">
                <FaTrash /> Supprimer
               </button>
               <button className="telecharger" onClick={() => window.open(doc.cloudinaryUrl, "_blank", "noopener,noreferrer")}>
                <FaDownload/> Telecharger
                               </button>
            </div>
          </div>
        ))}
      </div>
      </Sidebar>
    </div>
  );
};

export default Enregistrement;
