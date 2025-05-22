import React, { lazy } from "react";
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { matchPath } from "react-router"
import AuthProvider from "./AuthProvider";

const AppLayout = lazy(() => import('../layouts'))
const Home = lazy(() => import('../pages/home'))
const Login = lazy(() => import('../pages/login'))
const UserManage = lazy(() => import('../pages/system-manage/user-manage'))
const UserDetails = lazy(() => import('../pages/system-manage/user-manage/details'))
const RoleManage = lazy(() => import('../pages/system-manage/role-manage'))
const AuthManage = lazy(() => import('../pages/system-manage/auth-manage'))


export const routes = [
    {
        path: 'login',
        element: <Login />,
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
                element: <Home />,
            },
            {
                path: 'system',
                breadcrumbName: '系统管理',
                children: [
                    {
                        path: 'user',
                        element: <UserManage />,
                        breadcrumbName: '用户管理',
                    },
                    {
                        path: 'user/details',
                        element: <UserDetails />,
                        breadcrumbName: '用户详情',
                    },
                    {
                        path: 'role',
                        element: <RoleManage />,
                        breadcrumbName: '角色管理',
                    },
                    {
                        path: 'auth',
                        element: <AuthManage />,
                        breadcrumbName: '权限管理',
                    }
                ]
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
}

export const findRouteByPath = (targetPath) => {
    for (const route of routes) {
        const result = findRoute(route, '', targetPath)
        if (result) {
            return result
        }
    }
    return null
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


const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element: route.protected ? (<AuthProvider>{route.element}</AuthProvider>) : route.element
    }
})

const router = createBrowserRouter(finalRoutes)

export default router;