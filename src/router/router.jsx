import React, { lazy } from "react";
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { matchPath } from "react-router"
import { House, Settings, UserCog, Menu, ShieldUser, Building } from "lucide-react";
import { LoginRoute } from "./LoginRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import ServerError from "../pages/ServerError";
import { TenantSelectionRoute } from "./TenantSelectionRoute";

const AppLayout = lazy(() => import('../layouts'))
const Home = lazy(() => import('../pages/home'))
const Login = lazy(() => import('../pages/login'))
const TenantSelection = lazy(() => import('../pages/tenant-selection'))
const UserManage = lazy(() => import('../pages/system-manage/user-manage'))
const UserDetails = lazy(() => import('../pages/system-manage/user-manage/details'))
const RoleManage = lazy(() => import('../pages/system-manage/role-manage'))
const MenuManage = lazy(() => import('../pages/system-manage/menu-manage'))
const TenantManage = lazy(() => import('../pages/system-manage/tenant-manage'))


export const routes = [
    {
        path: 'login',
        element: <LoginRoute><Login /></LoginRoute>,
        protected: false,
    },
    {
        path: 'tenant-selection',
        element: <TenantSelectionRoute><TenantSelection /></TenantSelectionRoute>,
        protected: false,
    },
    {
        path: '',
        element: <AppLayout />,
        breadcrumbName: '主页',
        protected: true,
        children: [
            {
                path: '',
                element: <Navigate to="/home" />,
            },
            {
                path: 'home',
                breadcrumbName: '主页',
                defaultIcon: <House size={18} />,
                element: <Home />,
            },
            {
                path: 'system',
                breadcrumbName: '系统管理',
                defaultIcon: <Settings size={18} />,
                children: [
                    {
                        path: 'user',
                        element: <UserManage />,
                        breadcrumbName: '用户管理',
                        defaultIcon: <UserCog size={18} />,
                        protected: true,
                        requiredPermissions: ['system:user']
                    },
                    {
                        path: 'user/details/:id?',
                        element: <UserDetails />,
                        breadcrumbName: '用户详情',
                    },
                    {
                        path: 'role',
                        element: <RoleManage />,
                        breadcrumbName: '角色管理',
                        defaultIcon: <ShieldUser size={18} />,
                        protected: true,
                        requiredPermissions: ['system:role']
                    },
                    {
                        path: 'menu',
                        element: <MenuManage />,
                        breadcrumbName: '菜单管理',
                        defaultIcon: <Menu size={18} />,
                        protected: true,
                        requiredPermissions: ['system:menu']
                    },
                    {
                        path: 'tenant',
                        element: <TenantManage />,
                        breadcrumbName: '租户管理',
                        defaultIcon: <Building size={18} />,
                        protected: true,
                        requiredPermissions: ['system:tenant']
                    }
                ]
            },
            {
                path: '*',
                element: <NotFound />
            },
            {
                path: '/404',
                element: <NotFound />
            },
            {
                path: '/403',
                element: <Forbidden />
            },
            {
                path: '/500',
                element: <ServerError />
            },
        ]
    }
]

const findRoute = (route, fullPath, targetPath) => {
    if (route.path !== '') {
        fullPath = fullPath + (route.path.startsWith('/') ? route.path : '/' + route.path)
    }
    const result = matchPath({ path: fullPath }, targetPath)
    if (result) {
        return {
            ...route,
            fullPath: fullPath
        }
    }
    if (route.children && targetPath.includes(route.path)) {
        for (const childrenRoute of route.children) {
            const result = findRoute(childrenRoute, fullPath, targetPath)
            if (result) {
                return result
            }
        }
    }
    return null
}

const routeCache = new Map()

export const findRouteByPath = (targetPath) => {
    if (routeCache.has(targetPath)) {
        return routeCache.get(targetPath)
    }
    let result = null
    for (const route of routes) {
        result = findRoute(route, '', targetPath)
    }
    routeCache.set(targetPath, result)
    return result
}

const findRouteHierarchy = (paths, routes) => {
    if (paths.length === 0) {
        return null
    }
    const currentPath = paths[0]
    for (const route of routes) {
        if (route.path === currentPath) {
            if (paths.length === 1) {
                return route
            }
            if (route.children) {
                return findRouteHierarchy(paths.slice(1), route.children)
            }
        }
    }
    return null
}

export const findRouteByHierarchy = (paths) => {
    return findRouteHierarchy(paths, routes)
}

const wrapProtectedRoute = (route) => {
    const wrappedRoute = {
        ...route,
        element: route.protected ? (
            <ProtectedRoute requiredPermissions={route.requiredPermissions}>
                {route.element}
            </ProtectedRoute>
        ) : route.element,
    }
    if (route.children && route.children.length > 0) {
        wrappedRoute.children = route.children.map(wrapProtectedRoute)
    }

    return wrappedRoute
}

const finalRoutes = routes.map(wrapProtectedRoute)

const router = createBrowserRouter(finalRoutes)

export default router;