import { lazy } from "react";
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AuthProvider from "./AuthProvider";

const AppLayout = lazy(() => import('../pages/layout'))
const Home = lazy(() => import('../pages/home'))
const Login = lazy(() => import('../pages/login'))
const User = lazy(() => import('../pages/system-manage/user-manage'))
const UserDetails = lazy(() => import('../pages/system-manage/user-manage/details'))
const Role = lazy(() => import('../pages/system-manage/role-manage'))
const Auth = lazy(() => import('../pages/system-manage/auth-manage'))


export const routes = [
    {
        path: '/login',
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
                        element: <User />,
                        breadcrumbName: '用户管理',
                        // children: [
                        //     {
                        //         path: 'details',
                        //         element: <UserDetails />,
                        //         breadcrumbName: '用户详情',
                        //     }
                        // ]
                    },
                    {
                        path: 'role',
                        element: <Role />,
                        breadcrumbName: '角色管理',
                    },
                    {
                        path: 'auth',
                        element: <Auth />,
                        breadcrumbName: '权限管理',
                    }
                ]
            },

        ]
    }
]


const findRoute = (path, routes) => {
    for (const route of routes) {
        if (route.path === path) {
            return route
        }
        if (route.children) {
            return findRoute(path, route.children)
        }
    }
    return null
}

export const findRouteByPath = (path) => {

    return findRoute(path, routes)
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
    // const result = paths.filter(item => item !== '')
    // console.log('result',result)
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