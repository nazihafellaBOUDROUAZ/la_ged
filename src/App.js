import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./components/SignIn";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";
import Usersadmin from "./components/Usersadmin";
import Documents from "./components/Documents";
import "./App.css";
import Departments from "./components/Departments";
import Activites from "./components/Activites";
import Enregistrement from "./components/Enregistrement";
import DepartmentDocuments from "./components/DepartmentDocuments";
import ReportPage from "./components/ReportPage";


function App() {
  const router = createBrowserRouter([
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/",
      element: <Welcome />,
    },
    {
      path: "/ReportPage",
      element: <ReportPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/usersadmin",
      element: <Usersadmin />,
    },
    {
      path: "/documents",
      element: <Documents />,
    },
    {
      path: "/departments",
      element: <Departments />,
    },
    { 
      path:"/departments/:department" ,
      element:<DepartmentDocuments />,
    },
    {
      path: "/Enregistrement",
      element: <Enregistrement />,
    },
    {
      path: "/Activites",
      element: <Activites />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
