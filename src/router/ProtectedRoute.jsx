import { Spin } from "antd"
import { Navigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import { useSelector } from 'react-redux';
import Forbidden from "../pages/Forbidden";
import { useMemo } from "react";

export const ProtectedRoute = ({ children, requiredPermissions, fallback, requireAll = false }) => {

  const permissionCodes = useSelector((state) => state.auth.userInfo?.permissionCodes || [])

  const { isLoginIn } = useAuth()

  // 页面级权限检查
  const hasPermission = useMemo(() => {
    if (!requiredPermissions) return true

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

    if (permissionCodes.includes('all')) return true

    return requireAll
      ? 
      permissions.every((p) => permissionCodes.includes(p))
      : 
      permissions.some((p) => permissionCodes.includes(p))
  }, [requiredPermissions, permissionCodes])

  // 等待登录状态
  if (isLoginIn === null) return <Spin fullscreen />

  // 未登录
  if (!isLoginIn) return <Navigate to="/login" replace />

  // 权限不足
  if (!hasPermission) return fallback || <Forbidden />

  return children
}