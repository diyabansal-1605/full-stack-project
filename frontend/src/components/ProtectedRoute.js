// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProtectedRoute ({ children }) {
  const { authState } = useContext(AuthContext);

  if (!authState.user) {
    toast.error("Please log in to your account");
    return <Navigate to="/login" replace />;
  }

  return children;
};
