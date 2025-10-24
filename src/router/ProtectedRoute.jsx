import { Spin } from "antd"
import { Navigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import Forbidden from "../pages/Forbidden";
import { useHasPermission } from "../components/HasPermission";
import reduxStore from "../redux/store";

export const ProtectedRoute = ({ children, requiredPermissions, fallback, requireAll = false }) => {

  const { isLoginIn } = useAuth()
  
  // 等待登录状态
  if (isLoginIn === null) return <Spin fullscreen />

  // 未登录
  if (!isLoginIn) return <Navigate to="/login" replace />

  // 未选择租户则跳转租户选择页面
  const tenant = reduxStore.getState().layout.tenant
  if (!tenant) return <Navigate to="/tenant-selection" replace />

  const isAllowed = useHasPermission(requiredPermissions, requireAll)

  // 权限不足
  if (!isAllowed) return fallback || <Forbidden />

  return children
}