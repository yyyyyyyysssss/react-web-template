import { Spin } from "antd"
import { Navigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { isLoginIn } = useAuth()

  if (isLoginIn === null) return <Spin fullscreen />

  return isLoginIn ? children : <Navigate to="/login" replace />
}