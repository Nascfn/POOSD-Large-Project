import React from 'react';
import { Navigate } from 'react-router-dom';

type RequireAuthProps = {
  children: React.ReactElement;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;