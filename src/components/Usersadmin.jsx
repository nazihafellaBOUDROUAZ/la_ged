// UsersAdmin.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import "./usersadmin.css";
import Sidebar from "./Sidebar";

const departments = ["All", "RH", "INFO", "HHH", "JHBN", "DFGHJ"];
const roles = ["user", "admin"];

export default function UsersAdmin() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    email: "",
    password: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des employés:", err)
      );
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchDept = selectedDept === "All" || emp.department === selectedDept;
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleAddEmployee = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newEmployee.name.trim()) errors.name = "Nom requis";
    if (!newEmployee.department.trim()) errors.department = "Département requis";
    if (!newEmployee.email.trim()) {
      errors.email = "Email requis";
    } else if (!emailRegex.test(newEmployee.email)) {
      errors.email = "Email invalide";
    }
    if (!newEmployee.password.trim()) errors.password = "Mot de passe requis";
    if (!newEmployee.role.trim()) errors.role = "Rôle requis";

    const isDuplicateName = employees.some(
      (emp) => emp.name.toLowerCase() === newEmployee.name.toLowerCase()
    );
    if (isDuplicateName) {
      errors.name = "Nom déjà utilisé par un autre employé";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees([...employees, data]);
        setNewEmployee({
          name: "",
          department: "",
          email: "",
          password: "",
          role: "",
        });
        setFormErrors({});
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout:", err);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setEmployees(employees.filter((emp) => emp.id !== id));
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression:", err);
      });
  };

  return (
    <div className="employee-page">
      <Sidebar>
        <h2 className="title">Employés</h2>

        <div className="actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          Ajouter +
        </button>

        {showForm && (
          <div className="form-modal">
            <div className="form-card">
              <h3>Ajouter un employé</h3>

              <input
                type="text"
                placeholder="Nom complet"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}

              <select
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
              >
                <option value="">-- Sélectionner un département --</option>
                {departments.filter((dept) => dept !== "All").map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formErrors.department && (
                <span className="error-text">{formErrors.department}</span>
              )}

              <input
                type="email"
                placeholder="Email"
                autoComplete="off"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}

              <input
                type="password"
                placeholder="Mot de passe"
                autoComplete="new-password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
              />
              {formErrors.password && (
                <span className="error-text">{formErrors.password}</span>
              )}

              <select
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
              >
                <option value="">-- Sélectionner un rôle --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {formErrors.role && <span className="error-text">{formErrors.role}</span>}

              <div className="form-buttons">
                <button onClick={handleAddEmployee}>Ajouter</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="filters">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-btn ${selectedDept === dept ? "active" : ""}`}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="employee-table">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom</th>
                <th>Département</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Aucun employé pour l’instant.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td className="emp-name">{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>{emp.role || "Non défini"}</td>
                    <td className="actions-cell">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Sidebar>
    </div>
  );
}
