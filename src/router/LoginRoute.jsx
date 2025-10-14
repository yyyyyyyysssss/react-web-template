import { Spin } from "antd"
import { useAuth } from "./AuthProvider"
import { Navigate } from 'react-router-dom';


export const LoginRoute = ({ children }) => {
  const { isLoginIn } = useAuth()

  if (isLoginIn === null) return <Spin fullscreen />

  return isLoginIn ? <Navigate to="/home" replace /> : children
}