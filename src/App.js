import React from "react";
import SignIn from "./components/SignIn";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard"
import Usersadmin from "./components/Usersadmin";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import "./App.css"

function App() {
  const route = createBrowserRouter([
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
      element: <Usersadmin/>,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
