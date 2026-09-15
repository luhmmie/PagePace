import React from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
  const session = localStorage.getItem("PagePace_session");

  if (!session) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;