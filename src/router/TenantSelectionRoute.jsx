import { Spin } from "antd"
import { useAuth } from "./AuthProvider"
import { Navigate } from 'react-router-dom';
import reduxStore from "../redux/store";


export const TenantSelectionRoute = ({ children }) => {
  const { isLoginIn } = useAuth()

  // 等待登录状态
  if (isLoginIn === null) return <Spin fullscreen />

  // 未登录
  if (!isLoginIn) return <Navigate to="/login" replace />

  const tenant = reduxStore.getState().layout.tenant

  return isLoginIn && tenant ? <Navigate to="/home" replace /> : children
}