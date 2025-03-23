import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./components/SignIn";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";
import Usersadmin from "./components/Usersadmin";
import Documents from "./components/Documents";
import "./App.css";

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
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
