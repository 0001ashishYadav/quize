// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser"); // Check if a user is logged in

  if (!currentUser) {
    // User is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the child routes/components
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
